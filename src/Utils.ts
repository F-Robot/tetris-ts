import { cover } from 'intrinsic-scale'
import type { CanvasOptions, IUtils } from './types'

class Utils implements IUtils {
  createCanvas(selector: string, options?: CanvasOptions) {
    if (typeof selector !== 'string') throw 'Invalid selector'
    const parent = document.querySelector<HTMLElement>(selector)
    if (!parent) throw 'Element not found'
    const canvas = document.createElement('canvas')
    if (options && options.backgroundColor) {
      canvas.style.background = options.backgroundColor
    }
    parent.appendChild(canvas)
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
