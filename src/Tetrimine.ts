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
  IGame,
} from './types'
export default class Tetrimine implements ITetrimine {
  public GAME_END: boolean
  public COORDS: Coords[]
  public NAME: TetrimineName
  public INTERVAL_ID: number
  public INTERVAL = 1000
  public CELL_SIDE_SIZE: number
  public ROTATED_COORDS: Coords[]
  public CONTEXT: CanvasRenderingContext2D

  constructor(public board: IBoard, public game: IGame) {
    this.NAME = this.randomTetrimine
    this.CONTEXT = board.context
    this.CELL_SIDE_SIZE = this.board.CELL_SIDE_SIZE
    this.COORDS = TETRIMINES[this.NAME].coords.map((coords) => ({ ...coords }))
    this.ROTATED_COORDS = this.COORDS.map((coords) => ({ ...coords }))
    this.alignTetrimine()
    this.INTERVAL_ID = this.setDownInterval(this.INTERVAL)
    this.GAME_END = false
  }
  get canvasPosition(): Position[] {
    return this.COORDS.map((coords) => this.board.getCanvasPosition(coords))
  }
  get randomTetrimine(): TetrimineName {
    const tetrimineNames: TetrimineName[] = Object.values(TetrimineName)
    return tetrimineNames[Math.floor(Math.random() * tetrimineNames.length)]
  }
  get traslatedCoords(): Coords {
    return {
      x: this.ROTATED_COORDS[0].x - this.COORDS[0].x,
      y: this.ROTATED_COORDS[0].y - this.COORDS[0].y,
    }
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
  redraw(callback: (coords: Coords, index: number) => void): void {
    this.clear()
    this.COORDS.map(callback)
    this.draw()
  }
  move(direction: Direction) {
    if (this.isGameOver()) {
      this.GAME_END = true
      this.clearInterval()
      this.board.clearBoard()
      return
    }
    if (!this.canDown()) {
      return this.saveAndCreateNewTetrimine()
    }
    if (!this.canMove(direction)) {
      if (direction === Direction.down) {
        this.saveAndCreateNewTetrimine()
      }
      return
    }
    this.redraw((coords) => {
      if (direction === Direction.up) return coords.y--
      if (direction === Direction.left) return coords.x--
      if (direction === Direction.down) return coords.y++
      if (direction === Direction.right) return coords.x++
      throw new Error('Invalid Key')
    })
    clearInterval(this.INTERVAL_ID)
    this.INTERVAL_ID = this.setDownInterval(this.INTERVAL)
  }
  rotate() {
    if (!this.canRotate()) return
    this.redraw((coords, index) => {
      const { x, y } = this.ROTATED_COORDS[index]
      this.ROTATED_COORDS[index].x = y
      this.ROTATED_COORDS[index].y = -x
      coords.x = this.ROTATED_COORDS[index].x - this.traslatedCoords.x
      coords.y = this.ROTATED_COORDS[index].y - this.traslatedCoords.y
    })
  }
  canMove(direction: Direction): boolean {
    return this.COORDS.every(({ x, y }) => {
      if (direction === Direction.up) return --y >= 0
      if (direction === Direction.left) return --x >= 0
      if (direction === Direction.down) return ++y < this.board.ROWS
      if (direction === Direction.right) return ++x < this.board.COLUMNS
      throw new Error('Invalid Key')
    })
  }
  canRotate(): boolean {
    if (this.NAME === TetrimineName.o) return false
    return this.ROTATED_COORDS.every(({ x, y }) => {
      const rotatedX = y - this.traslatedCoords.x
      const rotatedY = -x - this.traslatedCoords.y
      return (
        rotatedX >= 0 &&
        rotatedY >= 0 &&
        rotatedX < this.board.COLUMNS &&
        rotatedY < this.board.ROWS
      )
    })
  }
  isGameOver() {
    return this.board.isGameEnd()
  }
  canDown() {
    const newCoords = this.COORDS.map(({ x, y }) =>
      y < 19 ? { x: x, y: ++y } : { x: x, y: y }
    )
    return !this.board.isInMemory(newCoords)
  }
  alignTetrimine() {
    this.COORDS.map((coords) => {
      coords.x += this.board.COLUMNS / 2 - 1
      if (this.NAME === TetrimineName.i) return
      coords.y += 1
    })
  }
  setDownInterval(timeout: number) {
    return setInterval(() => {
      this.canMove(Direction.down)
        ? this.move(Direction.down)
        : this.saveAndCreateNewTetrimine()
    }, timeout)
  }
  saveAndCreateNewTetrimine() {
    clearInterval(this.INTERVAL_ID)
    this.board.saveTetrimine(this)
    this.game.createNewTetrimine()
  }
  clearInterval() {
    clearInterval(this.INTERVAL_ID)
  }
  listenKeyEvents(): void {
    document.addEventListener('keydown', (event) => {
      if (this.GAME_END) return
      if (UP_KEYS.includes(event.key)) this.rotate()
      if (LEFT_KEYS.includes(event.key)) this.move(Direction.left)
      if (DOWN_KEYS.includes(event.key)) this.move(Direction.down)
      if (RIGHT_KEYS.includes(event.key)) this.move(Direction.right)
    })
  }
}
