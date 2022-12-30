import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

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
    path: 'edit-player',
    loadComponent: () =>
      import('./app/edit-player/edit-player.component').then(
        (m) => m.EditPlayerComponent
      ),
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
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000',
      })
    ),
  ],
});
