import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Category, defaultCategory } from 'src/app/models/questions';
import { QuestionsService } from 'src/app/services/questions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class QuestionsComponent implements OnInit {
  selectedCategory: Category = Category.random;
  categories = Object.values(defaultCategory);
  category = Category;
  numberQuestionsPerCategory = this.questionsService.numberQuestionsPerCategory;
  url = environment.URL;

  constructor(
    private router: Router,
    private questionsService: QuestionsService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.selectedCategory = this.questionsService.loadCategory();
    this.questionsService.calcQuestionsPerCategory();
    this.numberQuestionsPerCategory =
      this.questionsService.numberQuestionsPerCategory;
    this.cd.detectChanges();
  }

  setupQuestionCategory(category: Category): void {
    this.selectedCategory = category;
    this.questionsService.setupQuestionCategory(category);
  }

  backToGame(): void {
    this.router.navigate(['']);
  }
}
