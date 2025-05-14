import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { GameOverComponent } from './app/game-over/game-over.component';
import { BaseComponent } from './app/base/base.component';
import { AuthPageComponent } from './app/auth-page/auth-page.component';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';

const routes: Routes = [
  { path: '', component: AuthPageComponent }, // Початкова сторінка
  { path: 'base', component: BaseComponent },  // Сторінка після входу
  { path: 'game-over', component: GameOverComponent } // Маршрут для GameOverComponent
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule) 
  ]
}).catch(err => console.error(err));