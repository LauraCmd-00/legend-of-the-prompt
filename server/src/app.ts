import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { characterRouter } from './routes/character';
import { gameRouter } from './routes/game';
import { combatRouter } from './routes/combat';
import { inventoryRouter } from './routes/inventory';
import { errorHandler } from './middleware/error-handler';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
  app.use(express.json());

  // Routes
  app.use('/api/character', characterRouter);
  app.use('/api/game', gameRouter);
  app.use('/api/combat', combatRouter);
  app.use('/api/inventory', inventoryRouter);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Error handling
  app.use(errorHandler);

  return app;
}
