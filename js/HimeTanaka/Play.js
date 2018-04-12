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
		this.BtnContainer();
		this.HUDContainer();
		this.InputManager();
		this.CameraManager();
		this.ready();
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

	collideObstacle: function (player, obstacle) {
		// player.kill();
		if (obstacle.tag=='goal') return this.gameOver();
		this.M.SE.play('Hit');
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
		this.world.setBounds(0, this.GC.obstacleY, this.world.width, (this.GC.obstacleY * -1 + this.world.height));
		this.camera.follow(this.Player);
	},

	BgContainer: function () {
		this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
		this.genStartCharSprite();
		this.genClaspSprite();
	},

	genStartCharSprite: function () {
		var sprite = this.add.sprite(this.world.width,this.world.height,'Hime_1');
		sprite.anchor.setTo(1);
	},

	genClaspSprite: function () {
		var claspSprite = this.M.S.genBmpSprite(this.world.centerX,this.world.centerY+200,300,100,this.M.getConst('WHITE_COLOR'));
		claspSprite.anchor.setTo(.5);
		this.physics.arcade.enable(claspSprite);
		claspSprite.body.enable = true;
		claspSprite.body.immovable = true;
		this.Clasp = claspSprite;
		var shadowSprite = this.add.sprite(claspSprite.x+10, claspSprite.y+10, claspSprite.key);
		shadowSprite.anchor.setTo(.5);
		shadowSprite.tint = 0x000000;
		shadowSprite.alpha = .2;
		this.world.bringToTop(claspSprite);
	},

	BtnContainer: function () {
		this.genBackBtnSprite();
	},

	genBackBtnSprite: function () {
		var confirmDialog = this.M.S.BasicConfirmDialog({
			tint: this.M.getConst('SUB_TINT'),
			x: this.GC.cameraCenterPos.x,
			y: this.GC.cameraCenterPos.y,
			TFunc: function () {
				this.M.NextScene('Title');
			},
			duration: 800,
			message: '本当に戻りますか？',
		});
		var text = 'タイトルに戻る';
		var label = this.M.S.BasicGrayLabel(this.world.centerX,this.world.height-80,function () {
			confirmDialog.tweenShow();
		},text,this.StaticBaseTextStyle(),{tint:this.M.getConst('SUB_TINT')});
	},

	ObstaclesContainer: function () {
		this.Obstacles = this.add.group();
		for (var key in this.GC.LevelInfo.obstacles) {
			var objectType = this.GC.LevelInfo.obstacles[key];
			switch (objectType) {
				case 1: this.genHorizontalTweenObj(0,false); break;
				case 2: this.genDoubleHorizontalTweenObj(); break;
				case 3: this.genRotationObj(); break;
				case 4: this.genDoubleRotationObj(); break;
				case 5: this.genHorizontalChDuTweenObj(); break;
				case 6: this.genDoubleHorizontalChDuTweenObj(); break;
				case 7: this.genRndHorizontalTweenObj(); break;
				case 100: this.genGoalObj(); break;
				default: this.genSpaceObj();
			}
		}
	},

	genSpaceObj: function () {
		this.GC.obstacleY-=300;
	},

	genHorizontalTweenObj: function (x,rndFlag) {
		var imgKey = rndFlag ? this.GC.LevelInfo.imgKeyRHT : this.GC.LevelInfo.imgKeyHT;
		var sprite = this.add.sprite(x||0,this.GC.obstacleY,imgKey);
		sprite.anchor.setTo(.5);
		this.physics.arcade.enable(sprite);
		this.setBodySize(sprite);
		if (x) sprite.scale.setTo(-1,1);
		this.Obstacles.add(sprite);
		var tween = this.M.T.moveC(sprite,{xy:{x:this.world.width-sprite.x},duration:1500});
		tween.onLoop.add(function () {
			sprite.scale.setTo(sprite.scale.x*-1,1);
			if (rndFlag) tween.updateTweenData('duration',this.rnd.integerInRange(500,1500));
		},this);
		tween.start();
		this.GC.obstacleY-=this.world.centerY;
	},

	genHorizontalChDuTweenObj: function (x) {
		var sprite = this.add.sprite(x||0,this.GC.obstacleY,this.GC.LevelInfo.imgKeyHT);
		sprite.anchor.setTo(.5);
		this.physics.arcade.enable(sprite);
		this.setBodySize(sprite);
		if (x) sprite.scale.setTo(-1,1);
		this.Obstacles.add(sprite);
		var tween = this.M.T.moveC(sprite,
			{xy:{x:this.world.width-sprite.x},
			duration:1500});
		var durations = [500,500,1800,1000,1500,800];
		var currentDuration = 0;
		tween.onLoop.add(function () {
			if (currentDuration == durations.length) currentDuration = 0;
			tween.updateTweenData('duration',durations[currentDuration]);
			sprite.scale.setTo(sprite.scale.x*-1,1);
			currentDuration++;
		},this);
		tween.start();
		this.GC.obstacleY-=this.world.centerY;
	},

	genDoubleHorizontalTweenObj: function () {
		this.genHorizontalTweenObj(0,false);
		this.GC.obstacleY+=this.world.centerY-150;
		this.genHorizontalTweenObj(this.world.width,false);
	},

	genDoubleHorizontalChDuTweenObj: function () {
		this.genHorizontalChDuTweenObj(0);
		this.GC.obstacleY+=this.world.centerY-150;
		this.genHorizontalChDuTweenObj(this.world.width);
	},

	genRndHorizontalTweenObj: function () {
		this.genHorizontalTweenObj(0, true);
	},

	genRotationObj: function () {
		this.GC.obstacleY-=200;
		var rndNum = this.rnd.integerInRange(1,4);
		var pivotMargin = 280;
		var imgKey = this.GC.LevelInfo.imgKeyR;
		for (var i=0;i<2;i++) {
			for (var j=0;j<2;j++) {
				if (i+j*2+1==rndNum) continue;
				var sprite = this.add.sprite(this.world.centerX,this.GC.obstacleY,imgKey);
				sprite.pivot.x = pivotMargin*2*i-pivotMargin;
				sprite.pivot.y = pivotMargin*2*j-pivotMargin;
				sprite.anchor.set(.5);
				this.physics.arcade.enable(sprite);
				this.setBodySize(sprite);
				sprite.postUpdate = function () {
					this.rotation += 0.02;
				};
				this.Obstacles.add(sprite);
			}
		}
		this.GC.obstacleY-=(this.world.centerY+200);
	},

	genDoubleRotationObj: function () {
		this.GC.obstacleY-=300;
		var rndNum = this.rnd.integerInRange(1,4);
		var pivotMargin = 280;
		var imgKey = this.GC.LevelInfo.imgKeyR;
		for (var k=0;k<2;k++) {
			for (var i=0;i<2;i++) {
				for (var j=0;j<2;j++) {
					if (i+j*2+1==rndNum) continue;
					var sprite = this.add.sprite(this.world.centerX+600*k-300,this.GC.obstacleY,imgKey);
					sprite.pivot.x = pivotMargin*2*i-pivotMargin;
					sprite.pivot.y = pivotMargin*2*j-pivotMargin;
					sprite.anchor.set(.5);
					this.physics.arcade.enable(sprite);
					this.setBodySize(sprite);
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
		this.GC.obstacleY-=(this.world.centerY+300);
	},

	genGoalObj: function () {
		var sprite = this.add.sprite(this.world.centerX,this.GC.obstacleY,'Hime_1');
		sprite.anchor.setTo(.5);
		sprite.tag = 'goal';
		this.physics.arcade.enable(sprite);
		sprite.body.setCircle(100);
		this.Obstacles.add(sprite);
		this.GC.obstacleY-=this.world.centerY;
	},

	setBodySize: function (sprite) {
		var offset = 30;
		sprite.body.setSize(sprite.width-offset*2,sprite.height-offset*2,offset,offset);
	},

	PlayerContainer: function () {
		var playerSprite = this.M.S.genSprite(this.world.centerX,this.world.centerY,'Nikuman_1');
		playerSprite.anchor.setTo(.5);
		this.physics.arcade.enable(playerSprite);
		// playerSprite.body.enable = true;
		playerSprite.body.setCircle(80,20,10);
		// playerSprite.checkWorldBounds = true;
		// playerSprite.outOfBoundsKill = true;
		playerSprite.body.collideWorldBounds = true;
		// playerSprite.events.onKilled.add(this.OnKilledPlayer,this);
		var self = this;
		playerSprite.jump = function () {
			self.M.SE.play('Jump',{volume:2});
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
		if (this.game.device.touch) {
			var baseText = 'はおー！\n肉まんを上のヒメまで届けてね！\nタッチしてスタートだよー！';
		} else {
			var baseText = 'はおー！\n肉まんを上のヒメまで届けてね！\nクリックしてスタートだよー！';
		}
		var textSprite = this.M.S.genText(this.world.centerX,this.world.height-270,baseText,HUD.textStyle);
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

	ready: function () {
		this.stopBGM();
		this.playBGM();
	},

	playBGM: function () {
		var s = this.M.SE;
		if (s.isPlaying('PlayBGM')) return;
		s.play('PlayBGM',{isBGM:true,loop:true,volume:1});
	},

	stopBGM: function () {
		var s = this.M.SE;
		if (s.isPlaying('PlayBGM')) return;
		s.stop('currentBGM');
		s.stop('TitleBGM');
	},

	gameOver: function () {
		this.GC.isPlaying = false;
		this.Player.body.gravity.y = 0;
		this.Player.body.velocity.y = 0;
		this.HUD.showGameOver();
		this.GC.cameraCenterPos.y += this.camera.y;
		this.M.SE.play('Clear');
		this.time.events.add(1500, function () {
			this.ResultContainer();
			this.M.SE.play('Gong');
		}, this);
	},

	ResultContainer: function () {
		this.M.S.genDialog('Dialog',{
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
		this.M.S.genText(x,y-570,'結果発表',this.M.H.mergeJson({fontSize:80},this.StaticBaseTextStyle()));
		// TODO result text
		this.genRestartLabel(x,y+320,textStyle,{duration:800,delay:600},tint);
		this.genTweetLabel(x,y+455,textStyle,{duration:800,delay:800},tint);
		this.genBackLabel(x,y+580,textStyle,{duration:800,delay:1000},tint);
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
		var hashtags = 'ヒメゲー,田中ゲー';
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
				var velocity = this.M.H.getQuery('posTest');
				this.collisionManager = function () {};
				this.Player.jump = function () {this.body.velocity.y = -velocity;};
			}
		}
	},
};
