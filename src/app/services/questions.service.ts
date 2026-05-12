import { Injectable } from '@angular/core';
import {
  Category,
  defaultQuestionCounter,
  Question,
  questions,
} from 'src/app/models/questions';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import {
  removeQuestion as removeQuestionUtil,
  calcQuestionsPerCategory as calcQuestionsPerCategoryUtil,
} from 'src/app/utils/question.utils';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  private questionsSubject = new BehaviorSubject<{ [key: string]: Question }>(questions);
  questions$ = this.questionsSubject.asObservable();

  private categorySubject = new BehaviorSubject<Category>(Category.random);
  currentCategory$ = this.categorySubject.asObservable();

  private questionCounterSubject = new BehaviorSubject<{ [key: string]: number }>(defaultQuestionCounter);
  numberQuestionsPerCategory$ = this.questionCounterSubject.asObservable();

  /** Tracks how many questions have been asked this session (resets on
   *  page reload). Used for Aron-style depth escalation and Gottman
   *  appreciation injection. */
  private roundCounterSubject = new BehaviorSubject<number>(0);
  roundCounter$ = this.roundCounterSubject.asObservable();

  /** Bump this when the question pool changes to invalidate cached copies. */
  private static readonly QUESTIONS_VERSION = 3;

  private localStorageKey = 'questions';
  private versionKey = 'questionsVersion';
  private categoryLocalStorageKey = 'category';

  constructor(private localStorageService: LocalStorageService) {
    this.loadQuestions();
  }

  get questions(): { [key: string]: Question } {
    return this.questionsSubject.getValue();
  }

  set questions(value: { [key: string]: Question }) {
    this.questionsSubject.next(value);
  }

  get currentCategory(): Category {
    return this.categorySubject.getValue();
  }

  get numberQuestionsPerCategory(): { [key: string]: number } {
    return this.questionCounterSubject.getValue();
  }

  get roundCounter(): number {
    return this.roundCounterSubject.getValue();
  }

  advanceRound(): void {
    this.roundCounterSubject.next(this.roundCounter + 1);
  }

  resetRounds(): void {
    this.roundCounterSubject.next(0);
  }

  loadQuestions(): void {
    const storedVersion = this.localStorageService.getRaw(this.versionKey);
    const currentVersion = String(QuestionsService.QUESTIONS_VERSION);

    // If the stored version doesn't match, discard cached questions
    // so users get the updated pool.
    if (storedVersion !== currentVersion) {
      this.localStorageService.set(this.versionKey, currentVersion);
      this.localStorageService.set(this.localStorageKey, null);
      this.questionsSubject.next(questions);
      return;
    }

    const questionsFromLocalStorage = this.localStorageService.get<{ [key: string]: Question }>(this.localStorageKey);

    if (!questionsFromLocalStorage || Object.keys(questionsFromLocalStorage).length === 0) {
      this.questionsSubject.next(questions);
      return;
    }

    this.questionsSubject.next(questionsFromLocalStorage);
  }

  removeQuestion(questionId: string): void {
    const updated = removeQuestionUtil(this.questions, questionId);
    this.questionsSubject.next(updated);
  }

  saveQuestions(): void {
    this.localStorageService.set(this.localStorageKey, this.questions);
  }

  setupQuestionCategory(selectedCategory: Category) {
    this.categorySubject.next(selectedCategory);
    this.saveCategory(selectedCategory);
  }

  saveCategory(category: Category): void {
    this.localStorageService.set(this.categoryLocalStorageKey, category);
  }

  loadCategory(): Category {
    const category = (
      this.localStorageService.get(this.categoryLocalStorageKey) as Category
    ) || Category.random;
    this.categorySubject.next(category);
    return category;
  }

  calcQuestionsPerCategory(): void {
    const result = calcQuestionsPerCategoryUtil(this.questions);
    this.questionCounterSubject.next(result);
  }

  restoreQuestions() {
    this.questionsSubject.next(questions);
  }
}
