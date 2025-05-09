export type Point = [number, number]; // [рядок, стовпчик]

export interface Tetromino {
  shape: Point[]; // Координати відносно центру
  color: string;
  isRotatable?: boolean; // Додаємо прапорець для обертання
}

export const TETROMINOES: Tetromino[] = [
  {
    // I
    shape: [
      [0, -1], [0, 0], [0, 1], [0, 2]
    ],
    color: 'cyan',
    isRotatable: true
  },
  {
    // O
    shape: [
      [0, 0], [0, 1], [1, 0], [1, 1]
    ],
    color: 'yellow',
    isRotatable: false // Фігура "O" не обертається
  },
  {
    // T
    shape: [
      [0, -1], [0, 0], [0, 1], [1, 0]
    ],
    color: 'purple',
    isRotatable: true
  },
  {
    // S
    shape: [
      [0, 0], [0, 1], [1, -1], [1, 0]
    ],
    color: 'green',
    isRotatable: true
  },
  {
    // Z
    shape: [
      [0, -1], [0, 0], [1, 0], [1, 1]
    ],
    color: 'red',
    isRotatable: true
  },
  {
    // J
    shape: [
      [0, -1], [0, 0], [0, 1], [1, -1]
    ],
    color: 'blue',
    isRotatable: true
  },
  {
    // L
    shape: [
      [0, -1], [0, 0], [0, 1], [1, 1]
    ],
    color: 'orange',
    isRotatable: true
  }
];
