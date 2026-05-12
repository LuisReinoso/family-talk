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

/** Per-player accumulated score for the current trivia session. */
export type TriviaScores = { [playerId: string]: number };

/** Base points awarded for a correct answer. */
const BASE_POINTS = 10;
/** Extra bonus awarded if the answer comes in under SPEED_BONUS_MS. */
const SPEED_BONUS_POINTS = 5;
const SPEED_BONUS_MS = 5_000;

/**
 * Holds trivia game state: which subcategory is active, which questions
 * remain in the current session, per-player scores, and the current pick.
 * Mirrors the shape of QuestionsService but kept fully separate — trivia
 * and conversation share no state.
 */
@Injectable({ providedIn: 'root' })
export class TriviaService {
  private static readonly QUESTIONS_KEY = 'triviaQuestions';
  private static readonly CATEGORY_KEY = 'triviaCategory';
  private static readonly SCORES_KEY = 'triviaScores';

  private readonly questionsSubject = new BehaviorSubject<TriviaQuestion[]>(triviaQuestions);
  readonly questions$ = this.questionsSubject.asObservable();

  private readonly categorySubject = new BehaviorSubject<TriviaCategory>(TriviaCategory.random);
  readonly currentCategory$ = this.categorySubject.asObservable();

  private readonly scoresSubject = new BehaviorSubject<TriviaScores>({});
  readonly scores$ = this.scoresSubject.asObservable();

  constructor(private localStorage: LocalStorageService) {
    this.loadCategory();
    this.loadQuestions();
    this.loadScores();
  }

  get currentCategory(): TriviaCategory {
    return this.categorySubject.getValue();
  }

  get questions(): TriviaQuestion[] {
    return this.questionsSubject.getValue();
  }

  get scores(): TriviaScores {
    return this.scoresSubject.getValue();
  }

  setCategory(category: TriviaCategory): void {
    this.categorySubject.next(category);
    this.localStorage.set(TriviaService.CATEGORY_KEY, category);
  }

  /**
   * Pick a random question from the current category that hasn't been
   * asked yet this session. Returns the question with its options shuffled
   * (so the correct answer isn't always first). Returns null when the pool
   * is empty — caller decides whether to reset or show a "finished" UI.
   */
  pickRandom(lang: string): {
    question: string;
    options: string[];
    answer: string;
    questionId: string;
  } | null {
    const pool = filterTrivia(this.questions, this.currentCategory);

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

  /**
   * Compute points for a guess and credit them to the player. Returns the
   * detail so the UI can render a "+15!" toast.
   */
  awardGuess(
    playerId: string,
    correct: boolean,
    elapsedMs: number,
  ): { earned: number; speedBonus: boolean } {
    if (!correct) return { earned: 0, speedBonus: false };

    const speedBonus = elapsedMs < SPEED_BONUS_MS;
    const earned = BASE_POINTS + (speedBonus ? SPEED_BONUS_POINTS : 0);

    const updated: TriviaScores = {
      ...this.scores,
      [playerId]: (this.scores[playerId] ?? 0) + earned,
    };
    this.scoresSubject.next(updated);
    this.localStorage.set(TriviaService.SCORES_KEY, updated);

    return { earned, speedBonus };
  }

  /** Reset all scores AND restore the full question pool. */
  restart(): void {
    this.scoresSubject.next({});
    this.questionsSubject.next(triviaQuestions);
    this.localStorage.set(TriviaService.SCORES_KEY, {});
    this.save();
  }

  /** Restore only the question pool (keeps scores). */
  restoreQuestions(): void {
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

  private loadScores(): void {
    const stored = this.localStorage.get<TriviaScores>(TriviaService.SCORES_KEY);
    this.scoresSubject.next(stored ?? {});
  }
}
