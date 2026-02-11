import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import StatBar from '../components/ui/StatBar';
import Header from '../components/layout/Header';
import { useCharacterStore } from '../stores/useCharacterStore';
import { useGameStore } from '../stores/useGameStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { api } from '../services/api';
import { THEMES, ARCHETYPES, STAT_KEYS } from '@txtrpg/shared';
import type { Stats } from '@txtrpg/shared';

export default function CharacterCreationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    name, theme, archetype, stats, unallocatedPoints,
    setName, setTheme, setArchetype, incrementStat, decrementStat,
  } = useCharacterStore();

  const setGameState = useGameStore((s) => s.setGameState);
  const setSessionToken = useSettingsStore((s) => s.setSessionToken);

  const canStart = name.trim().length >= 2 && theme && archetype;

  async function handleStart() {
    if (!canStart || !theme || !archetype) return;
    setIsSubmitting(true);
    try {
      const result = await api.createCharacter({ name: name.trim(), theme, archetype, stats });
      setGameState(result.gameState);
      setSessionToken(result.sessionToken);
      navigate(`/game/${result.gameState.id}`);
    } catch (err) {
      console.error('Failed to create character:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="pb-20">
      <Header title={t('character.creation.title')} />

      <div className="p-4 space-y-6 max-w-lg mx-auto">
        {/* Name */}
        <div>
          <label className="block text-sm text-rpg-muted mb-2">{t('character.creation.name')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('character.creation.namePlaceholder')}
            maxLength={30}
            className="w-full bg-rpg-surface border border-rpg-border rounded-lg px-4 py-3 text-rpg-text placeholder:text-rpg-border focus:outline-none focus:border-rpg-accent"
          />
        </div>

        {/* Theme */}
        <div>
          <label className="block text-sm text-rpg-muted mb-2">{t('character.creation.chooseTheme')}</label>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map((th) => (
              <Card
                key={th.value}
                selected={theme === th.value}
                onClick={() => setTheme(th.value)}
                className="cursor-pointer text-center py-6"
              >
                <div className="text-2xl mb-1">
                  {th.value === 'sci-fi' ? '🚀' : th.value === 'medieval' ? '⚔️' : '⚙️'}
                </div>
                <div className="text-sm font-medium">{t(th.labelKey)}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Archetype */}
        <div>
          <label className="block text-sm text-rpg-muted mb-2">{t('character.creation.chooseArchetype')}</label>
          <div className="grid grid-cols-2 gap-3">
            {ARCHETYPES.map((arch) => (
              <Card
                key={arch.value}
                selected={archetype === arch.value}
                onClick={() => setArchetype(arch.value)}
                className="cursor-pointer text-center py-4"
              >
                <div className="font-medium">{t(arch.labelKey)}</div>
                <div className="text-xs text-rpg-muted mt-1">+{t(`stats.${arch.bonusStat}`)}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm text-rpg-muted">{t('character.creation.allocateStats')}</label>
            <span className="text-sm font-bold text-rpg-gold">
              {t('character.creation.pointsRemaining', { points: unallocatedPoints })}
            </span>
          </div>
          <div className="space-y-3">
            {STAT_KEYS.map((key) => (
              <StatBar
                key={key}
                label={t(`stats.${key}`)}
                value={stats[key as keyof Stats]}
                onIncrement={() => incrementStat(key as keyof Stats)}
                onDecrement={() => decrementStat(key as keyof Stats)}
                canIncrement={unallocatedPoints > 0 && stats[key as keyof Stats] < 20}
                canDecrement={stats[key as keyof Stats] > 5}
              />
            ))}
          </div>
        </div>

        {/* Start */}
        <Button
          size="lg"
          className="w-full"
          disabled={!canStart || isSubmitting}
          onClick={handleStart}
        >
          {isSubmitting ? '...' : t('character.creation.startAdventure')}
        </Button>
      </div>
    </div>
  );
}
