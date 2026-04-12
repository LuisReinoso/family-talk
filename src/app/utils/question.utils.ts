import { Category, Question, defaultQuestionCounter, questions as allQuestions } from 'src/app/models/questions';

export function filterQuestionsByCategory(
  questions: { [key: string]: Question },
  category: Category
): Question[] {
  const all = Object.values(questions);
  if (category === Category.random) return all;
  return all.filter((q) => q.category === category);
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

export function selectRandomQuestion(
  questions: { [key: string]: Question },
  category: Category,
  lang: string
): { questionText: string; remaining: { [key: string]: Question } } | null {
  let filtered = filterQuestionsByCategory(questions, category);

  if (filtered.length === 0) {
    filtered = Object.values(questions);
  }

  if (filtered.length === 0) return null;

  const selected = filtered[Math.floor(Math.random() * filtered.length)];
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