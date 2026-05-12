import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Player } from 'src/app/models/player';
import { TriviaCategory } from 'src/app/models/trivia';
import { GameModeService } from 'src/app/services/game-mode.service';
import { PlayerService } from 'src/app/services/player.service';
import { TriviaService } from 'src/app/services/trivia.service';
import { FtButtonComponent } from 'src/app/ft-ui/button/ft-button.component';
import { FtHeaderComponent } from 'src/app/ft-ui/header/ft-header.component';
import { PlayerGridComponent } from 'src/app/player-grid/player-grid.component';

interface OptionState {
  text: string;
  selected: boolean;
  /** Only assigned after a guess: correct → true, wrong → false. */
  correct?: boolean;
}

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslateModule,
    FtHeaderComponent,
    FtButtonComponent,
    PlayerGridComponent,
  ],
})
export class TriviaComponent implements OnInit, OnDestroy {
  /** Current question text. */
  question: string | null = null;
  /** Shuffled options. */
  options: OptionState[] = [];
  /** Correct answer for the active question. */
  private answer: string | null = null;
  /** Locks options after a guess is committed so a player can't change. */
  locked = false;

  /** Player chosen for this round (for show, not enforced). */
  players: { [key: string]: Player } = this.playerService.players;
  selectedPlayer: Player | null = null;

  private subs: Subscription[] = [];

  constructor(
    public trivia: TriviaService,
    private playerService: PlayerService,
    private gameMode: GameModeService,
    private translate: TranslateService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Ensure mode is trivia (in case user navigated directly via URL)
    this.gameMode.set('trivia');
    this.next();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.subs = [];
  }

  /** Pick the next question. */
  next(): void {
    const lang = this.translate.currentLang || 'es';
    const result = this.trivia.pickRandom(lang);
    if (!result) {
      this.question = null;
      return;
    }
    this.question = result.question;
    this.answer = result.answer;
    this.options = result.options.map((text) => ({ text, selected: false }));
    this.locked = false;
    this.cdr.markForCheck();
  }

  /** User selected an option. */
  selectOption(opt: OptionState): void {
    if (this.locked) return;
    opt.selected = true;
    this.locked = true;

    // Annotate every option as correct/incorrect so the UI can color them
    this.options = this.options.map((o) => ({
      ...o,
      correct: o.text === this.answer,
    }));

    this.cdr.markForCheck();
  }

  /** Switch back to conversation mode and navigate home. */
  switchToConversation(): void {
    this.gameMode.set('conversation');
    this.router.navigate(['']);
  }

  /** Quick helper used by template to know if the locked answer was correct. */
  get lastGuessCorrect(): boolean {
    if (!this.locked) return false;
    return this.options.some((o) => o.selected && o.correct);
  }
}
