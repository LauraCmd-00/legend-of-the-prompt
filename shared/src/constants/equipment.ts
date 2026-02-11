import type { EquipmentSlot } from '../types/equipment';

export const ALL_EQUIPMENT_SLOTS: EquipmentSlot[] = [
  'helmet', 'armor', 'gloveLeft', 'gloveRight', 'leggings', 'boots',
  'ring1', 'ring2', 'ring3', 'ring4', 'ring5',
  'ring6', 'ring7', 'ring8', 'ring9', 'ring10',
  'mainWeapon', 'secondaryWeapon',
];

export const SLOT_LABELS: Record<EquipmentSlot, string> = {
  helmet: 'equipment.slots.helmet',
  armor: 'equipment.slots.armor',
  gloveLeft: 'equipment.slots.gloveLeft',
  gloveRight: 'equipment.slots.gloveRight',
  leggings: 'equipment.slots.leggings',
  boots: 'equipment.slots.boots',
  ring1: 'equipment.slots.ring',
  ring2: 'equipment.slots.ring',
  ring3: 'equipment.slots.ring',
  ring4: 'equipment.slots.ring',
  ring5: 'equipment.slots.ring',
  ring6: 'equipment.slots.ring',
  ring7: 'equipment.slots.ring',
  ring8: 'equipment.slots.ring',
  ring9: 'equipment.slots.ring',
  ring10: 'equipment.slots.ring',
  mainWeapon: 'equipment.slots.mainWeapon',
  secondaryWeapon: 'equipment.slots.secondaryWeapon',
};

export const BACKPACK_MAX_SIZE = 30;

export const RARITY_COLORS: Record<string, string> = {
  common: '#9ca3af',
  uncommon: '#22c55e',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
};
