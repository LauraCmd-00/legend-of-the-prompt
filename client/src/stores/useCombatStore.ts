import { create } from 'zustand';
import type { CombatState } from '@txtrpg/shared';

interface CombatStoreState {
  combat: CombatState | null;
  isPlayerTurn: boolean;
  lastNarration: string;

  setCombat: (combat: CombatState) => void;
  setPlayerTurn: (isPlayerTurn: boolean) => void;
  setNarration: (narration: string) => void;
  reset: () => void;
}

export const useCombatStore = create<CombatStoreState>((set) => ({
  combat: null,
  isPlayerTurn: true,
  lastNarration: '',

  setCombat: (combat) => set({ combat }),
  setPlayerTurn: (isPlayerTurn) => set({ isPlayerTurn }),
  setNarration: (lastNarration) => set({ lastNarration }),
  reset: () => set({ combat: null, isPlayerTurn: true, lastNarration: '' }),
}));
