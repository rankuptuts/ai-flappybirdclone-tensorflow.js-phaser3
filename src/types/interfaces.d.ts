interface FlappyGameScene extends Phaser.Scene {
  scoreSound: Phaser.Sound.BaseSound
  gameOver(): void
  restartGame(): void
}

interface FlappyPipes extends Phaser.Physics.Arcade.Group {
  pipeGapsIndex: any[]
  nextTarget:any
  nextGapCordinates: number
  addRowOfPipes(h: number, startingPoint?: number): void   
  addOnePipe(x: number, y: number): void
/*killOutOfBoundPipes(pipe: Phaser.GameObjects.Sprite, frameNum: number): void */
}

interface FlappyPipe extends Phaser.GameObjects.Sprite {

}

interface FlappyScore extends Phaser.GameObjects.BitmapText {
  addScore(): void
}

interface FlappyBird extends Phaser.Physics.Arcade.Sprite {
  updateBird(scene: Phaser.Scene): void
  jump(): void
  setGrav(): void
  headDroop(): void
  stopTween(): void
}

interface FlappyGround extends Phaser.GameObjects.TileSprite {
  updateGround(delta: number): void
}