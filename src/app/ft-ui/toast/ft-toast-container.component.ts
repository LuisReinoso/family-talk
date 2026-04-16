import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FtToastService, FtToastVariant } from './ft-toast.service';

@Component({
  selector: 'ft-toast-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="ft-toast-container" aria-live="polite" aria-atomic="true">
      <div
        *ngFor="let t of toastService.toasts$ | async; trackBy: trackById"
        class="ft-toast"
        [ngClass]="'ft-toast--' + t.variant"
        role="status"
      >
        <span class="ft-toast__icon" aria-hidden="true">{{ iconFor(t.variant) }}</span>
        <span class="ft-toast__message">{{ t.message }}</span>
        <button
          type="button"
          class="ft-toast__close"
          (click)="toastService.dismiss(t.id)"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./ft-toast-container.component.scss'],
})
export class FtToastContainerComponent {
  constructor(public toastService: FtToastService) {}

  trackById(_: number, t: { id: number }): number {
    return t.id;
  }

  iconFor(variant: FtToastVariant): string {
    switch (variant) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warn':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  }
}
