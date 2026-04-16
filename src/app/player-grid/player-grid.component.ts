import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from 'src/app/models/player';
import { environment } from 'src/environments/environment';
import { FtPlayerCardComponent, PlayerCardState } from 'src/app/ft-ui/player-card/ft-player-card.component';

@Component({
  selector: 'app-player-grid',
  templateUrl: './player-grid.component.html',
  styleUrls: ['./player-grid.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FtPlayerCardComponent],
})
export class PlayerGridComponent {
  @Input() players: { [key: string]: Player } = {};
  @Input() selectedUserId: string = '';
  @Input() compact = false;
  @Output() playerClick = new EventEmitter<void>();

  url = environment.URL;

  trackByPlayerKey(index: number, item: { key: string }): string {
    return item.key;
  }

  getPlayerState(player: Player): PlayerCardState {
    if (player.id === this.selectedUserId) return 'selected';
    if (player.hasAnswer) return 'answered';
    if (player.timeRemaining <= 0) return 'expired';
    return 'available';
  }
}