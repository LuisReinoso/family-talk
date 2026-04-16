import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from 'src/app/services/player.service';
import { EventsDirective } from 'src/app/tracking/events.directive';
import { FtHeaderComponent } from 'src/app/ft-ui/header/ft-header.component';
import { FtButtonComponent } from 'src/app/ft-ui/button/ft-button.component';
import { FtCardComponent } from 'src/app/ft-ui/card/ft-card.component';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslateModule, EventsDirective, FtHeaderComponent, FtButtonComponent, FtCardComponent],
})
export class GeneralSettingsComponent {
  constructor(private playerService: PlayerService, private router: Router) {}

  resetPlayersTimer() {
    this.playerService.resetPlayersTimer();
  }

  backToGame() {
    this.router.navigate(['/']);
  }
}