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
  Memory,
} from './types'
export default class Tetrimine implements ITetrimine {
  readonly cellSize: number
  readonly memory: Memory
  readonly context: CanvasRenderingContext2D

  public name: TetrimineName
  public intervalId: number
  public coords: Coords[]
  public rotedCoords: Coords[]

  constructor(public board: IBoard) {
    this.context = this.board.context
    this.memory = this.board.memory
    this.cellSize = this.board.cellSize

    this.name = this.getRandomTetrimine()
    this.coords = TETRIMINES[this.name].coords.map((coords) => ({ ...coords }))
    this.rotedCoords = this.coords.map((coords) => ({ ...coords }))
    this.alignTetrimine()
    this.intervalId = this.setDownInterval(1000)

    this.listenKeyEvents()
  }
  newTetrmine() {
    clearInterval(this.intervalId)
    this.board.saveTetrimine(this)
    this.name = this.getRandomTetrimine()
    this.coords = TETRIMINES[this.name].coords.map((coords) => ({ ...coords }))
    this.rotedCoords = this.coords.map((coords) => ({ ...coords }))
    this.alignTetrimine()
    this.intervalId = this.setDownInterval(1000)
    this.draw()
  }
  getPosition(): Position[] {
    return this.coords.map((coords) => this.board.getPosition(coords))
  }
  getRandomTetrimine(): TetrimineName {
    const tetrimineNames: TetrimineName[] = Object.values(TetrimineName)
    return tetrimineNames[Math.floor(Math.random() * tetrimineNames.length)]
  }
  getTranslatedCoords(): Coords {
    return {
      x: this.rotedCoords[0].x - this.coords[0].x,
      y: this.rotedCoords[0].y - this.coords[0].y,
    }
  }
  draw(): void {
    this.getPosition().map(({ x, y }) => {
      this.context.fillStyle = '#000000'
      this.context.fillRect(x, y, this.cellSize, this.cellSize)
    })
  }
  clear(): void {
    this.getPosition().map(({ x, y }) => {
      this.context.clearRect(x, y, this.cellSize, this.cellSize)
      this.context.strokeRect(x, y, this.cellSize, this.cellSize)
    })
  }
  redraw(callback: (coords: Coords, index: number) => void): void {
    this.clear()
    this.coords.map(callback)
    this.draw()
  }
  move(direction: Direction) {
    if (!this.canMoveInBoard(direction) || !this.canMoveInMemory(direction)) {
      if (direction === Direction.down) return this.newTetrmine()
      return
    }
    this.redraw((coords) => {
      if (direction === Direction.up) return coords.y--
      if (direction === Direction.left) return coords.x--
      if (direction === Direction.down) return coords.y++
      if (direction === Direction.right) return coords.x++
      throw new Error('Invalid Key')
    })
  }
  rotate() {
    if (this.name === TetrimineName.o) return
    if (!this.canRotateInMemory() || !this.canRotateInsideBoard()) return
    this.redraw((coords, index) => {
      const { x, y } = this.rotedCoords[index]
      this.rotedCoords[index].x = y
      this.rotedCoords[index].y = -x
      coords.x = this.rotedCoords[index].x - this.getTranslatedCoords().x
      coords.y = this.rotedCoords[index].y - this.getTranslatedCoords().y
    })
  }
  canRotateInMemory() {
    const newCoords = this.coords.map((_coords, index) => {
      const { x, y } = this.rotedCoords[index]
      return {
        x: y - this.getTranslatedCoords().x,
        y: -x - this.getTranslatedCoords().y,
      }
    })
    return !newCoords.some((coords) => !!this.memory[coords.y][coords.x])
  }
  canMoveInMemory(direction: Direction) {
    const newCoords = this.coords.map(({ x, y }) => {
      if (direction === Direction.up) --y
      if (direction === Direction.left) --x
      if (direction === Direction.down) ++y
      if (direction === Direction.right) ++x
      return { x: x, y: y }
    })
    return !newCoords.some((coords) => !!this.memory[coords.y][coords.x])
  }
  canMoveInBoard(direction: Direction): boolean {
    return this.coords.every(({ x, y }) => {
      if (direction === Direction.up) return --y >= 0
      if (direction === Direction.left) return --x >= 0
      if (direction === Direction.down) return ++y < this.board.rows
      if (direction === Direction.right) return ++x < this.board.columns
      throw new Error('Invalid Key')
    })
  }
  canRotateInsideBoard(): boolean {
    return this.rotedCoords.every(({ x, y }) => {
      const rotatedX = y - this.getTranslatedCoords().x
      const rotatedY = -x - this.getTranslatedCoords().y
      return (
        rotatedX >= 0 &&
        rotatedY >= 0 &&
        rotatedX < this.board.columns &&
        rotatedY < this.board.rows
      )
    })
  }
  alignTetrimine() {
    this.coords.map((coords) => {
      coords.x += this.board.columns / 2 - 1
      if (this.name === TetrimineName.i) return
      coords.y += 1
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
  setDownInterval(timeout: number) {
    return setInterval(() => {
      this.canMoveInBoard(Direction.down)
        ? this.move(Direction.down)
        : this.newTetrmine()
    }, timeout)
  }
}
