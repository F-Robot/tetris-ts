import {
  DOWN_KEYS,
  LEFT_KEYS,
  RIGHT_KEYS,
  TETRIMINES,
  UP_KEYS,
} from './constants'
import {
  IBoard,
  Coords,
  Position,
  Direction,
  ITetrimine,
  TetrimineName,
} from './types'

export default class Tetrimine implements ITetrimine {
  public NAME: TetrimineName
  public COORDS: Coords[]
  public CELL_SIDE_SIZE: number
  public CONTEXT: CanvasRenderingContext2D

  constructor(public board: IBoard) {
    this.NAME = TetrimineName.z
    this.CONTEXT = board.context
    this.COORDS = TETRIMINES[this.NAME].coords
    this.CELL_SIDE_SIZE = this.board.CELL_SIDE_SIZE
    // this.COORDS.map((coords) => (coords.x += this.board.COLUMNS / 2 - 1))
    this.listenKeyEvents()
  }
  get canvasPosition(): Position[] {
    return this.COORDS.map((coords) => this.board.getCanvasPosition(coords))
  }
  get randomTetrimine(): TetrimineName {
    const tetrimineNames: TetrimineName[] = Object.values(TetrimineName)
    return tetrimineNames[Math.floor(Math.random() * tetrimineNames.length)]
  }
  draw(): void {
    this.canvasPosition.map(({ x, y }) => {
      this.CONTEXT.fillRect(x, y, this.CELL_SIDE_SIZE, this.CELL_SIDE_SIZE)
    })
  }
  clear(): void {
    this.canvasPosition.map(({ x, y }) => {
      this.CONTEXT.clearRect(x, y, this.CELL_SIDE_SIZE, this.CELL_SIDE_SIZE)
      this.CONTEXT.strokeRect(x, y, this.CELL_SIDE_SIZE, this.CELL_SIDE_SIZE)
    })
  }
  redraw(callback: () => void): void {
    this.clear()
    callback()
    this.draw()
  }
  move(direction: Direction): void {
    if (!this.canMove(direction)) return
    this.COORDS.map((coords) => {
      this.redraw(() => {
        if (direction === Direction.up) coords.y--
        if (direction === Direction.left) coords.x--
        if (direction === Direction.down) coords.y++
        if (direction === Direction.right) coords.x++
      })
    })
  }
  rotate() {
    // this.COORDS.map((coords) => {
    //   this.redraw(() => {})
    // })
  }
  canMove(direction: Direction): boolean {
    return this.COORDS.every(({ x, y }) => {
      if (direction === Direction.up) return --y >= 0
      if (direction === Direction.left) return --x >= 0
      if (direction === Direction.down) return ++y < this.board.ROWS
      if (direction === Direction.right) return ++x < this.board.COLUMNS
      throw 'Invalid Key'
    })
  }
  listenKeyEvents(): void {
    document.addEventListener('keydown', (event) => {
      if (UP_KEYS.includes(event.key)) this.rotate()
      if (LEFT_KEYS.includes(event.key)) this.move(Direction.left)
      if (DOWN_KEYS.includes(event.key)) this.move(Direction.down)
      if (RIGHT_KEYS.includes(event.key)) this.move(Direction.right)
    })
  }
}
