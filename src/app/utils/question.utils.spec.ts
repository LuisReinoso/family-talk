import { Category, Question } from 'src/app/models/questions';
import {
  filterQuestionsByCategory,
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