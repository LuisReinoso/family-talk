import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, take } from 'rxjs';
import { AiService } from 'src/app/services/ai.service';
import { EventsDirective } from 'src/app/tracking/events.directive';
import { FtHeaderComponent } from 'src/app/ft-ui/header/ft-header.component';
import { FtButtonComponent } from 'src/app/ft-ui/button/ft-button.component';
import { FtCheckboxComponent } from 'src/app/ft-ui/checkbox/ft-checkbox.component';
import { FtInputComponent } from 'src/app/ft-ui/input/ft-input.component';

@Component({
  selector: 'app-ai',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    EventsDirective,
    FtHeaderComponent,
    FtButtonComponent,
    FtCheckboxComponent,
    FtInputComponent,
  ],
})
export class AiComponent implements OnInit, OnDestroy {
  formGroup: FormGroup = this.fb.group({
    openAiToken: { value: '', updateOn: 'blur' },
    hasToUseAi: false,
  });
  openAiTokenSub!: Subscription | null;
  hasToUseAiSub!: Subscription | null;

  constructor(
    private fb: FormBuilder,
    private aiService: AiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.aiService.loadOpenAiToken();
    this.formGroup.controls['openAiToken'].setValue(this.aiService.openAiToken);

    this.aiService.loadHasToUseAi();
    this.formGroup.controls['hasToUseAi'].setValue(
      this.aiService.hasToUseAi.value
    );

    this.updateValidationOpenAiToken(this.aiService.hasToUseAi.value);
    this.watchOpenAiToken();
    this.watchHasToUseAi();
  }

  ngOnDestroy(): void {
    if (!!this.openAiTokenSub) {
      this.openAiTokenSub.unsubscribe();
      this.openAiTokenSub = null;
    }

    if (!!this.hasToUseAiSub) {
      this.hasToUseAiSub.unsubscribe();
      this.hasToUseAiSub = null;
    }
  }

  private watchOpenAiToken() {
    this.openAiTokenSub = this.formGroup.controls[
      'openAiToken'
    ].valueChanges.subscribe((openAiToken) => {
      this.aiService.saveOpenAiToken(openAiToken);
    });
  }

  private watchHasToUseAi() {
    this.hasToUseAiSub = this.formGroup.controls[
      'hasToUseAi'
    ].valueChanges.subscribe((hasToUseAi) => {
      this.updateValidationOpenAiToken(hasToUseAi);
      this.aiService.saveHasToUseAi(hasToUseAi);
    });
  }

  private updateValidationOpenAiToken(hasToUseAi: any) {
    if (hasToUseAi) {
      this.formGroup.controls['openAiToken'].addValidators(Validators.required);
    } else {
      this.formGroup.controls['openAiToken'].clearValidators();
    }
    this.formGroup.controls['openAiToken'].updateValueAndValidity();
  }

  backToGame(): void {
    if (this.formGroup.controls['openAiToken'].invalid) {
      this.formGroup.controls['openAiToken'].markAsTouched();
      return;
    }
    this.router.navigate(['']);
  }
}