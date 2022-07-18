import {
  IBoard,
  BoardOptions,
  Position,
  Size,
  Memory,
  Coords,
  ITetrimine,
} from './types'

export default class Board implements IBoard {
  readonly rows = 20
  readonly columns = 10
  readonly cellSize = 25
  readonly position: Position = { x: 0, y: 0 }
  readonly height = this.rows * this.cellSize
  readonly width = this.columns * this.cellSize
  readonly size: Size = { width: this.width, height: this.height }
  public memory: Memory = [['']]

  constructor(
    public context: CanvasRenderingContext2D,
    public options?: BoardOptions
  ) {
    if (options && options.margin) this.position = options.margin
    this.initMemory()
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
    this.context.fillStyle = '#f4f4f4'
    this.context.fillRect(x, y, this.cellSize, this.cellSize)
    this.context.strokeRect(x, y, this.cellSize, this.cellSize)
  }
  drawMino(coords: Coords): void {
    this.context.fillStyle = '#000000'
    const { x, y } = this.getPosition(coords)
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
  clearFullRows(): void {
    const rows = this.getFullRows()
    rows.map((row) => this.memory[row].fill(''))
    for (let row = 19; row >= 0; row--) {
      if (row < Math.max(...rows)) this.memory[row + 1] = [...this.memory[row]]
    }
    this.draw()
  }
}
