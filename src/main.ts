import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { APP_INITIALIZER } from '@angular/core';
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
    path: 'trivia',
    loadComponent: () =>
      import('./app/trivia/trivia.component').then((m) => m.TriviaComponent),
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
    importProvidersFrom(
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Check for new versions as soon as possible so users on the PWA
        // pick up deploys without manual cache clearing.
        registrationStrategy: 'registerImmediately',
      })
    ),
    {
      // When the SW reports a new version is ready, reload the page so
      // users get the new bundle without having to clear site data.
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (swUpdate: SwUpdate) => () => {
        if (!swUpdate.isEnabled) return;
        swUpdate.versionUpdates.subscribe((evt) => {
          if (evt.type === 'VERSION_READY') {
            // Activate the new SW and reload — small reload jank is
            // preferable to silent staleness.
            swUpdate.activateUpdate().then(() => document.location.reload());
          }
        });
        // Poll every 60s while the tab is open so long-lived sessions
        // don't miss updates.
        setInterval(() => swUpdate.checkForUpdate().catch(() => undefined), 60_000);
      },
      deps: [SwUpdate],
    },
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
