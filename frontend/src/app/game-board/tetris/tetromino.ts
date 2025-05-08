export type Point = [number, number]; // [рядок, стовпчик]

export interface Tetromino {
  shape: Point[]; // Координати відносно центру
  color: string;
}

export const TETROMINOES: Tetromino[] = [
  {
    // I
    shape: [
      [0, -1], [0, 0], [0, 1], [0, 2]
    ],
    color: 'cyan'
  },
  {
    // O
    shape: [
      [0, 0], [0, 1], [1, 0], [1, 1]
    ],
    color: 'yellow'
  },
  {
    // T
    shape: [
      [0, -1], [0, 0], [0, 1], [1, 0]
    ],
    color: 'purple'
  },
  {
    // S
    shape: [
      [0, 0], [0, 1], [1, -1], [1, 0]
    ],
    color: 'green'
  },
  {
    // Z
    shape: [
      [0, -1], [0, 0], [1, 0], [1, 1]
    ],
    color: 'red'
  },
  {
    // J
    shape: [
      [0, -1], [0, 0], [0, 1], [1, -1]
    ],
    color: 'blue'
  },
  {
    // L
    shape: [
      [0, -1], [0, 0], [0, 1], [1, 1]
    ],
    color: 'orange'
  }
];
