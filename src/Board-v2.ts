import { IBoard, BoardOptions, Coords, Position, Size } from './types'

export default class Board implements IBoard {
  readonly ROWS = 20
  readonly COLUMNS = 10
  readonly CELL_SIDE_SIZE = 25
  readonly POSITION: Position = { x: 0, y: 0 }
  readonly HEIGHT = this.ROWS * this.CELL_SIDE_SIZE
  readonly WIDTH = this.COLUMNS * this.CELL_SIDE_SIZE
  readonly SIZE: Size = { width: this.WIDTH, height: this.HEIGHT }

  constructor(
    public context: CanvasRenderingContext2D,
    public options?: BoardOptions
  ) {
    if (!options) return
    if (options.margin) this.POSITION = options.margin
  }
  getCanvasPosition(coords: Coords): Position {
    return {
      x: coords.x * this.CELL_SIDE_SIZE + this.POSITION.x,
      y: coords.y * this.CELL_SIDE_SIZE + this.POSITION.y,
    }
  }
  draw(): void {
    for (let column = 0; column < this.COLUMNS; column++) {
      for (let row = 0; row < this.ROWS; row++) {
        const { x, y } = this.getCanvasPosition({ x: column, y: row })
        this.context.strokeRect(x, y, this.CELL_SIDE_SIZE, this.CELL_SIDE_SIZE)
      }
    }
  }
}
