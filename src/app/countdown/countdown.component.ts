import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, take, tap } from 'rxjs';
import { Player } from 'src/app/models/player';
import { SecondsToMinutesPipe } from 'src/app/pipes/seconds-to-minutes.pipe';
import { DOCUMENT } from '@angular/common';
import { PlayerService } from 'src/app/services/player.service';
import { QuestionsService } from 'src/app/services/questions.service';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
  standalone: true,
  imports: [CommonModule, SecondsToMinutesPipe],
})
export class CountdownComponent implements OnInit {
  selectedPlayer!: Player;
  selectedUserId: string = '';
  selectedQuestion$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  maxAnswerPerQuestion = 5;
  answerPerQuestion = 0;

  players: { [key: string]: Player } = this.playerService.players;

  title = 'family-talk';

  intervalId!: NodeJS.Timer;
  isSelectingRandomUser: boolean = false;

  constructor(
    private router: Router,
    private playerService: PlayerService,
    private questionsService: QuestionsService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.selectRandomQuestion();
  }

  ngOnInit(): void {
    const totalPlayers = Object.values(this.players).length;
    this.maxAnswerPerQuestion = totalPlayers > 6 ? 6 : totalPlayers;
  }

  selectPlayer(player: Player) {
    this.selectedPlayer = player;
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      this.selectedPlayer.timeRemaining--;
      if (this.selectedPlayer.timeRemaining <= 0) {
        this.stopCountdown();
      }
    }, 1000);
  }

  stopCountdown() {
    clearInterval(this.intervalId);
    this.intervalId = null as unknown as NodeJS.Timer;
    this.savePlayers();
  }

  selectRandomUser() {
    const availablePlayers = Object.values(this.players).filter(
      (player) => !player.hasAnswer && player.timeRemaining > 0
    );

    const selectedRandomUserIndex = Math.floor(
      Math.random() * availablePlayers.length
    );

    const player = availablePlayers[selectedRandomUserIndex];
    this.selectedUserId = player.id;
    this.scrollToDiv();
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

    if (Object.values(this.players).every((player) => player.hasAnswer)) {
      this.players = Object.values(this.players)
        .map((player) => {
          return { ...player, hasAnswer: false };
        })
        .reduce((accumulator, player) => {
          return { ...accumulator, [player.id]: player };
        }, {});
    }

    interval(200)
      .pipe(
        tap(() => this.selectRandomUser()),
        take(Object.values(this.players).length)
      )
      .subscribe(
        () => {},
        () => {},
        () => {
          this.markPlayerAsAnswered();
          this.stopCountdown();
          this.selectPlayerById();
          this.startCountdown();
          this.answerPerQuestion += 1;
          this.isSelectingRandomUser = false;
        }
      );
  }

  markPlayerAsAnswered() {
    this.players[this.selectedUserId].hasAnswer = true;
  }

  selectRandomQuestion() {
    const questions = this.questionsService.questions;
    const selectedQuestionIndex = Math.floor(Math.random() * questions.length);

    this.selectedQuestion$.next(questions[selectedQuestionIndex]);
    this.questionsService.removeQuestion(selectedQuestionIndex);
    this.savePlayers();
    this.questionsService.saveQuestions();
  }

  scrollToDiv() {
    this.document.getElementById(this.selectedUserId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  navigateToEditPlayer() {
    this.stopCountdown();
    this.savePlayers();
    this.questionsService.saveQuestions();
    this.router.navigate(['/edit-player']);
  }

  savePlayers() {
    this.playerService.players = this.players;
    this.playerService.savePlayers();
  }
}
