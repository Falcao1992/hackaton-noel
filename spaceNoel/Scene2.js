let varVitess = 1;

setInterval(() => {
  varVitess *= 1.03
},1000)

let bestScore = 0;




class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");
  }


  create() {
    
    this.background = this.add
      .tileSprite(0, 0, config.width, config.height, "background")
      .setOrigin(0);

      

    this.ship1 = this.add.sprite(
      config.width / 2 - 150,
      config.height / 2,
      "ship"
    );
    this.ship2 = this.add.sprite(config.width / 2 - 250, config.height / 2, "ship2");
    this.ship3 = this.add.sprite(
      config.width / 2 + 250,
      config.height / 2,
      "ship3"
    );
    this.ship4 = this.add.sprite(config.width / 2 + 150, config.height / 2, "ship4");

    

    this.enemies = this.physics.add.group();
    this.enemies.add(this.ship1);
    this.enemies.add(this.ship2);
    this.enemies.add(this.ship3);
    this.enemies.add(this.ship4);


    this.ship1.play("ship1_anim");
    this.ship2.play("ship2_anim");
    this.ship3.play("ship3_anim");
    this.ship4.play("ship4_anim");


    this.ship1.setInteractive();
    this.ship2.setInteractive();
    this.ship3.setInteractive();
    this.ship4.setInteractive();


    this.input.on("gameobjectdown", this.destroyShip, this);

    this.physics.world.setBoundsCollision();

  

    this.player = this.physics.add.sprite(
      config.width / 2 - 8,
      config.height - 64,
      "player"
    );
    this.player.play("thrust");
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);

    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.projectiles = this.add.group();

    this.physics.add.collider(this.projectiles, function(

      projectile,
      powerUps,
    ) {
      projectile.destroy();
    });

    this.physics.add.overlap(
      this.player,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.hurtPlayer,
      null,
      this
    );

    this.physics.add.overlap(
      this.projectiles,
      this.enemies,
      this.hitEnemy,
      null,
      this
    );

    var graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(config.width, 0);
    graphics.lineTo(config.width, 20);
    graphics.lineTo(0, 20);
    graphics.lineTo(0, 0);
    
    graphics.closePath();
    graphics.fillPath();

    this.score = 0;
    var scoreFormated = this.zeroPad(this.score, 6);
    var scoreFormated2 = this.zeroPad(bestScore, 6);
    this.scoreLabel = this.add.bitmapText(
      15,
      55,
      "pixelFont",
      "Score " + scoreFormated,
      35
    );

    this.bestScoreLabel = this.add.bitmapText(
      15,
      15,
      "pixelFont",
      "Best SCORE " + scoreFormated2,
      35
    );

    this.beamSound = this.sound.add("audio_beam");
    this.explosionSound = this.sound.add("audio_explosion");
    this.mortSound = this.sound.add("mort")

    this.music = this.sound.add("music");

    var musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop:false,
      delay: 0
    }

    this.music.play(musicConfig);

  }


  hurtPlayer(player, enemy) {

    if (this.score > bestScore){
      bestScore = this.score
    }
    varVitess = 1
    
    this.score = 0;
    this.resetShipPos(enemy);
    this.mortSound.play();

    // 4.3 don't hurt the player if it is invincible
    if (this.player.alpha < 1) {
      return;
    }
    
    //this.scene.start("LoadScene");


    // 2.2 spawn a explosion animation
    var explosion = new Explosion(this, player.x, player.y);

    // 2.3 disable the player and hide it
    player.disableBody(true, true);

    // 3.1 after a time enable the player again
    this.time.addEvent({
      delay: 1000,
      callback: this.resetPlayer,
      callbackScope: this,
      loop: false
    });

  }

  resetPlayer() {
    // 3.2 enable the player again
    var x = config.width / 2 - 8;
    var y = config.height + 64;
    this.player.enableBody(true, x, y, true, true);


    // 4.1 make the player transparent to indicate invulnerability
    this.player.alpha = 0.5;
    //
    //
    // 4.2 move the ship from outside the screen to its original position
    var tween = this.tweens.add({
      targets: this.player,
      y: config.height - 64,
      ease: "Power1",
      duration: 1500,
      repeat: 0,
      onComplete: function() {
        this.player.alpha = 1;
      },
      callbackScope: this
    });
  }

  hitEnemy(projectile, enemy) {
    var explosion = new Explosion(this, enemy.x, enemy.y);

    projectile.destroy();
    this.resetShipPos(enemy);
    this.score += 15;

    var scoreFormated = this.zeroPad(this.score, 6);
    var scoreFormated2 = this.zeroPad(bestScore, 6);

  

    this.scoreLabel.text = "SCORE " + scoreFormated;
    this.bestScoreLabel.text = "Best SCORE " + scoreFormated2;

 
    this.explosionSound.play();
        
  }

  zeroPad(number, size) {
    var stringNumber = String(number);
    while (stringNumber.length < (size || 2)) {
      stringNumber = "0" + stringNumber;
    }
    return stringNumber;
  }


  update() {

    
    this.moveShip(this.ship1, 2 * varVitess);
    this.moveShip(this.ship2, 1 * varVitess);
    this.moveShip(this.ship3, 2 * varVitess);
    this.moveShip(this.ship4, 2 * varVitess);

    this.background.tilePositionX -= 1;

    this.movePlayerManager();

    if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
      if (this.player.active) {
        this.shootBeam();
      }
    }
    for (var i = 0; i < this.projectiles.getChildren().length; i++) {
      var beam = this.projectiles.getChildren()[i];
      beam.update();
    }
  }

  shootBeam() {
    var beam = new Beam(this);
    this.beamSound.play();
  }

  movePlayerManager() {
    this.player.setVelocity(0);

    if (this.cursorKeys.left.isDown) {
      this.player.setVelocityX(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.right.isDown) {
      this.player.setVelocityX(gameSettings.playerSpeed);
    }

    if (this.cursorKeys.up.isDown) {
      this.player.setVelocityY(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.down.isDown) {
      this.player.setVelocityY(gameSettings.playerSpeed);
    }
  }

  moveShip(ship, speed) {
    ship.y += speed;
    if (ship.y > config.height) {
      this.resetShipPos(ship);
    }
  }

  resetShipPos(ship) {
    ship.y = 0;
    var randomX = Phaser.Math.Between(0, config.width);
    ship.x = randomX;
  }

  destroyShip(pointer, gameObject) {
    gameObject.setTexture("explosion");
    gameObject.play("explode");
  }
}
