import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FtBadgeComponent } from '../badge/ft-badge.component';
import { SecondsToMinutesPipe } from 'src/app/pipes/seconds-to-minutes.pipe';

export type PlayerCardState = 'available' | 'selected' | 'answered' | 'expired';

@Component({
  selector: 'ft-player-card',
  template: `
    <div
      class="ft-player-card"
      [ngClass]="['ft-player-card--' + state, compact ? 'ft-player-card--compact' : '']"
      (click)="cardClick.emit()"
    >
      <div class="ft-player-card__body" [style.background]="color" [style.--card-accent]="color">
        <img class="ft-player-card__avatar" [src]="avatarUrl" [alt]="name + ' avatar'" />
        <div class="ft-player-card__name">{{ name }}</div>
        <div class="ft-player-card__time">{{ timeRemaining | secondsToMinutes }}</div>
        <ft-badge
          *ngIf="state === 'answered'"
          variant="success"
          icon="✓"
          class="ft-player-card__badge"
        ></ft-badge>
        <ft-badge
          *ngIf="state === 'expired'"
          variant="expired"
          icon="⏱"
          class="ft-player-card__badge"
        ></ft-badge>
      </div>
    </div>
  `,
  styleUrls: ['./ft-player-card.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FtBadgeComponent, SecondsToMinutesPipe],
})
export class FtPlayerCardComponent {
  @Input() name = '';
  @Input() avatarUrl = '';
  @Input() color = '';
  @Input() timeRemaining = 0;
  @Input() state: PlayerCardState = 'available';
  @Input() compact = false;

  @Output() cardClick = new EventEmitter<void>();
}