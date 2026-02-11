import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/layout/Header';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { api } from '../services/api';
import { ALL_EQUIPMENT_SLOTS, SLOT_LABELS, RARITY_COLORS } from '@txtrpg/shared';
import type { Inventory, EquipmentSlot } from '@txtrpg/shared';

export default function InventoryPage() {
  const { t } = useTranslation();
  const { gameId } = useParams<{ gameId: string }>();
  const [inventory, setInventory] = useState<Inventory | null>(null);

  useEffect(() => {
    if (!gameId) return;
    api.getInventory(gameId).then(setInventory).catch(console.error);
  }, [gameId]);

  if (!inventory) return <LoadingSpinner />;

  return (
    <div className="pb-20">
      <Header title={t('inventory.title')} subtitle={`${t('inventory.gold')}: ${inventory.gold}`} />

      <div className="p-4 space-y-6 max-w-lg mx-auto">
        {/* Equipment */}
        <div>
          <h2 className="text-lg font-bold mb-3">{t('inventory.equipment')}</h2>
          <div className="grid grid-cols-2 gap-2">
            {ALL_EQUIPMENT_SLOTS.map((slot) => {
              const item = inventory.equipped[slot];
              return (
                <Card key={slot} className="text-center py-3">
                  <div className="text-[10px] text-rpg-muted uppercase mb-1">
                    {t(SLOT_LABELS[slot as EquipmentSlot])}
                  </div>
                  {item ? (
                    <div
                      className="text-sm font-medium"
                      style={{ color: RARITY_COLORS[item.rarity] }}
                    >
                      {item.name}
                    </div>
                  ) : (
                    <div className="text-xs text-rpg-border">{t('inventory.empty')}</div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Backpack */}
        <div>
          <h2 className="text-lg font-bold mb-3">
            {t('inventory.backpack')} ({inventory.backpack.length})
          </h2>
          {inventory.backpack.length === 0 ? (
            <p className="text-rpg-muted text-sm">{t('inventory.empty')}</p>
          ) : (
            <div className="space-y-2">
              {inventory.backpack.map((item) => (
                <Card key={item.id} className="flex justify-between items-center">
                  <div>
                    <span
                      className="font-medium"
                      style={{ color: RARITY_COLORS[item.rarity] }}
                    >
                      {item.name}
                    </span>
                    <p className="text-xs text-rpg-muted">{item.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
