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
  nextTetromino!: Tetromino; // Змінна для наступної фігури
  position: [number, number] = [0, 4];
  intervalId: any;
  score: number = 0; // Змінна для підрахунку балів
  level: number = 1; // Змінна для рівня
  baseSpeed: number = 900; // Базова швидкість (мс)
  isGameRunning: boolean = false; // Стан гри
  isPaused: boolean = false; // Стан паузи

  ngOnInit(): void {
    this.resetGrid();
    this.nextTetromino = this.getRandomTetromino(); // Ініціалізуємо наступну фігуру
  }


  startGame(): void {
    if (this.isGameRunning) return; // Якщо гра вже запущена, нічого не робимо
  
    this.isGameRunning = true;
    this.isPaused = false; // Знімаємо паузу
    this.score = 0; // Скидаємо бали
    this.level = 1; // Скидаємо рівень
    this.resetGrid(); // Скидаємо сітку
    this.spawnTetromino(); // Спавнимо нову фігуру
    this.startGameLoop(); // Запускаємо ігровий цикл
  }

  togglePause(): void {
    if (!this.isGameRunning) return; // Якщо гра не запущена, нічого не робимо

    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      clearInterval(this.intervalId); // Зупиняємо таймер
    } else {
      this.updateGameSpeed(); // Відновлюємо таймер
    }
  }

  resetGrid(): void {
    this.grid = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill('')
    );
  }

 getRandomTetromino(): Tetromino {
    const index = Math.floor(Math.random() * TETROMINOES.length);
    return TETROMINOES[index];
  }

  spawnTetromino(): void {
    this.currentTetromino = this.nextTetromino; // Поточна фігура стає наступною
    this.position = [0, 4]; // Початкова позиція фігури
    this.nextTetromino = this.getRandomTetromino(); // Генеруємо нову наступну фігуру

    const canPlace = this.currentTetromino.shape.every(([dy, dx]) => {
      const y = this.position[0] + dy;
      const x = this.position[1] + dx;

      if (y < 0) return true;
      return (
        y >= 0 &&
        y < this.rows &&
        x >= 0 &&
        x < this.cols &&
        this.grid[y][x] === ''
      );
    });

    if (!canPlace) {
      clearInterval(this.intervalId);
      this.isGameRunning = false;
      alert('💀 Game Over!');
      return;
    }

    this.drawTetromino();
  }

  getNextTetrominoCell(row: number, col: number): string {
    if (!this.nextTetromino) return '';
    return this.nextTetromino.shape.some(([dy, dx]) => dy + 1 === row && dx + 1 === col)
      ? this.nextTetromino.color // Використовуємо колір фігури
      : '';
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

    if (!this.isPaused) {
      const speed = Math.max(this.baseSpeed - (this.level - 1) * 100, 100); // Зменшуємо швидкість із кожним рівнем
      this.intervalId = setInterval(() => {
        this.moveDown();
      }, speed);
    }
  }

  updateScore(rowsCleared: number): void {
    let points = 0;
  
    // Визначаємо кількість балів залежно від кількості очищених рядків
    switch (rowsCleared) {
      case 1:
        points = 10; // 1 рядок = 10 балів
        break;
      case 2:
        points = 30; // 2 рядки = 30 балів
        break;
      case 3:
        points = 40; // 3 рядки = 40 балів
        break;
      case 4:
        points = 60; // 4 рядки = 60 балів
        break;
      default:
        points = 0; // Якщо рядків не очищено, балів немає
    }
  
    this.score += points; // Додаємо бали до загального рахунку
  
    // Оновлюємо рівень кожні 20 балів
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

  if (event.key === 'ArrowLeft') {
    offsetX = -1;
  } else if (event.key === 'ArrowRight') {
    offsetX = 1;
  } else if (event.key === 'ArrowDown') {
    offsetY = 1;
  } else if (event.key === ' ') {
    // Перевіряємо, чи гра запущена і не на паузі, перед перевертанням фігури
    if (this.isGameRunning && !this.isPaused) {
      this.rotateTetromino();
    }
    event.preventDefault(); // Запобігаємо будь-яким іншим діям для клавіші space
    return;
  } else {
    return; // Ігноруємо інші клавіші
  }

  // Якщо гра на паузі, ігноруємо інші дії
  if (this.isPaused) {
    return;
  }

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



