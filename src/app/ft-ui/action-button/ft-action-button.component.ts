import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

export type ActionButtonVariant = 'ai' | 'question' | 'ghost';

@Component({
  selector: 'ft-action-button',
  template: `
    <button
      class="ft-action-btn"
      [ngClass]="'ft-action-btn--' + variant"
      [class.ft-action-btn--loading]="loading"
      [disabled]="loading"
      (click)="actionClick.emit()"
    >
      <span *ngIf="loading" class="ft-action-btn__spinner"></span>
      <span *ngIf="!loading" class="ft-action-btn__content">
        <span class="ft-action-btn__icon">{{ icon }}</span>
        <span class="ft-action-btn__text">{{ text }}</span>
      </span>
    </button>
  `,
  styleUrls: ['./ft-action-button.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class FtActionButtonComponent {
  @Input() icon = '';
  @Input() text = '';
  @Input() variant: ActionButtonVariant = 'question';
  @Input() loading = false;

  @Output() actionClick = new EventEmitter<void>();
}