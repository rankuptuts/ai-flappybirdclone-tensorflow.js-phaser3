import { Scene } from 'phaser'

export default class PreloadScene extends Scene {
  constructor() {
    super({ key: 'Preload' })
  }

  init() {
    let config = this.sys.game.config
    let width = <number>config.width
    let height = <number>config.height
    let loadingPic = this.add.image(width / 2, height / 2, 'loading')
    
    loadingPic.setSize(0, 19)
    this.load.on('progress', (value) => {
      loadingPic.setSize(value * 220, 19)
    })
  }

  preload() {
    let image = this.load.image.bind(this.load)
    let spritesheet = this.load.spritesheet.bind(this.load)
    let audio = this.load.audio.bind(this.load)

    this.load.setPath('src/assets/images/')
    image('background', 'background1.png')
    image('ground', 'ground.png')
    image('pipe', 'pipe.png')
    spritesheet('bird', 'bird.png', { frameWidth: 34, frameHeight: 24, endFrame: 2 })
        
    this.load.setPath('src/assets/fonts/')
    this.load.bitmapFont('flappyfont', 'flappyfont.png', 'flappyfont.xml')
    
    this.load.setPath('src/assets/audio/')
    audio('fly_sound', 'flap.wav')
    audio('score_sound', 'score.wav')
    audio('hit_pipe_sound', 'pipehit.wav')
    audio('hit_ground_sound', 'ouch.wav')
  }

  create() {
    this.scene.start('Menu')
  }
}
