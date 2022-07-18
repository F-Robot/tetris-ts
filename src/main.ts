import Utils from './Utils'
import { MARGIN } from './constants'
import Board from './Board'
import Tetrimine from './Tetrimine'

const canvas = Utils.createCanvas('#app', { background: '#f4f4f4' })
const context = Utils.getCanvasContext(canvas)

const board = new Board(context, { margin: { x: MARGIN, y: MARGIN } })
const tetrimine = new Tetrimine(board)

const { width, height } = board.size
const canvasWidth = width + MARGIN * 2
const canvasHeight = height + MARGIN * 2
Utils.resizeCanvas(canvas, canvasWidth, canvasHeight)

board.draw()
tetrimine.draw()
