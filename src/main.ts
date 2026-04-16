import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from 'src/app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./app/countdown/countdown.component').then(
        (m) => m.CountdownComponent
      ),
  },
  {
    path: 'roulette',
    loadComponent: () =>
      import('./app/roulette/roulette.component').then(
        (m) => m.RouletteComponent
      ),
  },
  {
    path: 'config-players',
    loadComponent: () =>
      import('./app/edit-player/edit-player.component').then(
        (m) => m.EditPlayerComponent
      ),
  },
  {
    path: 'configs',
    loadComponent: () =>
      import('./app/config/config.component').then((m) => m.ConfigComponent),
  },
  {
    path: 'config-language',
    loadComponent: () =>
      import('./app/language/language.component').then(
        (m) => m.LanguageComponent
      ),
  },
  {
    path: 'config-questions',
    loadComponent: () =>
      import('./app/questions/questions.component').then(
        (m) => m.QuestionsComponent
      ),
  },
  {
    path: 'config-ai',
    loadComponent: () =>
      import('./app/ai/ai.component').then((m) => m.AiComponent),
  },
  {
    path: 'general-settings',
    loadComponent: () =>
      import('./app/general-settings/general-settings.component').then(
        (m) => m.GeneralSettingsComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000',
      })
    ),
    importProvidersFrom(HttpClientModule), // or provideHttpClient() in Angular v15
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'es',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),
  ],
});

// main.ts
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
