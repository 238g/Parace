BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GM = {};
		this.HUD = {}; // HUD.js
		this.Bricks = {}; // PlayContents.js
		this.Paddle = {}; // PlayContents.js
		this.Ball = {}; // PlayContents.js
	},

	create: function () {
		this.GameManager();
		this.BgContainer();
		this.PhysicsManager();
		this.BrickContainer(); // PlayContents.js
		this.PaddleContainer(); // PlayContents.js
		this.BallContainer(); // PlayContents.js
		this.HUDContainer(); // HUD.js
		this.ready();
		this.test();
	},

	GameManager: function () {
		this.GM = {
			isPlaying: false,
			score: 0,
			CharInfo: this.M.getConf('CharInfo')[this.M.getGlobal('curCharKey')],
			ballPenetrateRange: 10,
			life: 6,
		};
		this.GM.paddleRange = { left: 24, right: this.world.width-24 };
	},

	update: function () {
		if (this.GM.isPlaying) {
			this.paddleController();
		}
	},

	paddleController: function () {
		var paddle = this.Paddle;
		paddle.x = this.input.x;
		var range = this.GM.paddleRange;
		if (paddle.x < range.left) {
			paddle.x = range.left;
		} else if (paddle.x > range.right) {
			paddle.x = range.right;
		}
		var ball = this.Ball;
		if (ball.onPaddle) {
			ball.body.x = paddle.x-ball.width*.5;
		} else if (ball.penetrate) {
			this.physics.arcade.collide(this.Ball, this.Paddle, this.ballHitPaddle, null, this);
			this.physics.arcade.overlap(this.Ball, this.Bricks, this.ballHitBrick, null, this);
		} else {
			this.physics.arcade.collide(this.Ball, this.Paddle, this.ballHitPaddle, null, this);
			this.physics.arcade.collide(this.Ball, this.Bricks, this.ballHitBrick, null, this);
		}
	},

	ballHitPaddle: function (ball, paddle) {
		var diff = 0;
		var speedX = 0;
		var speedY = 0;
		var penetrateRange = this.GM.ballPenetrateRange*.3;
		if (ball.x < paddle.x-penetrateRange) {
			ball.penetrate = false;
			diff = paddle.x - ball.x;
			speedX = -10 * diff;
			ball.body.velocity.x = Phaser.Math.clamp(speedX,ball.minSpeedX,ball.maxSpeedX);
			speedY = (ball.body.velocity.y + ball.standardSpeedY) * .5;
			ball.body.velocity.y = speedY;
		} else if (ball.x > paddle.x+penetrateRange) {
			ball.penetrate = false;
			diff = ball.x - paddle.x;
			speedX = 10 * diff;
			ball.body.velocity.x = Phaser.Math.clamp(speedX,ball.minSpeedX,ball.maxSpeedX);
			speedY = (ball.body.velocity.y + ball.standardSpeedY) * .5;
			ball.body.velocity.y = speedY;
		} else {
			ball.penetrate = true;
			if (ball.body.velocity.x >= 0) {
				speedX = (ball.body.velocity.x + ball.standardSpeedRangeX) * .5;
			} else {
				speedX = (ball.body.velocity.x - ball.standardSpeedRangeX) * .5;
			}
			ball.body.velocity.x = speedX;
			ball.body.velocity.y = this.rnd.between(ball.penetrateMinSpeedY, ball.penetrateMaxSpeedY);
		}
	},

	ballHitBrick: function (ball, brick) {
		brick.kill();
		if (this.Bricks.countLiving() <= this.GM.CharInfo.clearCount) {
			console.log("Clear");
		}
	},

	BgContainer: function () {
		var bgSprite = this.add.sprite(this.world.centerX,this.world.centerY,'Dialog');
		bgSprite.anchor.setTo(.5);
		bgSprite.scale.setTo(1.2);
	},

	PhysicsManager: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.checkCollision.down = false;
		// this.world.enableBody = true;
	},

	ready: function () {
		// TODO
		// this.stopBGM();
		// this.playBGM();
		this.HUD.startGame();
	},

	playBGM: function () {
		var s = this.M.SE;
		if (s.isPlaying('Stage_1')) return;
		s.play('Stage_1',{isBGM:true,loop:true,volume:1});
	},

	stopBGM: function () {
		var s = this.M.SE;
		if (s.isPlaying('PlayBGM')) return;
		s.stop('currentBGM');
		s.stop('TitleBGM');
	},

	start: function () {
		this.GM.isPlaying = true;
	},

	clear: function () {
		this.GM.isPlaying = false;
		this.HUD.showClear();
		// this.M.SE.play('CloseSE'); // TODO
		this.time.events.add(1500, function () {
			this.HUD.showToResult();
			this.endInput('Result');
		}, this);
	},

	gameOver: function () {
		this.GM.isPlaying = false;
		this.HUD.showGameOver();
		// this.M.SE.play('CloseSE'); // TODO
		this.time.events.add(1500, function () {
			this.HUD.showToBack();
			this.endInput('Title');
		}, this);
	},

	endInput: function (nextScene) {
		this.game.input.onDown.add(function () {
			this.M.NextScene(nextScene);
		}, this);
	},

	render: function () {
		// this.game.debug.body(this.Paddle);
		// this.game.debug.body(this.Ball);
	},

	test: function () {
		if (__ENV!='prod') {
			this.game.debug.font='40px Courier';
			this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver, this);
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(this.clear, this);
			this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
		}
	},
};
