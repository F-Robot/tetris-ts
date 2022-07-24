import './style.css'
import { Game } from './Game'
import type { GameOptions } from './types'

const gameOptions: GameOptions = {
  boardOptions: {
    boardColor: '#011627',
    cellSideColor: '#1e2d3d',
  },
}
new Game('#app', gameOptions).start()
