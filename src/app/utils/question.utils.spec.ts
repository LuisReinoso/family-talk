import { Category, Question } from 'src/app/models/questions';
import {
  filterQuestionsByCategory,
  filterQuestionsByDepth,
  depthForRound,
  isAppreciationRound,
  selectAppreciationPrompt,
  removeQuestion,
  calcQuestionsPerCategory,
  selectRandomQuestion,
  getQuestionText,
  parseAiQuestionResponse,
} from './question.utils';

describe('question.utils', () => {
  const mockQuestion: Question = {
    id: 'test1',
    question: '¿Pregunta de prueba?',
    translationUS: 'Test question?',
    category: Category.goals,
  };

  const mockQuestion2: Question = {
    id: 'test2',
    question: '¿Otra pregunta?',
    translationUS: 'Another question?',
    category: Category.health,
  };

  describe('filterQuestionsByCategory', () => {
    it('should return all questions for random category', () => {
      const allQuestions: { [key: string]: Question } = { test1: mockQuestion, test2: mockQuestion2 };
      const result = filterQuestionsByCategory(allQuestions, Category.random);
      expect(result.length).toBe(2);
    });

    it('should filter questions by specific category', () => {
      const allQuestions: { [key: string]: Question } = { test1: mockQuestion, test2: mockQuestion2 };
      const result = filterQuestionsByCategory(allQuestions, Category.goals);
      expect(result.length).toBe(1);
      expect(result[0].category).toBe(Category.goals);
    });

    it('should return empty array when no questions match category', () => {
      const allQuestions: { [key: string]: Question } = { test1: mockQuestion };
      const result = filterQuestionsByCategory(allQuestions, Category.health);
      expect(result.length).toBe(0);
    });
  });

  describe('removeQuestion', () => {
    it('should remove a question by id', () => {
      const allQuestions: { [key: string]: Question } = { test1: mockQuestion, test2: mockQuestion2 };
      const result = removeQuestion(allQuestions, 'test1');
      expect(result['test1']).toBeUndefined();
      expect(result['test2']).toEqual(mockQuestion2);
    });

    it('should not mutate the original object', () => {
      const allQuestions: { [key: string]: Question } = { test1: mockQuestion };
      removeQuestion(allQuestions, 'test1');
      expect(allQuestions['test1']).toBeDefined();
    });

    it('should return same object when id does not exist', () => {
      const allQuestions: { [key: string]: Question } = { test1: mockQuestion };
      const result = removeQuestion(allQuestions, 'nonexistent');
      expect(result).toEqual(allQuestions);
    });
  });

  describe('calcQuestionsPerCategory', () => {
    it('should count questions per category correctly', () => {
      const allQuestions: { [key: string]: Question } = { test1: mockQuestion, test2: mockQuestion2 };
      const result = calcQuestionsPerCategory(allQuestions);

      expect(result[Category.goals]).toBe(1);
      expect(result[Category.health]).toBe(1);
      expect(result[Category.random]).toBe(2);
    });

    it('should handle empty questions object', () => {
      const result = calcQuestionsPerCategory({});
      expect(result[Category.random]).toBe(0);
    });
  });

  describe('selectRandomQuestion', () => {
    it('should return a question and remaining questions', () => {
      const allQuestions: { [key: string]: Question } = { test1: mockQuestion, test2: mockQuestion2 };
      const result = selectRandomQuestion(allQuestions, Category.random, 'es');

      expect(result).not.toBeNull();
      expect(result!.questionText).toBeTruthy();
      expect(Object.keys(result!.remaining).length).toBe(1);
    });

    it('should return Spanish question when lang is es', () => {
      const allQuestions: { [key: string]: Question } = { test1: mockQuestion };
      const result = selectRandomQuestion(allQuestions, Category.random, 'es');

      expect(result!.questionText).toBe('¿Pregunta de prueba?');
    });

    it('should return English question when lang is en', () => {
      const allQuestions: { [key: string]: Question } = { test1: mockQuestion };
      const result = selectRandomQuestion(allQuestions, Category.random, 'en');

      expect(result!.questionText).toBe('Test question?');
    });

    it('should return null when no questions available', () => {
      const result = selectRandomQuestion({}, Category.random, 'es');
      expect(result).toBeNull();
    });

    it('should fall back to all questions when category filter yields empty', () => {
      const allQuestions: { [key: string]: Question } = { test1: mockQuestion };
      const result = selectRandomQuestion(allQuestions, Category.health, 'es');

      expect(result).not.toBeNull();
      expect(result!.questionText).toBe('¿Pregunta de prueba?');
    });
  });

  describe('depthForRound', () => {
    it('should return 1 for rounds 1-3', () => {
      expect(depthForRound(1)).toBe(1);
      expect(depthForRound(3)).toBe(1);
    });

    it('should return 2 for rounds 4-6', () => {
      expect(depthForRound(4)).toBe(2);
      expect(depthForRound(6)).toBe(2);
    });

    it('should return 3 for rounds 7+', () => {
      expect(depthForRound(7)).toBe(3);
      expect(depthForRound(100)).toBe(3);
    });
  });

  describe('isAppreciationRound', () => {
    it('should return true for every 5th round', () => {
      expect(isAppreciationRound(5)).toBe(true);
      expect(isAppreciationRound(10)).toBe(true);
      expect(isAppreciationRound(15)).toBe(true);
    });

    it('should return false for non-5th rounds', () => {
      expect(isAppreciationRound(0)).toBe(false);
      expect(isAppreciationRound(1)).toBe(false);
      expect(isAppreciationRound(4)).toBe(false);
      expect(isAppreciationRound(6)).toBe(false);
    });
  });

  describe('selectAppreciationPrompt', () => {
    it('should return a Spanish prompt for es lang', () => {
      const prompt = selectAppreciationPrompt('es');
      expect(prompt).toBeTruthy();
      expect(typeof prompt).toBe('string');
    });

    it('should return an English prompt for en lang', () => {
      const prompt = selectAppreciationPrompt('en');
      expect(prompt).toBeTruthy();
    });
  });

  describe('filterQuestionsByDepth', () => {
    const q1: Question = { ...mockQuestion, id: 'd1', depth: 1 };
    const q2: Question = { ...mockQuestion2, id: 'd2', depth: 2 };
    const q3: Question = { ...mockQuestion, id: 'd3', depth: 3 };

    it('should filter to depth 1 only', () => {
      expect(filterQuestionsByDepth([q1, q2, q3], 1).length).toBe(1);
    });

    it('should filter to depth <= 2', () => {
      expect(filterQuestionsByDepth([q1, q2, q3], 2).length).toBe(2);
    });

    it('should include all for depth 3', () => {
      expect(filterQuestionsByDepth([q1, q2, q3], 3).length).toBe(3);
    });

    it('should treat missing depth as 1', () => {
      const noDepth: Question = { ...mockQuestion, id: 'nd' };
      expect(filterQuestionsByDepth([noDepth], 1).length).toBe(1);
    });
  });

  describe('selectRandomQuestion with depth', () => {
    const q1: Question = { id: 'dq1', question: 'Ligera', translationUS: 'Light', category: Category.goals, depth: 1 };
    const q3: Question = { id: 'dq3', question: 'Profunda', translationUS: 'Deep', category: Category.goals, depth: 3 };

    it('should only return depth-1 questions when maxDepth is 1', () => {
      const all = { dq1: q1, dq3: q3 };
      const result = selectRandomQuestion(all, Category.random, 'es', 1);
      expect(result).not.toBeNull();
      expect(result!.questionText).toBe('Ligera');
    });

    it('should fall back when no questions match depth', () => {
      const all = { dq3: q3 };
      const result = selectRandomQuestion(all, Category.random, 'es', 1);
      expect(result).not.toBeNull();
      expect(result!.questionText).toBe('Profunda');
    });
  });

  describe('getQuestionText', () => {
    it('should return Spanish text for es language', () => {
      expect(getQuestionText(mockQuestion, 'es')).toBe('¿Pregunta de prueba?');
    });

    it('should return English text for en language', () => {
      expect(getQuestionText(mockQuestion, 'en')).toBe('Test question?');
    });
  });

  describe('parseAiQuestionResponse', () => {
    it('should parse valid JSON string', () => {
      const json = JSON.stringify({ id: '1', question: 'test', translationUS: 'testUS', category: 'goals' });
      const result = parseAiQuestionResponse(json);
      expect(result!.id).toBe('1');
      expect(result!.question).toBe('test');
      expect(result!.translationUS).toBe('testUS');
    });

    it('should return null for invalid JSON', () => {
      const result = parseAiQuestionResponse('not json');
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = parseAiQuestionResponse('');
      expect(result).toBeNull();
    });
  });
});