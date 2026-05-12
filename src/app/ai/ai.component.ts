import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AiProvider, AiService } from 'src/app/services/ai.service';
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
    aiProvider: 'openai' as AiProvider,
    openAiToken: { value: '', updateOn: 'blur' },
    ollamaToken: { value: '', updateOn: 'blur' },
    hasToUseAi: false,
  });

  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private aiService: AiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.aiService.loadAiProvider();
    this.aiService.loadOpenAiToken();
    this.aiService.loadOllamaToken();
    this.aiService.loadHasToUseAi();

    this.formGroup.patchValue({
      aiProvider: this.aiService.aiProvider,
      openAiToken: this.aiService.openAiToken,
      ollamaToken: this.aiService.ollamaToken,
      hasToUseAi: this.aiService.hasToUseAi.value,
    });

    this.updateTokenValidation();

    this.subs.push(
      this.formGroup.controls['openAiToken'].valueChanges.subscribe((v: string) => {
        this.aiService.saveOpenAiToken(v);
      }),
      this.formGroup.controls['ollamaToken'].valueChanges.subscribe((v: string) => {
        this.aiService.saveOllamaToken(v);
      }),
      this.formGroup.controls['aiProvider'].valueChanges.subscribe((p: AiProvider) => {
        this.aiService.saveAiProvider(p);
        this.updateTokenValidation();
        this.cdr.markForCheck();
      }),
      this.formGroup.controls['hasToUseAi'].valueChanges.subscribe((v: boolean) => {
        this.aiService.saveHasToUseAi(v);
        this.updateTokenValidation();
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.subs = [];
  }

  get isProviderOllama(): boolean {
    return this.formGroup.controls['aiProvider'].value === 'ollama';
  }

  get isProviderOpenAi(): boolean {
    return this.formGroup.controls['aiProvider'].value === 'openai';
  }

  selectProvider(provider: AiProvider): void {
    this.formGroup.controls['aiProvider'].setValue(provider);
  }

  /**
   * Required only on the field of the currently selected provider, and
   * only when the AI feature is enabled.
   */
  private updateTokenValidation(): void {
    const useAi = !!this.formGroup.controls['hasToUseAi'].value;
    const provider: AiProvider = this.formGroup.controls['aiProvider'].value;

    const openAi = this.formGroup.controls['openAiToken'];
    const ollama = this.formGroup.controls['ollamaToken'];

    openAi.clearValidators();
    ollama.clearValidators();

    if (useAi) {
      if (provider === 'openai') openAi.addValidators(Validators.required);
      else ollama.addValidators(Validators.required);
    }

    openAi.updateValueAndValidity({ emitEvent: false });
    ollama.updateValueAndValidity({ emitEvent: false });
  }

  backToGame(): void {
    const provider: AiProvider = this.formGroup.controls['aiProvider'].value;
    const tokenCtrl = provider === 'openai'
      ? this.formGroup.controls['openAiToken']
      : this.formGroup.controls['ollamaToken'];

    if (tokenCtrl.invalid) {
      tokenCtrl.markAsTouched();
      return;
    }
    this.router.navigate(['']);
  }
}
