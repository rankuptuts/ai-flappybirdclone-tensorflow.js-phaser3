import { Scene, GameObjects, Physics } from 'phaser'
import * as tf from '@tensorflow/tfjs'

export default class AiGameAgent {
  private birdModel: any
  private bird: FlappyBird

  constructor(bird) {
    this.bird = bird;
  }
  
  createModel() {
    const NEURONS = 6;
    const hiddenLayer = tf.layers.dense({
        units: NEURONS,
        inputShape: [2]
    });
    
    const outputLayer = tf.layers.dense({
        units: 1,
    });

    this.birdModel = tf.sequential(); 
    this.birdModel.add(hiddenLayer);
    this.birdModel.add(outputLayer);
    this.birdModel.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
  }

  predictResults(horizontalDistance, heightDistance) {
    tf.tidy(() => {
      var input = [horizontalDistance, heightDistance]; 
      var inputTensor = tf.tensor2d([ input ]);
      var outputs = this.birdModel.predict(inputTensor);
      outputs.data().then(output => { 
        if (output > 0.5) { 
          this.bird.jump(); 
        } 
      });
    });
  }
}