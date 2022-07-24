import { TETRIMINES } from './constants'
import type {
  Size,
  Memory,
  Coords,
  IBoard,
  Position,
  ITetrimine,
  BoardOptions,
  TetrimineName,
  IGame,
} from './types'

export class Board implements IBoard {
  readonly rows = 20
  readonly columns = 10
  readonly cellSize = 25
  readonly position: Position = { x: 0, y: 0 }
  readonly height = this.rows * this.cellSize
  readonly width = this.columns * this.cellSize
  readonly size: Size = { width: this.width, height: this.height }

  public score = 0
  public memory: Memory = [['']]

  constructor(
    public context: CanvasRenderingContext2D,
    public game: IGame,
    public options?: BoardOptions
  ) {
    if (options && options.margin) {
      this.position = { x: options.margin, y: options.margin }
    }
    this.initMemory()
  }
  getMinoColor(coords: Coords) {
    const minoName: TetrimineName | '' = this.memory[coords.y][coords.x]
    return minoName
      ? TETRIMINES[minoName].color
      : this.options?.boardColor ?? '#011627'
  }
  initMemory(): void {
    this.memory = [...Array(20).keys()].map(() => [...Array(10).fill('')])
  }
  draw(): void {
    this.memory.map((row, y) => {
      row.map((_column, x) =>
        this.memory[y][x]
          ? this.drawMino({ x: x, y: y })
          : this.drawCell({ x: x, y: y })
      )
    })
  }
  drawCell(coords: Coords): void {
    const { x, y } = this.getPosition(coords)
    this.context.fillStyle = this.options?.boardColor ?? '#011627'
    this.context.strokeStyle = this.options?.cellSideColor ?? '#1e2d3d'
    this.context.fillRect(x, y, this.cellSize, this.cellSize)
    this.context.strokeRect(x, y, this.cellSize, this.cellSize)
  }
  drawMino(coords: Coords): void {
    const { x, y } = this.getPosition(coords)
    this.context.fillStyle = this.getMinoColor(coords)
    this.context.fillRect(x, y, this.cellSize, this.cellSize)
  }
  saveTetrimine(tetrimine: ITetrimine): void {
    tetrimine.coords.map((coords) => {
      this.memory[coords.y][coords.x] = tetrimine.name
    })
    this.getFullRows().length !== 0 ? this.clearFullRows() : this.draw()
  }
  getPosition(coords: Coords): Position {
    return {
      x: coords.x * this.cellSize + this.position.x,
      y: coords.y * this.cellSize + this.position.y,
    }
  }
  getFullRows(): Array<number> {
    return this.memory
      .map((row, y) => (row.every((cell) => cell !== '') ? y : undefined))
      .filter((row): row is number => row !== undefined)
  }
  isGameOver(): boolean {
    return this.memory[0].some((cell) => cell !== '')
  }
  endGame(): void {
    this.score = 0
    this.initMemory()
    this.draw()
  }
  updateMinos(rows: number[]) {
    // r = Reverse index
    this.memory.map((_row, y, memory, r = memory.length - 1 - y) => {
      if (r < Math.min(...rows)) {
        this.memory[r + rows.length] = [...this.memory[r]]
      }
    })
  }
  clearFullRows(): void {
    const rows = this.getFullRows()
    rows.map((row) => this.memory[row].fill(''))
    this.updateMinos(rows)
    this.score += rows.length * 100
    this.game.score.value = this.score
    this.draw()
  }
}
