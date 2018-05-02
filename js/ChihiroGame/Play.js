BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GM = {};
		this.HUD = {};
		this.Bricks = {};
		this.Paddle = {};
	},

	create: function () {
		this.GameManager();
		this.BgContainer();
		this.PhysicsManager();
		this.BrickContainer();
		this.PaddleContainer();
		this.HUDContainer();
		this.ready();
		this.test();
	},

	GameManager: function () {
		this.GM = {
			isPlaying: false,
			score: 0,
		};
	},

	update: function () {
		if (this.GM.isPlaying) {
		}
	},

	/*
	timeManager: function () {
		if (this.GM.timer<0) {
			this.GM.timer = 1000;
		}
		this.GM.timer-=this.time.elapsed;
	},
	*/

	/*
	collisionManager: function () {
	},
	*/

	BgContainer: function () {
		// TODO
	},

	PhysicsManager: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.checkCollision.down = false;
		// this.world.enableBody = true;
	},

	BrickContainer: function () {
		this.Bricks = this.add.group();
		this.Bricks.enableBody = true;
		this.Bricks.physicsBodyType = Phaser.Physics.ARCADE;
		// TODO https://phaser.io/examples/v2/games/breakout
	},

	PaddleContainer: function () {
		// this.Paddle;
	},

	HUDContainer: function () {
		this.HUD = {
			self: this,
			showGameOver: null,
			changeScore: null,
			changeLevel: null,
			showWarningBoss: null,
			hideWarningBoss: null,
			showLevelUp: null,
		};
		this.genStartTextSprite();
		this.genScoreTextSprite();
		// this.genLevelTextSprite(); // TODO
		this.genGameOverTextSprite();
		// this.genLevelUpTextSprite(); // TODO
		// this.genWarningBossTextSprite(); // TODO
	},

	genStartTextSprite: function () {
		var baseText = 'スタート';
		var textStyle = this.BaseTextStyle(200);
		var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,textStyle);
		textSprite.setAnchor(.5);
		textSprite.setScale(0,0);
		textSprite.addTween('popUpB',{duration: 1000, delay: 500});
		textSprite.startTween('popUpB');
		this.M.T.onComplete(textSprite.multipleTextTween.popUpB, function () {
			this.time.events.add(1000, function () {
				textSprite.hide();
				this.start();
			}, this);
		});
	},

	genScoreTextSprite: function () {
		var baseText = 'スコア: ';
		var textStyle = this.BaseTextStyle(60);
		var textSprite = this.M.S.genText(10,10,baseText+this.GM.score,textStyle);
		textSprite.setAnchor(0,0);
		this.HUD.changeScore = function (val) {
			textSprite.changeText(baseText+val);
		};
	},

	genLevelTextSprite: function () {
		var baseText = 'レベル: ';
		var textStyle = this.BaseTextStyle(60);
		var textSprite = this.M.S.genText(this.world.width-10,10,baseText+this.GM.curLevel,textStyle);
		textSprite.setAnchor(1,0);
		this.HUD.changeLevel = function (val) {
			textSprite.changeText(baseText+val);
		};
	},

	genGameOverTextSprite: function () {
		var baseText = '終了！！';
		var textStyle = this.BaseTextStyle(200);
		var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,textStyle);
		textSprite.setAnchor(.5);
		textSprite.setScale(0,0);
		this.HUD.showGameOver = function () {
			textSprite.addTween('popUpB',{});
			textSprite.startTween('popUpB');
		};
	},

	genLevelUpTextSprite: function () {
		var textStyle = this.BaseTextStyle(150);
		var baseText = 'LEVEL ';
		var x = this.world.width+500;
		var y = this.world.centerY-200;
		var textSprite = this.M.S.genText(x,y,baseText+this.GM.curLevel,textStyle);
		textSprite.setAnchor(.5);
		textSprite.hide();
		textSprite.addTween('moveA',{xy:{x:this.world.centerX},tweenName:'move1',duration:1200});
		textSprite.addTween('moveA',{xy:{x:-500},tweenName:'move2',delay:1000,duration:1200});
		textSprite.chainTween('move1','move2');
		this.M.T.onComplete(textSprite.multipleTextTween.move2, function () {
			textSprite.move(x,y);
		});
		this.HUD.showLevelUp = function () {
			textSprite.changeText(baseText+this.self.GM.curLevel);
			textSprite.show();
			textSprite.startTween('move1');
		};
	},

	genWarningBossTextSprite: function () {
		var textStyle = this.BaseTextStyle(200);
		var baseText = 'BOSS';
		var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,textStyle);
		textSprite.setAnchor(.5);
		textSprite.hide();
		this.HUD.showWarningBoss = textSprite.show;
		this.HUD.hideWarningBoss = textSprite.hide;
	},

	ready: function () {
		return; // TODO
		this.stopBGM();
		this.playBGM();
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

	renderT: function () {
		// this.game.debug.body(this.Player);
		// for (var key in this.Enemys.children) this.game.debug.body(this.Enemys.children[key]);
		// for (var key in this.EnemysWeapon.bullets.children) this.game.debug.body(this.EnemysWeapon.bullets.children[key]);
		// for (var key in this.SpecialEnemysWeapon.bullets.children) this.game.debug.body(this.SpecialEnemysWeapon.bullets.children[key]);
		// this.game.debug.pointer(this.game.input.activePointer);
	},

	test: function () {
		if (__ENV!='prod') {
			this.game.debug.font='40px Courier';
			this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.B).onDown.add(function () {}, this);
			if(this.M.H.getQuery('curDifficulty')) this.GM.curDifficulty = this.M.H.getQuery('curDifficulty');
			this.stage.backgroundColor = '#333333';
		}
	},
};
