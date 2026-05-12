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
    <div
      class="ft-question-card"
      [class.ft-question-card--appreciation]="appreciation"
      [class.ft-question-card--trivia]="!!answer"
      *ngIf="questionText; else noQuestionTemplate"
    >
      <div class="ft-question-card__header">
        <span class="ft-question-card__label">
          {{ appreciation ? '💛' : (answer ? '🧠' : label) }}
        </span>
        <span class="ft-question-card__depth" *ngIf="!appreciation && !answer && depth">
          <span
            *ngFor="let dot of depthDots"
            class="ft-question-card__dot"
            [class.ft-question-card__dot--active]="dot <= depth"
          ></span>
        </span>
      </div>
      <div class="ft-question-card__text">{{ questionText }}</div>

      <ng-container *ngIf="answer">
        <button
          *ngIf="!answerRevealed"
          type="button"
          class="ft-question-card__reveal"
          (click)="reveal.emit()"
        >
          {{ revealLabel }}
        </button>
        <div
          *ngIf="answerRevealed"
          class="ft-question-card__answer"
        >
          <span class="ft-question-card__answer-label">{{ answerLabel }}</span>
          <span class="ft-question-card__answer-text">{{ answer }}</span>
        </div>
      </ng-container>

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
  /** Current depth level (1-3). Shown as dots. */
  @Input() depth: 1 | 2 | 3 = 1;
  /** Whether this is a Gottman appreciation prompt. */
  @Input() appreciation = false;
  /** Trivia answer (shown after reveal). */
  @Input() answer: string | null = null;
  /** Whether the trivia answer has been revealed. */
  @Input() answerRevealed = false;
  /** Localized labels for trivia UI. */
  @Input() revealLabel = 'Mostrar respuesta';
  @Input() answerLabel = 'Respuesta:';

  @Output() resetClick = new EventEmitter<void>();
  @Output() reveal = new EventEmitter<void>();

  readonly depthDots = [1, 2, 3];
}