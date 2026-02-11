import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import ProgressBar from '../components/ui/ProgressBar';
import { useGameStore } from '../stores/useGameStore';
import { api } from '../services/api';
import type { NarrationResponse } from '@txtrpg/shared';

export default function GamePage() {
  const { t } = useTranslation();
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const { gameState, currentNarration, isLoading, setGameState, setNarration, setLoading } = useGameStore();
  const [choosingId, setChoosingId] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (!gameId) return;

    async function loadGameAndNarration() {
      setLoading(true);
      try {
        if (!gameState || gameState.id !== gameId) {
          const state = await api.loadGame(gameId!);
          setGameState(state);
        }
        if (!currentNarration) {
          const narration = await api.getNarration(gameId!);
          setNarration(narration);
        }
      } catch (err) {
        console.error('Failed to load game:', err);
      } finally {
        setLoading(false);
      }
    }

    if (!gameState || gameState.id !== gameId || !currentNarration) {
      loadGameAndNarration();
    }
  }, [gameId]);

  async function handleChoice(choiceId: string) {
    if (!gameId || choosingId) return;
    setChoosingId(choiceId);
    try {
      const result = await api.makeChoice({ gameId, choiceId });
      setGameState(result.gameState);
      setNarration(result.narration);
      if (result.gameState.phase === 'combat') {
        navigate(`/combat/${gameId}`);
      }
    } catch (err) {
      console.error('Failed to make choice:', err);
    } finally {
      setChoosingId(null);
    }
  }

  if (isLoading || !gameState) return <LoadingSpinner />;

  const ch = gameState.character;
  const chapter = gameState.chapter;

  return (
    <div className="h-dvh flex flex-col p-2 gap-2">
      {/* ── Main narrative frame ── */}
      <div className="flex-1 border border-white flex flex-col min-h-0">
        {/* Header bar */}
        <div className="flex justify-between items-center px-3 py-1.5 border-b border-white/30 shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider truncate">
            {currentNarration?.sceneTitle || '...'}
          </span>
          <span className="text-[10px] text-rpg-muted uppercase tracking-wider shrink-0 ml-2">
            Ch.{chapter.chapterNumber}-{chapter.subChapterNumber}
          </span>
        </div>

        {/* Narrative text (scrollable) */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {currentNarration ? (
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {currentNarration.narrative}
            </p>
          ) : (
            <p className="text-rpg-muted italic text-sm">{t('game.loading')}</p>
          )}
        </div>

        {/* Choices grid */}
        {currentNarration && (
          <div className="grid grid-cols-2 gap-1.5 p-2 border-t border-white/30 shrink-0">
            {currentNarration.choices.map((choice) => (
              <button
                key={choice.id}
                disabled={!!choosingId}
                onClick={() => handleChoice(choice.id)}
                className={`border py-2.5 px-2 text-xs uppercase tracking-wider transition-all active:scale-95 disabled:opacity-30 ${
                  choice.isPremium
                    ? 'border-rpg-gold text-rpg-gold hover:bg-rpg-gold/10'
                    : 'border-white/50 text-white hover:bg-white/10'
                }`}
              >
                {choosingId === choice.id ? '...' : choice.label}
                {choice.isPremium && ' ★'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Bottom panel: Stats | Items ── */}
      <div className="grid grid-cols-2 gap-2 shrink-0">
        {/* Left: HP / MP / XP / Level + Stats button */}
        <div className="border border-white p-2 space-y-1.5">
          <ProgressBar value={ch.hp} max={ch.maxHp} color="bg-rpg-hp" label="PV" />
          <ProgressBar value={ch.mp} max={ch.maxMp} color="bg-rpg-mana" label="PM" />
          <ProgressBar value={ch.xp} max={ch.xpToNextLevel} color="bg-rpg-gold" label="XP" />
          <div className="flex justify-between items-center pt-1">
            <span className="text-[10px] text-rpg-muted uppercase tracking-wider">
              Niv. {ch.level}
            </span>
            <button
              onClick={() => setShowStats(true)}
              className="border border-white/50 px-2 py-0.5 text-[10px] uppercase tracking-wider hover:bg-white/10 transition-all"
            >
              Stats
            </button>
          </div>
        </div>

        {/* Right: 3 item slots + Inventory button */}
        <div className="border border-white p-2 flex flex-col gap-1.5">
          <div className="grid grid-cols-3 gap-1.5 flex-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="border border-white/20 flex items-center justify-center aspect-square">
                <span className="text-[10px] text-white/20">—</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => gameId && navigate(`/inventory/${gameId}`)}
            className="w-full border border-white/50 py-1.5 text-[10px] uppercase tracking-wider hover:bg-white/10 transition-all"
          >
            Inventaire
          </button>
        </div>
      </div>

      {/* Stats Modal */}
      <Modal open={showStats} onClose={() => setShowStats(false)} title="Stats">
        <div className="space-y-2 text-sm">
          {Object.entries(ch.stats).map(([key, val]) => (
            <div key={key} className="flex justify-between border-b border-white/10 pb-1">
              <span className="uppercase tracking-wider text-rpg-muted">{t(`stats.${key}`)}</span>
              <span className="font-bold">{val as number}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
