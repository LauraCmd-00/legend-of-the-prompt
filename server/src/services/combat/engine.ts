import type { Stats, Enemy } from '@txtrpg/shared';
import {
  CRIT_BASE_CHANCE, CRIT_LUCK_BONUS,
  DODGE_BASE_CHANCE, DODGE_DEX_BONUS,
  DEFENSE_PERFECT_THRESHOLD, DEFENSE_GOOD_THRESHOLD, DEFENSE_POOR_THRESHOLD,
  DEFENSE_REDUCTION,
  calculateDamage,
} from '@txtrpg/shared';

export function processPlayerAttack(
  playerStats: Stats,
  weaponDamage: number,
  enemy: Enemy,
): { damage: number; isCritical: boolean; isDodged: boolean } {
  const dodgeChance = DODGE_BASE_CHANCE + (enemy.stats.dexterity * DODGE_DEX_BONUS);
  const isDodged = Math.random() < dodgeChance;
  if (isDodged) return { damage: 0, isCritical: false, isDodged: true };

  const critChance = CRIT_BASE_CHANCE + (playerStats.luck * CRIT_LUCK_BONUS);
  const isCritical = Math.random() < critChance;

  const damage = calculateDamage(playerStats.force, enemy.stats.force, weaponDamage, isCritical);
  return { damage, isCritical, isDodged: false };
}

export function processDefense(timingScore: number): number {
  if (timingScore >= DEFENSE_PERFECT_THRESHOLD) return DEFENSE_REDUCTION.perfect;
  if (timingScore >= DEFENSE_GOOD_THRESHOLD) return DEFENSE_REDUCTION.good;
  if (timingScore >= DEFENSE_POOR_THRESHOLD) return DEFENSE_REDUCTION.partial;
  return DEFENSE_REDUCTION.failed;
}

export function processEnemyTurn(
  enemy: Enemy,
  playerStats: Stats,
  defenseReduction: number,
): { damage: number; isCritical: boolean; isDodged: boolean } {
  const dodgeChance = DODGE_BASE_CHANCE + (playerStats.dexterity * DODGE_DEX_BONUS);
  const isDodged = Math.random() < dodgeChance;
  if (isDodged) return { damage: 0, isCritical: false, isDodged: true };

  const isCritical = Math.random() < CRIT_BASE_CHANCE;
  let damage = calculateDamage(enemy.stats.force, playerStats.force, 10, isCritical);
  damage = Math.floor(damage * (1 - defenseReduction));
  return { damage: Math.max(0, damage), isCritical, isDodged: false };
}
