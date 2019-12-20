var gameSettings = {
  playerSpeed: 400,
  powerUpVel: 100,
}

var config = {
  type: Phaser.AUTO,
  width: 700,
  height: 500,
  backgroundColor: 0x000000,
  scene: [Scene1, Scene2],
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade:{
        debug: false,  
        debugShowVelocity: false
    }
  }
}
 

var game = new Phaser.Game(config);

