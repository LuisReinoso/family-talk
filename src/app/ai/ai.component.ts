import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, take } from 'rxjs';
import { AiService } from 'src/app/services/ai.service';

@Component({
  selector: 'app-ai',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
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
    this.formGroup.controls['hasToUseAi'].setValue(this.aiService.hasToUseAi);

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
      this.aiService.saveHasToUseAi(hasToUseAi);
    });
  }

  backToGame(): void {
    this.router.navigate(['']);
  }
}
