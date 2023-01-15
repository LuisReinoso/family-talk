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
    this.language = this.localStorageService.get('language') || 'es';
    this.setLanguage(this.language);
  }

  private saveLanguage(language: string): void {
    this.localStorageService.save('language', language);
  }
}
