BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GC = null;
		this.Player = null;
		this.Obstacles = null;
		this.HUD = null;
	},

	create: function () {
		this.GC = this.GameController();
		this.BgContainer();
		this.PhysicsManager();
		this.Obstacles = this.ObstaclesContainer();
		this.Player = this.PlayerContainer();
		this.HUD = this.HUDContainer();
		this.InputManager();
		this.CameraManager();
		this.ready();
		this.test();
	},

	GameController: function () {
		return {
			isPlaying: false,
			score: 0,
			timeCounter: 0,
			leftTime: 60,
		};
	},

	PhysicsManager: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.enableBody = true;
	},

	update: function () {
		if (this.GC.isPlaying) {
			this.timerManager();
			this.collisionManager();
		}
	},

	timerManager: function () {
		this.GC.timeCounter += this.time.elapsed;
		if (this.GC.timeCounter > 1000) {
			this.GC.timeCounter = 0;
			this.GC.leftTime--;
			// this.HUD.changeTimerText(this.GC.leftTime);
			console.log(this.GC.leftTime);
		}
		if (this.GC.leftTime <= 0) {
			this.gameOver();
		}
	},

	collisionManager: function () {
		// this.physics.arcade.overlap(this.EnemyFishGroup, this.GC.netBodySprite, this.castNet, null, this);
	},

	InputManager: function () {
		this.time.events.add(800, function () {
			this.game.input.onDown.addOnce(this.start, this);
		}, this);
		this.game.input.onDown.add(function (pointer) {
			if (this.GC.isPlaying) {
				// console.log(pointer);
				console.log(this.camera);
				this.Player.jump();
			}
		}, this);
	},

	CameraManager: function () {
		this.world.setBounds(0, -1000, 900, 2600); // TODO
		// this.world.setBounds(0, -5000, 900, 6600); // TODO
		this.camera.follow(this.Player);
	},

	BgContainer: function () {
		this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
	},

	ObstaclesContainer: function () {
		return {};
	},

	PlayerContainer: function () {
		var playerSprite = this.M.S.genSprite(this.world.centerX,this.world.centerY,'Player');
		playerSprite.anchor.setTo(.5);
		this.physics.arcade.enable(playerSprite);
		playerSprite.body.enable = true;
		playerSprite.body.setCircle(100, 90, 90); // TODO
		playerSprite.checkWorldBounds = true;
		playerSprite.outOfBoundsKill = true;
		playerSprite.events.onKilled.add(this.OnKilledPlayer,this);
		playerSprite.jump = function () {
			playerSprite.body.velocity.y = -1000;
		};
		return playerSprite;
	},

	OnKilledPlayer: function (/*playerSprite*/) {
		this.gameOver();
	},

	HUDContainer: function () {
		var HUD = {
			score:null,changeScore:null,
			showGameOver:null,
			textStyle: this.StaticBaseTextStyle(),
		};
		this.genScoreTextSprite(HUD);
		this.genStartTextSprite(HUD);
		this.genGameOverTextSprite(HUD);
		return HUD;
	},

	genScoreTextSprite: function (HUD) {
		var baseText = 'スコア: ';
		var textSprite = this.M.S.genText(this.world.width-50,50,baseText+this.GC.score,HUD.textStyle);
		textSprite.setAnchor(1,0);
		var self = this;
		HUD.changeScore = function (val) {
			textSprite.changeText(baseText+self.M.H.formatComma(val));
		};
		HUD.score = textSprite;
		// textSprite.fixedToCamera = true; // TODO
	},

	addScore: function (val) {
		this.GC.score += val;
		this.HUD.changeScore(this.GC.score);
	},

	genStartTextSprite: function (HUD) {
		var baseText = 'タッチしてスタート！';
		var textSprite = this.M.S.genText(this.world.centerX,this.world.height-50,baseText,HUD.textStyle);
		textSprite.setAnchor(.5);
	},

	genGameOverTextSprite: function (HUD) {
		var baseText = '終了！！';
		var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,HUD.textStyle);
		textSprite.setAnchor(.5);
		textSprite.setScale(0,0);
		var self = this;
		HUD.showGameOver = function () {
			textSprite.addTween('popUpB',{scale:{x:2,y:2}});
			textSprite.startTween('popUpB');
		};
	},

	ready: function () {
	},

	start: function () {
		this.GC.isPlaying = true;
		this.Player.body.gravity.y = 3000;
	},

	// startBGM

	stopBGM: function () {
		this.M.SE.stop('currentBGM');
		this.M.SE.stop('TitleBGM');
	},

	gameOver: function () {
		this.GC.isPlaying = false;
		this.HUD.showGameOver();
		this.time.events.add(2500, function () {
			this.ResultContainer();
		}, this);
	},

	ResultContainer: function () {
		// this.M.SE.play('Result',{volume:.5}); // TODO
		this.M.S.genDialog('Dialog_1',{
			tint: this.M.getConst('SUB_TINT'),
			onComplete:this.openedResult,
		}).tweenShow();
	},

	openedResult: function () {
		var x = this.world.centerX;
		var y = this.world.centerY;
		var textStyle = this.StaticBaseTextStyle();
		var tint = this.M.getConst('MAIN_TINT');
		this.M.S.genText(x,200,'結果発表',this.M.H.mergeJson({fontSize:80},this.StaticBaseTextStyle()));
		this.genRestartLabel(x,y+350,textStyle,{duration:800,delay:600},tint);
		this.genTweetLabel(x,y+475,textStyle,{duration:800,delay:800},tint);
		this.genBackLabel(x,y+600,textStyle,{duration:800,delay:1000},tint);
	},

	genRestartLabel: function (x,y,textStyle,tweenOption,tint) {
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			this.M.NextScene('Play');
		},'もう一度プレイ',textStyle,{tint:tint});
		label.setScale(0,0);
		label.addTween('popUpB',tweenOption);
		label.startTween('popUpB');
	},

	genTweetLabel: function (x,y,textStyle,tweenOption,tint) {
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			this.tweet();
		},'結果をツイート',textStyle,{tint:tint});
		label.setScale(0,0);
		label.addTween('popUpB',tweenOption);
		label.startTween('popUpB');
	},

	genBackLabel: function (x,y,textStyle,tweenOption,tint) {
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			this.M.NextScene('Title');
		},'タイトルにもどる',textStyle,{tint:tint});
		label.setScale(0,0);
		label.addTween('popUpB',tweenOption);
		label.startTween('popUpB');
	},

	tweet: function () {
		var emoji = '';
		for (var i=0;i<6;i++) {
			var rndNum = this.rnd.integerInRange(1,4);
			if (rndNum==1) {
				emoji += '👲';
			} else if (rndNum==2) {
				emoji += '🀄';
			} else {
				emoji += '🍜';
			}
		}
		var text = '『'+this.M.getConst('GAME_TITLE')+'』で遊んだよ！\n'
					+emoji+'\n'; // TODO
		var hashtags = '田中ゲー';
		this.M.H.tweet(text,hashtags,location.href);
	},

	StaticBaseTextStyle: function () {
		return {
			fill: this.M.getConst('MAIN_TEXT_COLOR'),
			stroke: this.M.getConst('WHITE_COLOR'),
			strokeThickness: 15,
			multipleStroke: this.M.getConst('MAIN_TEXT_COLOR'),
			multipleStrokeThickness: 10,
		};
	},

	render: function () {
		if (this.Player) this.game.debug.body(this.Player);
	},

	test: function () {
		if (__ENV!='prod') {
			if(this.M.H.getQuery('gameOver')) this.gameOver();
		}
	},
};
