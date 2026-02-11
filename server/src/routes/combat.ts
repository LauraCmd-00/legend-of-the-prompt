import { Router } from 'express';
import { validate } from '../middleware/validate';
import { CombatActionSchema } from '@txtrpg/shared';
import { prisma } from '../lib/prisma';
import { processPlayerAttack, processDefense, processEnemyTurn } from '../services/combat/engine';
import { resolveFleeAttempt } from '../services/combat/flee';
import type { Character, CombatState, CombatTurn, Inventory, Item } from '@txtrpg/shared';

export const combatRouter = Router();

combatRouter.post('/action', validate(CombatActionSchema), async (req, res, next) => {
  try {
    const { gameId, action, attackType, itemId, defenseTimingScore, fleeChoice } = req.body;

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game || !game.combatData) {
      res.status(404).json({ success: false, error: 'No active combat' });
      return;
    }

    const combat = JSON.parse(game.combatData) as CombatState;
    const character = JSON.parse(game.characterData) as Character;
    const inventory = JSON.parse(game.inventoryData) as Inventory;

    let narration = '';
    let defenseReduction = 0;

    // Process player action
    const playerTurn: CombatTurn = {
      turnNumber: combat.currentTurn,
      actorType: 'player',
      action,
      narration: '',
    };

    switch (action) {
      case 'attack': {
        const weaponDamage = 10; // TODO: calculate from equipped weapon
        const result = processPlayerAttack(character.stats, weaponDamage, combat.enemy);
        playerTurn.damage = result.damage;
        playerTurn.isCritical = result.isCritical;
        playerTurn.isDodged = result.isDodged;
        combat.enemyHp = Math.max(0, combat.enemyHp - result.damage);
        playerTurn.attackType = attackType;

        if (result.isDodged) {
          narration = `${character.name} attacks but the enemy dodges!`;
        } else if (result.isCritical) {
          narration = `Critical hit! ${character.name} deals ${result.damage} damage!`;
        } else {
          narration = `${character.name} deals ${result.damage} damage.`;
        }
        break;
      }

      case 'defend': {
        defenseReduction = processDefense(defenseTimingScore ?? 0);
        playerTurn.defenseTimingScore = defenseTimingScore;
        narration = defenseReduction >= 0.9
          ? `Perfect block! ${character.name} braces for impact.`
          : `${character.name} raises their guard.`;
        break;
      }

      case 'item': {
        const item = inventory.backpack.find(i => i.id === itemId);
        if (item && item.healAmount) {
          combat.playerHp = Math.min(character.maxHp, combat.playerHp + item.healAmount);
          playerTurn.healed = item.healAmount;
          playerTurn.itemUsed = item;
          // Remove item from backpack
          inventory.backpack = inventory.backpack.filter(i => i.id !== itemId);
          narration = `${character.name} uses ${item.name} and recovers ${item.healAmount} HP.`;
        }
        break;
      }

      case 'flee': {
        if (!fleeChoice) break;
        const result = resolveFleeAttempt(fleeChoice, character.stats.luck);
        playerTurn.fleeResult = result;

        if (result.success) {
          combat.phase = 'victory'; // flee = exit combat
          narration = `${character.name} escapes!`;
          playerTurn.narration = narration;
          combat.turns.push(playerTurn);

          // Sync HP back to character
          character.hp = combat.playerHp;
          character.mp = combat.playerMp;

          await prisma.game.update({
            where: { id: gameId },
            data: {
              combatData: null,
              characterData: JSON.stringify(character),
              phase: 'exploration',
              inventoryData: JSON.stringify(inventory),
            },
          });

          res.json({ success: true, data: { combat, character, narration } });
          return;
        } else {
          narration = `${character.name} tries to flee but fails!`;
        }
        break;
      }
    }

    playerTurn.narration = narration;
    combat.turns.push(playerTurn);

    // Check for enemy defeat
    if (combat.enemyHp <= 0) {
      combat.phase = 'victory';
      combat.xpGained = combat.enemy.xpReward;
      combat.goldGained = combat.enemy.goldReward;
      narration += ` Victory! Gained ${combat.enemy.xpReward} XP and ${combat.enemy.goldReward} gold.`;

      // Sync XP and HP back to character
      character.xp += combat.enemy.xpReward;
      character.hp = combat.playerHp;
      character.mp = combat.playerMp;

      // Level up check
      while (character.xp >= character.xpToNextLevel) {
        character.xp -= character.xpToNextLevel;
        character.level++;
        character.xpToNextLevel = Math.floor(100 * Math.pow(1.5, character.level - 1));
        character.unallocatedPoints += 3;
        character.maxHp += 10;
        character.maxMp += 8;
        character.hp = character.maxHp;
        character.mp = character.maxMp;
      }

      await prisma.game.update({
        where: { id: gameId },
        data: {
          combatData: JSON.stringify(combat),
          characterData: JSON.stringify(character),
          phase: 'exploration',
          inventoryData: JSON.stringify(inventory),
        },
      });

      res.json({ success: true, data: { combat, character, narration } });
      return;
    }

    // Process enemy turn
    const enemyResult = processEnemyTurn(combat.enemy, character.stats, defenseReduction);
    combat.playerHp = Math.max(0, combat.playerHp - enemyResult.damage);

    const enemyTurn: CombatTurn = {
      turnNumber: combat.currentTurn,
      actorType: 'enemy',
      action: 'attack',
      damage: enemyResult.damage,
      isCritical: enemyResult.isCritical,
      isDodged: enemyResult.isDodged,
      narration: enemyResult.isDodged
        ? `${combat.enemy.name} attacks but ${character.name} dodges!`
        : `${combat.enemy.name} deals ${enemyResult.damage} damage.`,
    };
    combat.turns.push(enemyTurn);

    // Check player defeat
    if (combat.playerHp <= 0) {
      combat.phase = 'defeat';
      character.hp = 0;
    } else {
      combat.phase = 'player_action';
      combat.currentTurn++;
      // Sync HP back to character
      character.hp = combat.playerHp;
      character.mp = combat.playerMp;
    }

    await prisma.game.update({
      where: { id: gameId },
      data: {
        combatData: JSON.stringify(combat),
        characterData: JSON.stringify(character),
        phase: combat.phase === 'defeat' ? 'game_over' : 'combat',
        inventoryData: JSON.stringify(inventory),
      },
    });

    res.json({
      success: true,
      data: {
        combat,
        character,
        narration: `${narration} ${enemyTurn.narration}`,
      },
    });
  } catch (error) {
    next(error);
  }
});

combatRouter.get('/:gameId', async (req, res, next) => {
  try {
    const game = await prisma.game.findUnique({ where: { id: req.params.gameId } });
    if (!game || !game.combatData) {
      res.status(404).json({ success: false, error: 'No active combat' });
      return;
    }
    res.json({ success: true, data: JSON.parse(game.combatData) });
  } catch (error) {
    next(error);
  }
});
