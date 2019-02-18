import { Physics, GameObjects } from 'phaser'

export default class Ground extends GameObjects.TileSprite {
  constructor(scene, x, y, width, height, texture) {
    super(scene, x, y, width, height, texture)
    
    this.setDepth(1)
  }

  updateGround(delta) {
    this.tilePositionX -= 100 * delta / 1000
  }
}