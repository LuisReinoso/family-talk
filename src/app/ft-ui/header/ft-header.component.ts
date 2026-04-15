import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FtButtonComponent } from '../button/ft-button.component';

@Component({
  selector: 'ft-header',
  template: `
    <div class="ft-header">
      <img class="ft-header__logo" src="./assets/icons/family-talk-icon.png" alt="Family Talk" />
      <div class="ft-header__title">{{ title }}</div>
      <ft-button
        *ngIf="showConfig"
        variant="icon"
        icon="⚙️"
        (buttonClick)="configClick.emit()"
      >
        {{ configLabel }}
      </ft-button>
      <ng-content select="[slot=action]"></ng-content>
    </div>
  `,
  styleUrls: ['./ft-header.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FtButtonComponent],
})
export class FtHeaderComponent {
  @Input() title = '';
  @Input() showConfig = false;
  @Input() configLabel = 'Configurar';

  @Output() configClick = new EventEmitter<void>();
}