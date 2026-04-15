import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

export type ButtonVariant = 'primary' | 'info' | 'danger' | 'icon' | 'ai' | 'question';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ft-button',
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="disabled || loading"
      (click)="onClick()"
    >
      <span *ngIf="loading" class="ft-btn__spinner"></span>
      <span *ngIf="icon && !loading" class="ft-btn__icon">{{ icon }}</span>
      <span class="ft-btn__text">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styleUrls: ['./ft-button.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class FtButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon = '';

  @Output() buttonClick = new EventEmitter<void>();

  get buttonClasses(): string {
    return `ft-btn ft-btn--${this.variant} ft-btn--${this.size}`;
  }

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit();
    }
  }
}