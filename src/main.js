/** @type {import("../typings/phaser")} */

import HomeScene from './home.js'
import GameScene from './game.js'

let game = new Phaser.Game({
    type: Phaser.WEBGL,
  width: 800,
  height: 600,
  parent: 'canvas',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 1000
      },
      debug: false
    }
  },

  scene: [

  HomeScene,
  GameScene
  ]
});
