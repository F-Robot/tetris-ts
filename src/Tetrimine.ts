import Board from './Board'
import {
  UP_KEY,
  DOWN_KEY,
  LEFT_KEY,
  RIGHT_KEY,
  A_KEY,
  D_KEY,
  S_KEY,
  W_KEY,
  TETRIMINES,
} from './constants'
import type {
  Coords,
  Position,
  TetrimineBody,
  TetrimineName,
} from './interfaces'

type Direction = 'Down' | 'Up' | 'Right' | 'Left'

interface ITetrimine {
  listenKeyEvents(): void
  getPosition(): Position
  getCoords(position: Position): Coords

  draw(): void
  clear(): void
  moveUp(): void
  moveDown(): void
  moveLeft(): void
  moveRight(): void
  move(direction: Direction): void

  isValidMove(direction: Direction): boolean
}

export default class Tetrimine implements ITetrimine {
  public position = { x: 0, y: 0 }
  public currentTime = 0
  public checkTime = 0
  public KEY_PRESS_TIMEOUT = 100
  public baseTetrimine?: TetrimineBody = undefined
  public minosArray: Coords[] = []

  constructor(
    public board: Board,
    public context: CanvasRenderingContext2D,
    public name: TetrimineName = 'Z'
  ) {
    this.listenKeyEvents()
    this.baseTetrimine = TETRIMINES[this.name]
    for (const mino of this.baseTetrimine.map) {
      this.minosArray.push(mino)
    }
  }
  getPosition() {
    return { ...this.position }
  }
  get getBoardPosition() {
    const position: Coords[] = []
    for (const mino of this.minosArray) {
      const newPosition = {
        x: mino.x + this.position.x,
        y: mino.y + this.position.y,
      }
      position.push(this.getCoords(newPosition))
    }
    return position
  }
  getCoords(coords: Coords) {
    return this.board.getCoords(coords)
  }
  draw() {
    for (const mino of this.getBoardPosition) {
      this.context.fillRect(
        mino.x,
        mino.y,
        this.board.CELL_SIDE,
        this.board.CELL_SIDE
      )
    }
  }
  clear() {
    for (const mino of this.getBoardPosition) {
      this.context.clearRect(
        mino.x,
        mino.y,
        this.board.CELL_SIDE,
        this.board.CELL_SIDE
      )
      this.context.strokeRect(
        mino.x,
        mino.y,
        this.board.CELL_SIDE,
        this.board.CELL_SIDE
      )
    }
  }
  moveUp() {
    return this.position.y--
  }
  moveDown() {
    return this.position.y++
  }
  moveLeft() {
    return this.position.x--
  }
  moveRight() {
    return this.position.x++
  }
  // An invalid move is an off-board position
  isValidMove(direction: Direction) {
    let { x, y } = this.getPosition()
    if (direction === 'Up') return --y >= 0
    if (direction === 'Down') return ++y < this.board.ROWS
    if (direction === 'Left') return --x >= 0
    if (direction === 'Right') return ++x < this.board.COLUMNS
    throw 'Invalid Key'
  }
  move(direction: Direction) {
    if (this.isValidMove(direction)) {
      this.clear()
      if (direction === 'Up') this.moveUp()
      if (direction === 'Left') this.moveLeft()
      if (direction === 'Down') this.moveDown()
      if (direction === 'Right') this.moveRight()
      this.draw()
    }
  }
  listenKeyEvents() {
    document.addEventListener('keydown', (event) => {
      if (event.key === DOWN_KEY || event.key === S_KEY) this.move('Down')
      if (event.key === UP_KEY || event.key === W_KEY) this.move('Up')
      if (event.key === LEFT_KEY || event.key === A_KEY) this.move('Left')
      if (event.key === RIGHT_KEY || event.key === D_KEY) this.move('Right')
    })
  }
}
