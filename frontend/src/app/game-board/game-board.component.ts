import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tetromino, TETROMINOES } from './tetris/tetromino';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  rows = 20;
  cols = 10;
  grid: string[][] = [];
  currentTetromino!: Tetromino;
  position: [number, number] = [0, 4];
  intervalId: any;

  ngOnInit(): void {
    this.resetGrid();
    this.spawnTetromino();
    this.startGameLoop();
  }

  resetGrid(): void {
    this.grid = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill('')
    );
  }

  spawnTetromino(): void {
    const index = Math.floor(Math.random() * TETROMINOES.length);
    const newTetromino = TETROMINOES[index];
    const newPosition: [number, number] = [0, 4];
  
    const canPlace = newTetromino.shape.every(([dy, dx]) => {
      const y = newPosition[0] + dy;
      const x = newPosition[1] + dx;
  
      if (y < 0) return true; // дозволяємо частини над сіткою
      return (
        y >= 0 &&
        y < this.rows &&
        x >= 0 &&
        x < this.cols &&
        this.grid[y][x] === ''
      );
    });
  
    if (!canPlace) {
      clearInterval(this.intervalId); // 🛑 Зупиняємо гру
      alert('💀 Game Over!');         // 🔔 Повідомлення
      return;
    }
  
    this.currentTetromino = newTetromino;
    this.position = newPosition;
    this.drawTetromino();
  }
  
  

  drawTetromino(): void {
    this.currentTetromino.shape.forEach(([dy, dx]) => {
      const y = this.position[0] + dy;
      const x = this.position[1] + dx;
      if (y >= 0 && y < this.rows && x >= 0 && x < this.cols) {
        this.grid[y][x] = this.currentTetromino.color;
      }
    });
  }

  clearTetromino(): void {
    this.currentTetromino.shape.forEach(([dy, dx]) => {
      const y = this.position[0] + dy;
      const x = this.position[1] + dx;
      if (y >= 0 && y < this.rows && x >= 0 && x < this.cols) {
        this.grid[y][x] = '';
      }
    });
  }

  canMoveTo(offsetY: number, offsetX: number): boolean {
    return this.currentTetromino.shape.every(([dy, dx]) => {
      const y = this.position[0] + dy + offsetY;
      const x = this.position[1] + dx + offsetX;
  
      // дозволяємо, якщо частина фігури вилазить над верхню межу
      if (y < 0) return true;
  
      return (
        y >= 0 &&
        y < this.rows &&
        x >= 0 &&
        x < this.cols &&
        this.grid[y][x] === '' // важливо! перевірка, що клітинка порожня
      );
    });
  }
  

  moveDown(): void {
    this.clearTetromino(); // важливо!
  
    if (this.canMoveTo(1, 0)) {
      this.position[0]++;
      this.drawTetromino();
    } else {
      this.drawTetromino(); // вертаємо на місце
      this.fixTetromino();
      this.spawnTetromino();
    }
  }
  
  

  startGameLoop(): void {
    this.intervalId = setInterval(() => {
      this.moveDown();
    }, 300);
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent): void {
    let offsetY = 0;
    let offsetX = 0;
  
    if (event.key === 'ArrowLeft') offsetX = -1;
    else if (event.key === 'ArrowRight') offsetX = 1;
    else if (event.key === 'ArrowDown') offsetY = 1;
    else return;
  
    this.clearTetromino(); // важливо!
  
    if (this.canMoveTo(offsetY, offsetX)) {
      this.position = [this.position[0] + offsetY, this.position[1] + offsetX];
    }
  
    this.drawTetromino(); // завжди малюємо після перевірки
  }
  

  fixTetromino(): void {
    this.currentTetromino.shape.forEach(([dy, dx]) => {
      const y = this.position[0] + dy;
      const x = this.position[1] + dx;
      if (y >= 0 && y < this.rows && x >= 0 && x < this.cols) {
        this.grid[y][x] = this.currentTetromino.color;
      }
    });
  }
  
}



