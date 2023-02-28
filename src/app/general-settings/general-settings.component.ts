import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from 'src/app/services/player.service';
import { EventsDirective } from 'src/app/tracking/events.directive';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, EventsDirective],
})
export class GeneralSettingsComponent implements OnInit {
  constructor(private playerService: PlayerService, private router: Router) {}

  ngOnInit(): void {}

  resetPlayersTimer() {
    this.playerService.resetPlayersTimer();
  }

  backToGame() {
    this.router.navigate(['/']);
  }
}
