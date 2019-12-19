let game;
 
// global game options object, to tune gameplay
let gameOptions = {
 
    // ground position, where 0: top of the screen, 1: bottom of the screen
    groundPosition: 3 / 4,
 
    // height of the bouncing ball, in pixel above ground position
    ballHeight: 300,
 
    // ball gravity used by ARCADE physics
    ballGravity: 2500,
 
    // ball x position, where 0: left of the screen, 1: righ of the screen
    ballPosition: 1 / 5,
 
    // platforms speed, in pixels per second
    platformSpeed: 950,
 
    // distance range from the center of each platform, in pixels
    platformDistanceRange: [150, 250],
 
    // height range of a platform, in pixels from ground position
    platformHeightRange: [-100, 100],
 
    // length range of a platform, in pixels
    platformLengthRange: [40, 60],
 
    // % of a platform to fall down after being hit
    fallingPlatformPercent: 50,
 
    // localStorage string name
    localStorageName: "bestballscore3"
}
window.onload = function() {
 
    // game configuration object
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: '#2d2d2d',
        audio: {
            disableWebAudio: true
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 960,
            height: 540
        },
        physics: {
            default: "arcade"
        },
        scene: playGame
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}
class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame");
    }
    preload(){
        this.load.image("fond", "fond.jpg")
        this.load.image("ground", "ground.png");
        this.load.image("ball", "ball.png");
        this.load.audio("song", "song.mp3");
    }
    create(){
        const image = this.add.image(0, 0, "fond").setOrigin(0);
        // creation of the physics group which will contain all platforms
        this.platformGroup = this.physics.add.group();

        // ball sprite bound to an ARCADE body
        this.ball = this.physics.add.sprite(game.config.width * gameOptions.ballPosition, game.config.height * gameOptions.groundPosition - gameOptions.ballHeight, "ball");

        // set ball vertical gravity
        this.ball.body.gravity.y = gameOptions.ballGravity;

        // set maximum restitution to the ball
        this.ball.setBounce(1);

        // we will only check ball collision on its bottom side
        this.ball.body.checkCollision.down = true;
        this.ball.body.checkCollision.up = false;
        this.ball.body.checkCollision.left = false;
        this.ball.body.checkCollision.right = false;
 
        // make ball physics body a little narrower than its sprite
        this.ball.setSize(30, 50, true)

        // first platform will be exactly under the ball
        let platformX = this.ball.x;

        // we are going to create 10 platforms which we'll reuse to save resources
        for(let i = 0; i < 5; i++){

            // platform creation, as a member of platformGroup physics group
            let platform = this.platformGroup.create(0, 0, "ground");
 
            // platform won't physically react to collisions
            platform.setImmovable(true);
 
            // method to position the platform
            this.placePlatform(platform, platformX)
            
            // define next platform x position
            platformX += Phaser.Math.Between(gameOptions.platformDistanceRange[0], gameOptions.platformDistanceRange[1]);
        }
 
        // input management
        this.input.on("pointerdown", this.movePlatforms, this);
        this.input.on("pointerup", this.stopPlatforms, this);
 
        // score stats at zero
        this.score = 0;
 
        // retrieve top score from local storage, if any
        this.topScore = localStorage.getItem(gameOptions.localStorageName) == null ? 0 : localStorage.getItem(gameOptions.localStorageName);
 
        // text object to display the score
        this.scoreText = this.add.text(10, 10, "");
 
        // updateScore method will add its argument to current score and display it
        this.updateScore(0);
    }
 
    // method to add inc to current score and display it
    updateScore(inc){
        this.score += inc;
        this.scoreText.text = "Score: " + this.score + "\nBest: " + this.topScore;
    }
 
    // method to move platform to the left, called when the pointer is pressed
    movePlatforms(){
        this.platformGroup.setVelocityX(-gameOptions.platformSpeed);
    }
 
    // method to stop platforms, called when the pointer is released
    stopPlatforms(){
        this.platformGroup.setVelocityX(0);
    }
 
    // method to place "platform" platform at posX horizontal position
    placePlatform(platform, posX){
 
        // set platform x and y position
        platform.x = posX;
        platform.y = game.config.height * gameOptions.groundPosition + Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]);
 
        // platform will fall down if it's not the first platform AND if a random number between 1 and 100 is smaller than fallingPlatformPercent value
        platform.fallingDown = posX != this.ball.x && Phaser.Math.Between(1, 100) <= gameOptions.fallingPlatformPercent;
 
        // set platform display width
        platform.displayWidth = Phaser.Math.Between(gameOptions.platformLengthRange[0], gameOptions.platformLengthRange[1]);
 
        // (re)set platform body and velocity to zero
        platform.body.gravity.y = 0;
        platform.body.velocity.y = 0;
    }
 
    // method to get the rightmost platform, returns the position of the rightmost platform, in pixels
    getRightmostPlatform(){
        let rightmostPlatform = 0;
        this.platformGroup.getChildren().forEach(function(platform){
            rightmostPlatform = Math.max(rightmostPlatform, platform.x);
        });
        return rightmostPlatform;
    }
 
    // method to be executed at each frame
    update(){
 
        // handle collision between platform group and the ball
        this.physics.world.collide(this.platformGroup, this.ball, function(bodyA, bodyB){
 
            // if the platform is set to fall down, then assign it a high vertical gravity
            if(bodyB.fallingDown){
                bodyB.body.gravity.y = 1000
            }
        });
 
        // loop through all platforms
        this.platformGroup.getChildren().forEach(function(platform){
 
            // if a platform leaves the stage to the left side...
            if(platform.getBounds().right < 0){
 
                // increase and show the score
                this.updateScore(1);
 
                // reposition the platform
                this.placePlatform(platform, this.getRightmostPlatform() + Phaser.Math.Between(gameOptions.platformDistanceRange[0], gameOptions.platformDistanceRange[1]))
            }
        }, this);
 
        // if the ball falls down...
        if(this.ball.y > game.config.height){
 
            // save the best score
            localStorage.setItem(gameOptions.localStorageName, Math.max(this.score, this.topScore));
 
            // restart the scene
            this.scene.start("PlayGame");
        }
    }
}