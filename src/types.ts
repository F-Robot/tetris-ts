export type Memorie = Array<Array<TetrimineName | ''>>

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
export interface IBoard {
  readonly COLUMNS: number
  readonly ROWS: number
  readonly WIDTH: number
  readonly HEIGHT: number
  readonly SIZE: Size
  readonly POSITION: Position
  readonly CELL_SIDE_SIZE: number
  MEMORIE: Memorie

  context: CanvasRenderingContext2D
  options?: BoardOptions

  draw(): void
  isGameEnd(): boolean
  clearBoard(): void
  clear(): void
  isInMemory(coords: Coords[]): boolean
  saveTetrimine(tetrimine: ITetrimine): void
  getCanvasPosition(coords: Coords): Position
}
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
export interface TetrimineCoords {
  coords: Coords[]
}
export type Tetrimines = {
  [key in TetrimineName]: TetrimineCoords
}
export interface ITetrimine {
  NAME: TetrimineName
  COORDS: Coords[]
  CELL_SIDE_SIZE: number
  CONTEXT: CanvasRenderingContext2D

  board: IBoard
  canvasPosition: Position[]

  draw(): void
  clear(): void
  listenKeyEvents(): void
  move(direction: Direction): void
  redraw(callback: () => void): void
  canMove(direction: Direction, coords: Coords): void
}
export interface IGame {
  BOARD: IBoard
  TETRIMINE: ITetrimine
  context: CanvasRenderingContext2D
  createNewTetrimine(): void
  endGame(): void
}
