import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

export type AlertVariant = 'warn' | 'error' | 'info' | 'success';

@Component({
  selector: 'ft-alert',
  template: `
    <div class="ft-alert" [ngClass]="'ft-alert--' + variant" *ngIf="visible">
      <span class="ft-alert__icon">{{ variantIcon }}</span>
      <span class="ft-alert__message">
        <ng-content></ng-content>
      </span>
      <button *ngIf="dismissible" class="ft-alert__close" (click)="dismiss()">✕</button>
    </div>
  `,
  styleUrls: ['./ft-alert.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class FtAlertComponent {
  @Input() variant: AlertVariant = 'warn';
  @Input() dismissible = false;

  @Output() dismissed = new EventEmitter<void>();

  visible = true;

  get variantIcon(): string {
    const icons: Record<AlertVariant, string> = {
      warn: '⚠️',
      error: '❌',
      info: 'ℹ️',
      success: '✅',
    };
    return icons[this.variant];
  }

  dismiss(): void {
    this.visible = false;
    this.dismissed.emit();
  }
}