BasicGame.Play = function () {};

BasicGame.Play.prototype = {
	init: function () {
		this.GOP = {};
		this.TC = {};
		this.HUD = {};
	},

	create: function () {
		this.GOP = this.GameOption();
		this.genBgSprite();
		this.TC = this.genTargetContainer();
		this.HUD = this.genHUDContainer();
		this.inputController();
		this.soundController();
		this.ready();
		this.test();
	},

	genBgSprite: function () {
		var s = this.game.global.SpriteManager;
		var bgSprite = s.genSprite(-300,this.world.height,'Bg_1');
		bgSprite.anchor.setTo(0,1);
		bgSprite.scale.setTo(2);
	},

	inputController: function () {
		this.game.input.onDown.add(function () {
			if (this.GOP.isPlaying) {
				this.game.global.SoundManager.play({key:'Gunfire',volume:1.2,});
				var minusScore = (this.GOP.leftTime < 15) ? -10000 : -5000;
				this.GOP.score += minusScore;
				this.HUD.changeScore(this.GOP.score);
				this.addScoreEffect(minusScore);
			}
		}, this);
	},

	soundController: function () {
		var s = this.game.global.SoundManager;
		s.stop('currentBGM');
		setTimeout(function () {
			s.stop('currentBGM');
			s.play({key:'HappyBGM_2',isBGM:true,loop:true,volume:1.2,});
		}, 1800);
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
			score: 0,
			SEC30: 30,
			leftTime: 30,
			timeCounter: 0,
			deviceBonusScore: this.game.device.desktop ? 1.2 : 1,
			bonusScore: 1,
			SCORE_TEXT: 'すコア',
		};
	},

	genTargetContainer: function () {
		var c = {};
		c.targetGroup = this.add.group();
		c.nuisanceGroup = this.add.group();
		c.bonusGroup = this.add.group();
		c.particle = this.genParticle();
		this.createMultiple(c.targetGroup, 
			['MiniZombie_1','MiniZombie_2',
			'MiniZombie_1','MiniZombie_2',
			'MiniZombie_1','MiniZombie_2',
			'MiniZombie_1','MiniZombie_2',], 3);
		this.createMultiple(c.nuisanceGroup, 
			['Takashi','Zombiko_2',
			'Takashi','Zombiko_2',], 1);
		this.createMultiple(c.bonusGroup, 'Human', 1);
		var self = this;
		c.start = function () {
			self.time.events.repeat(100, 5, self.respawnTarget, self);
			self.time.events.loop(1100, self.respawnTarget, self);
			self.time.events.loop(500, self.respawnTarget, self);
			self.time.events.loop(800, self.respawnTarget, self);
			self.time.events.loop(1500, self.respawnTarget, self);
			self.time.events.loop(8000, self.respawnNuisance, self);
			self.time.events.add(self.rndInt(5,25)*1000, self.respawnNuisance, self);
			self.time.events.add(self.rndInt(5,25)*1000, self.respawnNuisance, self);
			self.time.events.add(self.rndInt(5,25)*1000, self.respawnNuisance, self);
			self.time.events.add(20000, self.respawnNuisance, self);
			self.time.events.add(20000, self.respawnNuisance, self);
			self.time.events.repeat(6000, 4, self.respawnBonus, self);
			self.time.events.add(self.rndInt(5,25)*1000, self.respawnBonus, self);
			self.time.events.add(self.rndInt(5,25)*1000, self.respawnBonus, self);
		};
		return c;
	},

	createMultiple: function (group, keys, quantity) {
		group.inputEnableChildren = true;
		group.createMultiple(quantity, keys);
		group.children.forEach(function (target) {
			target.anchor.setTo(.5);
			if (keys[0] == 'MiniZombie_1') {
				target.angle = this.rnd.angle();
			}
		}, this);
		group.onChildInputDown.add(this.damageTarget, this);
	},

	damageTarget: function (target) {
		if (this.GOP.isPlaying) {
			target.damage(1);
			switch (target.key) {
				case 'Human':
					this.game.global.SoundManager.play({key:'HumanVoice',volume:1,});
					this.GOP.bonusScore = 5;
					this.time.events.add(3000, function () {
						this.GOP.bonusScore = 1;
					}, this);
					break;
				case 'Takashi':
					this.game.global.SoundManager.play({key:'ZombieVoice_1',volume:1,});
					break;
				case 'Zombiko_2':
					this.game.global.SoundManager.play({key:'ZombieVoice_2',volume:1,});
					break;
				case 'MiniZombie_1':
				case 'MiniZombie_2':
					var rndNum = this.rndInt(0,20);
					var keyNum = ('0'+rndNum).slice(-2);
					this.game.global.SoundManager.play({key:'MiniZombieVoice_'+keyNum,volume:.5,});
					this.fireParticle(target);
					break;
			}
			var addScore = target.score*this.GOP.bonusScore;
			this.GOP.score += addScore;
			this.addScoreEffect(addScore);
			this.HUD.changeScore(this.GOP.score);
		}
	},

	respawnTarget: function () {
		var target = this.TC.targetGroup.getFirstDead();
		if (target) {
			target.reset(this.world.randomX, this.world.randomY);
			var rndNum = this.rndReal(.1,2);
			target.scale.setTo(rndNum);
			this.setTargetScore(target);
			target.lifespan = rndNum*900+1000;
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

	respawnBonus: function () {
		var target = this.TC.bonusGroup.getFirstDead();
		if (target) {
			target.reset(this.world.randomX, this.world.randomY);
			this.setTargetScore(target);
			target.lifespan = 3000;
		}
	},

	setTargetScore: function (target) {
		switch (target.key) {
			case 'MiniZombie_1':
			case 'MiniZombie_2':
				var a = target.scale.x;
				var b = a.toFixed(3);
				target.score = parseInt(10000*b*this.GOP.deviceBonusScore);
				break;
			case 'Human':
				target.score = 10000;
				break;
			default:
				target.score = -50000;
				break;
		}
	},

	genParticle: function () {
		var particle = this.add.emitter(0, 0, 1000);
		particle.makeParticles('Particle');
		particle.setYSpeed(-300, 300);
		particle.setXSpeed(-300, 300);
		particle.gravity = 0;
		return particle;
	},

	fireParticle: function (target) {
		var particle = this.TC.particle;
		particle.x = target.x;
		particle.y = target.y;
		particle.explode(500, 30);
	},

	genHUDContainer: function () {
		var c = {score:null,gameover:null,textStyle:null,};
		c.textStyle = {
			fill: '#a0522d',
			stroke:'#FFFFFF',
			strokeThickness: 10,
			multipleStroke:'#a0522d',
			multipleStrokeThickness: 10,
		};
		this.genPanelSprite(c);
		this.genScoreTextSprite(c);
		this.genTimeCounterTextSprite(c);
		this.genGameOverTextSprite(c);
		return c;
	},

	genScoreTextSprite: function (HUD) {
		var s = this.game.global.SpriteManager;
		var baseText = this.GOP.SCORE_TEXT+': ';
		var textSprite = s.genText(this.world.centerX,50,baseText+this.GOP.score,HUD.textStyle);
		HUD.changeScore = function (val) {
			textSprite.changeText(baseText+val);
		};
		HUD.score = textSprite;
	},

	genTimeCounterTextSprite: function (HUD) {
		var s = this.game.global.SpriteManager;
		var baseText = 'タイむ: ';
		var textSprite = s.genText(120,50,baseText+this.GOP.leftTime,HUD.textStyle);
		HUD.changeTime = function (val) {
			textSprite.changeText(baseText+val);
		};
	},

	genGameOverTextSprite: function (HUD) {
		var s = this.game.global.SpriteManager;
		var textSprite = s.genText(this.world.centerX,400,'げぇむオーバぁ～',HUD.textStyle);
		textSprite.hide();
		textSprite.setTextStyle({fontSize:'80px'})
		HUD.gameover = textSprite;
	},

	genPanelSprite: function (HUD) {
		var t = this.game.global.TweenManager;
		var s = this.game.global.SpriteManager;
		var panelSprite = s.genSprite(this.world.centerX, this.world.centerY, 'greySheet', 'grey_panel');
		panelSprite.scale.setTo(0);
		panelSprite.anchor.setTo(.5);
		panelSprite.tint = 0xfaebd7;
		panelSprite.hide();
		var restartBtnSprite = this.genRestartBtnSprite();
		var tweetBtnSprite = this.genTweetBtnSprite();
		var backToTopBtnSprite = this.genBackToTopBtnSprite();
		var tween = t.popUpA(panelSprite, 500, {x:8,y:13});
		t.onComplete(tween, function () {
			HUD.score.move(HUD.gameover.x,HUD.gameover.y+200);
			HUD.score.show();
			HUD.gameover.show();
			restartBtnSprite.allShow();
			tweetBtnSprite.allShow();
			backToTopBtnSprite.allShow();
		}, this);
		HUD.showGameOver = function () {
			panelSprite.show();
			tween.start();
		};
		return panelSprite;
	},

	genRestartBtnSprite: function () {
		var btnSprite = this.genBtnTpl(this.world.centerX,this.world.centerY,function () {
			this.state.start(this.game.global.nextSceen);
		}, 'もう三度！');
		btnSprite.hide();
		btnSprite.textSprite.hide();
		btnSprite.allShow = function () {
			btnSprite.show();
			btnSprite.textSprite.show();
		};
		return btnSprite;
	},

	genTweetBtnSprite: function () {
		var btnSprite = this.genBtnTpl(this.world.centerX,this.world.centerY+200,this.tweet,'結果をツいート');
		btnSprite.hide();
		btnSprite.textSprite.hide();
		btnSprite.allShow = function () {
			btnSprite.show();
			btnSprite.textSprite.show();
		};
		return btnSprite;
	},

	genBackToTopBtnSprite: function () {
		var btnSprite = this.genBtnTpl(this.world.centerX,this.world.centerY+400,function () {
			this.game.global.nextSceen = 'Title';
			this.state.start(this.game.global.nextSceen);
		}, 'とっプにモドる');
		btnSprite.hide();
		btnSprite.textSprite.hide();
		btnSprite.allShow = function () {
			btnSprite.show();
			btnSprite.textSprite.show();
		};
		return btnSprite;
	},

	genBtnTpl: function (x,y,func,text) {
		var textStyle = {
			fontSize:'45px',
			fill: '#b8860b',
			stroke:'#FFFFFF',
			strokeThickness: 10,
			multipleStroke:'#b8860b',
			multipleStrokeThickness: 10,
		};
		var s = this.game.global.SpriteManager;
		var btnSprite = s.genButton(x, y, 'greySheet',func,this);
		btnSprite.setFrames(
			// overFrame, outFrame, downFrame, upFrame
			'grey_button00', 'grey_button00', 'grey_button01', 'grey_button00');
		btnSprite.anchor.setTo(.5);
		btnSprite.scale.setTo(2.3);
		btnSprite.tint = 0xf5deb3;
		btnSprite.textSprite = s.genText(x,y,text,textStyle);
		btnSprite.UonInputDown(function () {
			this.game.global.SoundManager.play({key:'Click',volume:1,});
		}, this);
		return btnSprite;
	},

	tweet: function () {
		var text = 'あナタの'+this.GOP.SCORE_TEXT+'は '+this.GOP.score+' でス！\nﾍ（０Д０ﾍ）ﾍ（０Д０ﾍ）ﾍ（０Д０ﾍ）\n『'+this.game.global.GAME_TITLE+'』';
		var tweetText = encodeURIComponent(text);
		var tweetUrl = location.href;
		var tweetHashtags = 'ゾンビ子ゲーム'; // 'A,B,C'
		window.open(
			'https://twitter.com/intent/tweet?text='+tweetText+'&url='+tweetUrl+'&hashtags='+tweetHashtags, 
			'share window', 
			'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
		);
		return false;
	},

	addScoreEffect: function (text) {
		text = text+'';
		var s = this.game.global.SpriteManager;
		var t = this.game.global.TweenManager;
		var textStyle = {stroke:'#00ff00'};
		var x = this.HUD.score.right;
		if (text[0]=='-') {
			textStyle.stroke = '#dd5a52';
			x += 150;
		}
		var textSprite = s.genText(x, this.HUD.score.y, text,textStyle);
		var tween = t.moveA(textSprite, {y:'+50'});
		t.onComplete(tween,function () {
			setTimeout(function () {
				textSprite.destroy();
			},this);
		},this);
		tween.start();
	},

	ready: function () {
		var textStyle = {
			fontSize:'100px',
			fill: '#a0522d',
			stroke:'#FFFFFF',
			strokeThickness: 10,
			multipleStroke:'#a0522d',
			multipleStrokeThickness: 10,
		};
		var readyTextSprite = this.genReadyTextSprite(textStyle);
		var startTextSprite = this.genStartTextSprite(textStyle);
		this.startTween(readyTextSprite,startTextSprite);
	},

	genReadyTextSprite: function (textStyle) {
		var s = this.game.global.SpriteManager;
		var textSprite = s.genText(this.world.centerX,this.world.centerY-100,'れディー…',textStyle);
		textSprite.setScale(0,0);
		return textSprite;
	},

	genStartTextSprite: function (textStyle) {
		var s = this.game.global.SpriteManager;
		var textSprite = s.genText(this.world.centerX,this.world.centerY+100,'スターと',textStyle);
		textSprite.setScale(0,0);
		return textSprite;
	},

	startTween: function (readyTextSprite,startTextSprite) {
		var t = this.game.global.TweenManager;
		var readyDuration = 800;
		var startDuration = 500;
		t.popUpA(readyTextSprite,readyDuration).start();
		t.popUpA(readyTextSprite.multipleTextSprite,readyDuration).start();
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
	},

	rndReal: function (min, max) {
		return this.rnd.realInRange(min, max);
	},

	rndInt: function (min, max) {
		return this.rnd.integerInRange(min, max);
	},

	test: function () {
		if (__ENV!='prod') {
			this.GOP.leftTime = getQuery('time') || this.GOP.leftTime;
		}
	},
};