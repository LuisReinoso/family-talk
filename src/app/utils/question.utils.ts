import {
  Category,
  Question,
  QuestionDepth,
  defaultQuestionCounter,
  appreciationPrompts,
} from 'src/app/models/questions';

export function filterQuestionsByCategory(
  questions: { [key: string]: Question },
  category: Category
): Question[] {
  const all = Object.values(questions);
  if (category === Category.random) return all;
  return all.filter((q) => q.category === category);
}

export function filterQuestionsByDepth(
  questions: Question[],
  depth: QuestionDepth
): Question[] {
  return questions.filter((q) => (q.depth ?? 1) <= depth);
}

/**
 * Compute the max allowed depth for a given round number using
 * Aron's escalation protocol:
 *   rounds 1-3  → depth 1 (light)
 *   rounds 4-6  → depth 1-2 (moderate)
 *   rounds 7+   → depth 1-3 (deep)
 */
export function depthForRound(round: number): QuestionDepth {
  if (round <= 3) return 1;
  if (round <= 6) return 2;
  return 3;
}

/**
 * Returns true when the current round should be an appreciation prompt
 * instead of a normal question (every 5th question starting at round 5).
 */
export function isAppreciationRound(round: number): boolean {
  return round > 0 && round % 5 === 0;
}

/**
 * Pick a random appreciation prompt in the given language.
 */
export function selectAppreciationPrompt(lang: string): string {
  const idx = Math.floor(Math.random() * appreciationPrompts.length);
  const p = appreciationPrompts[idx];
  return lang === 'en' ? p.translationUS : p.prompt;
}

export function removeQuestion(
  questions: { [key: string]: Question },
  id: string
): { [key: string]: Question } {
  const { [id]: _, ...rest } = questions;
  return rest;
}

export function calcQuestionsPerCategory(
  questions: { [key: string]: Question }
): { [key: string]: number } {
  const result: { [key: string]: number } = {
    ...defaultQuestionCounter,
    [Category.random]: Object.values(questions).length,
  };
  Object.values(questions).forEach((question) => {
    result[question.category] = (result[question.category] || 0) + 1;
  });
  return result;
}

/**
 * Select a random question respecting category and depth constraints.
 * Falls back gracefully: if no questions match the requested depth,
 * opens up to all depths; if no questions match the category, opens to
 * all categories.
 */
export function selectRandomQuestion(
  questions: { [key: string]: Question },
  category: Category,
  lang: string,
  maxDepth: QuestionDepth = 3
): { questionText: string; remaining: { [key: string]: Question } } | null {
  let filtered = filterQuestionsByCategory(questions, category);

  // Try depth-constrained first
  let pool = filterQuestionsByDepth(filtered, maxDepth);

  // Fallback: any depth in the same category
  if (pool.length === 0) pool = filtered;

  // Fallback: any question at all
  if (pool.length === 0) pool = Object.values(questions);

  if (pool.length === 0) return null;

  const selected = pool[Math.floor(Math.random() * pool.length)];
  const questionText = lang === 'en' ? selected.translationUS : selected.question;
  const remaining = removeQuestion(questions, selected.id);

  return { questionText, remaining };
}

export function getQuestionText(question: Question, lang: string): string {
  return lang === 'en' ? question.translationUS : question.question;
}

export function parseAiQuestionResponse(text: string): Question | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
