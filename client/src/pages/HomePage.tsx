import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/useGameStore';

export default function HomePage() {
  const navigate = useNavigate();
  const gameState = useGameStore((s) => s.gameState);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6">
      <h1 className="text-3xl font-bold uppercase tracking-[0.25em] text-white mb-16 text-center">
        Legends of the Prompt
      </h1>

      <div className="w-full max-w-xs space-y-4">
        <button
          onClick={() => navigate('/create')}
          className="w-full border border-white py-4 text-white uppercase tracking-widest text-sm font-medium hover:bg-white/10 active:scale-95 transition-all"
        >
          New Game
        </button>

        <button
          onClick={() => gameState && navigate(`/game/${gameState.id}`)}
          disabled={!gameState}
          className="w-full border border-white/40 py-4 text-white/40 uppercase tracking-widest text-sm font-medium hover:bg-white/10 hover:text-white/70 active:scale-95 transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          Continue
        </button>

        <button
          onClick={() => navigate('/settings')}
          className="w-full border border-white/40 py-4 text-white/60 uppercase tracking-widest text-sm font-medium hover:bg-white/10 hover:text-white active:scale-95 transition-all"
        >
          Settings
        </button>
      </div>
    </div>
  );
}
