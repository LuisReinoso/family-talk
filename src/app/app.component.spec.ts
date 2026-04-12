import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { LanguageService } from './services/language.service';

describe('AppComponent', () => {
  let languageServiceSpy: jasmine.SpyObj<LanguageService>;

  beforeEach(async () => {
    languageServiceSpy = jasmine.createSpyObj('LanguageService', ['loadLanguage']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: LanguageService, useValue: languageServiceSpy },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call loadLanguage on construction', () => {
    TestBed.createComponent(AppComponent);
    expect(languageServiceSpy.loadLanguage).toHaveBeenCalled();
  });
});