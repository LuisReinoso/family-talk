import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';

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
    let language: string | null = this.localStorageService.get('language');

    if (!!language) {
      if (language.includes('es')) {
        language = 'es';
      }

      if (language.includes('en')) {
        language = 'en';
      }
    }

    this.language = language || this.translateService.currentLang;
    this.setLanguage(this.language);
  }

  private saveLanguage(language: string): void {
    this.localStorageService.set('language', language);
  }
}
