import type { Theme, Archetype, Perspective } from './character';

// --- JSON schema returned by the AI at each sub-chapter ---

export interface NarrationMeta {
  theme: Theme;
  chapter: number;
  subChapter: number;
  sceneType: 'exploration' | 'dialogue' | 'combat_intro' | 'puzzle' | 'moral_dilemma' | 'revelation' | 'boss_intro' | 'resolution';
  mood: 'tense' | 'calm' | 'epic' | 'mysterious' | 'dark' | 'hopeful' | 'humorous';
}

export interface NarrationChoice {
  id: string;
  label: string;
  consequencePreview: string;
  isPremium: boolean;
  consequenceType: 'combat' | 'exploration' | 'loot' | 'rest' | 'story' | 'detour' | 'ally' | 'betrayal';
}

export interface NarrationResponse {
  meta: NarrationMeta;
  storyStateSummary: string;
  sceneTitle: string;
  sceneDescription: string;
  narrative: string;
  choices: NarrationChoice[];
  techNotes: string;
}

// --- Context sent from backend to the AI ---

export interface PreviousChoice {
  chapter: number;
  subChapter: number;
  choiceId: string;
  choiceLabel: string;
  outcome: string;
}

export interface SceneContext {
  theme: Theme;
  archetype: Archetype;
  playerName: string;
  perspective: Perspective;
  characterLevel: number;
  currentChapter: number;
  currentSubChapter: number;
  previousChoices: PreviousChoice[];
  premiumEnabled: boolean;
  language: 'en' | 'fr';
}
