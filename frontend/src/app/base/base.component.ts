import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { GameBoardComponent } from "../game-board/game-board.component";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [CommonModule, GameBoardComponent, HeaderComponent, FooterComponent],
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})


export class BaseComponent {
  score: number = 0;
  level: number = 1;


  constructor(private cdr: ChangeDetectorRef) {}
  
  onScoreChange(score: number): void {
    this.score = score;
    this.cdr.detectChanges();
  }
  
  onLevelChange(level: number): void {
    this.level = level;
    this.cdr.detectChanges();
  }
  
}


