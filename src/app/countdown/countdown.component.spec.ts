import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountdownComponent } from './countdown.component';
import { PlayerService } from 'src/app/services/player.service';
import { QuestionsService } from 'src/app/services/questions.service';
import { AiService } from 'src/app/services/ai.service';
import { LanguageService } from 'src/app/services/language.service';
import { UserAgentService } from 'src/app/services/userAgent.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { TranslateService } from '@ngx-translate/core';

describe('CountdownComponent', () => {
  let component: CountdownComponent;
  let fixture: ComponentFixture<CountdownComponent>;

  beforeEach(async () => {
    const playerServiceSpy = jasmine.createSpyObj('PlayerService', ['loadPlayers', 'savePlayers'], { players: {} });
    const questionsServiceSpy = jasmine.createSpyObj('QuestionsService', ['loadQuestions', 'saveQuestions', 'restoreQuestions', 'setupQuestionCategory'], { questions: {}, currentCategory: 'random' });
    const aiServiceSpy = jasmine.createSpyObj('AiService', ['loadOpenAiToken', 'loadHasToUseAi'], { openAiToken: null, hasToUseAi$: { subscribe: () => {} } });
    const languageServiceSpy = jasmine.createSpyObj('LanguageService', ['loadLanguage']);
    const userAgentServiceSpy = jasmine.createSpyObj('UserAgentService', ['isMobile']);
    const localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['get', 'set', 'reset']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['use'], { currentLang: 'es' });

    await TestBed.configureTestingModule({
      imports: [CountdownComponent],
      providers: [
        { provide: PlayerService, useValue: playerServiceSpy },
        { provide: QuestionsService, useValue: questionsServiceSpy },
        { provide: AiService, useValue: aiServiceSpy },
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: UserAgentService, useValue: userAgentServiceSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CountdownComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});