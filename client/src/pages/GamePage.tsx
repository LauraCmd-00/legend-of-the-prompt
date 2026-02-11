import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useGameStore } from '../stores/useGameStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { api } from '../services/api';
import type { NarrationResponse } from '@txtrpg/shared';

export default function GamePage() {
  const { t } = useTranslation();
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const textOnly = useSettingsStore((s) => s.textOnly);

  const { gameState, currentNarration, isLoading, setGameState, setNarration, setLoading } = useGameStore();
  const [choosingId, setChoosingId] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) return;

    async function load() {
      setLoading(true);
      try {
        const state = await api.loadGame(gameId!);
        setGameState(state);

        // Get initial narration
        const narration = await api.getNarration(gameId!);
        setNarration(narration);
      } catch (err) {
        console.error('Failed to load game:', err);
      } finally {
        setLoading(false);
      }
    }

    if (!gameState || gameState.id !== gameId) {
      load();
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

  const chapter = gameState.chapter;

  return (
    <div className="flex flex-col min-h-dvh pb-20">
      {/* Chapter progress */}
      <div className="px-4 py-2 border-b border-rpg-border">
        <div className="flex justify-between text-xs text-rpg-muted mb-1">
          <span>{t('game.chapter', { chapter: chapter.chapterNumber })}</span>
          <span>{t('game.subchapter', { sub: chapter.subChapterNumber })}</span>
        </div>
        <ProgressBar
          value={(chapter.chapterNumber - 1) * 3 + chapter.subChapterNumber}
          max={15}
          showValue={false}
        />
      </div>

      {/* Scene image */}
      {!textOnly && currentNarration?.imageUrl && (
        <div className="w-full h-48 bg-rpg-surface overflow-hidden">
          <img
            src={currentNarration.imageUrl}
            alt="Scene"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Narration text */}
      <div className="flex-1 px-4 py-6">
        {currentNarration ? (
          <p className="text-base leading-relaxed whitespace-pre-line">
            {currentNarration.text}
          </p>
        ) : (
          <p className="text-rpg-muted italic">{t('game.loading')}</p>
        )}
      </div>

      {/* Player stats bar */}
      <div className="px-4 mb-2">
        <div className="flex gap-4">
          <ProgressBar
            value={gameState.character.hp}
            max={gameState.character.maxHp}
            color="bg-rpg-hp"
            label={t('combat.hp')}
          />
          <ProgressBar
            value={gameState.character.mp}
            max={gameState.character.maxMp}
            color="bg-rpg-mana"
            label={t('combat.mp')}
          />
        </div>
      </div>

      {/* Choices */}
      {currentNarration && (
        <div className="px-4 pb-4 space-y-2">
          {currentNarration.choices.map((choice) => (
            <Button
              key={choice.id}
              variant={choice.isPremium ? 'gold' : 'secondary'}
              size="md"
              className="w-full text-left"
              disabled={!!choosingId}
              onClick={() => handleChoice(choice.id)}
            >
              {choosingId === choice.id ? '...' : choice.text}
              {choice.isPremium && ' ★'}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
