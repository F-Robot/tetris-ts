import { Tetrimines } from './types'

export const MARGIN = 25
export const DOWN_KEY = 'ArrowDown'
export const UP_KEY = 'ArrowUp'
export const LEFT_KEY = 'ArrowLeft'
export const RIGHT_KEY = 'ArrowRight'
export const A_KEY = 'a'
export const S_KEY = 's'
export const W_KEY = 'w'
export const D_KEY = 'd'
export const H_KEY = 'h'
export const J_KEY = 'j'
export const K_KEY = 'k'
export const L_KEY = 'l'
export const UP_KEYS = [UP_KEY, W_KEY, K_KEY]
export const DOWN_KEYS = [DOWN_KEY, S_KEY, J_KEY]
export const LEFT_KEYS = [LEFT_KEY, A_KEY, H_KEY]
export const RIGHT_KEYS = [RIGHT_KEY, D_KEY, L_KEY]
export const TETRIMINES: Tetrimines = {
  Z: {
    coords: [
      { x: 0, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: -1, y: -1 },
    ],
    color: '#fea55f',
  },
  S: {
    coords: [
      { x: 0, y: 0 },
      { x: 1, y: -1 },
      { x: 0, y: -1 },
      { x: -1, y: 0 },
    ],
    color: '#43d9ad',
  },
  J: {
    coords: [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: -1, y: -1 },
      { x: 1, y: 0 },
    ],
    color: '#e99287',
  },
  L: {
    coords: [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
    ],
    color: '#c98bdf',
  },
  T: {
    coords: [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
    ],
    color: '#4d5bce',
  },
  O: {
    coords: [
      { x: 0, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: -1 },
      { x: 1, y: 0 },
    ],
    color: '#ffffff',
  },
  I: {
    coords: [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ],
    color: '#607b96',
  },
}
