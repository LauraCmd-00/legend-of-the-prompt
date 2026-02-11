import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../stores/useGameStore';

export default function MobileNav() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const gameState = useGameStore((s) => s.gameState);

  const gameId = gameState?.id;

  const items = [
    { path: '/', label: t('nav.home'), icon: '⌂' },
    { path: gameId ? `/game/${gameId}` : null, label: t('nav.game'), icon: '⚔' },
    { path: gameId ? `/inventory/${gameId}` : null, label: t('nav.inventory'), icon: '⊞' },
    { path: '/settings', label: t('nav.settings'), icon: '⚙' },
  ];

  return (
    <nav className="sticky bottom-0 bg-rpg-surface border-t border-rpg-border safe-bottom">
      <div className="flex justify-around items-center h-14">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const disabled = !item.path;

          return (
            <button
              key={item.label}
              onClick={() => item.path && navigate(item.path)}
              disabled={disabled}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? 'text-rpg-accent' : disabled ? 'text-rpg-border' : 'text-rpg-muted'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
