import { Component } from '@angular/core';
import { GameBoardComponent } from './game-board/game-board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GameBoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
