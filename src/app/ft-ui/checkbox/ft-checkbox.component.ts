import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ft-checkbox',
  template: `
    <label class="ft-checkbox-wrapper">
      <span class="ft-checkbox-box" [class.ft-checkbox-box--checked]="checked">
        <input
          type="checkbox"
          class="ft-checkbox-input"
          [checked]="checked"
          [disabled]="disabled"
          (change)="onToggle()"
        />
        <span *ngIf="checked" class="ft-checkbox-mark"></span>
      </span>
      <span *ngIf="label" class="ft-checkbox-label">{{ label }}</span>
    </label>
  `,
  styleUrls: ['./ft-checkbox.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FtCheckboxComponent),
      multi: true,
    },
  ],
})
export class FtCheckboxComponent implements ControlValueAccessor {
  @Input() checked = false;
  @Input() label = '';
  @Input() disabled = false;

  @Output() checkedChange = new EventEmitter<boolean>();

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  onToggle(): void {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.onChange(this.checked);
    this.checkedChange.emit(this.checked);
  }

  writeValue(value: boolean): void {
    this.checked = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}