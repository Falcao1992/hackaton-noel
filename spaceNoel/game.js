var gameSettings = {
  playerSpeed: 200
}

var config = {
  width: 700,
  height: 500,
  backgroundColor: 0x000000,
  scene: [Scene1, Scene2],
  pixelArt: true,
  // 1.1 set the physics to arcade
  physics: {
    default: "arcade",
    arcade:{
        debug: false
    }
  }
}

var game = new Phaser.Game(config);
