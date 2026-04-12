import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from 'src/app/models/player';
import { SecondsToMinutesPipe } from 'src/app/pipes/seconds-to-minutes.pipe';
import { TranslateModule } from '@ngx-translate/core';

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
  @Output() pauseClick = new EventEmitter<void>();
  @Output() resumeClick = new EventEmitter<void>();
}