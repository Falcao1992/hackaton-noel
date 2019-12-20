var game = new Phaser.Game(950,540);
var vitesse = 500;

var dodger = {
  preload: function() {
    game.load.image('fond', 'images/imgfond2.jpg');
    game.load.image('player', 'images/image1.png');
    game.load.image('boule', 'images/boule.png');
    this.load.audio("music", ["music/noel.mp3"]);
  },
  create: function() {
    // affichage + setup
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
    
    this.sound.play('music');
    
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    game.add.sprite(0,0, 'fond');
    
    this.player = game.add.sprite(450,450, 'player')
    this.player.anchor.set(0.5);
    game.physics.arcade.enable(this.player);

    this.cursors= game.input.keyboard.createCursorKeys();
    this.boules = game.add.group();
    this.timer = game.time.events.loop(200, this.ajouterUneBoule, this);

    this.score = 0;
    this.labelScore = game.add.text(20, 20, "0", {font: "30px Arial", fill: "#fff"});

  },
  update: function() {
    //logique du jeux
    
    game.physics.arcade.overlap(this.player, this.boules, this.restartGame, null, this);
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -vitesse * +1;
    }
    if (this.cursors.right.isDown) {
      this.player.body.velocity.x = +vitesse;
    }
    if (this.cursors.up.isDown) {
      this.player.body.velocity.y = -vitesse * +1;
    }
    if (this.cursors.down.isDown) {
      this.player.body.velocity.y = +vitesse;
    }
    if (this.player.inWorld ==false) {
      this.restartGame();
    }
  },
  restartGame: function() {
    game.state.start('dodger');
  },
  ajouterUneBoule: function() {
    var position = Math.floor(Math.random() * 900) + 1;
    var boule = game.add.sprite(position,-50, 'boule');
    game.physics.arcade.enable(boule);
    boule.body.gravity.y = 400;

    this.boules.add(boule);

    this.score += 30;
    this.labelScore.text = this.score;

    boule.checkWorldBounds = true;
    boule.outOfBoundsKill = true;

  }
};

game.state.add('dodger', dodger);
game.state.start('dodger');