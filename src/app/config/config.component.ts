import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EventsDirective } from 'src/app/tracking/events.directive';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslateModule, EventsDirective],
})
export class ConfigComponent {
  constructor(private router: Router) {}

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