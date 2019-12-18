const config = {
  width: 700,
  height: 500,
  type: Phaser.AUTO,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: {y: 500}
      }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);
let image1
let cursors


function preload() {
  this.load.image("image1", "./images/image1.png");
}


function create() {
  image1 = this.physics.add.image(100, 100, "image1");
  image1.body.collideWorldBounds = true;

  cursors = this.input.keyboard.createCursorKeys()
}


function update() {
    image1.setVelocityX(0)

    if(cursors.up.isDown){
        image1.setVelocity(0,-200)
    }
    if(cursors.down.isDown){
        image1.setVelocity(0,200)
    }
    if(cursors.left.isDown){
        image1.setVelocity(-200,0)
    }
    if(cursors.right.isDown){
        image1.setVelocity(200,0)
    }
}
