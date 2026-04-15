import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Category, defaultCategory } from 'src/app/models/questions';
import { QuestionsService } from 'src/app/services/questions.service';
import { EventsDirective } from 'src/app/tracking/events.directive';
import { environment } from 'src/environments/environment';
import { FtHeaderComponent } from 'src/app/ft-ui/header/ft-header.component';
import { FtButtonComponent } from 'src/app/ft-ui/button/ft-button.component';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslateModule, EventsDirective, FtHeaderComponent, FtButtonComponent],
})
export class QuestionsComponent implements OnInit {
  selectedCategory: Category = Category.random;
  categories = Object.values(defaultCategory);
  category = Category;
  numberQuestionsPerCategory = this.questionsService.numberQuestionsPerCategory;
  url = environment.URL;

  constructor(
    private router: Router,
    private questionsService: QuestionsService
  ) {}

  ngOnInit(): void {
    this.selectedCategory = this.questionsService.loadCategory();
    this.questionsService.calcQuestionsPerCategory();
    this.numberQuestionsPerCategory =
      this.questionsService.numberQuestionsPerCategory;
  }

  setupQuestionCategory(category: Category): void {
    this.selectedCategory = category;
    this.questionsService.setupQuestionCategory(category);
  }

  backToGame(): void {
    this.router.navigate(['']);
  }
}