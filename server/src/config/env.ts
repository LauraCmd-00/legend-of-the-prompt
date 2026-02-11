import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MISTRAL_API_KEY: z.string().min(1, 'MISTRAL_API_KEY is required'),
  MISTRAL_MODEL: z.string().default('mistral-small-latest'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
});

export const env = envSchema.parse(process.env);
