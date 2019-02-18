import { GameObjects  } from 'phaser'

const round = Math.round

export default class Score extends GameObjects.BitmapText implements FlappyScore {
  private _score: number = 0
  
  constructor(scene, x, y, font, text, size) {
    super(scene, x, y, font, text, size)
    
    this._score = 0
    this.setDepth(1)
  }

  addScore() {
    let scene = <FlappyGameScene>this.scene
    ++this._score
    scene.scoreSound.play()

    this.setText(this._score.toString())
  }
}