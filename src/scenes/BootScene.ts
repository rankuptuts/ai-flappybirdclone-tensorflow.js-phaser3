import { Scene } from 'phaser'

export default class BootScene extends Scene {
  constructor() {
    super({ key: 'Boot' })
  }
  
  preload() {
    
  }

  create() {
    this.scene.start('Preload')
  }
}
