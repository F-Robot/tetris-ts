import Utils from './Utils'
import { Board } from './Board'
import { Tetrimine } from './Tetrimine'

import type { GameOptions, IBoard, IGame, ITetrimine } from './types'
import { ref, Ref } from 'vue'

export class Game implements IGame {
  readonly board: IBoard
  readonly tetrimine: ITetrimine
  readonly canvas: HTMLCanvasElement
  readonly context: CanvasRenderingContext2D
  public score: Ref<number> = ref(0)

  constructor(public el: HTMLDivElement, public options?: GameOptions) {
    this.canvas = Utils.createCanvas(el, this.options?.canvasOptions)
    this.context = Utils.getCanvasContext(this.canvas)
    this.board = new Board(this.context, this, this.options?.boardOptions)
    this.tetrimine = new Tetrimine(this.board)
    this.resizeCanvas()
  }
  start(): void {
    this.board.draw()
    this.tetrimine.newTetrimine()
  }
  newGame(): void {
    this.tetrimine.newTetrimine()
  }
  resizeCanvas(): void {
    const margin = this.options?.boardOptions?.margin ?? 0
    const { width, height } = this.board.size
    Utils.resizeCanvas(this.canvas, width + margin * 2, height + margin * 2)
  }
}
