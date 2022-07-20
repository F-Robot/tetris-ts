import {
  DOWN_KEYS,
  LEFT_KEYS,
  RIGHT_KEYS,
  TETRIMINES,
  UP_KEYS,
} from './constants'
import { TetrimineName, Direction } from './types'
import type { IBoard, Memory, Coords, Position, ITetrimine } from './types'

export default class Tetrimine implements ITetrimine {
  readonly cellSize: number
  readonly memory: Memory
  readonly context: CanvasRenderingContext2D
  readonly timeout = 1500
  readonly keyPressTimeout = 100

  public intervalId = 0
  public isGameOver = false
  public coords: Coords[] = []
  public keyPressTime = Date.now()
  public rotedCoords: Coords[] = []
  public name: TetrimineName = this.randomTetrimine

  constructor(public board: IBoard) {
    this.context = this.board.context
    this.memory = this.board.memory
    this.cellSize = this.board.cellSize
    this.newTetrimine()
    this.listenKeyEvents()
  }
  get position(): Position[] {
    return this.coords.map((coords) => this.board.getPosition(coords))
  }
  get randomTetrimine(): TetrimineName {
    const tetrimineNames: TetrimineName[] = Object.values(TetrimineName)
    return tetrimineNames[Math.floor(Math.random() * tetrimineNames.length)]
  }
  get translatedCoords(): Coords {
    return {
      x: this.rotedCoords[0].x - this.coords[0].x,
      y: this.rotedCoords[0].y - this.coords[0].y,
    }
  }
  draw(): void {
    this.position.map(({ x, y }) => {
      this.context.fillStyle = '#000000'
      this.context.fillRect(x, y, this.cellSize, this.cellSize)
    })
  }
  clear(): void {
    this.position.map(({ x, y }) => {
      this.context.clearRect(x, y, this.cellSize, this.cellSize)
      this.context.strokeRect(x, y, this.cellSize, this.cellSize)
    })
  }
  redraw(callback: (coords: Coords, index: number) => void): void {
    this.clear()
    this.coords.map(callback)
    this.draw()
  }
  move(direction: Direction): void {
    if (!this.canMoveInBoard(direction) || !this.canMoveInMemory(direction)) {
      if (direction === Direction.down) return this.saveTetrimine()
      return
    }
    this.redraw((coords) => {
      if (direction === Direction.up) return coords.y--
      if (direction === Direction.left) return coords.x--
      if (direction === Direction.down) return coords.y++
      if (direction === Direction.right) return coords.x++
      throw new Error('Invalid Key')
    })
    clearInterval(this.intervalId)
    this.setDownInterval(this.timeout)
    return
  }
  rotate(): void {
    if (this.name === TetrimineName.o) return
    if (!this.canRotateInMemory() || !this.canRotateInBoard()) return
    this.redraw((coords, index) => {
      const { x, y } = this.rotedCoords[index]
      this.rotedCoords[index].x = y
      this.rotedCoords[index].y = -x
      coords.x = this.rotedCoords[index].x - this.translatedCoords.x
      coords.y = this.rotedCoords[index].y - this.translatedCoords.y
    })
  }
  canRotateInMemory(): boolean {
    const newCoords = this.coords.map((_coords, index) => {
      const { x, y } = this.rotedCoords[index]
      return {
        x: y - this.translatedCoords.x,
        y: -x - this.translatedCoords.y,
      }
    })
    return !newCoords.some(({ x, y }) => (y >= 0 ? !!this.memory[y][x] : false))
  }
  canMoveInMemory(direction: Direction): boolean {
    const newCoords = this.coords.map(({ x, y }) => {
      if (direction === Direction.up) --y
      if (direction === Direction.left) --x
      if (direction === Direction.down) ++y
      if (direction === Direction.right) ++x
      return { x: x, y: y }
    })
    return !newCoords.some(({ x, y }) => !!this.memory[y][x])
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
  canRotateInBoard(): boolean {
    return this.rotedCoords.every(({ x, y }) => {
      const rotatedX = y - this.translatedCoords.x
      const rotatedY = -x - this.translatedCoords.y
      return (
        rotatedX >= 0 &&
        rotatedY >= 0 &&
        rotatedX < this.board.columns &&
        rotatedY < this.board.rows
      )
    })
  }
  canPressKey(): boolean {
    return Date.now() - this.keyPressTime < this.keyPressTimeout
  }
  alignTetrimine(): void {
    this.coords.map((coords) => {
      coords.x += this.board.columns / 2 - 1
      if (this.name === TetrimineName.i) return
      coords.y += 1
    })
  }
  listenKeyEvents(): void {
    document.addEventListener('keydown', (event) => {
      if (this.isGameOver) return
      if (this.canPressKey()) return
      this.keyPressTime = Date.now()
      if (UP_KEYS.includes(event.key)) return this.rotate()
      if (LEFT_KEYS.includes(event.key)) return this.move(Direction.left)
      if (DOWN_KEYS.includes(event.key)) return this.move(Direction.down)
      if (RIGHT_KEYS.includes(event.key)) return this.move(Direction.right)
    })
  }
  setDownInterval(timeout: number): void {
    this.intervalId = setInterval(() => {
      this.canMoveInBoard(Direction.down)
        ? this.move(Direction.down)
        : this.saveTetrimine()
    }, timeout)
  }
  saveTetrimine(): void {
    clearInterval(this.intervalId)
    this.board.saveTetrimine(this)
    if (this.board.isGameOver()) return this.endGame()
    this.newTetrimine()
  }
  newTetrimine(): void {
    this.name = this.randomTetrimine
    this.coords = TETRIMINES[this.name].coords.map((coords) => ({ ...coords }))
    this.rotedCoords = this.coords.map((coords) => ({ ...coords }))
    this.alignTetrimine()
    this.setDownInterval(this.timeout)
    this.draw()
    this.isGameOver = false
  }
  endGame() {
    this.isGameOver = true
    this.board.endGame()
  }
}
