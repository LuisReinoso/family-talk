import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'ft-config-card',
  template: `
    <button
      class="ft-config-card"
      [style.border-top-color]="accentColor"
      (click)="cardClick.emit()"
    >
      <span class="ft-config-card__icon">{{ icon }}</span>
      <span class="ft-config-card__label">{{ label }}</span>
    </button>
  `,
  styleUrls: ['./ft-config-card.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class FtConfigCardComponent {
  @Input() icon = '';
  @Input() label = '';
  @Input() accentColor = '#4caf50';

  @Output() cardClick = new EventEmitter<void>();
}