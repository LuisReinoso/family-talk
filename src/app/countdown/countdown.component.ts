import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, lastValueFrom, Subscription, take, tap } from 'rxjs';
import { Player } from 'src/app/models/player';
import { PlayerService } from 'src/app/services/player.service';
import { QuestionsService } from 'src/app/services/questions.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Category } from 'src/app/models/questions';
import { AiService } from 'src/app/services/ai.service';
import { UserAgentService } from 'src/app/services/userAgent.service';
import { LanguageService } from 'src/app/services/language.service';
import { EventsDirective } from 'src/app/tracking/events.directive';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { PlayerGridComponent } from 'src/app/player-grid/player-grid.component';
import { TimerComponent } from 'src/app/timer/timer.component';
import { FtHeaderComponent } from 'src/app/ft-ui/header/ft-header.component';
import { FtQuestionCardComponent } from 'src/app/ft-ui/question-card/ft-question-card.component';
import { FtActionButtonComponent } from 'src/app/ft-ui/action-button/ft-action-button.component';
import { FtButtonComponent } from 'src/app/ft-ui/button/ft-button.component';
import { FtAlertComponent } from 'src/app/ft-ui/alert/ft-alert.component';
import {
  getRandomAvailablePlayer,
  getPlayersForNextRound,
  calcMaxAnswersPerQuestion,
} from 'src/app/utils/player.utils';
import {
  selectRandomQuestion,
  getQuestionText,
  depthForRound,
  isAppreciationRound,
  selectAppreciationPrompt,
} from 'src/app/utils/question.utils';
import { GameModeService } from 'src/app/services/game-mode.service';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslateModule,
    EventsDirective,
    PlayerGridComponent,
    TimerComponent,
    FtHeaderComponent,
    FtQuestionCardComponent,
    FtActionButtonComponent,
    FtButtonComponent,
    FtAlertComponent,
  ],
})
export class CountdownComponent implements OnInit, OnDestroy {
  selectedPlayer!: Player;
  selectedUserId: string = '';
  selectedQuestion$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  maxAnswerPerQuestion = 5;
  answerPerQuestion = 0;

  players: { [key: string]: Player } = this.playerService.players;

  private countdownIntervalId: ReturnType<typeof setInterval> | null = null;
  private shuffleSubscription: Subscription | null = null;
  isSelectingRandomUser: boolean = false;
  isTimerRunning: boolean = false;
  showAiErrorAlert: boolean = false;
  showPlayerAlert: boolean = false;

  /** Token currently configured for the active AI provider (OpenAI or Ollama). */
  get aiToken(): string | null {
    return this.aiService.activeToken;
  }
  isLoadingQuestion: boolean = false;
  isMobile = this.userAgentService.isMobile();
  hasToUseAi$ = this.aiService.hasToUseAi$;

  constructor(
    private router: Router,
    private playerService: PlayerService,
    private questionsService: QuestionsService,
    private translateService: TranslateService,
    private languageService: LanguageService,
    private aiService: AiService,
    private userAgentService: UserAgentService,
    private localStorageService: LocalStorageService,
    private gameMode: GameModeService,
    private cdr: ChangeDetectorRef,
  ) {
    this.languageService.loadLanguage();
    this.selectRandomQuestion();
  }

  ngOnInit(): void {
    const totalPlayers = Object.values(this.players).length;
    this.maxAnswerPerQuestion = calcMaxAnswersPerQuestion(totalPlayers);
  }

  ngOnDestroy(): void {
    this.clearCountdown();
    this.shuffleSubscription?.unsubscribe();
  }

  startCountdown() {
    this.clearCountdown();
    this.isTimerRunning = true;
    this.countdownIntervalId = setInterval(() => {
      this.selectedPlayer = {
        ...this.selectedPlayer,
        timeRemaining: this.selectedPlayer.timeRemaining - 1,
      };
      this.players[this.selectedUserId] = this.selectedPlayer;
      if (this.selectedPlayer.timeRemaining <= 0) {
        this.stopCountdown();
      }
      this.cdr.markForCheck();
    }, 1000);
  }

  stopCountdown() {
    this.clearCountdown();
    this.isTimerRunning = false;
    this.savePlayers();
  }

