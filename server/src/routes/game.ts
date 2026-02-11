import { Router } from 'express';
import { validate } from '../middleware/validate';
import { MakeChoiceSchema } from '@txtrpg/shared';
import { prisma } from '../lib/prisma';
import { generateNarration } from '../services/ai/mistral';
import type { Character, GameState, NarrativeEntry, SceneContext, PreviousChoice } from '@txtrpg/shared';

export const gameRouter = Router();

// Helper: build SceneContext from game record
function buildContext(character: Character, game: { chapter: number; subChapter: number }, previousChoices: PreviousChoice[], isPremium: boolean): SceneContext {
  return {
    theme: character.theme,
    archetype: character.archetype,
    playerName: character.name,
    perspective: character.perspective ?? 'tu',
    characterLevel: character.level,
    currentChapter: game.chapter,
    currentSubChapter: game.subChapter,
    previousChoices,
    premiumEnabled: isPremium,
    language: 'fr', // TODO: get from request headers / settings
  };
}

gameRouter.get('/:gameId', async (req, res, next) => {
  try {
    const game = await prisma.game.findUnique({
      where: { id: req.params.gameId },
      include: { player: true },
    });
    if (!game) {
      res.status(404).json({ success: false, error: 'Game not found' });
      return;
    }

    const character = JSON.parse(game.characterData) as Character;
    const gameState: GameState = {
      id: game.id,
      character,
      inventory: JSON.parse(game.inventoryData),
      chapter: {
        chapterNumber: game.chapter,
        subChapterNumber: game.subChapter,
        eventIndex: game.eventIndex,
        totalEvents: 4,
      },
      phase: game.phase as GameState['phase'],
      combat: game.combatData ? JSON.parse(game.combatData) : undefined,
      narrativeHistory: JSON.parse(game.narrativeData),
      isPremium: game.player.isPremium,
      createdAt: game.createdAt.toISOString(),
      updatedAt: game.updatedAt.toISOString(),
    };

    res.json({ success: true, data: gameState });
  } catch (error) {
    next(error);
  }
});

gameRouter.post('/choice', validate(MakeChoiceSchema), async (req, res, next) => {
  try {
    const { gameId, choiceId } = req.body;

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { player: true },
    });
    if (!game) {
      res.status(404).json({ success: false, error: 'Game not found' });
      return;
    }

    const character = JSON.parse(game.characterData) as Character;
    const narrativeHistory = JSON.parse(game.narrativeData) as NarrativeEntry[];
    const aiHistory = JSON.parse(game.aiContextData);

    // Build previous choices from narrative history
    const previousChoices: PreviousChoice[] = narrativeHistory.map((entry) => ({
      chapter: game.chapter,
      subChapter: game.subChapter,
      choiceId: entry.choicesMade[0] || '',
      choiceLabel: entry.choicesMade[0] || '',
      outcome: entry.text.substring(0, 100),
    }));

    const context = buildContext(character, game, previousChoices, game.player.isPremium);

    // Generate narration with the chosen action
    const { narration, updatedHistory } = await generateNarration(
      context,
      aiHistory,
      choiceId,
    );

    // Update narrative history
    const newEntry: NarrativeEntry = {
      id: `${Date.now()}`,
      text: narration.narrative,
      choicesMade: [choiceId],
      timestamp: new Date().toISOString(),
    };
    narrativeHistory.push(newEntry);

    // Advance chapter/sub-chapter based on scene progression
    let { chapter, subChapter, eventIndex } = game;
    eventIndex++;

    // Auto-advance sub-chapter every ~4 events, or if tech_notes suggest it
    if (eventIndex >= 4) {
      if (subChapter < 3) {
        subChapter++;
        eventIndex = 0;
      } else if (chapter < 5) {
        chapter++;
        subChapter = 1;
        eventIndex = 0;
      }
    }

    // Determine phase from scene type
    let phase = game.phase;
    const sceneType = narration.meta.sceneType;
    if (sceneType === 'combat_intro' || sceneType === 'boss_intro') {
      phase = 'combat';
    } else if (sceneType === 'resolution' && chapter === 5 && subChapter === 3) {
      phase = 'victory';
    }

    // Save
    await prisma.game.update({
      where: { id: gameId },
      data: {
        chapter,
        subChapter,
        eventIndex,
        phase,
        narrativeData: JSON.stringify(narrativeHistory),
        aiContextData: JSON.stringify(updatedHistory),
      },
    });

    res.json({
      success: true,
      data: {
        narration,
        gameState: {
          id: game.id,
          character,
          inventory: JSON.parse(game.inventoryData),
          chapter: { chapterNumber: chapter, subChapterNumber: subChapter, eventIndex, totalEvents: 4 },
          phase,
          narrativeHistory,
          isPremium: game.player.isPremium,
          createdAt: game.createdAt.toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get initial narration (first scene or reconnection)
gameRouter.get('/:gameId/narration', async (req, res, next) => {
  try {
    const game = await prisma.game.findUnique({
      where: { id: req.params.gameId },
      include: { player: true },
    });
    if (!game) {
      res.status(404).json({ success: false, error: 'Game not found' });
      return;
    }

    const character = JSON.parse(game.characterData) as Character;
    const aiHistory = JSON.parse(game.aiContextData);
    const context = buildContext(character, game, [], game.player.isPremium);

    // No chosenAction = first scene
    const { narration, updatedHistory } = await generateNarration(context, aiHistory);

    // Save the AI context for continuity
    await prisma.game.update({
      where: { id: game.id },
      data: { aiContextData: JSON.stringify(updatedHistory) },
    });

    res.json({ success: true, data: narration });
  } catch (error) {
    next(error);
  }
});
