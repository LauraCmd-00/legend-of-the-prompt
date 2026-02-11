import { z } from 'zod';
import { STAT_KEYS, MIN_STAT_VALUE, MAX_STAT_VALUE, INITIAL_ALLOCATION_POINTS, BASE_STAT_VALUE } from '../constants/game';

export const StatsSchema = z.object({
  force: z.number().min(MIN_STAT_VALUE).max(MAX_STAT_VALUE),
  dexterity: z.number().min(MIN_STAT_VALUE).max(MAX_STAT_VALUE),
  intelligence: z.number().min(MIN_STAT_VALUE).max(MAX_STAT_VALUE),
  spirit: z.number().min(MIN_STAT_VALUE).max(MAX_STAT_VALUE),
  luck: z.number().min(MIN_STAT_VALUE).max(MAX_STAT_VALUE),
}).refine((stats) => {
  const totalAllocated = STAT_KEYS.reduce((sum, key) => sum + stats[key], 0);
  const totalBase = STAT_KEYS.length * BASE_STAT_VALUE;
  return (totalAllocated - totalBase) <= INITIAL_ALLOCATION_POINTS;
}, { message: 'Stat points exceed allocation budget' });

export const CreateCharacterSchema = z.object({
  name: z.string().min(2).max(30).trim(),
  theme: z.enum(['medieval', 'sci-fi', 'steampunk', 'cyberpunk', 'modern']),
  archetype: z.enum(['warrior', 'rogue', 'mage', 'healer', 'ranger']),
  perspective: z.enum(['tu', 'il', 'elle']).default('tu'),
  stats: StatsSchema,
});

export const CombatActionSchema = z.object({
  gameId: z.string().uuid(),
  action: z.enum(['attack', 'defend', 'item', 'flee']),
  attackType: z.enum(['mainWeapon', 'secondaryWeapon', 'spell']).optional(),
  itemId: z.string().optional(),
  defenseTimingScore: z.number().min(0).max(1).optional(),
  fleeChoice: z.enum(['rock', 'paper', 'scissors']).optional(),
});

export const MakeChoiceSchema = z.object({
  gameId: z.string().uuid(),
  choiceId: z.string(),
});

export const EquipItemSchema = z.object({
  gameId: z.string().uuid(),
  itemId: z.string(),
  slot: z.string(),
});
