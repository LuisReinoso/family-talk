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
import { environment } from 'src/environments/environment';
import { Player } from 'src/app/models/player';
import { GameModeService } from 'src/app/services/game-mode.service';
import { PlayerService } from 'src/app/services/player.service';
import { TriviaScores, TriviaService } from 'src/app/services/trivia.service';
import { FtButtonComponent } from 'src/app/ft-ui/button/ft-button.component';
import { FtHeaderComponent } from 'src/app/ft-ui/header/ft-header.component';

interface OptionState {
  text: string;
  selected: boolean;
  /** Only assigned after a guess: correct → true, wrong → false. */
  correct?: boolean;
}

interface ScoreRow {
  id: string;
  name: string;
  avatarUrl: string;
  color: string;
  score: number;
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
  ],
})
export class TriviaComponent implements OnInit, OnDestroy {
  /** Current question text. */
  question: string | null = null;
  /** Shuffled options. */
  options: OptionState[] = [];
  /** Correct answer for the active question. */
  private answer: string | null = null;
  /** Locks options after a guess is committed. */
  locked = false;
  /** Whether the most recent answer was correct (drives feedback styles). */
  lastGuessCorrect = false;
  /** Points awarded by the most recent guess (for the "+15!" toast). */
  lastPointsEarned = 0;
  /** Whether the last guess hit the speed bonus. */
  lastSpeedBonus = false;
  /** True when the question pool runs out — shows the podium. */
  finished = false;

  /** Player whose turn it is to answer. */
  currentPlayer: Player | null = null;
  /** Elapsed milliseconds on the current question (updates every 100ms). */
  elapsedMs = 0;
  /** Scoreboard rows ordered by score desc — recomputed when scores change. */
  scoreboard: ScoreRow[] = [];
  /** Top-3 podium ordering shown when the session finishes. */
  podium: ScoreRow[] = [];

  private players: { [key: string]: Player } = {};
  private startMs = 0;
  private timerId: ReturnType<typeof setInterval> | null = null;
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
    this.gameMode.set('trivia');
    this.players = this.playerService.players;

    this.subs.push(
      this.trivia.scores$.subscribe((scores) => {
        this.rebuildScoreboard(scores);
        this.cdr.markForCheck();
      }),
    );

    this.next();
  }

  ngOnDestroy(): void {
    this.stopTimer();
    this.subs.forEach((s) => s.unsubscribe());
    this.subs = [];
  }

  /** Pick the next question and a new random player. */
  next(): void {
    const lang = this.translate.currentLang || 'es';
    const result = this.trivia.pickRandom(lang);

    if (!result) {
      // No more questions — show podium
      this.finished = true;
      this.podium = [...this.scoreboard].slice(0, 3);
      this.stopTimer();
      this.cdr.markForCheck();
      return;
    }

    this.finished = false;
    this.question = result.question;
    this.answer = result.answer;
    this.options = result.options.map((text) => ({ text, selected: false }));
    this.locked = false;
    this.lastGuessCorrect = false;
    this.lastPointsEarned = 0;
    this.lastSpeedBonus = false;
    this.currentPlayer = this.pickRandomPlayer();

    this.startTimer();
    this.cdr.markForCheck();
  }

  /** User selected an option. */
  selectOption(opt: OptionState): void {
    if (this.locked || !this.currentPlayer) return;

    this.stopTimer();
    opt.selected = true;
    this.locked = true;

    const correct = opt.text === this.answer;
    this.lastGuessCorrect = correct;

    // Annotate every option as correct/incorrect so the UI can color them
    this.options = this.options.map((o) => ({
      ...o,
      correct: o.text === this.answer,
    }));

    const awarded = this.trivia.awardGuess(this.currentPlayer.id, correct, this.elapsedMs);
    this.lastPointsEarned = awarded.earned;
    this.lastSpeedBonus = awarded.speedBonus;

    this.cdr.markForCheck();
  }

  /** Reset scores and questions, then start over. */
  restart(): void {
    this.trivia.restart();
    this.next();
  }

  /** Switch back to conversation mode and navigate home. */
  switchToConversation(): void {
    this.gameMode.set('conversation');
    this.router.navigate(['']);
  }

  avatarUrl(player: Player): string {
    return environment.URL + player.avatar;
  }

  private pickRandomPlayer(): Player | null {
    const list = Object.values(this.players);
    if (list.length === 0) return null;
    return list[Math.floor(Math.random() * list.length)];
  }

  private startTimer(): void {
    this.stopTimer();
    this.startMs = Date.now();
    this.elapsedMs = 0;
    this.timerId = setInterval(() => {
      this.elapsedMs = Date.now() - this.startMs;
      this.cdr.markForCheck();
    }, 100);
  }

  private stopTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private rebuildScoreboard(scores: TriviaScores): void {
    this.scoreboard = Object.values(this.players)
      .map((p) => ({
        id: p.id,
        name: p.name,
        avatarUrl: environment.URL + p.avatar,
        color: p.color,
        score: scores[p.id] ?? 0,
      }))
      .sort((a, b) => b.score - a.score);

    if (this.finished) {
      this.podium = [...this.scoreboard].slice(0, 3);
    }
  }
}
