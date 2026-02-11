import { create } from 'zustand';
import type { Character, Theme, Archetype, Stats } from '@txtrpg/shared';
import { BASE_STAT_VALUE, INITIAL_ALLOCATION_POINTS, MAX_STAT_VALUE } from '@txtrpg/shared';

interface CharacterStoreState {
  name: string;
  theme: Theme | null;
  archetype: Archetype | null;
  stats: Stats;
  unallocatedPoints: number;
  character: Character | null;

  setName: (name: string) => void;
  setTheme: (theme: Theme) => void;
  setArchetype: (archetype: Archetype) => void;
  incrementStat: (stat: keyof Stats) => void;
  decrementStat: (stat: keyof Stats) => void;
  setCharacter: (character: Character) => void;
  resetCreation: () => void;
}

const defaultStats: Stats = {
  force: BASE_STAT_VALUE,
  dexterity: BASE_STAT_VALUE,
  intelligence: BASE_STAT_VALUE,
  spirit: BASE_STAT_VALUE,
  luck: BASE_STAT_VALUE,
};

export const useCharacterStore = create<CharacterStoreState>((set) => ({
  name: '',
  theme: null,
  archetype: null,
  stats: { ...defaultStats },
  unallocatedPoints: INITIAL_ALLOCATION_POINTS,
  character: null,

  setName: (name) => set({ name }),
  setTheme: (theme) => set({ theme }),
  setArchetype: (archetype) => set({ archetype }),
  incrementStat: (stat) =>
    set((state) => {
      if (state.unallocatedPoints <= 0 || state.stats[stat] >= MAX_STAT_VALUE) return state;
      return {
        stats: { ...state.stats, [stat]: state.stats[stat] + 1 },
        unallocatedPoints: state.unallocatedPoints - 1,
      };
    }),
  decrementStat: (stat) =>
    set((state) => {
      if (state.stats[stat] <= BASE_STAT_VALUE) return state;
      return {
        stats: { ...state.stats, [stat]: state.stats[stat] - 1 },
        unallocatedPoints: state.unallocatedPoints + 1,
      };
    }),
  setCharacter: (character) => set({ character }),
  resetCreation: () =>
    set({ name: '', theme: null, archetype: null, stats: { ...defaultStats }, unallocatedPoints: INITIAL_ALLOCATION_POINTS }),
}));
