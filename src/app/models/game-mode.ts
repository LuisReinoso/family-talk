/**
 * Two top-level game modes. Each has its own services, components, and
 * UI — they share only player state and i18n.
 *
 * - conversation: research-backed open-ended questions (Aron, Gottman,
 *   Duke-Fivush). The original Family Talk mode.
 * - trivia: factual questions with multiple choice + correct answer.
 */
export type GameMode = 'conversation' | 'trivia';

export const DEFAULT_GAME_MODE: GameMode = 'conversation';
