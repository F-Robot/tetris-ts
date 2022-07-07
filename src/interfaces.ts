export interface Point {
  x: number
  y: number
}
export interface Board {
  readonly ROWS: number
  readonly COLUMNS: number
  readonly WIDTH: number
  readonly HEIGHT: number
  readonly POSITION: Point
  readonly CELL_SIDE_SIZE: number

  draw(): void
}

export interface Coords {
  x: number
  y: number
}
export interface Position {
  x: number
  y: number
}
export interface Size {
  width: number
  height: number
}
export interface TetrimineBody {
  color: string
  map: Coords[]
}

export type TetrimineName = 'Z' | 'S' | 'J' | 'L' | 'O' | 'I' | 'T'

export type Tetrimines = {
  [key in TetrimineName]: TetrimineBody
}
