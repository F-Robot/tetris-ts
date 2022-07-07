import { Coords, Position, Size } from './interfaces'

export interface BoardOptions {
  margin: number
}
interface IBoard {
  getSize(): Size
  getPosition(): Position
  getCoords(position: Position): Coords
  draw(): void
  drawCell(column: number, row: number): void
}
export default class Board implements IBoard {
  public ROWS = 20
  public COLUMNS = 10
  public CELL_SIDE = 25
  public POSITION = { x: 0, y: 0 }
  public HEIGHT = this.ROWS * this.CELL_SIDE
  public WIDTH = this.COLUMNS * this.CELL_SIDE
  public SIZE = { width: this.WIDTH, height: this.HEIGHT }

  constructor(
    public ctx: CanvasRenderingContext2D,
    public options?: BoardOptions
  ) {
    if (options && options.margin) {
      this.POSITION = { x: options.margin, y: options.margin }
    }
  }
  getPosition() {
    return { ...this.POSITION }
  }
  getSize() {
    return { ...this.SIZE }
  }
  getCoords(position: Position) {
    return {
      x: position.x * this.CELL_SIDE + this.POSITION.x,
      y: position.y * this.CELL_SIDE + this.POSITION.y,
    }
  }
  drawCell(column: number, row: number) {
    this.ctx.strokeRect(
      column * this.CELL_SIDE + this.POSITION.x,
      row * this.CELL_SIDE + this.POSITION.y,
      this.CELL_SIDE,
      this.CELL_SIDE
    )
  }
  draw() {
    for (let column = 0; column < this.COLUMNS; column++) {
      for (let row = 0; row < this.ROWS; row++) {
        this.drawCell(column, row)
      }
    }
  }
}
