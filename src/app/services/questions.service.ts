import { Injectable } from '@angular/core';
import { Question, questions } from 'src/app/models/questions';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  questions: {
    [key: string]: Question;
  } = questions;

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
    delete this.questions[questionId];
    this.questions = { ...this.questions };
  }

  saveQuestions(): void {
    this.localStorageService.save('questions', this.questions);
  }

  setupQuestionCategory(selectedCategory: Category) {
    this.currentCategory = selectedCategory;
    this.saveCategory(selectedCategory);
  }

  saveCategory(category: Category): void {
    this.localStorageService.save('category', category);
  }

  loadCategory(): Category {
    return (
      (this.localStorageService.get('category') as Category) || Category.random
    );
  }

  calcQuestionsPerCategory(): void {
    const questionCalc: { [key: string]: number } = {
      ...defaultQuestionCounter,
      [Category.random]: Object.values(this.questions).length,
    };
    Object.values(this.questions).forEach((question) => {
      questionCalc[question.category] += 1;
    });

    console.log('questionCalc', questionCalc);

    this.numberQuestionsPerCategory = {
      ...questionCalc,
    };
  }

  restoreQuestions() {
    this.questions = questions;
  }
}
