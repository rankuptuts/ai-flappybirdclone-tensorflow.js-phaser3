export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'flappy-container',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  banner: false
}

export const config = {
  birdGravity: 500,
  birdFlapPower: 200
}