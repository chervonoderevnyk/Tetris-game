import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { GameOverComponent } from './app/game-over/game-over.component';
import { BaseComponent } from './app/base/base.component';

const routes: Routes = [
  { path: '', component: BaseComponent }, // Головний маршрут
  { path: 'game-over', component: GameOverComponent } // Маршрут для GameOverComponent
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
}).catch(err => console.error(err));