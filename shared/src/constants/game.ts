import type { Theme, Archetype, StatKey } from '../types/character';

export const THEMES: { value: Theme; labelKey: string; emoji: string }[] = [
  { value: 'medieval', labelKey: 'themes.medieval', emoji: '⚔️' },
  { value: 'sci-fi', labelKey: 'themes.scifi', emoji: '🚀' },
  { value: 'steampunk', labelKey: 'themes.steampunk', emoji: '⚙️' },
  { value: 'cyberpunk', labelKey: 'themes.cyberpunk', emoji: '🌃' },
  { value: 'modern', labelKey: 'themes.modern', emoji: '🌍' },
];

export const ARCHETYPES: { value: Archetype; labelKey: string; bonusStat: StatKey }[] = [
  { value: 'warrior', labelKey: 'archetypes.warrior', bonusStat: 'force' },
  { value: 'rogue', labelKey: 'archetypes.rogue', bonusStat: 'dexterity' },
  { value: 'mage', labelKey: 'archetypes.mage', bonusStat: 'intelligence' },
  { value: 'healer', labelKey: 'archetypes.healer', bonusStat: 'spirit' },
  { value: 'ranger', labelKey: 'archetypes.ranger', bonusStat: 'luck' },
];

export const STAT_KEYS: StatKey[] = ['force', 'dexterity', 'intelligence', 'spirit', 'luck'];

export const BASE_STAT_VALUE = 5;
export const INITIAL_ALLOCATION_POINTS = 10;
export const MAX_STAT_VALUE = 20;
export const MIN_STAT_VALUE = 1;

export const BASE_HP = 100;
export const HP_PER_FORCE = 10;
export const BASE_MP = 50;
export const MP_PER_INTELLIGENCE = 8;

export const XP_BASE = 100;
export const XP_GROWTH_FACTOR = 1.5;

export const POINTS_PER_LEVEL = 3;

export const FREE_CHOICE_COUNT = 3;
export const PREMIUM_CHOICE_COUNT = 4;
export const PREMIUM_PRICE_USD = 2.99;

export const TOTAL_CHAPTERS = 5;
export const SUB_CHAPTERS_PER_CHAPTER = 3;
export const EVENTS_PER_SUB_CHAPTER = 4;
