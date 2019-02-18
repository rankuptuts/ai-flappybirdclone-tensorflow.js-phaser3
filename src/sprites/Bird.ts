import { Physics } from 'phaser'
import { config } from '../config'

export default class Bird extends Physics.Arcade.Sprite implements FlappyBird {
  private flySound: Phaser.Sound.BaseSound
  private tween: Phaser.Tweens.Tween

  constructor(scene, x, y, textureKey) {
    super(scene, x, y, textureKey)

    this.flySound = scene.sound.add('fly_sound')
    this.setDepth(1)
  }
  
  updateBird(scene) {
    if (this.active === false) return
    
    if (this.y > 200 && this.angle < 20) {
      this.angle += 1
    }
    
    if (this.y < 0) {
      scene.hitPipe()
    }
  }
  
  jump() {
    let { birdFlapPower } = config
    let flapPower = 0 - birdFlapPower
    this.setVelocityY(flapPower)
    
    if (this.angle > -20) {
      this.stopTween()
      this.tween = this.scene.tweens.add({
        targets: this,
        angle: '-= 20',
        duration: 100
      })
    }

    this.flySound.play()
  }

  headDroop() {
    this.stopTween()
    this.tween = this.scene.tweens.add({
      targets: this,
      duration: 500,
      angle: 70
    })
  }

  stopTween() {
    if (this.tween) {
      this.tween.stop()
      this.tween = null
    }
  }

  setGrav() {
    let { birdGravity } = config
    this.body.gravity.y = birdGravity
  }
}