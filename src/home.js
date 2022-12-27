class HomeScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'HomeScene'
    })
  }
  preload() {
    this.load.image('deea', './assets/image/deea.png')
    this.load.image('play', './assets/image/play.png')
    this.load.image('background', './assets/image/background.png')
    this.load.image('platform', './assets/image/platform.png')
 
  }
  create() {

   this.background = this.add.tileSprite(400, 300, 800, 600, 'background')
   
    this.ground = this.add.tileSprite(400, 568, 800, 135, 'platform')
    this.physics.add.existing(this.ground)
    this.ground.body.immovable = true
    this.ground.body.moves = false

    this.logo = this.add.image(400, 190, 'deea')
    this.logo.setScale(0.5)

    let play = this.add.image(400, 400, 'play')
    play.setScale(0.4)
    play.setInteractive()
    play.on('pointerdown', () => this.scene.start('GameScene'))
    play.on('pointerover', () => play.setTint(0xcccccc))
    play.on('pointerout', () => play.setTint(0xffffff))
  }

  update() {
    this.background.tilePositionX += 6
  }
}

export default HomeScene