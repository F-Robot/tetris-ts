import Utils from './Utils'
import Board from './Board'
import Tetrimine from './Tetrimine'

import type { GameOptions, IBoard, IGame, ITetrimine } from './types'

export default class Game implements IGame {
  readonly board: IBoard
  readonly tetrimine: ITetrimine
  readonly canvas: HTMLCanvasElement
  readonly context: CanvasRenderingContext2D

  constructor(public selector: string, public options?: GameOptions) {
    this.canvas = Utils.createCanvas(selector, this.options?.canvasOptions)
    this.context = Utils.getCanvasContext(this.canvas)
    this.board = new Board(this.context, this.options?.boardOptions)
    this.tetrimine = new Tetrimine(this.board)
    this.resizeCanvas()
  }
  get score(): number {
    return this.board.score
  }
  start(): void {
    this.board.draw()
    this.tetrimine.draw()
  }
  newGame(): void {
    this.tetrimine.newTetrimine()
  }
  resizeCanvas(): void {
    const margin = this.options?.boardOptions.margin ?? 0
    const { width, height } = this.board.size
    Utils.resizeCanvas(this.canvas, width + margin * 2, height + margin * 2)
  }
}
