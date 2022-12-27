class GameScene extends Phaser.Scene {
    constructor() {
      super({
        key: 'GameScene'
      })
  
      this.player
      this.gameOver = false
      this.stars
      this.bombs
      this.cakes
      this.score = 0
      this.life = 1
      this.lifeText
      this.scoreText
      this.bombEvent
      this.meatEvent
      this.cakeEvent
    }

    preload() {
      this.load.image('background','./assets/image/background.png')
      this.load.image('ground', './assets/image/platform.png')
      this.load.spritesheet('character', './assets/image/character.png', {frameWidth: 32, frameHeight: 48})
      this.load.image('restart', 'assets/image/restart.png')
      this.load.image('gameover', 'assets/image/gameOver.png')
      this.load.image('star', './assets/image/star.png')
      this.load.image('cake','./assets/image/cakee.png')
      this.load.spritesheet('bomb', './assets/image/bombs.png', {frameWidth: 14.5, frameHeight: 12})
      this.load.audio('death', 'assets/death.mp3')
      this.load.audio('pickup', 'assets/pickup.wav')
    
    }
  
    create() {
     this.background = this.add.tileSprite(400, 300, 1000, 600, 'background')
     var platforms;
     
    
     platforms = this.physics.add.staticGroup();
     platforms.create(400, 568, 'ground').setScale(4.2).refreshBody();


      this.player = this.physics.add.sprite(100, 450, 'character');
      this.player.setScale(2.25)
      this.player.setBounce(0.2);
      this.player.setCollideWorldBounds(true);
    
      this.cakes = this.physics.add.group()
      this.stars = this.physics.add.group()
      this.bombs = this.physics.add.group()
      this.starEvent = this.time.addEvent({ delay: 1000, callback: starsEvent, callbackScope: this, loop: true})
      this.bombEvent = this.time.addEvent({ delay: 3000, callback: bombsEvent, callbackScope: this, loop: true})
      this.cakeEvent = this.time.addEvent({ delay: 5000, callback: cakesEvent, callbackScope: this, loop: true})

      function starsEvent() {
        this.starEvent.reset({ delay: Phaser.Math.Between(1000 ,5000), callback: starsEvent, callbackScope: this, loop: true})
        let star = this.stars.create(800, Phaser.Math.Between(200, 485), 'star')
        star.setScale(1.5)
        star.setCircle(6.5)
        star.setBounceY(Phaser.Math.FloatBetween(0.6, 1.2))
        this.stars.setVelocityX(Phaser.Math.Between(-1000, -300))
      }
  
      function bombsEvent() {
        this.bombEvent.reset({ delay: Phaser.Math.Between(3000 ,5000), callback: bombsEvent, callbackScope: this, loop: true})
        let bomb = this.bombs.create(800, Phaser.Math.Between(300, 485), 'bomb')
        bomb.setScale(4)
        bomb.setCircle(5)
        bomb.anims.play('boom', true)
        bomb.setBounceY(1.2)
        this.bombs.setVelocityX(Phaser.Math.Between(-1000, -300))
      }

       function cakesEvent(){
        this.cakeEvent.reset({ delay: Phaser.Math.Between(7000 ,10000), callback: cakesEvent, callbackScope: this, loop: true})
        let cake = this.cakes.create(800, Phaser.Math.Between(300, 485), 'cake')
        cake.setScale(1.5)
        cake.setCircle(2)
        cake.setBounceY(Phaser.Math.FloatBetween(0.6, 1.2))
        this.cakes.setVelocityX(Phaser.Math.Between(-1000, -300))

      }

        this.anims.create({
          key: 'left',
          frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
      });

      this.anims.create({
          key: 'turn',
          frames: [ { key: 'character', frame: 4} ],
          frameRate: 20
      });

      this.anims.create({
          key: 'right',
          frames: this.anims.generateFrameNumbers('character', { start: 5, end: 8 }),
          frameRate: 10,
          repeat: -1
      });


      this.anims.create({
        key: 'boom',
        frames: this.anims.generateFrameNumbers('bomb', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      })


      
   

   this.scoreText = this.add.text(580, 16, 'SCORE: 0', { fontSize: '32px', fill: '#000'});//16 16
   this.lifeText = this.add.text(16, 16, 'LIFE: 1', { fontSize: '32px', fill: '#000' });//580 /16
   function collectPoints (player, star)
    {
        star.destroy();
        this.sound.add('pickup').play();
        this.score = this.score+10;
        this.scoreText.setText('SCORE: ' + this.score);
    }

    function collectLife (player, cake)
    {
        cake.destroy();
        this.sound.add('pickup').play();
        this.life = this.life + 1;
        this.lifeText.setText('LIFE: ' + this.life);
    }

  function hitBomb (player, bomb)
   {bomb.destroy();
    this.life--;
    this.lifeText.setText('LIFE: '+ this.life)
    if(this.life==0)
    {
    this.physics.pause();
    this.sound.add('death').play();
    this.player.setTint(0xff0000);
    this.bombEvent.paused = true
    this.starEvent.paused = true
    this.cakeEvent.paused = true
    this.player.anims.play('turn');
    this.gameOver = true;

    let restart = this.add.image(400, 350, 'restart')
      restart.setScale(4)
      restart.setInteractive()
      restart.on('pointerdown', () => {
        this.scene.start('GameScene')
        this.gameOver = false
        this.life = 1
        this.score = 0
        
          })
      restart.on('pointerover', () => restart.setTint(0xcccccc))
      restart.on('pointerout', () => restart.setTint(0xffffff))

      this.gameover = this.add.image(400, 180, 'gameover')
      this.gameover.setScale(0.8)
     
   }
  }



    this.physics.add.collider(this.player, platforms)
    this.physics.add.collider(this.stars, platforms)
    this.physics.add.collider(this.cakes, platforms)
    this.physics.add.collider(this.bombs, platforms)
    this.physics.add.overlap(this.player, this.stars, collectPoints, null, this)
    this.physics.add.overlap(this.player, this.cakes, collectLife, null, this)
    this.physics.add.collider(this.player, this.bombs, hitBomb, null, this)
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05)
    this.cameras.main.setBounds(0, 0, 800, 600)
    }
  
    update() {

if(this.gameOver==false){
    let cursors = this.input.keyboard.createCursorKeys()
      if (cursors.right.isDown) {
        this.player.setVelocityX(200)
        this.player.flipX = false
      this.player.anims.play('right', true)
      }
      else if (cursors.left.isDown) {
        this.player.setVelocityX(-260)
        this.player.anims.play('left', true)
      }
      else {
        this.player.setVelocityX(0)
        this.player.anims.play('right', true)
      }
      if (cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-600);
      }
    

        this.background.tilePositionX += 6
    }
    }
  }



  
  export default GameScene
 