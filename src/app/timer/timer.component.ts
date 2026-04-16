import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from 'src/app/models/player';
import { SecondsToMinutesPipe } from 'src/app/pipes/seconds-to-minutes.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { CONFIG } from 'src/app/models/config';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SecondsToMinutesPipe, TranslateModule],
})
export class TimerComponent {
  @Input() player: Player | null = null;
  @Input() isRunning: boolean = false;
  @Input() isSelecting: boolean = false;
  @Input() totalTime: number = CONFIG.maxTimeToTalkInSeconds;
  @Output() pauseClick = new EventEmitter<void>();
  @Output() resumeClick = new EventEmitter<void>();

  readonly radius = 54;
  readonly circumference = 2 * Math.PI * this.radius;

  get progressOffset(): number {
    if (!this.player) return this.circumference;
    const ratio = Math.max(0, Math.min(1, this.player.timeRemaining / this.totalTime));
    return this.circumference * (1 - ratio);
  }

  get urgency(): 'normal' | 'warn' | 'critical' {
    if (!this.player) return 'normal';
    const ratio = this.player.timeRemaining / this.totalTime;
    if (ratio <= 0.1) return 'critical';
    if (ratio <= 0.3) return 'warn';
    return 'normal';
  }
}
