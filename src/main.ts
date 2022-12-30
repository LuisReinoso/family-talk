import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { provideRouter, Routes } from '@angular/router';

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

bootstrapApplication(AppComponent, { providers: [provideRouter(routes)] });
