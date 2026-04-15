import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'ft-avatar-picker',
  template: `
    <div class="ft-avatar-picker">
      <img
        *ngFor="let avatar of avatars"
        class="ft-avatar-picker__option"
        [class.ft-avatar-picker__option--selected]="avatar === selectedAvatar"
        [src]="avatar"
        alt="Avatar option"
        (click)="selectAvatar(avatar)"
      />
    </div>
  `,
  styleUrls: ['./ft-avatar-picker.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class FtAvatarPickerComponent {
  @Input() avatars: string[] = [];
  @Input() selectedAvatar = '';

  @Output() avatarSelect = new EventEmitter<string>();

  selectAvatar(avatar: string): void {
    this.avatarSelect.emit(avatar);
  }
}