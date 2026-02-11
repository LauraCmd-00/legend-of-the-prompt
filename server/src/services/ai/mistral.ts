import { Mistral } from '@mistralai/mistralai';
import { env } from '../../config/env';
import { buildSystemPromptDetailed } from './prompts/system';
import { buildNarrationUserPrompt } from './prompts/narration';
import { buildCombatNarrationPrompt } from './prompts/combat-narration';
import type { SceneContext, NarrationResponse } from '@txtrpg/shared';
import { narrationResponseSchema, transformNarrationResponse } from './types';

const mistral = new Mistral({ apiKey: env.MISTRAL_API_KEY });

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function generateNarration(
  context: SceneContext,
  aiHistory: ChatMessage[],
  chosenAction?: string,
): Promise<{ narration: NarrationResponse; updatedHistory: ChatMessage[] }> {
  const systemPrompt = buildSystemPromptDetailed(context);
  const userPrompt = buildNarrationUserPrompt(context, chosenAction);

  // Keep last 20 messages for context
  const history = aiHistory.slice(-20);

  const result = await mistral.chat.complete({
    model: env.MISTRAL_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: userPrompt },
    ],
    responseFormat: { type: 'json_object' },
    maxTokens: 2000,
    temperature: 0.85,
  });

  const content = result.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') throw new Error('Empty AI response');

  // Parse and validate
  const rawParsed = narrationResponseSchema.parse(JSON.parse(content));
  const narration = transformNarrationResponse(rawParsed) as NarrationResponse;

  const updatedHistory: ChatMessage[] = [
    ...aiHistory,
    { role: 'user', content: userPrompt },
    { role: 'assistant', content },
  ];

  return { narration, updatedHistory };
}

export async function generateCombatNarration(
  turnDescription: string,
  context: SceneContext,
): Promise<string> {
  const result = await mistral.chat.complete({
    model: env.MISTRAL_MODEL,
    messages: [
      { role: 'system', content: buildCombatNarrationPrompt(context) },
      { role: 'user', content: turnDescription },
    ],
    maxTokens: 200,
    temperature: 0.9,
  });

  const content = result.choices?.[0]?.message?.content;
  return (typeof content === 'string' ? content : null) || turnDescription;
}
