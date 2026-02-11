import { create } from 'zustand';
import type { GameState, GamePhase, NarrationResponse } from '@txtrpg/shared';

interface GameStoreState {
  gameState: GameState | null;
  currentNarration: NarrationResponse | null;
  isLoading: boolean;
  error: string | null;

  setGameState: (state: GameState) => void;
  setNarration: (narration: NarrationResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPhase: (phase: GamePhase) => void;
  reset: () => void;
}

export const useGameStore = create<GameStoreState>((set) => ({
  gameState: null,
  currentNarration: null,
  isLoading: false,
  error: null,

  setGameState: (gameState) => set({ gameState }),
  setNarration: (currentNarration) => set({ currentNarration }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setPhase: (phase) =>
    set((state) => ({
      gameState: state.gameState ? { ...state.gameState, phase } : null,
    })),
  reset: () => set({ gameState: null, currentNarration: null, isLoading: false, error: null }),
}));
