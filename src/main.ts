import Utils from './Utils'
import Game from './Game'
import { MARGIN } from './constants'

const canvas = Utils.createCanvas('#app', { background: '#f4f4f4' })
const context = Utils.getCanvasContext(canvas)

const game = new Game(context, { margin: { x: MARGIN, y: MARGIN } })

const { width, height } = game.SIZE
const canvasWidth = width + MARGIN * 2
const canvasHeight = height + MARGIN * 2
Utils.resizeCanvas(canvas, canvasWidth, canvasHeight)

game.start()
