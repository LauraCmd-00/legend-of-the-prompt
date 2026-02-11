import type { RPSChoice } from '@txtrpg/shared';
import { RPS_WINS, FLEE_BASE_CHANCE, FLEE_LUCK_BONUS } from '@txtrpg/shared';

export function resolveFleeAttempt(
  playerChoice: RPSChoice,
  playerLuck: number,
): { enemyChoice: RPSChoice; success: boolean } {
  const choices: RPSChoice[] = ['rock', 'paper', 'scissors'];
  const enemyChoice = choices[Math.floor(Math.random() * 3)];

  let success: boolean;
  if (RPS_WINS[playerChoice] === enemyChoice) {
    success = true;
  } else if (RPS_WINS[enemyChoice] === playerChoice) {
    success = false;
  } else {
    const fleeChance = FLEE_BASE_CHANCE + (playerLuck * FLEE_LUCK_BONUS);
    success = Math.random() < fleeChance;
  }

  return { enemyChoice, success };
}
