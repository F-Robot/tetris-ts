import { cover } from 'intrinsic-scale'
import type { CanvasOptions, IUtils } from './types'

class Utils implements IUtils {
  createCanvas(el: HTMLDivElement, options?: CanvasOptions) {
    const canvas = document.createElement('canvas')
    if (options && options.backgroundColor) {
      canvas.style.background = options.backgroundColor
    }
    el.appendChild(canvas)
    return canvas
  }
  getCanvasContext(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw 'Invalid context'
    return ctx
  }
  resizeCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
    const dimentions = cover(width, height, width, height)
    canvas.height = dimentions.height
    canvas.width = dimentions.width
  }
}
export default new Utils()
