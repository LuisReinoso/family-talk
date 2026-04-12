import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { normalizeLanguage } from 'src/app/utils/language.utils';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  language: string = 'es';

  constructor(
    private localStorageService: LocalStorageService,
    private translateService: TranslateService
  ) {}

  public setLanguage(language: string): void {
    this.language = language;
    this.translateService.use(language);
    this.saveLanguage(language);
  }

  public loadLanguage() {
    let language: string | null =
      this.localStorageService.get<string>('language') ||
      this.translateService.currentLang ||
      (typeof navigator !== 'undefined' ? navigator.language : null);

    language = normalizeLanguage(language);
    this.language = language;
    this.setLanguage(this.language);
  }

  private saveLanguage(language: string): void {
    this.localStorageService.set('language', language);
  }
}