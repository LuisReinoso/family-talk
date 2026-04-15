import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type CardPadding = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ft-card',
  template: `
    <div class="ft-card" [ngClass]="cardClasses" [style.border-top-color]="accentColor">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./ft-card.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class FtCardComponent {
  @Input() accentColor = '';
  @Input() padding: CardPadding = 'md';

  get cardClasses(): Record<string, boolean> {
    return {
      'ft-card--pad-sm': this.padding === 'sm',
      'ft-card--pad-md': this.padding === 'md',
      'ft-card--pad-lg': this.padding === 'lg',
      'ft-card--accent': !!this.accentColor,
    };
  }
}