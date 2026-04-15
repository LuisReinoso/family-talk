import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type BadgeVariant = 'success' | 'expired' | 'info';

@Component({
  selector: 'ft-badge',
  template: `
    <div class="ft-badge" [ngClass]="'ft-badge--' + variant">
      <span class="ft-badge__icon">{{ icon }}</span>
    </div>
  `,
  styleUrls: ['./ft-badge.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class FtBadgeComponent {
  @Input() variant: BadgeVariant = 'success';

  @Input() icon = '';

  get defaultIcon(): string {
    const icons: Record<BadgeVariant, string> = {
      success: '✓',
      expired: '⏱',
      info: 'i',
    };
    return this.icon || icons[this.variant];
  }
}