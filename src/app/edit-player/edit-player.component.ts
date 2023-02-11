import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { colors } from 'src/app/models/colors';
import { Player, playerTemplate } from 'src/app/models/player';
import { PlayerService } from 'src/app/services/player.service';
import { EventsDirective } from 'src/app/tracking/events.directive';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    EventsDirective,
  ],
})
export class EditPlayerComponent implements OnInit {
  players: {
    [key: string]: Player;
  } = this.playerService.players;
  selectedUserId: string = '';

  form = this.fb.group({ name: ['', Validators.required] });
  hasToDisplayAddUser: boolean = false;
  colors = colors;
  selectedColor = '#dc0936';
  url = environment.URL;

  constructor(
    private playerService: PlayerService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (
      !this.playerService.players ||
      Object.values(this.playerService.players).length === 0
    ) {
      this.playerService.loadPlayers();
    }
  }

  selectPlayer(playerId: Player['id']): void {
    if (this.selectedUserId === playerId) {
      this.selectedUserId = '';
      return;
    }

    this.selectedUserId = playerId;
    this.form.controls.name.setValue(this.players[this.selectedUserId].name);
  }

  backToGame(): void {
    this.playerService.savePlayers();
    this.router.navigate(['']);
  }

  saveUser(): void {
    if (this.form.invalid) {
      return;
    }

    this.playerService.updateUser({
      ...this.players[this.selectedUserId],
      name: this.form.controls.name.value || '',
    });

    this.selectedUserId = '';
  }

  deleteUser(): void {
    this.playerService.deleteUser(this.selectedUserId);

    this.selectedUserId = '';
  }

  displayAddUser(): void {
    this.hasToDisplayAddUser = true;
  }

  addUser(): void {
    if (this.form.invalid) {
      return;
    }

    this.playerService.addUser({
      ...playerTemplate,
      id: this.generateRandomId(),
      color: this.selectedColor,
      name: this.form.controls.name.value || '',
    });

    this.hasToDisplayAddUser = false;
  }

  cancelCreateUser() {
    this.hasToDisplayAddUser = false;
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  selectRandomImage(playerId: string) {
    const mainSeed = Math.floor(Math.random() * (16 - 1 + 1)) + 1;
    const rowSeed = Math.floor(Math.random() * 3);

    this.playerService.updateUser({
      ...this.players[playerId],
      avatar: `/assets/faces/${mainSeed}_${rowSeed}_${rowSeed}.png`,
    });
  }

  private generateRandomId(): string {
    const randomNumber = Math.random();
    const RANDOM_LENGTH = 16;
    const id = randomNumber.toString(RANDOM_LENGTH);
    return id;
  }
}
