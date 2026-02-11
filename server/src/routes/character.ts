import { Router } from 'express';
import { validate } from '../middleware/validate';
import { CreateCharacterSchema } from '@txtrpg/shared';
import { prisma } from '../lib/prisma';
import { v4 as uuid } from 'uuid';
import { calculateMaxHp, calculateMaxMp, calculateXpToNextLevel } from '@txtrpg/shared';
import type { CreateCharacterRequest, Character, Inventory, EquipmentLoadout } from '@txtrpg/shared';

export const characterRouter = Router();

const emptyLoadout: EquipmentLoadout = {
  helmet: null, armor: null, gloveLeft: null, gloveRight: null,
  leggings: null, boots: null, mainWeapon: null, secondaryWeapon: null,
  ring1: null, ring2: null, ring3: null, ring4: null, ring5: null,
  ring6: null, ring7: null, ring8: null, ring9: null, ring10: null,
};

characterRouter.post('/', validate(CreateCharacterSchema), async (req, res, next) => {
  try {
    const body = req.body as CreateCharacterRequest;

    const character: Character = {
      id: uuid(),
      name: body.name,
      theme: body.theme,
      archetype: body.archetype,
      perspective: body.perspective ?? 'tu',
      level: 1,
      xp: 0,
      xpToNextLevel: calculateXpToNextLevel(1),
      hp: calculateMaxHp(body.stats, 1),
      maxHp: calculateMaxHp(body.stats, 1),
      mp: calculateMaxMp(body.stats, 1),
      maxMp: calculateMaxMp(body.stats, 1),
      stats: body.stats,
      unallocatedPoints: 0,
      createdAt: new Date().toISOString(),
    };

    const inventory: Inventory = {
      equipped: { ...emptyLoadout },
      backpack: [],
      gold: 50,
    };

    // Create player with a session token
    const sessionToken = uuid();
    const player = await prisma.player.create({
      data: { sessionToken },
    });

    // Create game
    const game = await prisma.game.create({
      data: {
        playerId: player.id,
        characterData: JSON.stringify(character),
        inventoryData: JSON.stringify(inventory),
        chapter: 1,
        subChapter: 1,
        eventIndex: 0,
        phase: 'exploration',
      },
    });

    res.status(201).json({
      success: true,
      data: {
        character,
        gameState: {
          id: game.id,
          character,
          inventory,
          chapter: { chapterNumber: 1, subChapterNumber: 1, eventIndex: 0, totalEvents: 4 },
          phase: 'exploration',
          narrativeHistory: [],
          isPremium: player.isPremium,
          createdAt: game.createdAt.toISOString(),
          updatedAt: game.updatedAt.toISOString(),
        },
        sessionToken,
      },
    });
  } catch (error) {
    next(error);
  }
});

characterRouter.get('/:gameId', async (req, res, next) => {
  try {
    const game = await prisma.game.findUnique({ where: { id: req.params.gameId } });
    if (!game) {
      res.status(404).json({ success: false, error: 'Game not found' });
      return;
    }
    res.json({ success: true, data: JSON.parse(game.characterData) });
  } catch (error) {
    next(error);
  }
});
