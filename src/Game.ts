import Board from './Board'
import Tetrimine from './Tetrimine'
import { BoardOptions, IBoard, IGame, ITetrimine, Size } from './types'

export default class Game implements IGame {
  public BOARD: IBoard
  public TETRIMINE: ITetrimine
  public SIZE: Size

  constructor(
    public context: CanvasRenderingContext2D,
    public options?: BoardOptions
  ) {
    this.BOARD = new Board(this.context, this, this.options)
    this.TETRIMINE = new Tetrimine(this.BOARD, this)
    this.SIZE = this.BOARD.SIZE
    this.TETRIMINE.listenKeyEvents()
  }
  start() {
    this.BOARD.draw()
    this.TETRIMINE.draw()
  }
  createNewTetrimine() {
    for (const key in this.TETRIMINE) {
      // @ts-ignore
      delete this.TETRIMINE[key]
    }
    Object.assign(this.TETRIMINE, new Tetrimine(this.BOARD, this))
    this.TETRIMINE.draw()
  }
  endGame() {
    this.BOARD.clear()
    for (const key in this.TETRIMINE) {
      // @ts-ignore
      delete this.TETRIMINE[key]
    }
    for (const key in this.BOARD) {
      // @ts-ignore
      delete this.BOARD[key]
    }
    Object.assign(this.BOARD, new Board(this.context, this, this.options))
    Object.assign(this.TETRIMINE, new Tetrimine(this.BOARD, this))
    this.TETRIMINE.draw()
  }
}
