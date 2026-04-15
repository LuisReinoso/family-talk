import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'ft-question-card',
  template: `
    <div class="ft-question-card" *ngIf="questionText; else noQuestionTemplate">
      <div class="ft-question-card__label">{{ label }}</div>
      <div class="ft-question-card__text">{{ questionText }}</div>
      <div class="ft-question-card__actions">
        <ng-content select="[slot=actions]"></ng-content>
      </div>
    </div>
    <ng-template #noQuestionTemplate>
      <div class="ft-question-card ft-question-card--empty">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
  styleUrls: ['./ft-question-card.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class FtQuestionCardComponent {
  @Input() questionText: string | null = null;
  @Input() label = 'Pregunta';

  @Output() resetClick = new EventEmitter<void>();
}