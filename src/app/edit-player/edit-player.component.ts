import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { colors } from 'src/app/models/colors';
import { Player, playerTemplate } from 'src/app/models/player';
import { PlayerService } from 'src/app/services/player.service';
import { EventsDirective } from 'src/app/tracking/events.directive';
import { environment } from 'src/environments/environment';
import { generateId, generateAvatarPaths } from 'src/app/utils/id.utils';
import { FtHeaderComponent } from 'src/app/ft-ui/header/ft-header.component';
import { FtButtonComponent } from 'src/app/ft-ui/button/ft-button.component';
import { FtInputComponent } from 'src/app/ft-ui/input/ft-input.component';
import { FtColorPickerComponent } from 'src/app/ft-ui/color-picker/ft-color-picker.component';
import { FtAvatarPickerComponent } from 'src/app/ft-ui/avatar-picker/ft-avatar-picker.component';
import { FtToastService } from 'src/app/ft-ui/toast/ft-toast.service';

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
    FtHeaderComponent,
    FtButtonComponent,
    FtInputComponent,
    FtColorPickerComponent,
    FtAvatarPickerComponent,
  ],
})
export class EditPlayerComponent implements OnInit, OnDestroy {
  url = environment.URL;
  players: {
    [key: string]: Player;
  } = this.playerService.players;
  selectedUserId: string = '';
  avatarOptions: string[] = generateAvatarPaths();
  avatarUrls: string[] = generateAvatarPaths().map(a => this.url + a);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
  });
  hasToDisplayAddUser: boolean = false;
  colors = colors;
  selectedColor = '#dc0936';

  private playersSub?: Subscription;

  constructor(
    private playerService: PlayerService,
    private fb: FormBuilder,
    private router: Router,
    private toast: FtToastService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {
    // OnPush components don't re-render on service-side BehaviorSubject
    // emissions unless we explicitly markForCheck(). Subscribe to players$
    // so the grid reflects add/update/delete without a page reload.
    this.playersSub = this.playerService.players$.subscribe((players) => {
      this.players = players;
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    if (
      !this.playerService.players ||
      Object.values(this.playerService.players).length === 0
    ) {
      this.playerService.loadPlayers();
    }
  }

  ngOnDestroy(): void {
    this.playersSub?.unsubscribe();
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

  getInputErrorMessage(): string {
    const control = this.form.get('name');
    if (!control?.errors || !control.touched) return '';
    if (control.errors['required']) return 'Name is required';
    if (control.errors['minlength']) return 'Name too short';
    if (control.errors['maxlength']) return 'Name too long';
    return '';
  }

  private showError(key: string): void {
    this.toast.error(this.translate.instant(key));
  }

  private showSuccess(key: string): void {
    this.toast.success(this.translate.instant(key));
  }
}