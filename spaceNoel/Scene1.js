class Scene1 extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }

  preload(){
    this.load.image("background", "assets/images/background.gif");
    
    this.load.spritesheet("ship", "assets/spritesheets/ship.png",{
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.spritesheet("ship2", "assets/spritesheets/ship2.png",{
      frameWidth: 96,
      frameHeight: 96
    });
    this.load.spritesheet("ship3", "assets/spritesheets/ship3.png",{
      frameWidth: 37,
      frameHeight: 45
    });
    this.load.spritesheet("ship4", "assets/spritesheets/ship4.png",{
      frameWidth: 96,
      frameHeight: 65
    });
    this.load.spritesheet("explosion", "assets/spritesheets/explosion.png",{
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("power-up", "assets/spritesheets/power-up.png",{
      frameWidth: 43,
      frameHeight: 43
    });
    this.load.spritesheet("player", "assets/spritesheets/player.png",{
      frameWidth: 83,
      frameHeight: 98
    });
    this.load.spritesheet("beam", "assets/spritesheets/beam.png",{
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.bitmapFont("pixelFont", "assets/font/font.png", "assets/font/font.xml");

    this.load.audio('audio_beam', ["assets/sounds/beam.ogg", "assets/sounds/beam.mp3"]);
    this.load.audio('audio_explosion', ["assets/sounds/explosion.ogg", "assets/sounds/explosion.mp3"]);
    this.load.audio('audio_pickup', ["assets/sounds/pickup.ogg", "assets/sounds/pickup.mp3"]);
    this.load.audio('music', ["assets/sounds/sci-fi_platformer12.ogg", "assets/sounds/sci-fi_platformer12.mp3"]);

  } 

  create() {

    
    this.add.text(20, 20, "Loading game...");
    this.scene.start("playGame");
 
    this.anims.create({
      key: "ship1_anim",
      frames: this.anims.generateFrameNumbers("ship", {start:0, end: 3}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "ship2_anim",
      frames: this.anims.generateFrameNumbers("ship2", {start:0, end: 3}),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: "ship3_anim",
      frames: this.anims.generateFrameNumbers("ship3", {start:0, end:17}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: "ship4_anim",
      frames: this.anims.generateFrameNumbers("ship4", {start:0, end:2}),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    });

    this.anims.create({
      key: "red",
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 0,
        end: 15
      }),
      frameRate: 25,
      repeat: -1
    });
    this.anims.create({
      key: "gray",
      frames: this.anims.generateFrameNumbers("power-up", {
        start: 0,
        end: 15
      }),
      frameRate: 25,
      repeat: -1
    });
    this.anims.create({
      key: "thrust",
      frames: this.anims.generateFrameNumbers("player"),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: "beam_anim",
      frames: this.anims.generateFrameNumbers("beam"),
      frameRate: 20,
      repeat: -1
    });

  }
}
