import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { colors } from 'src/app/models/colors';
import { Player, playerTemplate } from 'src/app/models/player';
import { PlayerService } from 'src/app/services/player.service';
import { EventsDirective } from 'src/app/tracking/events.directive';
import { environment } from 'src/environments/environment';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { generateId, generateAvatarPaths } from 'src/app/utils/id.utils';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    EventsDirective,
    MatTooltipModule,
    MatSnackBarModule,
  ],
})
export class EditPlayerComponent implements OnInit {
  players: {
    [key: string]: Player;
  } = this.playerService.players;
  selectedUserId: string = '';
  avatarOptions: string[] = generateAvatarPaths();

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
  });
  hasToDisplayAddUser: boolean = false;
  colors = colors;
  selectedColor = '#dc0936';
  url = environment.URL;

  constructor(
    private playerService: PlayerService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
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
      this.showError('edit.nameValidation');
      return;
    }

    this.playerService.updateUser({
      ...this.players[this.selectedUserId],
      name: this.form.controls.name.value || '',
    });

    this.selectedUserId = '';
    this.showSuccess('edit.playerUpdated');
  }

  deleteUser(): void {
    this.playerService.deleteUser(this.selectedUserId);
    this.selectedUserId = '';
    this.showSuccess('edit.playerDeleted');
  }

  displayAddUser(): void {
    this.hasToDisplayAddUser = true;
    this.form.reset();
    this.selectedColor = '#dc0936';
  }

  addUser(): void {
    if (this.form.invalid) {
      this.showError('edit.nameValidation');
      return;
    }

    this.playerService.addUser({
      ...playerTemplate,
      id: generateId(),
      color: this.selectedColor,
      name: this.form.controls.name.value || '',
      avatar: `/assets/faces/1_0_0.png`,
    });

    this.hasToDisplayAddUser = false;
    this.showSuccess('edit.playerAdded');
  }

  cancelCreateUser() {
    this.hasToDisplayAddUser = false;
    this.form.reset();
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  selectAvatar(avatar: string, playerId: string) {
    this.playerService.updateUser({
      ...this.players[playerId],
      avatar: avatar,
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}