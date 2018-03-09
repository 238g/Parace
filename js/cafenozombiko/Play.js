BasicGame.Play = function () {};

BasicGame.Play.prototype = {
	init: function () {
		this.GOP = {};
		this.TC = {};
		this.HUD = {};
	},

	create: function () {
		this.GOP = this.GameOption();
		this.TC = this.genTargetContainer();
		this.HUD = this.genHUDContainer();
		this.inputController();
		// this.soundController();
		this.start(); // TODO del
		// this.ready();
		this.test();
	},

	inputController: function () {
		this.game.input.onDown.add(function () {
			if (this.GOP.isPlaying) {
				this.game.global.SoundManager.play('Gunfire');
			}
		}, this);
	},

	soundController: function () {
		var s = this.game.global.SoundManager;
		s.stop('currentBGM');
		setTimeout(function () {
			s.stop('currentBGM');
			s.play({key:'MushroomsForest',isBGM:true,loop:true,volume:.8,}); // TODO change
		}, 500);
	},

	update: function () {
		if (this.GOP.isPlaying) {
			this.timeManager();
		}
	},

	timeManager: function () {
		this.GOP.timeCounter += this.time.elapsed;
		if (this.GOP.timeCounter > 1000) {
			this.GOP.timeCounter = 0;
			this.GOP.leftTime--;
			this.HUD.changeTime(this.GOP.leftTime);
		}
		if (this.GOP.leftTime <= 0) {
			this.gameOver();
		}
	},

	GameOption: function () {
		return {
			isPlaying: false,
			// isPlaying: true, // TODO del
			score: 0,
			leftTime: 30,
			timeCounter: 0,
			deviceBonusScore: this.game.device.desktop ? 1.2 : 1,
			bonusScore: 1,
		};
	},

	genTargetContainer: function () {
		var c = {};
		c.targetGroup = this.add.group();
		c.nuisanceGroup = this.add.group();
		c.particleGroup = this.add.group();
		// this.genParticle(c.particleGroup);
		this.createMultiple(c.targetGroup, 'MiniZombie');
		// Human score up
		this.createMultiple(c.nuisanceGroup, 'Takashi');
		var self = this;
		c.start = function () {
			self.time.events.repeat(100, 5, self.respawnTargetRndPos, self);
			self.time.events.loop(1100, self.respawnTargetRndPos, self);
			self.time.events.loop(500, self.respawnTargetRndPos, self);
			self.time.events.loop(800, self.respawnTargetRndPos, self);
			self.time.events.repeat(9000, 3, self.respawnNuisance, self);
		};
		return c;
	},

	createMultiple: function (group, keys) {
		group.inputEnableChildren = true;
		var quantity = (keys == 'MiniZombie') ? 50 : 2;
		group.createMultiple(quantity, keys, 0, false);
		group.children.forEach(function (target) {
			target.anchor.setTo(.5);
		}, this);
		group.onChildInputDown.add(function (target) {
			if (this.GOP.isPlaying) {
				target.damage(1);
				// this.fireParticle(target);
				this.GOP.score += target.score*this.GOP.bonusScore;
				this.HUD.changeScore(this.GOP.score);
			}
		}, this);
	},

	respawnTargetRndPos: function () {
		var target = this.TC.targetGroup.getFirstDead();
		if (target) {
			target.reset(this.world.randomX, this.world.randomY);
			var rndNum = this.rndReal(.1,2);
			target.scale.setTo(rndNum);
			this.setTargetScore(target);
			target.lifespan = rndNum*900+800;
		}
	},

	respawnNuisance: function () {
		var target = this.TC.nuisanceGroup.getFirstDead();
		if (target) {
			target.reset(this.world.randomX, this.world.randomY);
			this.setTargetScore(target);
			target.lifespan = this.rndInt(1500,3000);
		}
	},

	setTargetScore: function (target) {
		if (target.key == 'MiniZombie') {
			var a = target.scale.x;
			var b = a.toFixed(3);
			target.score = parseInt(10000*b*this.GOP.deviceBonusScore);
		} else {
			target.score = -5000;
		}
	},

	/*
	genParticle: function (group) {
		for (var i=0;i<5;i++) {
			var particle = this.add.emitter(0, 0, 20);
			particle.makeParticles('Particle');
			particle.setYSpeed(-150, 300);
			particle.setXSpeed(-150, 300);
			particle.gravity = 0;
			group.add(particle);
		}
	},
	*/

	/*
	fireParticle: function (target) {
		var particle = this.TC.particleGroup.getFirstDead();
		console.log(particle);
		if (particle) {
			particle.reset(target.x, target.y);
			particle.start(true, 800, null, 20);
		}
	},
	*/

	genHUDContainer: function () {
		var c = {score:null,gameover:null,};
		this.genScoreTextSprite(c);
		this.genTimeCounterTextSprite(c);
		this.genGameOverTextSprite(c);
		this.genPanelSprite(c);
		c.showGameOver = function () {
			// TODO panel
			c.score.move(c.gameover.x,c.gameover.y+200);
			c.score.show();
			c.gameover.show();
		};
		return c;
	},

	genScoreTextSprite: function (HUD) {
		var s = this.game.global.SpriteManager;
		var baseText = 'スコア: ';
		var textSprite = s.genText(this.world.centerX,50,baseText+this.GOP.score);
		HUD.changeScore = function (val) {
			textSprite.changeText(baseText+val);
		};
		HUD.score = textSprite;
	},

	genTimeCounterTextSprite: function (HUD) {
		var s = this.game.global.SpriteManager;
		var baseText = 'タイム: ';
		var textSprite = s.genText(120,50,baseText+this.GOP.leftTime);
		HUD.changeTime = function (val) {
			textSprite.changeText(baseText+val);
		};
	},

	genGameOverTextSprite: function (HUD) {
		var s = this.game.global.SpriteManager;
		var textSprite = s.genText(this.world.centerX,this.world.centerY-200,'ゲームオーバー');
		textSprite.hide();
		HUD.gameover = textSprite;
	},

	genPanelSprite: function () {
		// TODO
	},

	ready: function () {
		var textStyle = {
			fontSize:'100px',
			fill: '#000000',
			stroke:'#FFFFFF',
			strokeThickness: 10,
			multipleStroke:'#000000',
			multipleStrokeThickness: 10,
		};
		var s = this.game.global.SpriteManager;
		var t = this.game.global.TweenManager;
		var x = this.world.centerX;
		var y = this.world.centerY;
		var readyDuration = 800;
		var startDuration = 500;
		var readyTextSprite = s.genText(x,y-100,'レディー…',textStyle);
		readyTextSprite.setScale(0,0);
		t.popUpA(readyTextSprite,readyDuration).start();
		t.popUpA(readyTextSprite.multipleTextSprite,readyDuration).start();
		var startTextSprite = s.genText(x,y+100,'スタート',textStyle);
		startTextSprite.setScale(0,0);
		var tween = t.popUpA(startTextSprite,startDuration,false,readyDuration);
		t.onComplete(tween, function () {
			this.time.events.add(500, function () {
				readyTextSprite.hide();
				startTextSprite.hide();
				this.start();
			}, this);
		}, this);
		tween.start();
		t.popUpA(startTextSprite.multipleTextSprite,startDuration,false,readyDuration).start();
	},

	start: function () {
		this.GOP.isPlaying = true;
		this.TC.start();
	},

	gameOver: function () {
		this.GOP.isPlaying = false;
		this.time.events.removeAll();
		this.HUD.showGameOver();
		// TODO panel, backBtn,restartBtn,tweetBtn
	},

	rndReal: function (min, max) {
		return this.rnd.realInRange(min, max);
	},

	// dont use now
	rndInt: function (min, max) {
		return this.rnd.integerInRange(min, max);
	},

	test: function () {
		if (__ENV!='prod') {
			// if (getQuery('gameOver')) { this.Panel.hide();this.gameOver(); }
			this.GOP.leftTime = getQuery('time') || this.GOP.leftTime;
			// this.GC.vertical = getQuery('v') || this.GC.vertical;
		}
	},
};