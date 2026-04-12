import { Injectable } from '@angular/core';
import {
  Category,
  defaultQuestionCounter,
  Question,
  questions,
} from 'src/app/models/questions';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {
  removeQuestion as removeQuestionUtil,
  calcQuestionsPerCategory as calcQuestionsPerCategoryUtil,
} from 'src/app/utils/question.utils';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  questions: {
    [key: string]: Question;
  } = questions;

  currentCategory: Category = Category.random;

  numberQuestionsPerCategory: { [key: string]: number } =
    defaultQuestionCounter;

  constructor(private localStorageService: LocalStorageService) {
    this.loadQuestions();
  }

  loadQuestions(): void {
    const questionsFromLocalStorage = this.localStorageService.get('questions');

    if (!questionsFromLocalStorage || questionsFromLocalStorage.length === 0) {
      this.questions = questions;
      return;
    }

    this.questions = questionsFromLocalStorage;
  }

  removeQuestion(questionId: string): void {
    this.questions = removeQuestionUtil(this.questions, questionId);
  }

  saveQuestions(): void {
    this.localStorageService.set('questions', this.questions);
  }

  setupQuestionCategory(selectedCategory: Category) {
    this.currentCategory = selectedCategory;
    this.saveCategory(selectedCategory);
  }

  saveCategory(category: Category): void {
    this.localStorageService.set('category', category);
  }

  loadCategory(): Category {
    return (
      (this.localStorageService.get('category') as Category) || Category.random
    );
  }

  calcQuestionsPerCategory(): void {
    this.numberQuestionsPerCategory = calcQuestionsPerCategoryUtil(this.questions);
  }

  restoreQuestions() {
    this.questions = questions;
  }
}