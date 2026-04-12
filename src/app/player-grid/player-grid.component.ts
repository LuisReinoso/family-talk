import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from 'src/app/models/player';
import { SecondsToMinutesPipe } from 'src/app/pipes/seconds-to-minutes.pipe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-player-grid',
  templateUrl: './player-grid.component.html',
  styleUrls: ['./player-grid.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SecondsToMinutesPipe],
})
export class PlayerGridComponent {
  @Input() players: { [key: string]: Player } = {};
  @Input() selectedUserId: string = '';
  @Output() playerClick = new EventEmitter<void>();

  url = environment.URL;

  trackByPlayerKey(index: number, item: { key: string }): string {
    return item.key;
  }
}