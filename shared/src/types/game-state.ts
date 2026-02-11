import type { Character } from './character';
import type { Inventory } from './equipment';
import type { CombatState } from './combat';

export interface ChapterProgress {
  chapterNumber: number;
  subChapterNumber: number;
  eventIndex: number;
  totalEvents: number;
}

export type GamePhase =
  | 'character_creation'
  | 'exploration'
  | 'combat'
  | 'shopping'
  | 'rest'
  | 'chapter_end'
  | 'game_over'
  | 'victory';

export interface NarrativeEntry {
  id: string;
  text: string;
  imageUrl?: string;
  choicesMade: string[];
  timestamp: string;
}

export interface GameState {
  id: string;
  character: Character;
  inventory: Inventory;
  chapter: ChapterProgress;
  phase: GamePhase;
  combat?: CombatState;
  narrativeHistory: NarrativeEntry[];
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}
