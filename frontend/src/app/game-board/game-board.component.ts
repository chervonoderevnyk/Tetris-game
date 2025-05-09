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
  score: number = 0; // Змінна для підрахунку балів
  level: number = 1; // Змінна для рівня
  baseSpeed: number = 900; // Базова швидкість (мс)
  isGameRunning: boolean = false; // Стан гри


  ngOnInit(): void {
    this.resetGrid();
  }

  startGame(): void {
    if (this.isGameRunning) return; // Якщо гра вже запущена, нічого не робимо
    this.isGameRunning = true;
    this.score = 0; // Скидаємо бали
    this.level = 1; // Скидаємо рівень
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
    this.updateGameSpeed(); // Оновлюємо швидкість гри залежно від рівня
  }

  updateGameSpeed(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Зупиняємо попередній таймер
    }

    const speed = Math.max(this.baseSpeed - (this.level - 1) * 100, 100); // Зменшуємо швидкість із кожним рівнем
    this.intervalId = setInterval(() => {
      this.moveDown();
    }, speed);
  }

  updateScore(rowsCleared: number): void {
    const pointsPerRow = 10; // Кількість балів за один рядок
    this.score += rowsCleared * pointsPerRow; // Додаємо бали

    // Оновлюємо рівень кожні ? балів
    const newLevel = Math.floor(this.score / 20) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.updateGameSpeed(); // Оновлюємо швидкість гри
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent): void {
    let offsetY = 0;
    let offsetX = 0;
  
    if (event.key === 'ArrowLeft') offsetX = -1;
    else if (event.key === 'ArrowRight') offsetX = 1;
    else if (event.key === 'ArrowDown') offsetY = 1;
    else if (event.key === ' ') {
      this.rotateTetromino();
      return;
    } else return;
  
  
    this.clearTetromino();
  
    if (this.canMoveTo(offsetY, offsetX)) {
      this.position = [this.position[0] + offsetY, this.position[1] + offsetX];
    }
  
    this.drawTetromino();
  }
  
  rotateTetromino(): void {
    if (!this.currentTetromino.isRotatable) {
      return; // Якщо фігура не обертається, просто виходимо
    }
  
    this.clearTetromino(); // Очищаємо поточну фігуру з сітки
  
    // Зберігаємо стару форму для відкату, якщо обертання неможливе
    const oldShape = [...this.currentTetromino.shape];
  
    // Обчислюємо нову форму (обертання за годинниковою стрілкою)
    const newShape: [number, number][] = this.currentTetromino.shape.map(([dy, dx]) => [-dx, dy]);
  
    // Перевіряємо, чи можна виконати обертання
    const canRotate = newShape.every(([dy, dx]) => {
      const y = this.position[0] + dy;
      const x = this.position[1] + dx;
  
      return (
        y >= 0 &&
        y < this.rows &&
        x >= 0 &&
        x < this.cols &&
        this.grid[y][x] === '' // Перевіряємо, чи клітинка порожня
      );
    });
  
    if (canRotate) {
      this.currentTetromino.shape = newShape; // Застосовуємо нову форму
    } else {
      this.currentTetromino.shape = oldShape; // Відкат до старої форми
    }
  
    this.drawTetromino(); // Малюємо фігуру з новою (або старою) формою
  }
  

  fixTetromino(): void {
    this.currentTetromino.shape.forEach(([dy, dx]) => {
      const y = this.position[0] + dy;
      const x = this.position[1] + dx;
      if (y >= 0 && y < this.rows && x >= 0 && x < this.cols) {
        this.grid[y][x] = this.currentTetromino.color;
      }
    });

    const rowsCleared = this.clearFullRows(); // Перевіряємо та очищаємо заповнені рядки
    this.updateScore(rowsCleared); // Оновлюємо бали
  }

  clearFullRows(): number {
    const rowsToClear: number[] = [];

    // Знаходимо заповнені рядки
    this.grid.forEach((row, rowIndex) => {
      if (row.every(cell => cell !== '')) {
        rowsToClear.push(rowIndex);
      }
    });

    if (rowsToClear.length > 0) {
      // Видаляємо заповнені рядки
      const newGrid = this.grid.filter((_, rowIndex) => !rowsToClear.includes(rowIndex));

      // Додаємо порожні рядки зверху
      while (newGrid.length < this.rows) {
        newGrid.unshift(Array(this.cols).fill(''));
      }

      this.grid = newGrid; // Оновлюємо сітку
    }

    return rowsToClear.length; // Повертаємо кількість очищених рядків
  }
  
}



