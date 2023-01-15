import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AiService } from 'src/app/services/ai.service';

@Component({
  selector: 'app-ai',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
})
export class AiComponent implements OnInit, OnDestroy {
  formGroup: FormGroup = this.fb.group(
    { openAiToken: '' },
    { updateOn: 'blur' }
  );
  openAiTokenSub!: Subscription | null;

  constructor(
    private fb: FormBuilder,
    private aiService: AiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.aiService.loadOpenAiToken();
    this.formGroup.controls['openAiToken'].setValue(this.aiService.openAiToken);

    this.openAiTokenSub = this.formGroup.controls[
      'openAiToken'
    ].valueChanges.subscribe((openAiToken) => {
      this.aiService.saveOpenAiToken(openAiToken);
    });
  }

  ngOnDestroy(): void {
    if (!!this.openAiTokenSub) {
      this.openAiTokenSub.unsubscribe();
      this.openAiTokenSub = null;
    }
  }

  backToGame(): void {
    this.router.navigate(['']);
  }
}
