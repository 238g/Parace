BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GC = null;
		this.Player = null;
		this.Obstacles = null;
		this.Clasp = null;
		this.HUD = null;
		this.world.setBounds(0, 0, this.game.width, this.game.height);
	},

	create: function () {
		this.GameController();
		this.BgContainer();
		this.PhysicsManager();
		this.ObstaclesContainer();
		this.PlayerContainer();
		this.HUDContainer();
		this.InputManager();
		this.CameraManager();
		this.test();
	},

	GameController: function () {
		var currentLevel = this.M.getGlobal('currentLevel');
		this.GC = {
			isPlaying: false,
			timeCounter: 0,
			timer: 0,
			cameraCenterPos: {x:this.world.centerX,y:this.world.centerY},
			currentLevel: currentLevel,
			LevelInfo: this.M.getConf('LevelInfo')[currentLevel],
			obstacleY: 0,
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
			this.GC.timer++;
			this.HUD.changeTimerText(this.GC.timer);
		}
	},

	collisionManager: function () {
		this.physics.arcade.overlap(this.Player,this.Obstacles,this.collideObstacle,null,this);
		this.physics.arcade.collide(this.Player,this.Clasp);
	},

	collideObstacle: function (player/*, obstacle*/) {
		// player.kill();
		player.reset(this.GC.cameraCenterPos.x,this.GC.cameraCenterPos.y);
		this.camera.shake(.05,200,true,Phaser.Camera.SHAKE_HORIZONTAL);
	},

	InputManager: function () {
		this.time.events.add(800, function () {
			this.game.input.onDown.addOnce(this.start, this);
		}, this);
		this.game.input.onDown.add(function (pointer) {
			if (this.GC.isPlaying) this.Player.jump();
		}, this);
	},

	CameraManager: function () {
		this.world.setBounds(0, this.GC.obstacleY, 900, (this.GC.obstacleY * -1 + this.world.height));
		this.camera.follow(this.Player);
	},

	BgContainer: function () {
		this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
		this.genClaspSprite();
	},

	genClaspSprite: function () {
		var sprite = this.M.S.genBmpSprite(this.world.centerX,this.world.centerY+200,300,100,this.M.getConst('WHITE_COLOR'));
		sprite.anchor.setTo(.5);
		this.physics.arcade.enable(sprite);
		sprite.body.enable = true;
		sprite.body.immovable = true;
		this.Clasp = sprite;
	},

	ObstaclesContainer: function () {
		this.Obstacles = this.add.group();
		for (var key in this.GC.LevelInfo.obstacles) {
			var objectType = this.GC.LevelInfo.obstacles[key];
			console.log(objectType); // TODO del
			switch (objectType) {
				case 1: this.genHorizontalTweenOB(); break;
				case 2: this.genDoubleHorizontalTweenOB(); break;
				case 3: this.genRotationOB(); break;
				case 4: this.genDoubleRotationOB(); break;
				case 5: this.genHorizontalChDuTweenOB(); break;
				case 100: this.genGoalOB(); break;
				default: this.genSpaceOB();
			}
		}
	},

	genSpaceOB: function () {
		this.GC.obstacleY-=this.world.centerY;
	},

	genHorizontalTweenOB: function (x) {
		var sprite = this.M.S.genSprite(x||0,this.GC.obstacleY,'Player');
		sprite.anchor.setTo(.5);
		this.physics.arcade.enable(sprite);
		sprite.body.enable = true;
		this.Obstacles.add(sprite);
		this.M.T.moveC(sprite,{xy:{x:this.world.width-sprite.x},duration:1500}).start();
		this.GC.obstacleY-=this.world.centerY;
	},

	genHorizontalChDuTweenOB: function () {
		var sprite = this.M.S.genSprite(0,this.GC.obstacleY,'Player');
		sprite.anchor.setTo(.5);
		this.physics.arcade.enable(sprite);
		sprite.body.enable = true;
		this.Obstacles.add(sprite);
		var tween = this.M.T.moveC(sprite,
			{xy:{x:this.world.width},
			duration:1500});
		var durations = [500,500,1800,1000,1500,800];
		var currentDuration = 0;
		tween.onLoop.add(function () {
			if (currentDuration == durations.length) currentDuration = 0;
			tween.updateTweenData('duration',durations[currentDuration]);
			currentDuration++;
		},this);
		tween.start();
		this.GC.obstacleY-=this.world.centerY;
	},

	genDoubleHorizontalTweenOB: function () {
		this.genHorizontalTweenOB();
		this.GC.obstacleY+=this.world.centerY; // TODO think...
		this.genHorizontalTweenOB(this.world.width);
	},

	genRotationOB: function () {
		// TODO TESTrotation
	},

	genDoubleRotationOB: function () {
		// TODO TESTdoubleRotation
	},

	genGoalOB: function () {

	},

	TESTrotation: function () {
		var rndNum = this.rnd.integerInRange(1,4);
		for (var i=0;i<2;i++) {
			for (var j=0;j<2;j++) {
				if (i+j*2+1==rndNum) continue;
				// var x = this.world.centerX+400*i-200;
				// var y = this.world.centerY+400*j-200;
				var x = this.world.centerX;
				var y = this.world.centerY;
				var sprite = this.add.sprite(x,y,'Player');
				sprite.scale.setTo(.5);
				sprite.pivot.x = 1000*i-500;
				// sprite.pivot.x = 500*i-250;
				sprite.pivot.y = 1000*j-500;
				// sprite.pivot.y = 500*j-250;
				sprite.anchor.set(.5);
				sprite.Utype='obstacle';
				sprite.postUpdate = function () {
					this.rotation += 0.02;
				};
				this.Obstacles.add(sprite);
			}
		}
	},

	TESTdoubleRotation: function () {
		var rndNum = this.rnd.integerInRange(1,4);
		for (var k=0;k<2;k++) {
			for (var i=0;i<2;i++) {
				for (var j=0;j<2;j++) {
					if (i+j*2+1==rndNum) continue;
					// var x = this.world.centerX+400*i-200;
					// var y = this.world.centerY+400*j-200;
					// var x = this.world.centerX+300*k-150;
					var x = this.world.centerX+600*k-300;
					var y = this.world.centerY;
					var sprite = this.add.sprite(x,y,'Player');
					sprite.scale.setTo(.5);
					sprite.pivot.x = 1000*i-500;
					// sprite.pivot.x = 500*i-250;
					sprite.pivot.y = 1000*j-500;
					// sprite.pivot.y = 500*j-250;
					sprite.anchor.set(.5);
					sprite.Utype='obstacle';
					if (k==0) {
						sprite.postUpdate = function () {
							this.rotation -= 0.02;
						};
					} else {
						sprite.postUpdate = function () {
							this.rotation += 0.02;
						};
					}
					this.Obstacles.add(sprite);
				}
			}
			if (rndNum%2==0) {
				rndNum--;
			} else {
				rndNum++;
			}
		}
	},

	PlayerContainer: function () {
		var playerSprite = this.M.S.genSprite(this.world.centerX,this.world.centerY,'Player');
		playerSprite.anchor.setTo(.5);
		this.physics.arcade.enable(playerSprite);
		playerSprite.body.enable = true;
		playerSprite.body.setCircle(100, 90, 90); // TODO
		// playerSprite.checkWorldBounds = true;
		// playerSprite.outOfBoundsKill = true;
		playerSprite.body.collideWorldBounds = true;
		// playerSprite.events.onKilled.add(this.OnKilledPlayer,this);
		playerSprite.jump = function () {
			playerSprite.body.velocity.y = -1000;
		};
		this.Player = playerSprite;
	},

	// OnKilledPlayer: function (/*playerSprite*/) {
		// this.gameOver();
	// },

	HUDContainer: function () {
		this.HUD = {
			changeTimerText:null,
			showGameOver:null,
			textStyle: this.StaticBaseTextStyle(),
		};
		this.genTimerTextSprite(this.HUD);
		this.genStartTextSprite(this.HUD);
		this.genGameOverTextSprite(this.HUD);
	},

	genTimerTextSprite: function (HUD) {
		var baseText = 'タイム: ';
		var textSprite = this.M.S.genText(50,50,baseText+this.GC.timeCounter,HUD.textStyle);
		textSprite.setAnchor(0,0);
		HUD.changeTimerText = function (val) {
			textSprite.changeText(baseText+val);
		};
		HUD.score = textSprite;
		textSprite.fixedToCamera = true;
		textSprite.multipleTextSprite.fixedToCamera = true;
	},

	genStartTextSprite: function (HUD) {
		var baseText = 'タッチしてスタート！';
		var textSprite = this.M.S.genText(this.world.centerX,this.world.height-50,baseText,HUD.textStyle);
		textSprite.setAnchor(.5);
	},

	genGameOverTextSprite: function (HUD) {
		var baseText = 'クリア！！';
		var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,HUD.textStyle);
		textSprite.setAnchor(.5);
		textSprite.setScale(0,0);
		HUD.showGameOver = function () {
			textSprite.addTween('popUpB',{scale:{x:2,y:2}});
			textSprite.startTween('popUpB');
		};
		textSprite.fixedToCamera = true;
		textSprite.multipleTextSprite.fixedToCamera = true;
	},

	start: function () {
		this.GC.isPlaying = true;
		this.Player.body.gravity.y = 3000;
	},

	// TODO startBGM

	stopBGM: function () {
		this.M.SE.stop('currentBGM');
		this.M.SE.stop('TitleBGM');
	},

	gameOver: function () {
		this.GC.isPlaying = false;
		this.HUD.showGameOver();
		this.GC.cameraCenterPos.y += this.camera.y;
		this.time.events.add(2500, function () {
			this.ResultContainer();
		}, this);
	},

	ResultContainer: function () {
		// this.M.SE.play('Result',{volume:.5}); // TODO
		this.M.S.genDialog('Dialog_1',{
			tint: this.M.getConst('SUB_TINT'),
			onComplete:this.openedResult,
			x: this.GC.cameraCenterPos.x,
			y: this.GC.cameraCenterPos.y,
		}).tweenShow();
	},

	openedResult: function () {
		var x = this.world.centerX;
		var y = this.GC.cameraCenterPos.y;
		var textStyle = this.StaticBaseTextStyle();
		var tint = this.M.getConst('MAIN_TINT');
		this.M.S.genText(x,y-600,'結果発表',this.M.H.mergeJson({fontSize:80},this.StaticBaseTextStyle()));
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
		this.game.debug.body(this.Player);
		this.Obstacles.forEach(function (sprite) {
			this.game.debug.body(sprite);
		}, this);
		this.game.debug.body(this.Clasp);
		this.game.debug.cameraInfo(this.camera,32,32);
	},

	test: function () {
		if (__ENV!='prod') {
			if(this.M.H.getQuery('gameOver')) this.gameOver();
			this.game.debug.font='30px Courier';
			this.game.debug.lineHeight=30;
			if (this.M.H.getQuery('posTest')) {
				this.collisionManager = function () {};
				this.Player.jump = function () {this.body.velocity.y = -3000;};
			}
		}
	},
};
