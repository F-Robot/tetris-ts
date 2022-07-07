import Utils from './Utils'
import Board from './Board-v2'
import Tetrimine from './Tetrimine-v2'
import { MARGIN } from './constants'

const canvas = Utils.createCanvas('#app', { background: '#f4f4f4' })
const context = Utils.getCanvasContext(canvas)

const board = new Board(context, { margin: { x: MARGIN, y: MARGIN } })
const tetrimine = new Tetrimine(board)

const { width, height } = board.SIZE
const canvasWidth = width + MARGIN * 2
const canvasHeight = height + MARGIN * 2
Utils.resizeCanvas(canvas, canvasWidth, canvasHeight)

board.draw()
tetrimine.draw()
