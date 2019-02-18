import { Scene, GameObjects, Physics } from 'phaser'
import * as tf from '@tensorflow/tfjs'

import { config } from '../config'
import Pipes from '../sprites/Pipes'
import Score from '../helpers/Score'
import Ground from '../sprites/Groud'
import Bird from '../sprites/Bird'
import GameAgent from '../helpers/AiGameAgent'

var generation = 0

export default class GameScene extends Scene implements FlappyGameScene {
  private background: GameObjects.TileSprite
  private ground: FlappyGround
  private bird: FlappyBird
  private pipes: FlappyPipes
  private labelScore: FlappyScore
  private labelGeneration: FlappyScore

  private started: boolean = false
  private width: number
  private height: number
  private halfWidth: number
  private halfHeight: number

  scoreSound: Phaser.Sound.BaseSound
  private hitPipeSound: Phaser.Sound.BaseSound
  private hitGroudSound: Phaser.Sound.BaseSound

  private pipeGeneratorLoop: any
  private gameAgent: GameAgent

  currentTarget: number = 0
  changeTarget: boolean = true

  constructor() {
    super({ key: 'Game' })
  }

  init() {
    this.scoreSound = this.sound.add('score_sound')
    this.hitPipeSound = this.sound.add('hit_pipe_sound')
    this.hitGroudSound = this.sound.add('hit_ground_sound')

    let config = this.sys.game.config
    this.width = <number>config.width
    this.height = <number>config.height
    this.halfWidth = this.width / 2
    this.halfHeight = this.height / 2
    let { width, height, halfWidth, halfHeight } = this
    
    this.background = this.add.tileSprite(halfWidth, halfHeight, width, height, 'background')
    this.ground = new Ground(this, halfWidth, height - 56, width, 112, 'ground')
    this.add.existing(this.ground)
    
    this.bird = new Bird(this, 50, 150, 'bird')
    this.physics.add.existing(this.bird, false)
    this.add.existing(this.bird)
    this.bird.anims.play('fly')

    this.gameAgent = new GameAgent(this.bird)
    this.gameAgent.createModel()

    this.currentTarget = 0;
    this.labelScore = new Score(this, 10, 10, 'flappyfont', '0', 36)
    this.add.existing(this.labelScore)

    this.labelGeneration = new Score(this, 300, 10, 'flappyfont', 'Generation: ' + generation, 36)
    this.add.existing(this.labelGeneration)
    
    this.startGame()
  }

  startGame() {
    this.input.keyboard.on('keydown_SPACE', this.bird.jump, this.bird)
    this.bird.setGrav()

    this.pipes = new Pipes(this.physics.world, this.physics.world.scene, { allowGravity: false })
    this.pipes.addRowOfPipes(this.height, 1);
    this.pipeGeneratorLoop = this.time.addEvent({ 
      delay: 3000, 
      callback: this.pipes.addRowOfPipes, 
      args:[this.height], 
      callbackScope: this.pipes, 
      loop: true 
    });

    this.physics.add.existing(this.ground, true)
    this.physics.add.collider(this.bird, this.ground, this.hitGroud, null, this)
    this.physics.add.overlap(this.bird, this.pipes, this.hitPipe, null, this)

    this.started = true
  }

  update(time, delta) {
    if (!this.started) return

    if (this.background.active) {
      this.background.tilePositionX -= 10 * delta / 1000
    }
    
    if (this.ground.active) {
      this.ground.updateGround(delta)
    }
    
    if (this.bird.active) {
      this.bird.updateBird(this)
    }

    var hole = 0;
    if(this.pipes.pipeGapsIndex.length == 6) {  // number of tiles
      this.pipes.nextTarget = <GameObjects.Sprite>this.pipes.getChildren()[this.currentTarget] 
      this.pipes.nextGapCordinates = hole = this.pipes.pipeGapsIndex[this.currentTarget];
      this.currentTarget = 0
    }
    else if(this.changeTarget && this.pipes.nextTarget && (this.pipes.nextTarget.x + 64 - 24) < this.bird.x) {  // 24 is adjustment
      this.changeTarget = false;
      this.currentTarget = this.currentTarget + 6
      this.pipes.nextTarget = this.pipes.getChildren()[this.currentTarget] 
      this.pipes.nextGapCordinates = hole = this.pipes.pipeGapsIndex[this.currentTarget];

      var that = this;
      setTimeout(function() { that.changeTarget = true; }, 500);
    }
   
    var horizontalDistance = this.pipes.nextTarget.x;
    var heightDistance = this.bird.y - this.pipes.pipeGapsIndex[this.currentTarget]; // assuming that calculation is correct
    this.gameAgent.predictResults(horizontalDistance, heightDistance);
  }

  gameOver() {
    if (!this.started) return

    this.labelGeneration.text = "Generation: " + (++generation);
    
    var horizontalDistance = this.pipes.nextTarget.x;
    var heightDistance = this.bird.y - this.pipes.nextGapCordinates;
    var reward = parseInt(this.labelScore.text) + (this.bird.x - this.pipes.nextTarget.x);

    this.bird.stopTween()
    this.restartGame()
  }

  restartGame() {
    this.scene.restart()
  }

  hitGroud() {
    if (!this.started) return

    this.hitGroudSound.play()
    if (this.bird.active) {
      this.offBirdJump()
      this.stopGameObjects()
    }
    
    this.gameOver()
  }

  hitPipe() {
    if (!this.bird.active) return

    this.hitPipeSound.play()
    this.offBirdJump()
    this.stopGameObjects()
    this.bird.headDroop()
    this.gameOver()
  }

  stopGameObjects() {
    this.background.setActive(false)
    this.ground.setActive(false)
    this.bird.setActive(false)
    this.time.removeAllEvents();
  }

  offBirdJump() {
    this.input.keyboard.off('keydown_SPACE', this.bird.jump, this.bird, false)
  }
}
