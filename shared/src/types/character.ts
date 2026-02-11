export type Theme = 'medieval' | 'sci-fi' | 'steampunk' | 'cyberpunk' | 'modern';

export type Archetype = 'warrior' | 'rogue' | 'mage' | 'healer' | 'ranger';

export type Perspective = 'tu' | 'il' | 'elle';

export interface Stats {
  force: number;
  dexterity: number;
  intelligence: number;
  spirit: number;
  luck: number;
}

export type StatKey = keyof Stats;

export interface Character {
  id: string;
  name: string;
  theme: Theme;
  archetype: Archetype;
  perspective: Perspective;
  level: number;
  xp: number;
  xpToNextLevel: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  stats: Stats;
  unallocatedPoints: number;
  createdAt: string;
}
