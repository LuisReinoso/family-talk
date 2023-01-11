import { Injectable } from '@angular/core';
import { questions } from 'src/app/models/questions';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  questions: string[] = questions;

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

  removeQuestion(index: number): void {
    this.questions = this.questions.filter((question, i) => i !== index);
  }

  saveQuestions(): void {
    this.localStorageService.save('questions', this.questions);
  }
}
