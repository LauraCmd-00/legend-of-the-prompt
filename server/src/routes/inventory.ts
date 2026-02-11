import { Router } from 'express';
import { validate } from '../middleware/validate';
import { EquipItemSchema } from '@txtrpg/shared';
import { prisma } from '../lib/prisma';
import type { Inventory, EquipmentSlot, Item } from '@txtrpg/shared';

export const inventoryRouter = Router();

inventoryRouter.get('/:gameId', async (req, res, next) => {
  try {
    const game = await prisma.game.findUnique({ where: { id: req.params.gameId } });
    if (!game) {
      res.status(404).json({ success: false, error: 'Game not found' });
      return;
    }
    res.json({ success: true, data: JSON.parse(game.inventoryData) });
  } catch (error) {
    next(error);
  }
});

inventoryRouter.post('/equip', validate(EquipItemSchema), async (req, res, next) => {
  try {
    const { gameId, itemId, slot } = req.body;

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      res.status(404).json({ success: false, error: 'Game not found' });
      return;
    }

    const inventory = JSON.parse(game.inventoryData) as Inventory;
    const equipSlot = slot as EquipmentSlot;

    // Find item in backpack
    const itemIndex = inventory.backpack.findIndex(i => i.id === itemId);
    if (itemIndex === -1) {
      res.status(400).json({ success: false, error: 'Item not in backpack' });
      return;
    }

    const item = inventory.backpack[itemIndex];

    // If slot is occupied, swap to backpack
    const currentEquipped = inventory.equipped[equipSlot];
    if (currentEquipped) {
      inventory.backpack.push(currentEquipped);
    }

    // Equip new item
    (inventory.equipped as Record<string, Item | null>)[equipSlot] = item;
    inventory.backpack.splice(itemIndex, 1);

    await prisma.game.update({
      where: { id: gameId },
      data: { inventoryData: JSON.stringify(inventory) },
    });

    res.json({ success: true, data: { inventory } });
  } catch (error) {
    next(error);
  }
});

inventoryRouter.post('/unequip', async (req, res, next) => {
  try {
    const { gameId, slot } = req.body;

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      res.status(404).json({ success: false, error: 'Game not found' });
      return;
    }

    const inventory = JSON.parse(game.inventoryData) as Inventory;
    const equipSlot = slot as EquipmentSlot;
    const item = inventory.equipped[equipSlot];

    if (!item) {
      res.status(400).json({ success: false, error: 'Slot is empty' });
      return;
    }

    inventory.backpack.push(item);
    (inventory.equipped as Record<string, Item | null>)[equipSlot] = null;

    await prisma.game.update({
      where: { id: gameId },
      data: { inventoryData: JSON.stringify(inventory) },
    });

    res.json({ success: true, data: { inventory } });
  } catch (error) {
    next(error);
  }
});
