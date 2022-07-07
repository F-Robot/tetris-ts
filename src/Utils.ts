import { cover } from 'intrinsic-scale'

export interface CreateCanvasOptions {
  background?: string
}
interface IUtils {
  createCanvas(
    selector: string,
    options?: CreateCanvasOptions
  ): HTMLCanvasElement
  getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D
  resizeCanvas(canvas: HTMLCanvasElement, width: number, height: number): void
}
class Utils implements IUtils {
  createCanvas(selector: string, options?: CreateCanvasOptions) {
    if (typeof selector !== 'string') throw 'Invalid selector'
    const parent = document.querySelector<HTMLElement>(selector)
    if (!parent) throw 'Not found element'
    const canvas = document.createElement('canvas')
    if (options && options.background) {
      canvas.style.background = options.background
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
