import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useGameStore } from '../stores/useGameStore';
import { api } from '../services/api';
import type { NarrationResponse } from '@txtrpg/shared';

export default function GamePage() {
  const { t } = useTranslation();
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();

  const { gameState, currentNarration, isLoading, setGameState, setNarration, setLoading } = useGameStore();
  const [choosingId, setChoosingId] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId) return;

    async function loadGameAndNarration() {
      setLoading(true);
      try {
        // Load game state if needed
        if (!gameState || gameState.id !== gameId) {
          const state = await api.loadGame(gameId!);
          setGameState(state);
        }

        // Always fetch narration if we don't have one
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

      {/* Scene title & narration */}
      <div className="flex-1 px-4 py-6">
        {currentNarration ? (
          <>
            <h2 className="text-lg font-bold text-rpg-accent mb-3">{currentNarration.sceneTitle}</h2>
            <p className="text-base leading-relaxed whitespace-pre-line">
              {currentNarration.narrative}
            </p>
          </>
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
              {choosingId === choice.id ? '...' : choice.label}
              {choice.isPremium && ' ★'}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
