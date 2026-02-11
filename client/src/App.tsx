import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import HomePage from './pages/HomePage';
import CharacterCreationPage from './pages/CharacterCreationPage';
import GamePage from './pages/GamePage';
import CombatPage from './pages/CombatPage';
import InventoryPage from './pages/InventoryPage';
import SettingsPage from './pages/SettingsPage';
import LoadingSpinner from './components/ui/LoadingSpinner';

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="min-h-dvh flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CharacterCreationPage />} />
            <Route path="/game/:gameId" element={<GamePage />} />
            <Route path="/combat/:gameId" element={<CombatPage />} />
            <Route path="/inventory/:gameId" element={<InventoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Suspense>
  );
}
