import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EventsDirective } from 'src/app/tracking/events.directive';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, EventsDirective],
})
export class ConfigComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToPlayersConfig(): void {
    this.router.navigate(['/config-players']);
  }

  goToLanguageConfig(): void {
    this.router.navigate(['/config-language']);
  }

  goToQuestionsConfig(): void {
    this.router.navigate(['/config-questions']);
  }

  goToAiConfig(): void {
    this.router.navigate(['/config-ai']);
  }

  backToGame(): void {
    this.router.navigate(['']);
  }

  goToGeneralConfig(): void {
    this.router.navigate(['/general-settings']);
  }
}
