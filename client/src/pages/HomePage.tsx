import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import { useGameStore } from '../stores/useGameStore';

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const gameState = useGameStore((s) => s.gameState);

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh px-6 text-center">
      <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-rpg-accent to-rpg-gold bg-clip-text text-transparent">
        {t('app.title')}
      </h1>
      <p className="text-rpg-muted mb-12">{t('app.subtitle')}</p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button size="lg" className="w-full" onClick={() => navigate('/create')}>
          {t('home.newGame')}
        </Button>

        {gameState && (
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => navigate(`/game/${gameState.id}`)}
          >
            {t('home.continueGame')}
          </Button>
        )}

        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={() => navigate('/settings')}
        >
          {t('home.settings')}
        </Button>
      </div>
    </div>
  );
}
