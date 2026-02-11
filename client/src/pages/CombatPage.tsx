import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useCombatStore } from '../stores/useCombatStore';
import { useGameStore } from '../stores/useGameStore';
import { api } from '../services/api';
import type { CombatAction, AttackType, RPSChoice } from '@txtrpg/shared';

type SubMenu = 'none' | 'attack' | 'item' | 'flee';

export default function CombatPage() {
  const { t } = useTranslation();
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const { combat, lastNarration, setCombat, setNarration, reset } = useCombatStore();
  const gameState = useGameStore((s) => s.gameState);

  const [subMenu, setSubMenu] = useState<SubMenu>('none');
  const [isActing, setIsActing] = useState(false);

  useEffect(() => {
    if (!gameId) return;
    async function load() {
      try {
        const c = await api.getCombat(gameId!);
        setCombat(c);
      } catch {
        navigate(`/game/${gameId}`);
      }
    }
    load();
    return () => reset();
  }, [gameId]);

  async function doAction(action: CombatAction, extra?: { attackType?: AttackType; itemId?: string; defenseTimingScore?: number; fleeChoice?: RPSChoice }) {
    if (!gameId || isActing) return;
    setIsActing(true);
    setSubMenu('none');
    try {
      const result = await api.combatAction({
        gameId,
        action,
        ...extra,
      });
      setCombat(result.combat);
      setNarration(result.narration);

      if (result.combat.phase === 'victory' || result.combat.phase === 'defeat') {
        setTimeout(() => navigate(`/game/${gameId}`), 2000);
      }
    } catch (err) {
      console.error('Combat action failed:', err);
    } finally {
      setIsActing(false);
    }
  }

  if (!combat || !gameState) return <LoadingSpinner />;

  const isEnded = combat.phase === 'victory' || combat.phase === 'defeat';

  return (
    <div className="flex flex-col min-h-dvh pb-20">
      {/* Enemy */}
      <div className="p-4 border-b border-rpg-border">
        <h2 className="text-lg font-bold mb-2">{combat.enemy.name}</h2>
        <ProgressBar value={combat.enemyHp} max={combat.enemy.maxHp} color="bg-rpg-danger" label={t('combat.hp')} />
      </div>

      {/* Combat log */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {lastNarration && (
          <p className="text-sm text-rpg-muted mb-4 leading-relaxed">{lastNarration}</p>
        )}
        {combat.turns.slice(-6).map((turn, i) => (
          <div key={i} className={`text-sm mb-1 ${turn.actorType === 'player' ? 'text-rpg-accent' : 'text-rpg-danger'}`}>
            {turn.narration}
          </div>
        ))}
        {isEnded && (
          <div className={`text-2xl font-bold text-center mt-6 ${combat.phase === 'victory' ? 'text-rpg-gold' : 'text-rpg-danger'}`}>
            {combat.phase === 'victory' ? t('combat.victory') : t('combat.defeat')}
            {combat.xpGained && <div className="text-sm text-rpg-muted mt-1">+{combat.xpGained} XP, +{combat.goldGained} Gold</div>}
          </div>
        )}
      </div>

      {/* Player status */}
      <div className="px-4 mb-2">
        <ProgressBar value={combat.playerHp} max={gameState.character.maxHp} color="bg-rpg-success" label={t('combat.hp')} />
      </div>

      {/* Actions */}
      {!isEnded && (
        <div className="px-4 pb-4">
          {subMenu === 'none' && (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="primary" onClick={() => setSubMenu('attack')} disabled={isActing}>
                {t('combat.attack')}
              </Button>
              <Button variant="secondary" onClick={() => doAction('defend', { defenseTimingScore: 0.7 })} disabled={isActing}>
                {t('combat.defend')}
              </Button>
              <Button variant="secondary" onClick={() => setSubMenu('item')} disabled={isActing}>
                {t('combat.item')}
              </Button>
              <Button variant="danger" onClick={() => setSubMenu('flee')} disabled={isActing}>
                {t('combat.flee')}
              </Button>
            </div>
          )}

          {subMenu === 'attack' && (
            <div className="space-y-2">
              <Button className="w-full" onClick={() => doAction('attack', { attackType: 'mainWeapon' })}>
                {t('combat.mainWeapon')}
              </Button>
              <Button variant="secondary" className="w-full" onClick={() => doAction('attack', { attackType: 'secondaryWeapon' })}>
                {t('combat.secondaryWeapon')}
              </Button>
              <Button variant="gold" className="w-full" onClick={() => doAction('attack', { attackType: 'spell' })}>
                {t('combat.spell')}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSubMenu('none')}>
                ← Back
              </Button>
            </div>
          )}

          {subMenu === 'flee' && (
            <div className="space-y-2">
              <p className="text-sm text-rpg-muted text-center mb-2">{t('combat.rps.instruction')}</p>
              <div className="grid grid-cols-3 gap-2">
                {(['rock', 'paper', 'scissors'] as RPSChoice[]).map((choice) => (
                  <Button
                    key={choice}
                    variant="secondary"
                    onClick={() => doAction('flee', { fleeChoice: choice })}
                  >
                    {t(`combat.rps.${choice}`)}
                  </Button>
                ))}
              </div>
              <Button variant="secondary" size="sm" onClick={() => setSubMenu('none')}>
                ← Back
              </Button>
            </div>
          )}

          {subMenu === 'item' && (
            <div className="space-y-2">
              <p className="text-sm text-rpg-muted text-center">No items available</p>
              <Button variant="secondary" size="sm" onClick={() => setSubMenu('none')}>
                ← Back
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
