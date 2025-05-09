import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { GameBoardComponent } from './app/game-board/game-board.component';
import { GameOverComponent } from './app/game-over/game-over.component';

const routes: Routes = [
  { path: '', component: GameBoardComponent },
  { path: 'game-over', component: GameOverComponent }
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
}).catch(err => console.error(err));