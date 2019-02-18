import { GameObjects, Physics } from 'phaser'

export default class Pipe extends GameObjects.Sprite implements FlappyPipe {
  private bird: Physics.Arcade.Sprite
  private score: FlappyScore
  private frameNum: number
  private scoreAdded: boolean
  
  constructor(scene, x, y, key, frame) {
    super(scene, x, y, key, frame)
    this.bird  = scene.bird
    this.score = scene.labelScore
    this.frameNum = frame
    
    if (frame === 0) {
      this.scoreAdded = false
    }
  }

  preUpdate() {
    let x = this.x
    
    if(this.y > 50){
      return;
    }
    if (x < -54) {
      //this.pipes.killOutOfBoundPipes(this, this.frameNum)
      this.scoreAdded = false
    } 
    else if (!this.scoreAdded && this.frameNum == 0 && x + 28 + 17 < this.bird.x) {
      this.score.addScore()
      this.scoreAdded = true
    }
  }

  public setSpeed() {
    let pipeBody = <Phaser.Physics.Arcade.Body>this.body
    pipeBody.setVelocityX(-100)
  }
}