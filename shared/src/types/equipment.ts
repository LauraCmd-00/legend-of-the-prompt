import type { StatKey } from './character';

export type EquipmentSlot =
  | 'helmet'
  | 'armor'
  | 'gloveLeft'
  | 'gloveRight'
  | 'leggings'
  | 'boots'
  | 'ring1' | 'ring2' | 'ring3' | 'ring4' | 'ring5'
  | 'ring6' | 'ring7' | 'ring8' | 'ring9' | 'ring10'
  | 'mainWeapon'
  | 'secondaryWeapon';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type ItemType = 'weapon' | 'armor' | 'accessory' | 'consumable';

export interface StatModifier {
  stat: StatKey;
  value: number;
}

export interface Item {
  id: string;
  name: string;
  nameKey: string;
  description: string;
  descriptionKey: string;
  type: ItemType;
  rarity: ItemRarity;
  slot?: EquipmentSlot;
  modifiers: StatModifier[];
  levelRequirement: number;
  value: number;
  healAmount?: number;
  mpRestoreAmount?: number;
}

export interface EquipmentLoadout {
  helmet: Item | null;
  armor: Item | null;
  gloveLeft: Item | null;
  gloveRight: Item | null;
  leggings: Item | null;
  boots: Item | null;
  ring1: Item | null;
  ring2: Item | null;
  ring3: Item | null;
  ring4: Item | null;
  ring5: Item | null;
  ring6: Item | null;
  ring7: Item | null;
  ring8: Item | null;
  ring9: Item | null;
  ring10: Item | null;
  mainWeapon: Item | null;
  secondaryWeapon: Item | null;
}

export interface Inventory {
  equipped: EquipmentLoadout;
  backpack: Item[];
  gold: number;
}
