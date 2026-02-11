import type { Stats } from './character';
import type { Item } from './equipment';

export type CombatAction = 'attack' | 'defend' | 'item' | 'flee';

export type AttackType = 'mainWeapon' | 'secondaryWeapon' | 'spell';

export type RPSChoice = 'rock' | 'paper' | 'scissors';

export type EnemyCategory = 'weak' | 'standard' | 'elite' | 'miniboss' | 'boss';

export interface Enemy {
  id: string;
  name: string;
  nameKey: string;
  description: string;
  category: EnemyCategory;
  level: number;
  hp: number;
  maxHp: number;
  stats: Stats;
  xpReward: number;
  goldReward: number;
  lootTable: LootEntry[];
  imageUrl?: string;
}

export interface LootEntry {
  itemId: string;
  dropChance: number;
}

export interface CombatTurn {
  turnNumber: number;
  actorType: 'player' | 'enemy';
  action: CombatAction;
  attackType?: AttackType;
  damage?: number;
  healed?: number;
  itemUsed?: Item;
  isCritical?: boolean;
  isDodged?: boolean;
  defenseTimingScore?: number;
  fleeResult?: {
    playerChoice: RPSChoice;
    enemyChoice: RPSChoice;
    success: boolean;
  };
  narration: string;
}

export type CombatPhase =
  | 'player_action'
  | 'player_submenu'
  | 'defense_timing'
  | 'flee_rps'
  | 'enemy_turn'
  | 'resolving'
  | 'victory'
  | 'defeat';

export interface CombatState {
  id: string;
  enemy: Enemy;
  playerHp: number;
  playerMp: number;
  enemyHp: number;
  turns: CombatTurn[];
  currentTurn: number;
  phase: CombatPhase;
  loot?: Item[];
  xpGained?: number;
  goldGained?: number;
}
