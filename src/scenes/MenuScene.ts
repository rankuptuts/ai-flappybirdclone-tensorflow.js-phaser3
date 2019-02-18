import { Scene, GameObjects } from 'phaser'

export default class MenuScene extends Scene {
  private background: GameObjects.TileSprite
  private ground: GameObjects.TileSprite
  private bird: GameObjects.Sprite
  
  constructor() {
    super({ key: 'Menu' }) 
  }
  
  create() {
    let config = this.sys.game.config
    let width = <number>config.width
    let height = <number>config.height
    
    this.background = this.add.tileSprite(width / 2, height / 2, width, height, 'background')
    this.ground = this.add.tileSprite(width / 2, height - 56, width, 112, 'ground')
    
    let titleGroup = this.add.group()
    let title = titleGroup.create(145, 100, 'title')
    this.bird = titleGroup.create(257, 100, 'bird')

    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNumbers('bird', { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    })
    
    this.bird.anims.play('fly')

    this.tweens.add({
      targets: titleGroup.getChildren(),
      y: '+=20',
      duration: 1000,
      yoyo: true,
      repeat: Number.MAX_VALUE
    })

    this.scene.start('Game')
  }
  
  update(time, delta) {
    this.background.tilePositionX -= 10 * delta / 1000
    this.ground.tilePositionX -= 100 * delta / 1000    
  }
}