import type { Character, Theme, Archetype, Perspective, Stats } from './character';
import type { GameState } from './game-state';
import type { NarrationResponse } from './narration';
import type { CombatState, CombatAction, AttackType, RPSChoice } from './combat';
import type { Inventory, EquipmentSlot } from './equipment';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Character
export interface CreateCharacterRequest {
  name: string;
  theme: Theme;
  archetype: Archetype;
  perspective: Perspective;
  stats: Stats;
}

export interface CreateCharacterResponse {
  character: Character;
  gameState: GameState;
}

// Game / Narration
export interface GetNarrationRequest {
  gameId: string;
}

export interface MakeChoiceRequest {
  gameId: string;
  choiceId: string;
}

export interface MakeChoiceResponse {
  narration: NarrationResponse;
  gameState: GameState;
}

// Combat
export interface CombatActionRequest {
  gameId: string;
  action: CombatAction;
  attackType?: AttackType;
  itemId?: string;
  defenseTimingScore?: number;
  fleeChoice?: RPSChoice;
}

export interface CombatActionResponse {
  combat: CombatState;
  character?: Character;
  narration: string;
}

// Inventory
export interface EquipItemRequest {
  gameId: string;
  itemId: string;
  slot: EquipmentSlot;
}

export interface EquipItemResponse {
  inventory: Inventory;
}
