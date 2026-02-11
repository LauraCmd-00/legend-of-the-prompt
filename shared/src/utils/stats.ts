import type { Stats } from '../types/character';
import { XP_BASE, XP_GROWTH_FACTOR, BASE_HP, HP_PER_FORCE, BASE_MP, MP_PER_INTELLIGENCE } from '../constants/game';

export function calculateXpToNextLevel(level: number): number {
  return Math.floor(XP_BASE * Math.pow(XP_GROWTH_FACTOR, level - 1));
}

export function calculateMaxHp(stats: Stats, level: number): number {
  return BASE_HP + (stats.force * HP_PER_FORCE) + (level * 5);
}

export function calculateMaxMp(stats: Stats, level: number): number {
  return BASE_MP + (stats.intelligence * MP_PER_INTELLIGENCE) + (level * 3);
}

export function calculateDamage(
  attackerForce: number,
  defenderForce: number,
  weaponDamage: number,
  isCritical: boolean,
): number {
  const baseDamage = weaponDamage + (attackerForce * 2) - (defenderForce * 0.5);
  const critMultiplier = isCritical ? 1.5 : 1;
  return Math.max(1, Math.floor(baseDamage * critMultiplier));
}
