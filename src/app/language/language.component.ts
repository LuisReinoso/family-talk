import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { EventsDirective } from 'src/app/tracking/events.directive';

@Component({
  selector: 'language-name',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslateModule, EventsDirective],
})
export class LanguageComponent implements OnInit {
  currentLanguage: string = 'es';

  constructor(
    private languageService: LanguageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.languageService.language;
  }

  backToGame(): void {
    this.router.navigate(['']);
  }

  setupSpanishAsLanguage(): void {
    this.currentLanguage = 'es';
    this.languageService.setLanguage(this.currentLanguage);
  }

  setupEnglishAsLanguage(): void {
    this.currentLanguage = 'en';
    this.languageService.setLanguage(this.currentLanguage);
  }
}
