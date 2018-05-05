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
			BallInfo: {
				standardSpeedY: -400,
				standardSpeedRangeX: 100,
				maxSpeedX: 1200,
				minSpeedX: -1200,
				penetrateMaxSpeedY: -1200,
				penetrateMinSpeedY: -800,
			},
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
		var speed = 0;
		var penetrateRange = this.GM.ballPenetrateRange*.5;
		var BallInfo = this.GM.BallInfo;
		if (ball.x < paddle.x-penetrateRange) {
			ball.penetrate = false;
			diff = paddle.x - ball.x;
			speed = -10 * diff;
			ball.body.velocity.x = Phaser.Math.clamp(speed,BallInfo.minSpeedX,BallInfo.maxSpeedX);
			var speedY = (ball.body.velocity.y + BallInfo.standardSpeedY) * .5;
			ball.body.velocity.y = speedY;
		} else if (ball.x > paddle.x+penetrateRange) {
			ball.penetrate = false;
			diff = ball.x - paddle.x;
			speed = 10 * diff;
			ball.body.velocity.x = Phaser.Math.clamp(speed,BallInfo.minSpeedX,BallInfo.maxSpeedX);
			var speedY = (ball.body.velocity.y + BallInfo.standardSpeedY) * .5;
			ball.body.velocity.y = speedY;
		} else {
			ball.penetrate = true;
			var rangeX = BallInfo.standardSpeedRangeX;
			ball.body.velocity.x = this.rnd.between(-rangeX, rangeX);
			ball.body.velocity.y = this.rnd.between(BallInfo.penetrateMinSpeedY, BallInfo.penetrateMaxSpeedY);
		}
	},

	ballHitBrick: function (ball, brick) {
		brick.kill();
		var lives = this.Bricks.countLiving();
		this.HUD.changeLives(lives);
		if (lives <= 250) { // TODO del
		// if (this.Bricks.countLiving() <= this.GM.CharInfo.clearCount) {
			console.log("Clear");
		}
	},

	BgContainer: function () {
		// TODO
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
		// this.HUD.startGame();
		this.start(); // TODO del
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

	gameOver: function () {
		this.GM.isPlaying = false;
		this.HUD.showGameOver();
		// this.M.SE.play('CloseSE'); // TODO
		this.time.events.add(1500, function () {
			// this.M.SE.play('OpenSE'); // TODO
			this.ResultContainer();
		}, this);
	},

	//////////////////////////////////////////////////////////////////////////////////
	ResultContainer: function () {
		this.M.S.genDialog('Dialog',{
			onComplete:this.openedResult,
		}).tweenShow();
	},

	openedResult: function () {
		var x = this.world.centerX;
		var y = this.world.centerY;
		this.genResultTextSprite(x,y-90,'結果発表');
		this.genResultTextSprite(x,y+40,'レベル: '+this.GM.curLevel); // -300
		this.genResultTextSprite(x,y+140,'スコア: '+this.GM.score); // -300
		var marginX = 500;
		this.genResultLabel(x-marginX,y+350,'もう一度プレイ',function () {
			this.M.NextScene('Play');
		},600);
		this.genResultLabel(x,y+350,'結果をツイート',this.tweet,800);
		this.genResultLabel(x+marginX,y+350,'タイトルにもどる',function () {
			this.M.NextScene('Title');
		},1000);
	},

	genResultTextSprite: function (x,y,text) {
		var textSprite = this.M.S.genText(x,y,text,this.BaseTextStyle(80));
		textSprite.setScale(0,0);
		textSprite.addTween('popUpB',{duration:800});
		textSprite.startTween('popUpB');
	},

	genResultLabel: function (x,y,text,func,delay) {
		var label = this.M.S.BasicGrayLabel(x,y,func,text,this.BaseTextStyle(50),{tint:this.M.getConst('MAIN_TINT')});
		label.setScale(0,0);
		label.addTween('popUpB',{duration:800,delay:delay});
		label.startTween('popUpB');
	},

	tweet: function () {
		// TODO
		var emoji = '🌟❤🌟❤🌟';
		var text = '『'+this.M.getConst('GAME_TITLE')+'』で遊んだよ！\n'
					+emoji+'\n'
					+emoji+'\n';
		var hashtags = ',';
		this.M.H.tweet(text,hashtags,location.href);
	},
	//////////////////////////////////////////////////////////////////////////////////

	BaseTextStyle: function (fontSize) {
		return {
			fontSize: fontSize||50,
			fill: this.M.getConst('MAIN_TEXT_COLOR'),
			stroke: this.M.getConst('WHITE_COLOR'),
			strokeThickness: 15,
			multipleStroke: this.M.getConst('MAIN_TEXT_COLOR'),
			multipleStrokeThickness: 10,
		};
	},

	render: function () {
		this.game.debug.body(this.Paddle);
		this.game.debug.body(this.Ball);
		// for (var key in this.Enemys.children) this.game.debug.body(this.Enemys.children[key]);
	},

	test: function () {
		if (__ENV!='prod') {
			this.game.debug.font='40px Courier';
			this.game.debug.lineHeight=100;
			// this.input.keyboard.addKey(Phaser.Keyboard.B).onDown.add(function () {}, this);
			// if(this.M.H.getQuery('curDifficulty')) this.GM.curDifficulty = this.M.H.getQuery('curDifficulty');
		}
	},
};
