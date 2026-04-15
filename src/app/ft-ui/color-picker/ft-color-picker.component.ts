import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'ft-color-picker',
  template: `
    <div class="ft-color-picker">
      <div
        *ngFor="let color of colors"
        class="ft-color-picker__swatch"
        [class.ft-color-picker__swatch--selected]="color === selectedColor"
        [style.background]="color"
        (click)="selectColor(color)"
      ></div>
    </div>
  `,
  styleUrls: ['./ft-color-picker.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class FtColorPickerComponent {
  @Input() colors: string[] = [];
  @Input() selectedColor = '';

  @Output() colorSelect = new EventEmitter<string>();

  selectColor(color: string): void {
    this.colorSelect.emit(color);
  }
}