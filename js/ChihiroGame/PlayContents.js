BasicGame.Play.prototype.BrickContainer = function () {
	this.BgBricks = this.add.group();
	this.Bricks = this.add.group();
	this.Bricks.enableBody = true;
	this.Bricks.physicsBodyType = Phaser.Physics.ARCADE;
	var curCharInfo = this.GM.CharInfo;
	var startX = 100;
	var startY = 200;
	for (var i=0;i<curCharInfo.holizontal;i++) {
		for (var j=0;j<curCharInfo.vertical;j++) {
			this.BgBricks.create(
				startX+i*(curCharInfo.width+5),
				startY+j*(curCharInfo.height+5),
				curCharInfo.backKey,
				i+curCharInfo.holizontal*j
			);
			var brick = this.Bricks.create(
				startX+i*(curCharInfo.width+5),
				startY+j*(curCharInfo.height+5),
				curCharInfo.key,
				i+curCharInfo.holizontal*j
			);
			brick.body.bounce.set(1);
			brick.body.immovable = true;
			brick.tint = 0xbbbbbb;
		}
	}
};
BasicGame.Play.prototype.PaddleContainer = function () {
	var paddleH = 20;
	this.Paddle = this.M.S.genBmpSprite(this.world.centerX,this.world.height-100,200,paddleH,'#0000ff');
	this.Paddle.anchor.setTo(.5);
	this.physics.enable(this.Paddle, Phaser.Physics.ARCADE);
	this.Paddle.body.collisionManager = true;
	this.Paddle.body.bounce.set(1);
	this.Paddle.body.immovable = true;
	var centerMark = this.M.S.genBmpSprite(0,0,this.GM.ballPenetrateRange,paddleH,'#ff0000');
	centerMark.anchor.setTo(.5);
	this.Paddle.addChild(centerMark);
};

BasicGame.Play.prototype.BallContainer = function () {
	var radius = 48;
	this.Ball = this.M.S.genBmpCircleSprite(0,this.Paddle.y-radius,radius,'#0f0f0f');
	this.Ball.anchor.setTo(.5);
	this.Ball.checkWorldBounds = true;
	this.physics.enable(this.Ball, Phaser.Physics.ARCADE);
	this.Ball.body.collideWorldBounds = true;
	this.Ball.body.bounce.set(1);
	this.Ball.events.onOutOfBounds.add(this.ballLost, this);
	this.Ball.onPaddle = true;
	// this.Ball.penetrate = true;
	this.Ball.penetrate = false;
	this.input.onUp.add(this.releaseBall, this);
};

BasicGame.Play.prototype.ballLost = function () {
	if (this.GM.isPlaying) {
		this.GM.life--;
		if (this.GM.life == 0) {
			// this.gameOver();
		} else {
			this.Ball.reset(this.Paddle.x, this.Paddle.y-this.Ball.height);
			this.Ball.onPaddle = true;
		}
	}
};

BasicGame.Play.prototype.releaseBall = function () {
	if (this.GM.isPlaying && this.Ball.onPaddle) {
		this.Ball.onPaddle = false;
		this.Ball.body.velocity.y = this.GM.BallInfo.standardSpeedY;
		var rangeX = this.GM.BallInfo.standardSpeedRangeX;
		this.Ball.body.velocity.x = this.rnd.between(-rangeX,rangeX);
	}
};
