import type { SceneContext } from '@txtrpg/shared';

export function buildNarrationUserPrompt(context: SceneContext, chosenAction?: string): string {
  if (!chosenAction) {
    // First scene of the adventure
    return `Génère la première scène de l'aventure.
Thème : ${context.theme}
Chapitre : ${context.currentChapter}/5
Sous-chapitre : ${context.currentSubChapter}/3
Personnage : ${context.playerName} (${context.archetype})

C'est le tout début. Crée une ouverture qui accroche immédiatement : un événement, une atmosphère, un mystère. Plonge le joueur dans l'action.

Réponds UNIQUEMENT avec le JSON demandé.`;
  }

  return `Le joueur a choisi : "${chosenAction}"

Continue l'histoire en tenant compte de ce choix.
Position actuelle : Chapitre ${context.currentChapter}/5, Sous-chapitre ${context.currentSubChapter}/3

Rappel : la narration doit refléter les conséquences de ce choix de manière visible et significative.

Réponds UNIQUEMENT avec le JSON demandé.`;
}
