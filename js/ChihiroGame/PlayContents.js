BasicGame.Play.prototype.BgContainer = function () {
	var bgSprite = this.add.sprite(this.world.centerX,this.world.centerY,'Dialog');
	bgSprite.anchor.setTo(.5);
	bgSprite.scale.setTo(1.2);
};

BasicGame.Play.prototype.genCutInSprite = function () {
	var x = this.world.width*2;
	var toX = this.world.width;
	var y = this.world.height;
	var sprite = this.add.sprite(x,y,'Chihiro_1'); // TODO change img
	sprite.anchor.setTo(1);
	var tween = this.M.T.moveA(sprite,{xy:{x:toX},tweenName:'move1',duration:800});
	var tween2 = this.M.T.moveA(sprite,{xy:{x:x},tweenName:'move2',delay:500,duration:800});
	tween.chain(tween2);
	sprite.startTween = function () {
		tween.start();
	};
	this.CutInSprite = sprite;
};

BasicGame.Play.prototype.BrickContainer = function () {
	this.BgBricks = this.add.group();
	this.Bricks = this.add.group();
	this.Bricks.enableBody = true;
	this.Bricks.physicsBodyType = Phaser.Physics.ARCADE;
	var curCharInfo = this.GM.CharInfo;
	var margin = 5;
	var frameX = curCharInfo.frameX;
	var frameY = curCharInfo.frameY;
	if (frameX == 0) frameX = (this.world.width - curCharInfo.imgWidth - curCharInfo.holizontal * margin) *.5;
	for (var i=0;i<curCharInfo.holizontal;i++) {
		for (var j=0;j<curCharInfo.vertical;j++) {
			this.BgBricks.create(
				frameX+i*(curCharInfo.width+margin),
				frameY+j*(curCharInfo.height+margin),
				curCharInfo.backKey,
				i+curCharInfo.holizontal*j
			);
			var brick = this.Bricks.create(
				frameX+i*(curCharInfo.width+margin),
				frameY+j*(curCharInfo.height+margin),
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
	var paddle = this.M.S.genBmpSprite(this.world.centerX,this.world.height-100,200,paddleH,'#0000ff');
	this.Paddle = paddle;
	paddle.anchor.setTo(.5);
	this.physics.enable(paddle, Phaser.Physics.ARCADE);
	paddle.body.collisionManager = true;
	paddle.body.bounce.set(1);
	paddle.body.immovable = true;
	var centerMark = this.M.S.genBmpSprite(0,0,this.GM.ballPenetrateRange,paddleH,'#ff0000');
	centerMark.anchor.setTo(.5);
	paddle.addChild(centerMark);
};

BasicGame.Play.prototype.BallContainer = function () {
	var radius = 30;
	var ball = this.M.S.genBmpCircleSprite(this.Paddle.x,this.Paddle.y-radius,radius,BasicGame.MAIN_TEXT_COLOR);
	this.Ball = ball;
	ball.anchor.setTo(.5);
	ball.checkWorldBounds = true;
	this.physics.enable(ball, Phaser.Physics.ARCADE);
	ball.body.collideWorldBounds = true;
	ball.body.bounce.set(1);
	ball.events.onOutOfBounds.add(this.ballLost, this);
	ball.onPaddle = true;
	ball.penetrate = false;
	ball.standardSpeedY = -400;
	ball.standardSpeedRangeX = 100;
	ball.maxSpeedX = 1200;
	ball.minSpeedX = -1200;
	ball.penetrateMaxSpeedY = -1200;
	ball.penetrateMinSpeedY = -800;
	if (this.game.device.touch) {
		this.input.onUp.add(this.releaseBall, this);
	} else {
		this.input.onDown.add(this.releaseBall, this);
	}
};

BasicGame.Play.prototype.ballLost = function () {
	if (this.GM.isPlaying) {
		this.GM.life--;
		this.HUD.changeLives(this.GM.life);
		if (this.GM.life == 0) {
			this.gameOver();
		} else {
			this.Ball.reset(this.Paddle.x, this.Paddle.y-this.Ball.height);
			this.Ball.onPaddle = true;
		}
	}
};

BasicGame.Play.prototype.releaseBall = function () {
	var ball = this.Ball;
	if (this.GM.isPlaying && ball.onPaddle) {
		ball.onPaddle = false;
		var rangeX = ball.standardSpeedRangeX;
		ball.body.velocity.x = this.rnd.between(-rangeX,rangeX);
		ball.body.velocity.y = ball.standardSpeedY;
	}
};

BasicGame.Play.prototype.ParticleContainer = function () {
	var emitter = this.add.emitter(0,0,600);
	emitter.makeParticles('Particle');
	emitter.gravity = 200;
	this.Particles = emitter;
};

