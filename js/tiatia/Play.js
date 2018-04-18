BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GM = {};
		this.HUD = {};
		this.Player = {};
	},

	create: function () {
		this.GameManager();
		this.BgContainer();
		this.PlayerContainer();
		this.HUDContainer();
		this.ready();
		this.test();
	},

	GameManager: function () {
		this.GM = {
			isPlaying: false,
			respawnEnemyCountdown: 500,
			respawnEnemyCountdownTimer: 500,
		};
	},

	update: function () {
		this.respawnEnemy();
		// this.collisionManager();
	},

	respawnEnemy: function () {
		if (this.GM.respawnEnemyCountdownTimer<0) {
			this.GM.respawnEnemyCountdownTimer = this.GM.respawnEnemyCountdown;
			console.log('respawn from game level array');
		}
		this.GM.respawnEnemyCountdownTimer-=this.time.elapsed;
	},

	collisionManager: function () {
		// this.physics.arcade.overlap(this.Player.weapon.bullets, ---ENEMY---, this.hitBulletToEnemy);
	},

	hitBulletToEnemy: function (bullet/*, enemy*/) {
		bullet.kill();
	},

	BgContainer: function () {
		this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
	},

	PlayerContainer: function () {
		this.Player = this.add.sprite(this.world.centerX,this.world.centerY,'Player');
		this.Player.inputEnabled = true;
		this.Player.input.enableDrag(true);
		this.Player.weapon = this.genWeapon();
		/*
		this.Player.postUpdate = function () {
			this.weapon.fire();
			this.weapon.debug(50,50,true);
		};
		*/
	},

	genWeapon: function () {
		var weapon = this.add.weapon(40, 'Player');
		// weapon.setBulletFrames(0, 80, true);
		weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		weapon.bulletAngleOffset = 90;
		// weapon.bulletAngleVariance = 10;
		// weapon.bulletSpeedVariance = 200;
		weapon.bulletSpeed = 1000;
		weapon.fireRate = 200;
		weapon.autofire = true;
		weapon.trackSprite(this.Player, this.Player.width/2, 0, false);
		return weapon;
	},

	HUDContainer: function () {
		this.HUD = {
			self: this,
			showGameOver: null,
			changeScore: null,
		};
		// TODO level/boss text -> = alice round
		this.genScoreTextSprite();
		this.genGameOverTextSprite();
	},

	genScoreTextSprite: function () {
		var baseText = 'スコア: ';
		var textStyle = this.BaseTextStyle();
		textStyle.fontSize = 60;
		var textSprite = this.M.S.genText(150,600,baseText+0,textStyle);
		this.HUD.changeScore = function (val) {
			textSprite.changeText(baseText+val);
		};
	},

	genGameOverTextSprite: function () {
		var baseText = '終了！！';
		var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,this.BaseTextStyle());
		textSprite.setAnchor(.5);
		textSprite.setScale(0,0);
		this.HUD.showGameOver = function () {
			textSprite.addTween('popUpB',{scale:{x:2,y:2}});
			textSprite.startTween('popUpB');
		};
	},

	ready: function () {
		this.stopBGM();
		this.playBGM();
	},

	playBGM: function () {
		return; // TODO
		var s = this.M.SE;
		if (s.isPlaying('PlayBGM')) return;
		s.play('PlayBGM',{isBGM:true,loop:true,volume:1});
	},

	stopBGM: function () {
		return; // TODO
		var s = this.M.SE;
		if (s.isPlaying('PlayBGM')) return;
		s.stop('currentBGM');
		s.stop('TitleBGM');
	},

	start: function () {
		this.GM.isPlaying = true;
		this.startRound();
	},

	gameOver: function () {
		this.GM.isPlaying = false;
		this.HUD.showGameOver();
		// this.M.SE.play('Gong'); // TODO
		this.time.events.add(1500, function () {
			this.ResultContainer();
			// this.M.SE.play('Gong'); // TODO
		}, this);
	},

	ResultContainer: function () {
		this.M.S.genDialog('Dialog',{
			onComplete:this.openedResult,
		}).tweenShow();
	},

	openedResult: function () {
		var y = this.world.centerY;
		this.genResultTextSprite(y-500,'結果発表');
		this.genResultTextSprite(y-350,'モード: ');
		this.genResultTextSprite(y-220,'ダーツ: ');
		this.genResultTextSprite(y-90,'ターン: ');
		this.genResultTextSprite(y+40,'結果: ');
		this.genResultLabel(y+200,'もう一度プレイ',function () {
			this.M.NextScene('Play');
		},600);
		this.genResultLabel(y+350,'結果をツイート',this.tweet,800);
		this.genResultLabel(y+500,'タイトルにもどる',function () {
			this.M.NextScene('Title');
		},1000);
	},

	genResultTextSprite: function (y,text) {
		var textSprite = this.M.S.genText(this.world.centerX,y,text,this.BaseTextStyle(80));
		textSprite.setScale(0,0);
		textSprite.addTween('popUpB',{duration:800});
		textSprite.startTween('popUpB');
	},

	genResultLabel: function (y,text,func,delay) {
		var label = this.M.S.BasicGrayLabel(this.world.centerX,y,func,text,this.BaseTextStyle(50),{tint:this.M.getConst('MAIN_TINT')});
		label.setScale(0,0);
		label.addTween('popUpB',{duration:800,delay:delay});
		label.startTween('popUpB');
	},

	tweet: function () {
		var emoji = '';
		for (var i=0;i<6;i++) {
			var rndNum = this.rnd.integerInRange(1,7);
			switch (rndNum) {
				case 1: emoji += '⏰'; break;
				case 2: emoji += '🃏'; break;
				case 3: emoji += '♠'; break;
				case 4: emoji += '♣'; break;
				case 5: emoji += '♦'; break;
				case 6: emoji += '♥'; break;
				case 7: emoji += '🐰'; break;
			}
		}
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

	test: function () {
		if (__ENV!='prod') {
			this.game.debug.font='40px Courier';
			this.game.debug.lineHeight=100;
			if(this.M.H.getQuery('gameOver')) this.gameOver();
			this.stage.backgroundColor = '#333333';
		}
	},
};
