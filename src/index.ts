import { Game } from 'phaser'
import BootScene from './scenes/BootScene'
import PreloadScene from './scenes/PreloadScene'
import MenuScene from './scenes/MenuScene'
import GameScene from './scenes/GameScene'
import { gameConfig } from './config'

class App {
  constructor() {
    let game = new Game(gameConfig)
    game.scene.add('Boot', BootScene, true)
    game.scene.add('Preload', PreloadScene)
    game.scene.add('Menu', MenuScene)
    game.scene.add('Game', GameScene)
  }
}
  
new App()