import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  TriviaCategory,
  TriviaQuestion,
  filterTrivia,
  shuffle,
  triviaQuestions,
} from 'src/app/models/trivia';
import { LocalStorageService } from 'src/app/services/local-storage.service';

/**
 * Holds trivia game state: which subcategory is active, which questions
 * remain in the current session, and the current pick. Mirrors the
 * shape of QuestionsService but kept fully separate — trivia and
 * conversation share no state.
 */
@Injectable({ providedIn: 'root' })
export class TriviaService {
  private static readonly QUESTIONS_KEY = 'triviaQuestions';
  private static readonly CATEGORY_KEY = 'triviaCategory';

  private readonly questionsSubject = new BehaviorSubject<TriviaQuestion[]>(triviaQuestions);
  readonly questions$ = this.questionsSubject.asObservable();

  private readonly categorySubject = new BehaviorSubject<TriviaCategory>(TriviaCategory.random);
  readonly currentCategory$ = this.categorySubject.asObservable();

  constructor(private localStorage: LocalStorageService) {
    this.loadCategory();
    this.loadQuestions();
  }

  get currentCategory(): TriviaCategory {
    return this.categorySubject.getValue();
  }

  get questions(): TriviaQuestion[] {
    return this.questionsSubject.getValue();
  }

  setCategory(category: TriviaCategory): void {
    this.categorySubject.next(category);
    this.localStorage.set(TriviaService.CATEGORY_KEY, category);
  }

  /**
   * Pick a random question from the current category that hasn't been
   * asked yet this session. Returns the question with its options shuffled
   * (so the correct answer isn't always first). If the pool runs out it
   * resets back to the full set.
   */
  pickRandom(lang: string): {
    question: string;
    options: string[];
    answer: string;
    questionId: string;
  } | null {
    let pool = filterTrivia(this.questions, this.currentCategory);

    if (pool.length === 0) {
      // Reset and try again
      this.restore();
      pool = filterTrivia(this.questions, this.currentCategory);
    }

    if (pool.length === 0) return null;

    const selected = pool[Math.floor(Math.random() * pool.length)];
    const questionText = lang === 'en' ? selected.translationUS : selected.question;
    const rawOptions = lang === 'en' ? selected.optionsUS : selected.options;
    const answerText = lang === 'en' ? selected.answerUS : selected.answer;

    // Remove this question from the pool so it isn't repeated this session
    const remaining = this.questions.filter((q) => q.id !== selected.id);
    this.questionsSubject.next(remaining);
    this.save();

    return {
      question: questionText,
      options: shuffle(rawOptions),
      answer: answerText,
      questionId: selected.id,
    };
  }

  /** Restore the full question pool (e.g. when "all questions used"). */
  restore(): void {
    this.questionsSubject.next(triviaQuestions);
    this.save();
  }

  /** Persist the current questions pool to localStorage. */
  private save(): void {
    this.localStorage.set(TriviaService.QUESTIONS_KEY, this.questions);
  }

  private loadQuestions(): void {
    const stored = this.localStorage.get<TriviaQuestion[]>(TriviaService.QUESTIONS_KEY);
    if (!stored || stored.length === 0) {
      this.questionsSubject.next(triviaQuestions);
      return;
    }
    this.questionsSubject.next(stored);
  }

  private loadCategory(): void {
    const stored = this.localStorage.get<TriviaCategory>(TriviaService.CATEGORY_KEY);
    if (stored && Object.values(TriviaCategory).includes(stored)) {
      this.categorySubject.next(stored);
    }
  }
}
