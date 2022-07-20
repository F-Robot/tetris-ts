import Game from './Game'
import type { GameOptions } from './types'
import { MARGIN } from './constants'

const gameOptions: GameOptions = {
  boardOptions: {
    margin: MARGIN,
  },
  canvasOptions: {
    backgroundColor: '#f4f4f4',
  },
}
new Game('#app', gameOptions).start()