  selectRandomUser() {
    const player = getRandomAvailablePlayer(this.players);
    if (!player) return;
    this.selectedUserId = player.id;
    this.cdr.markForCheck();
    this.scrollToPlayer();
  }

  selectPlayerById() {
    this.selectedPlayer = this.players[this.selectedUserId];
  }

  selectRandomUserAndStart() {
    if (this.isSelectingRandomUser) {
      return;
    }

    this.isSelectingRandomUser = true;

    if (this.maxAnswerPerQuestion === this.answerPerQuestion) {
      this.selectRandomQuestion();
      this.answerPerQuestion = 0;
    }

    this.stopCountdown();
    this.savePlayers();

    this.players = getPlayersForNextRound(this.players);

    this.shuffleSubscription = interval(200)
      .pipe(
        tap(() => this.selectRandomUser()),
        take(Object.values(this.players).length)
      )
      .subscribe({
        complete: () => {
          this.markPlayerAsAnswered();
          this.stopCountdown();
          this.selectPlayerById();
          this.startCountdown();
          this.answerPerQuestion += 1;
          this.isSelectingRandomUser = false;
          this.cdr.markForCheck();
        },
      });
  }

  markPlayerAsAnswered() {
    this.players[this.selectedUserId].hasAnswer = true;
  }

  /** Whether the current question is an appreciation prompt (affects UI). */
  isAppreciation = false;
  /** Current depth level for UI indicator. */
  currentDepth: 1 | 2 | 3 = 1;

  selectRandomQuestion() {
    const lang = this.translateService.currentLang || 'es';
    this.questionsService.advanceRound();
    const round = this.questionsService.roundCounter;

    // Gottman appreciation injection: every 5th question
    if (isAppreciationRound(round)) {
      this.isAppreciation = true;
      this.currentDepth = 3;
      this.selectedQuestion$.next(selectAppreciationPrompt(lang));
      return;
    }

    this.isAppreciation = false;
    const maxDepth = depthForRound(round);
    this.currentDepth = maxDepth;

    const result = selectRandomQuestion(
      this.questionsService.questions,
      this.questionsService.currentCategory,
      lang,
      maxDepth
    );

    if (!result) {
      this.questionsService.restoreQuestions();
      const retry = selectRandomQuestion(
        this.questionsService.questions,
        this.questionsService.currentCategory,
        lang,
        maxDepth
      );
      if (retry) {
        this.selectedQuestion$.next(retry.questionText);
        this.questionsService.questions = retry.remaining;
      }
      return;
    }

    this.selectedQuestion$.next(result.questionText);
    this.questionsService.questions = result.remaining;
    this.savePlayers();
    this.questionsService.saveQuestions();
  }

  /** Switch to trivia mode and navigate to the trivia screen. */
  switchToTrivia(): void {
    this.gameMode.set('trivia');
    this.router.navigate(['/trivia']);
  }

  async generateRandomQuestion(): Promise<void> {
    this.isLoadingQuestion = true;

    try {
      const currentQuestion = await lastValueFrom(
        this.aiService.generateRandomQuestion(
          this.questionsService.currentCategory
        )
      );

      this.isLoadingQuestion = false;

      const question = getQuestionText(
        currentQuestion!,
        this.translateService.currentLang || 'es'
      );

      this.selectedQuestion$.next(question);
      this.savePlayers();
    } catch (error) {
      this.isLoadingQuestion = false;
      this.showAiErrorAlert = true;
      setTimeout(() => { this.showAiErrorAlert = false; }, 3000);
    }
  }

  scrollToPlayer() {
    const element = document.getElementById(this.selectedUserId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }

  navigateConfigs() {
    this.stopCountdown();
    this.savePlayers();
    this.questionsService.saveQuestions();
    this.router.navigate(['/configs']);
  }

  savePlayers() {
    this.playerService.players = this.players;
  }

  resetLocalStorage() {
    this.localStorageService.reset();
    location.reload();
  }

  private clearCountdown(): void {
    if (this.countdownIntervalId !== null) {
      clearInterval(this.countdownIntervalId);
      this.countdownIntervalId = null;
    }
  }
}