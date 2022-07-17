import {
  IBoard,
  BoardOptions,
  Coords,
  Position,
  Size,
  Memorie,
  ITetrimine,
  IGame,
} from './types'

export default class Board implements IBoard {
  readonly ROWS = 20
  readonly COLUMNS = 10
  readonly CELL_SIDE_SIZE = 25
  readonly POSITION: Position = { x: 0, y: 0 }
  readonly HEIGHT = this.ROWS * this.CELL_SIDE_SIZE
  readonly WIDTH = this.COLUMNS * this.CELL_SIDE_SIZE
  readonly SIZE: Size = { width: this.WIDTH, height: this.HEIGHT }
  public MEMORIE: Memorie = [['']]

  constructor(
    public context: CanvasRenderingContext2D,
    public game: IGame,
    public options?: BoardOptions
  ) {
    if (options && options.margin) this.POSITION = options.margin
    this.initMemory()
  }
  get hasALine() {
    const lineRows: number[] = []
    this.MEMORIE.map((row, index) => {
      const isALine = row.every((a) => a !== '')
      if (isALine) lineRows.push(index)
    })
    return lineRows
  }
  isGameEnd() {
    return this.MEMORIE[0].some((chunk) => !!chunk)
  }
  saveTetrimine(tetrimine: ITetrimine): void {
    tetrimine.COORDS.map(
      (coords) => (this.MEMORIE[coords.y][coords.x] = tetrimine.NAME)
    )
    if (this.hasALine.length !== 0) this.clearRow(this.hasALine)
  }
  clearRow(rows: number[]) {
    rows.map((row) => {
      for (let column = 0; column < this.COLUMNS; column++) {
        const { x, y } = this.getCanvasPosition({ x: column, y: row })
        this.context.clearRect(x, y, this.CELL_SIDE_SIZE, this.CELL_SIDE_SIZE)
        this.context.strokeRect(x, y, this.CELL_SIDE_SIZE, this.CELL_SIDE_SIZE)
        this.MEMORIE[row][column] = ''
      }
    })
    this.updateBoard(rows)
  }
  updateBoard(rows: number[]) {
    const lastRow = Math.max(...rows)
    this.clearBoard2()
    for (let row = 19; row >= 0; row--) {
      if (row < lastRow) {
        for (let column = 0; column < this.COLUMNS; column++) {
          const lastRowArray = [...this.MEMORIE[row]]
          this.MEMORIE[row + 1] = lastRowArray
        }
      }
    }
    this.drawMemorie()
  }
  drawMemorie() {
    for (let column = 0; column < this.COLUMNS; column++) {
      for (let row = 0; row < this.ROWS; row++) {
        if (this.MEMORIE[row][column]) {
          const { x, y } = this.getCanvasPosition({ x: column, y: row })
          this.context.fillRect(x, y, this.CELL_SIDE_SIZE, this.CELL_SIDE_SIZE)
        }
      }
    }
  }
  clearBoard() {
    this.game.endGame()
  }
  isInMemory(coords: Coords[]): boolean {
    return coords.some((coords) => !!this.MEMORIE[coords.y][coords.x])
  }
  getCanvasPosition(coords: Coords): Position {
    return {
      x: coords.x * this.CELL_SIDE_SIZE + this.POSITION.x,
      y: coords.y * this.CELL_SIDE_SIZE + this.POSITION.y,
    }
  }
  initMemory(): void {
    for (let row = 0; row < this.ROWS; row++) {
      this.MEMORIE[row] = []
      for (let column = 0; column < this.COLUMNS; column++) {
        this.MEMORIE[row].push('')
      }
    }
  }
  clearBoard2() {
    for (let column = 0; column < this.COLUMNS; column++) {
      for (let row = 0; row < this.ROWS; row++) {
        const { x, y } = this.getCanvasPosition({ x: column, y: row })
        this.context.clearRect(x, y, this.CELL_SIDE_SIZE, this.CELL_SIDE_SIZE)
        this.context.strokeRect(x, y, this.CELL_SIDE_SIZE, this.CELL_SIDE_SIZE)
      }
    }
  }
  clear(): void {
    for (let column = 0; column < this.COLUMNS; column++) {
      for (let row = 0; row < this.ROWS; row++) {
        const { x, y } = this.getCanvasPosition({ x: column, y: row })
        this.context.clearRect(x, y, this.CELL_SIDE_SIZE, this.CELL_SIDE_SIZE)
        this.context.strokeRect(x, y, this.CELL_SIDE_SIZE, this.CELL_SIDE_SIZE)
      }
    }
    this.initMemory()
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
