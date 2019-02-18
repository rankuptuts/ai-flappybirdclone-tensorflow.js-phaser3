import { Physics, GameObjects } from 'phaser'
import Pipe from './Pipe'

export default class Pipes extends Physics.Arcade.Group implements FlappyPipes {
  nextTarget: GameObjects.Sprite
  nextGapCordinates: number

  pipeGapsIndex: any[] = []

  constructor(world, scene, config) {
    super(world, scene, config)
  }

  addOnePipe(x, y) {
      let pipe = new Pipe(this.scene, x, y, 'pipe', 0)
      this.add(pipe, true)
      pipe.setSpeed()
  }

  addRowOfPipes(h, startingPoint:number = 1) {
    //Work out how many tiles we need to fit across the screen
    var tilesNeeded = Math.ceil((h - 113) / 64); // - 113 as otherwise tiles will overlap ground
    
    //Add a gap randomly somewhere between pipes
    var min = 2;
    var max = tilesNeeded - 2;
    var hole = Math.floor(Math.random() * (max-min+1) + min);
    
    for (var i = 1; i < tilesNeeded + 1; i++) {
          if (i != hole && i != hole + 1) {
              this.pipeGapsIndex.push(64 * hole)
              this.addOnePipe(this.scene.cameras.main.width / startingPoint, (i * 64) - 30) // -30 otherwise tile will not start from top
          }
    }
  }
}