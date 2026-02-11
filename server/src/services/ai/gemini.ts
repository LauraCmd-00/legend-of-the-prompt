import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env';
import { buildSystemPromptDetailed } from './prompts/system';
import { buildNarrationUserPrompt } from './prompts/narration';
import { buildCombatNarrationPrompt } from './prompts/combat-narration';
import type { SceneContext, NarrationResponse } from '@txtrpg/shared';
import { narrationResponseSchema, transformNarrationResponse } from './types';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export interface ChatMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export async function generateNarration(
  context: SceneContext,
  aiHistory: ChatMessage[],
  chosenAction?: string,
): Promise<{ narration: NarrationResponse; updatedHistory: ChatMessage[] }> {
  const systemPrompt = buildSystemPromptDetailed(context);
  const userPrompt = buildNarrationUserPrompt(context, chosenAction);

  const model = genAI.getGenerativeModel({
    model: env.GEMINI_MODEL,
    systemInstruction: systemPrompt,
    generationConfig: {
      responseMimeType: 'application/json',
      maxOutputTokens: 2000,
      temperature: 0.85,
    },
  });

  // Keep last 20 messages for context
  const history = aiHistory.slice(-20);
  const chat = model.startChat({ history });

  const result = await chat.sendMessage(userPrompt);
  const content = result.response.text();

  if (!content) throw new Error('Empty AI response');

  // Parse and validate
  const rawParsed = narrationResponseSchema.parse(JSON.parse(content));
  const narration = transformNarrationResponse(rawParsed) as NarrationResponse;

  const updatedHistory: ChatMessage[] = [
    ...aiHistory,
    { role: 'user', parts: [{ text: userPrompt }] },
    { role: 'model', parts: [{ text: content }] },
  ];

  return { narration, updatedHistory };
}

export async function generateCombatNarration(
  turnDescription: string,
  context: SceneContext,
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: env.GEMINI_MODEL,
    systemInstruction: buildCombatNarrationPrompt(context),
    generationConfig: {
      maxOutputTokens: 200,
      temperature: 0.9,
    },
  });

  const result = await model.generateContent(turnDescription);
  return result.response.text() || turnDescription;
}
