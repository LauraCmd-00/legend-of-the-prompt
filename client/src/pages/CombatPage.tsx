import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { gameState, setGameState } = useGameStore();

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
      const result = await api.combatAction({ gameId, action, ...extra });
      setCombat(result.combat);
      setNarration(result.narration);

      // Sync character updates back to game store
      if (result.character && gameState) {
        setGameState({ ...gameState, character: result.character });
      }

      if (result.combat.phase === 'victory' || result.combat.phase === 'defeat') {
        setTimeout(() => {
          // Clear narration so GamePage reloads a fresh scene
          useGameStore.getState().setNarration(null as never);
          navigate(`/game/${gameId}`);
        }, 2500);
      }
    } catch (err) {
      console.error('Combat action failed:', err);
    } finally {
      setIsActing(false);
    }
  }

  if (!combat || !gameState) return <LoadingSpinner />;

  const ch = gameState.character;
  const isEnded = combat.phase === 'victory' || combat.phase === 'defeat';
  const recentTurns = combat.turns.slice(-6);

  return (
    <div className="h-dvh flex flex-col p-2 gap-2">
      {/* ── Enemy panel ── */}
      <div className="border border-white p-3 shrink-0">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold uppercase tracking-wider">{combat.enemy.name}</span>
          <span className="text-[10px] text-rpg-muted uppercase tracking-wider">
            {combat.enemy.category} Niv.{combat.enemy.level}
          </span>
        </div>
        <ProgressBar value={combat.enemyHp} max={combat.enemy.maxHp} color="bg-rpg-danger" label="PV" />
      </div>

      {/* ── Combat log (scrollable) ── */}
      <div className="flex-1 border border-white flex flex-col min-h-0">
        <div className="px-3 py-1.5 border-b border-white/30 shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider">Combat</span>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {lastNarration && (
            <p className="text-xs text-rpg-muted leading-relaxed italic mb-2">{lastNarration}</p>
          )}
          {recentTurns.map((turn, i) => (
            <div
              key={i}
              className={`text-xs leading-relaxed ${
                turn.actorType === 'player' ? 'text-white' : 'text-rpg-danger'
              }`}
            >
              <span className="text-rpg-muted mr-1">{turn.actorType === 'player' ? '>' : '<'}</span>
              {turn.narration}
              {turn.isCritical && <span className="text-rpg-gold ml-1">CRIT!</span>}
              {turn.isDodged && <span className="text-rpg-muted ml-1">MISS</span>}
            </div>
          ))}

          {/* Victory / Defeat overlay */}
          {isEnded && (
            <div className="text-center py-6">
              <div className={`text-2xl font-bold uppercase tracking-widest ${
                combat.phase === 'victory' ? 'text-rpg-gold' : 'text-rpg-danger'
              }`}>
                {combat.phase === 'victory' ? 'Victoire' : 'Defaite'}
              </div>
              {combat.phase === 'victory' && (combat.xpGained || combat.goldGained) && (
                <div className="text-xs text-rpg-muted mt-2 space-y-1">
                  {combat.xpGained && <div>+{combat.xpGained} XP</div>}
                  {combat.goldGained && <div>+{combat.goldGained} Or</div>}
                </div>
              )}
              <div className="text-[10px] text-rpg-muted mt-3 animate-pulse">
                Retour a l'aventure...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Player status ── */}
      <div className="border border-white p-2 shrink-0 space-y-1.5">
        <ProgressBar value={combat.playerHp} max={ch.maxHp} color="bg-rpg-hp" label="PV" />
        <ProgressBar value={combat.playerMp} max={ch.maxMp} color="bg-rpg-mana" label="PM" />
      </div>

      {/* ── Actions ── */}
      {!isEnded && (
        <div className="shrink-0">
          {subMenu === 'none' && (
            <div className="grid grid-cols-2 gap-1.5">
              <button
                disabled={isActing}
                onClick={() => setSubMenu('attack')}
                className="border border-white py-3 text-xs uppercase tracking-wider hover:bg-white/10 transition-all active:scale-95 disabled:opacity-30"
              >
                Attaquer
              </button>
              <button
                disabled={isActing}
                onClick={() => doAction('defend', { defenseTimingScore: 0.7 })}
                className="border border-white/50 py-3 text-xs uppercase tracking-wider text-white/70 hover:bg-white/10 transition-all active:scale-95 disabled:opacity-30"
              >
                Defendre
              </button>
              <button
                disabled={isActing}
                onClick={() => setSubMenu('item')}
                className="border border-white/50 py-3 text-xs uppercase tracking-wider text-white/70 hover:bg-white/10 transition-all active:scale-95 disabled:opacity-30"
              >
                Objet
              </button>
              <button
                disabled={isActing}
                onClick={() => setSubMenu('flee')}
                className="border border-rpg-danger/50 py-3 text-xs uppercase tracking-wider text-rpg-danger hover:bg-rpg-danger/10 transition-all active:scale-95 disabled:opacity-30"
              >
                Fuir
              </button>
            </div>
          )}

          {subMenu === 'attack' && (
            <div className="space-y-1.5">
              <button
                onClick={() => doAction('attack', { attackType: 'mainWeapon' })}
                className="w-full border border-white py-3 text-xs uppercase tracking-wider hover:bg-white/10 transition-all active:scale-95"
              >
                Arme Principale
              </button>
              <button
                onClick={() => doAction('attack', { attackType: 'spell' })}
                className="w-full border border-rpg-mana/50 py-3 text-xs uppercase tracking-wider text-rpg-mana hover:bg-rpg-mana/10 transition-all active:scale-95"
              >
                Sort
              </button>
              <button
                onClick={() => setSubMenu('none')}
                className="w-full border border-white/30 py-2 text-[10px] uppercase tracking-wider text-rpg-muted hover:bg-white/10 transition-all"
              >
                Retour
              </button>
            </div>
          )}

          {subMenu === 'flee' && (
            <div className="space-y-1.5">
              <p className="text-[10px] text-rpg-muted text-center uppercase tracking-wider mb-1">
                Pierre - Feuille - Ciseaux
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {(['rock', 'paper', 'scissors'] as RPSChoice[]).map((choice) => (
                  <button
                    key={choice}
                    onClick={() => doAction('flee', { fleeChoice: choice })}
                    className="border border-white/50 py-3 text-xs uppercase tracking-wider hover:bg-white/10 transition-all active:scale-95"
                  >
                    {choice === 'rock' ? 'Pierre' : choice === 'paper' ? 'Feuille' : 'Ciseaux'}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSubMenu('none')}
                className="w-full border border-white/30 py-2 text-[10px] uppercase tracking-wider text-rpg-muted hover:bg-white/10 transition-all"
              >
                Retour
              </button>
            </div>
          )}

          {subMenu === 'item' && (
            <div className="space-y-1.5">
              <p className="text-[10px] text-rpg-muted text-center uppercase tracking-wider py-3">
                Aucun objet disponible
              </p>
              <button
                onClick={() => setSubMenu('none')}
                className="w-full border border-white/30 py-2 text-[10px] uppercase tracking-wider text-rpg-muted hover:bg-white/10 transition-all"
              >
                Retour
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
