import type {
  ApiResponse,
  CreateCharacterRequest, CreateCharacterResponse,
  MakeChoiceRequest, MakeChoiceResponse,
  CombatActionRequest, CombatActionResponse,
  EquipItemRequest, EquipItemResponse,
} from '@txtrpg/shared';
import type { GameState, NarrationResponse, CombatState, Inventory } from '@txtrpg/shared';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json: ApiResponse<T> = await res.json();
  if (!json.success || !json.data) throw new Error(json.error || 'Request failed');
  return json.data;
}

export const api = {
  createCharacter: (data: CreateCharacterRequest) =>
    request<CreateCharacterResponse & { sessionToken: string }>('/character', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  loadGame: (gameId: string) =>
    request<GameState>(`/game/${gameId}`),

  getNarration: (gameId: string) =>
    request<NarrationResponse>(`/game/${gameId}/narration`),

  makeChoice: (data: MakeChoiceRequest) =>
    request<MakeChoiceResponse>('/game/choice', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  combatAction: (data: CombatActionRequest) =>
    request<CombatActionResponse>('/combat/action', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCombat: (gameId: string) =>
    request<CombatState>(`/combat/${gameId}`),

  getInventory: (gameId: string) =>
    request<Inventory>(`/inventory/${gameId}`),

  equipItem: (data: EquipItemRequest) =>
    request<EquipItemResponse>('/inventory/equip', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
