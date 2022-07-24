import { Ref } from 'vue'

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
export interface CanvasOptions {
  backgroundColor?: string
}
export interface BoardOptions {
  margin?: number
  boardColor?: string
  cellSideColor?: string
}
export interface GameOptions {
  canvasOptions?: CanvasOptions
  boardOptions?: BoardOptions
}
export interface TetrimineBody {
  coords: Coords[]
  color: string
}
export type Tetrimines = {
  [key in TetrimineName]: TetrimineBody
}
export interface IUtils {
  createCanvas(selector: string, options?: CanvasOptions): void
  getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D
  resizeCanvas(canvas: HTMLCanvasElement, width: number, height: number): void
}
export interface IGame {
  readonly canvas: HTMLCanvasElement
  readonly context: CanvasRenderingContext2D
  readonly board: IBoard
  readonly tetrimine: ITetrimine

  el: HTMLDivElement
  score: Ref<number>
  options?: GameOptions

  start(): void
  newGame(): void
  resizeCanvas(): void
}
export interface IBoard {
  readonly columns: number
  readonly rows: number
  readonly width: number
  readonly height: number
  readonly size: Size
  readonly position: Position
  readonly cellSize: number

  score: number
  memory: Memory
  options?: BoardOptions
  context: CanvasRenderingContext2D

  draw(): void
  endGame(): void
  initMemory(): void
  isGameOver(): boolean
  clearFullRows(): void
  getFullRows(): Array<number>
  drawCell(coords: Coords): void
  drawMino(coords: Coords): void
  getPosition(coords: Coords): Position
  saveTetrimine(tetrimine: ITetrimine): void
}
export interface ITetrimine {
  readonly memory: Memory
  readonly timeout: number
  readonly cellSize: number
  readonly keyPressTimeout: number
  readonly context: CanvasRenderingContext2D

  board: IBoard
  color: string
  coords: Coords[]
  intervalId: number
  name: TetrimineName
  isGameOver: boolean
  keyPressTime: number
  rotedCoords: Coords[]

  get position(): Position[]
  get translatedCoords(): Coords
  get randomTetrimine(): TetrimineName

  draw(): void
  clear(): void
  rotate(): void
  endGame(): void
  newTetrimine(): void
  saveTetrimine(): void
  canPressKey(): boolean
  alignTetrimine(): void
  listenKeyEvents(): void
  canRotateInBoard(): boolean
  canRotateInMemory(): boolean
  move(direction: Direction): void
  setDownInterval(timeout: number): void
  canMoveInBoard(direction: Direction): boolean
  canMoveInMemory(direction: Direction): boolean
  redraw(callback: (coords: Coords, index: number) => void): void
}
