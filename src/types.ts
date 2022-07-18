export type Memory = Array<Array<TetrimineName | ''>>

export enum Direction {
  up = 'UP',
  down = 'DOWN',
  left = 'LEFT',
  right = 'RIGHT',
}
export enum TetrimineName {
  z = 'Z',
  s = 'S',
  j = 'J',
  l = 'L',
  o = 'O',
  i = 'I',
  t = 'T',
}

export interface Position {
  x: number
  y: number
}
export interface Coords {
  x: number
  y: number
}
export interface Size {
  width: number
  height: number
}
export interface BoardOptions {
  margin?: Position
}
export interface TetrimineCoords {
  coords: Coords[]
}
export type Tetrimines = {
  [key in TetrimineName]: TetrimineCoords
}
export interface IGame {
  BOARD: IBoard
  TETRIMINE: ITetrimine
  context: CanvasRenderingContext2D
  createNewTetrimine(): void
  endGame(): void
}
export interface IBoard {
  readonly columns: number
  readonly rows: number
  readonly width: number
  readonly height: number
  readonly size: Size
  readonly position: Position
  readonly cellSize: number
  context: CanvasRenderingContext2D
  options?: BoardOptions
  memory: Memory
  draw(): void
  initMemory(): void
  drawCell(coords: Coords): void
  drawMino(coords: Coords): void
  getPosition(coords: Coords): Position
  getFullRows(): Array<number>
  clearFullRows(): void
  saveTetrimine(tetrimine: ITetrimine): void
}
export interface ITetrimine {
  readonly name: TetrimineName
  readonly cellSize: number
  readonly coords: Coords[]
  readonly rotedCoords: Coords[]
  readonly board: IBoard
  readonly context: CanvasRenderingContext2D
  readonly memory: Memory

  getPosition(): Position[]
  getRandomTetrimine(): TetrimineName
  getTranslatedCoords(): Coords

  // draw(): void
  // clear(): void
  // listenKeyEvents(): void
  // move(direction: Direction): void
  // redraw(callback: () => void): void
  // canMove(direction: Direction, coords: Coords): void
}
