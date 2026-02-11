import type { RPSChoice } from '../types/combat';

export const RPS_WINS: Record<RPSChoice, RPSChoice> = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

export const DEFENSE_PERFECT_THRESHOLD = 0.9;
export const DEFENSE_GOOD_THRESHOLD = 0.6;
export const DEFENSE_POOR_THRESHOLD = 0.3;

export const DEFENSE_REDUCTION = {
  perfect: 0.9,
  good: 0.6,
  partial: 0.3,
  failed: 0.0,
};

export const CRIT_BASE_CHANCE = 0.05;
export const CRIT_LUCK_BONUS = 0.02;
export const CRIT_DAMAGE_MULTIPLIER = 1.5;

export const DODGE_BASE_CHANCE = 0.05;
export const DODGE_DEX_BONUS = 0.015;

export const FLEE_BASE_CHANCE = 0.5;
export const FLEE_LUCK_BONUS = 0.03;
