import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, lastValueFrom, Subscription, take, tap } from 'rxjs';
import { Player } from 'src/app/models/player';
import { SecondsToMinutesPipe } from 'src/app/pipes/seconds-to-minutes.pipe';
import { PlayerService } from 'src/app/services/player.service';
import { QuestionsService } from 'src/app/services/questions.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Category } from 'src/app/models/questions';
import { AiService } from 'src/app/services/ai.service';
import { UserAgentService } from 'src/app/services/userAgent.service';
import { environment } from 'src/environments/environment';
import { LanguageService } from 'src/app/services/language.service';
import { EventsDirective } from 'src/app/tracking/events.directive';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {
  getRandomAvailablePlayer,
  getPlayersForNextRound,
  calcMaxAnswersPerQuestion,
} from 'src/app/utils/player.utils';
import {
  selectRandomQuestion,
  getQuestionText,
} from 'src/app/utils/question.utils';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SecondsToMinutesPipe,
    TranslateModule,
    EventsDirective,
  ],
})
export class CountdownComponent implements OnInit, OnDestroy {
  selectedPlayer!: Player;
  selectedUserId: string = '';
  selectedQuestion$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  maxAnswerPerQuestion = 5;
  answerPerQuestion = 0;

  players: { [key: string]: Player } = this.playerService.players;

  title = 'family-talk';

  private countdownIntervalId: ReturnType<typeof setInterval> | null = null;
  private shuffleSubscription: Subscription | null = null;
  isSelectingRandomUser: boolean = false;
  isTimerRunning: boolean = false;
  showAiErrorAlert: boolean = false;
  showPlayerAlert: boolean = false;

  openAiToken = this.aiService.openAiToken;
  isLoadingQuestion: boolean = false;
  isMobile = this.userAgentService.isMobile();
  hasToUseAi$ = this.aiService.hasToUseAi$;
  url = environment.URL;

  constructor(
    private router: Router,
    private playerService: PlayerService,
    private questionsService: QuestionsService,
    private translateService: TranslateService,
    private languageService: LanguageService,
    private aiService: AiService,
    private userAgentService: UserAgentService,
    private localStorageService: LocalStorageService,
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

  selectPlayer(player: Player) {
    this.selectedPlayer = player;
  }

  startCountdown() {
    this.clearCountdown();
    this.isTimerRunning = true;
    this.countdownIntervalId = setInterval(() => {
      this.selectedPlayer.timeRemaining--;
      if (this.selectedPlayer.timeRemaining <= 0) {
        this.stopCountdown();
      }
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
    this.scrollToPlayer();
  }

  selectPlayerById() {
    this.selectPlayer(this.players[this.selectedUserId]);
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
        },
      });
  }

  markPlayerAsAnswered() {
    this.players[this.selectedUserId].hasAnswer = true;
  }

  selectRandomQuestion() {
    const result = selectRandomQuestion(
      this.questionsService.questions,
      this.questionsService.currentCategory,
      this.translateService.currentLang || 'es'
    );

    if (!result) {
      this.questionsService.restoreQuestions();
      const retry = selectRandomQuestion(
        this.questionsService.questions,
        this.questionsService.currentCategory,
        this.translateService.currentLang || 'es'
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