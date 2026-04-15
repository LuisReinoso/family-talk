import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EventsDirective } from 'src/app/tracking/events.directive';
import { FtHeaderComponent } from 'src/app/ft-ui/header/ft-header.component';
import { FtConfigCardComponent } from 'src/app/ft-ui/config-card/ft-config-card.component';
import { FtButtonComponent } from 'src/app/ft-ui/button/ft-button.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslateModule,
    EventsDirective,
    FtHeaderComponent,
    FtConfigCardComponent,
    FtButtonComponent,
  ],
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