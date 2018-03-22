BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GC = null;
		this.HUD = null;
		this.GAUGE = null;
		this.RightFishGroup = null;
		this.LeftFishGroup = null;
		this.BonusFishGroup = null;
		this.EnemyFishGroup = null;
	},

	create: function () {
		this.GC = this.GameController();
		this.BgContainer();
		this.physicsController();
		this.InputContainer();
		this.FishContainer();
		this.GAUGE = this.GaugeContainer();
		this.HUD = this.HUDContainer();
		this.ready();
		this.test();
	},

	GameController: function () {
		return {
			timeCounter: 0,
			leftTime: 60,
			inputEnable: false,
			isPlaying: false,
			score: 0,
			netFirst: false,
			netBodySprite: null,
			netViewSprite: null,
			baseFishFrequency: this.game.conf.ModeInfo[this.game.global.currentMode].fishFrequency,
			catchFishCount: 0,
			catchFishScore: 0,
			currentGauge: 100,
			isHealing: false,
			isBonusMode: false,
			bonusTime: 5000,
		};
	},

	checkInput: function () {
		if (
			this.GC.isPlaying
			&& this.GC.inputEnable
			&& !this.GC.isHealing
		) { return true; } return false;
	},

	physicsController: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.enableBody = true;
	},

	InputContainer: function () {
		this.GC.netViewSprite = this.genNetViewSprite();
		this.GC.netBodySprite = this.genNetBodySprite();
		this.game.input.onDown.add(function (pointer) {
			if (this.checkInput()) {
				var x = pointer.x;
				var y = pointer.y;
				this.GC.inputEnable = false;
				this.GC.netViewSprite.cast(x,y);
				this.GAUGE.addVal(-30);
				this.time.events.add(500, function () {
					this.GC.netBodySprite.reset(x,y);
					this.GC.netBodySprite.visible = false;
				}, this);
				this.time.events.add(1500, function () {
					if (this.GC.netBodySprite.alive) {
						this.GC.inputEnable = true;
						this.GC.netViewSprite.hide();
						this.GC.netBodySprite.kill();
					}
				}, this);
			}
		}, this);
	},

	BgContainer: function () {
		// 8x13
		this.stage.backgroundColor = '#afeeee';
		for (var i=0;i<8;i++) this.add.sprite(i*128,128,'fishSpritesheet', 'WaterWave');
		for (var i=0;i<8;i++) {
			for (var j=0;j<10;j++) {
				this.add.sprite(i*128,j*128+256,'fishSpritesheet', 'WaterFill');
			}
		}
		var arrSeaweedFront = ['SeaweedGreenWS','SeaweedGreenSS','SeaweedPinkWS',];
		var arrSeaweedBack = [
			'SeaweedGreenWS','SeaweedGreenSS','SeaweedOrangeLS',
			'SeaweedPinkWS','SeaweedGreenTS','SeaweedPinkTS','SeaweedOrangeSS',
			'SeaweedGreenTShortS','SeaweedPinkTShortS',
			'SeaweedGreenWShortS','SeaweedPinkWShortS','SeaweedGreenSShortS',
		];
		var arrSeaFloorHW = ['SeaFloorWWaveDS','SeaFloorWWaveDBS'];
		var arrSeaFloorF = ['SeaFloorWFillStarfish','SeaFloorWFillShell','SeaFloorWFillM','SeaFloorWFill'];
		for (var i=0;i<8;i++) {
			var x = i*128;
			this.add.sprite(x,1408,'fishSpritesheet', this.rnd.pick(arrSeaFloorHW));
			this.add.sprite(x-50,1380,'fishSpritesheet', this.rnd.pick(arrSeaweedBack));
			if (this.rnd.integerInRange(1,3)===1) this.add.sprite(x,1408,'fishSpritesheet', this.rnd.pick(arrSeaweedFront));
			this.add.sprite(x,1536,'fishSpritesheet', this.rnd.pick(arrSeaFloorF));
		}
	},

	genNetViewSprite: function () {
		var s = this.game.global.SpriteManager;
		var t = this.game.global.TweenManager;
		var netViewSprite = s.genSprite(0,0,'Net');
		netViewSprite.anchor.setTo(.5);
		netViewSprite.scale.setTo(0);
		netViewSprite.hide();
		var tween = t.popUpA(netViewSprite,500);
		t.onComplete(tween, function () {
			this.time.events.add(500, function () {
				netViewSprite.scale.setTo(0);
				this.GC.inputEnable = true;
			}, this);
		}, this);
		netViewSprite.cast = function (x,y) {
			netViewSprite.show();
			netViewSprite.x = x;
			netViewSprite.y = y;
			tween.start();
		};
		return netViewSprite;
	},

	genNetBodySprite: function () {
		var netBodySprite = this.add.sprite(0,0,'Net');
		netBodySprite.anchor.setTo(.5);
		this.physics.arcade.enable(netBodySprite);
		netBodySprite.body.setCircle(250, 0, 0);
		netBodySprite.kill();
		return netBodySprite;
	},

	update: function () {
		if (this.GC.isPlaying) {
			this.timeManager();
			this.collisionManager();
		}
	},

	timeManager: function () {
		this.GC.timeCounter += this.time.elapsed;
		if (this.GC.timeCounter > 1000) {
			this.GC.timeCounter = 0;
			this.GC.leftTime--;
			this.HUD.changeTime(this.GC.leftTime);
			this.gaugeManager();
		}
		if (this.GC.leftTime <= 0) {
			this.gameOver();
		}
	},

	collisionManager: function () {
		if (this.GC.isPlaying && this.GC.netBodySprite){
			this.physics.arcade.overlap(this.RightFishGroup, this.GC.netBodySprite, this.castNet, null, this);
			this.physics.arcade.overlap(this.LeftFishGroup, this.GC.netBodySprite, this.castNet, null, this);
			this.physics.arcade.overlap(this.BonusFishGroup, this.GC.netBodySprite, this.castNet, null, this);
			this.physics.arcade.overlap(this.EnemyFishGroup, this.GC.netBodySprite, this.castNet, null, this);
		}
	},

	gaugeManager: function () {
		if (this.GC.currentGauge < 100) {
			var m = this.game.conf.ModeInfo;
			var c = this.game.global.currentMode;
			this.GAUGE.addVal(m[c].healingVal);
		}
	},

	castNet: function (netBodySprite, fishEmitter) {
		this.GC.catchFishCount += 1;
		var score = this.checkKindOfFish(fishEmitter);
		if (!this.GC.netFirst) {
			this.GC.netFirst = true;
			this.time.events.add(100, function () {
				netBodySprite.kill();
			}, this);
			this.time.events.add(500, function () {
				console.log('in', this.GC.catchFishCount,this.GC.catchFishScore); // TODO del
				this.addScore();
				this.GC.netFirst = false;
				this.GC.catchFishCount = 0;
				this.GC.catchFishScore = 0;
			}, this);
		}
		fishEmitter.kill();
		this.fishScoreEffect(score, fishEmitter.x, fishEmitter.y);
	},

	checkKindOfFish: function (fishEmitter) {
		var score = 13;
		if (fishEmitter.key == 'BeefBowl') this.bonusMode(); return 0;
		switch (fishEmitter.frameName) {
			case 'FishEel': 
			case 'FishBlowfish': score*=5; break;
			case 'FishPink': 
			case 'FishBlue': 
			case 'FishOrange': score*=3; break;
			case 'FishRed': break;
			case 'FishGreen': break;
			case 'FishRedBoneS':
			case 'FishBlueBoneS':
			case 'FishGreenBoneS':
			case 'FishOrangeBoneS':
			case 'FishPinkBoneS': score*=-10; break;
		}
		this.GC.catchFishScore += score;
		return score;
	},

	bonusMode: function () {
		if (!this.GC.isBonusMode) {
			this.HUD.showBonus();
			this.GC.isBonusMode = true;
			this.RightFishGroup.frequency = 20;
			this.LeftFishGroup.frequency = 20;
			this.time.events.add(this.GC.bonusTime, function () {
				this.GC.isBonusMode = false;
				this.RightFishGroup.frequency = this.GC.baseFishFrequency;
				this.LeftFishGroup.frequency = this.GC.baseFishFrequency;
			}, this);
		}
	},

	addScore: function () {
		var m = this.game.conf.ModeInfo[this.game.global.currentMode];
		var score = this.GC.catchFishScore 
				* this.GC.catchFishCount
				* m.modeScore;
		this.GC.score += score;
		this.HUD.changeScore(this.GC.score);
	},

	fishScoreEffect: function (score, x, y) {
		if (score) this.addScoreEffect(score, x, y, '-50');
	},

	addScoreEffect: function (score, x, y, moveY) {
		var textStyle = {stroke:'#00ff00'};
		var text = score+'';
		if (text[0]=='-') {
			textStyle.stroke = '#dd5a52';
		} else {
			text = '+'+text;
		}
		var s = this.game.global.SpriteManager;
		var t = this.game.global.TweenManager;
		var textSprite = s.genText(x,y,text,textStyle);
		var tween = t.moveA(textSprite,{y:moveY},1000);
		t.onComplete(tween,function () {
			textSprite.destroy();
		},this);
		tween.start();
	},

	FishContainer: function () {
		this.genFishEmitter('Right');
		this.genFishEmitter('Left');
		this.genBonusFishEmitter();
		this.genEnemyFishEmitter();
	},

	genFishEmitter: function (type) {
		var fishArr = ['FishBlue','FishRed','FishOrange','FishPink','FishGreen', 'FishEel',　'FishBlowfish'];
		if (type == 'Left') {
			var emitter = this.add.emitter(-100, this.world.centerY, 1000);
			this.LeftFishGroup = emitter;
			var val = 1;
		} else {
			var emitter = this.add.emitter(this.world.width+100, this.world.centerY, 1000);
			this.RightFishGroup = emitter;
			var val = -1;
			emitter.setScale(-1,-1,1,1);
		}
		emitter.gravity.x = 100 * val;
		emitter.gravity.y = 25;
		emitter.makeParticles('fishSpritesheet',fishArr,1000,true,false);
		emitter.height = 1000;
		emitter.minRotation = 0;
		emitter.maxRotation = 0;
		emitter.start(false, 6000, this.GC.baseFishFrequency);
	},

	genBonusFishEmitter: function () {
		var b = this.game.conf.ModeInfo[this.game.global.currentMode].bonusInfo;
		var emitter = this.add.emitter(this.world.centerX, -100, 2);
		this.BonusFishGroup = emitter;
		emitter.gravity.x = b.gravityX;
		emitter.gravity.y = b.gravityY;
		emitter.makeParticles('BeefBowl',0,2,true,false);
		emitter.width = 300;
		emitter.start(false, 6000, b.frequency);
	},

	genEnemyFishEmitter: function () {
		var fishArr = ['FishRedBoneS',　'FishBlueBoneS', 'FishGreenBoneS', 'FishOrangeBoneS', 'FishPinkBoneS'];
		var emitter = this.add.emitter(this.world.width, this.world.centerY, 10);
		this.EnemyFishGroup = emitter;
		emitter.setScale(-1,-1,1,1);
		emitter.gravity.x = -100;
		emitter.gravity.y = 25;
		emitter.makeParticles('fishSpritesheet',fishArr,10,true,false);
		emitter.height = 1000;
		emitter.minRotation = 0;
		emitter.maxRotation = 0;
		emitter.start(false, 6000, 1000);
	},

	HUDContainer: function () {
		var c = {
			score:null,
			textStyle:{
				fill: this.game.const.GAME_TEXT_COLOR,
				stroke:'#FFFFFF',
				strokeThickness: 15,
				multipleStroke:this.game.const.GAME_TEXT_COLOR,
				multipleStrokeThickness: 10,
			},
		};
		this.genScoreTextSprite(c);
		this.genTimeCounterTextSprite(c);
		this.genGaugeTextSprite(c);
		this.genBonusTextSprite(c);
		this.genHealingTextSprite(c);
		return c;
	},

	genScoreTextSprite: function (HUD) {
		var s = this.game.global.SpriteManager;
		var baseText = 'スコア: ';
		var textSprite = s.genText(this.world.width-20,20,baseText+this.GC.score,HUD.textStyle);
		textSprite.setAnchor(1,0);
		var self = this;
		HUD.changeScore = function (val) {
			textSprite.changeText(baseText+__formatComma(val));
			self.addScoreEffect(self.GC.score, textSprite.x-100, textSprite.y+60, '+50');
		};
		HUD.score = textSprite;
	},

	genTimeCounterTextSprite: function (HUD) {
		var s = this.game.global.SpriteManager;
		var baseText = 'タイム: ';
		var textSprite = s.genText(20,20,'',HUD.textStyle);
		textSprite.setAnchor(0,0);
		HUD.changeTime = function (val) {
			textSprite.changeText(baseText+val);
		};
		HUD.changeTime(this.GC.leftTime);
	},

	genGaugeTextSprite: function (HUD) {
		var s = this.game.global.SpriteManager;
		var baseText = 'スタミナ';
		HUD.textStyle.fontSize = '30px';
		var textSprite = s.genText(this.world.centerX,this.world.height-50,baseText,HUD.textStyle);
		HUD.changeGauge = function (val) {
			textSprite.changeText(baseText+val);
		};
		HUD.changeGauge(this.GC.currentGauge);
	},

	genBonusTextSprite: function (HUD) {
		var t = this.game.global.TweenManager;
		var s = this.game.global.SpriteManager;
		var baseText = 'ボーナスモード！';
		HUD.textStyle.fontSize = '90px';
		HUD.textStyle.fill = '#ffff00';
		HUD.textStyle.stroke = '#ff0000';
		HUD.textStyle.strokeThickness = 20;
		HUD.textStyle.multipleStroke = '#ffffff';
		var textSprite = s.genText(this.world.centerX,this.world.centerY-200,baseText,HUD.textStyle);
		textSprite.setScale(0,0);
		var tween = t.popUpB(textSprite,800);
		var tween2 = t.popUpB(textSprite.multipleTextSprite,800);
		var self = this;
		HUD.showBonus = function () {
			tween.start();
			tween2.start();
			self.time.events.add(self.GC.bonusTime, function () {
				textSprite.setScale(0,0);
			}, self);
		};
	},

	genHealingTextSprite: function (HUD) {
		var t = this.game.global.TweenManager;
		var s = this.game.global.SpriteManager;
		var baseText = 'スタミナ回復中…';
		HUD.textStyle.fill = this.game.const.GAME_TEXT_COLOR; // TODO color
		HUD.textStyle.stroke = '#FFFFFF';
		HUD.textStyle.multipleStroke = this.game.const.GAME_TEXT_COLOR;
		var textSprite = s.genText(this.world.centerX,this.world.centerY,baseText,HUD.textStyle);
		textSprite.setScale(0,0);
		var tween = t.popUpA(textSprite,300);
		var tween2 = t.popUpA(textSprite.multipleTextSprite,300);
		var self = this;
		HUD.showHealing = function () {
			tween.start();
			tween2.start();
		};
		HUD.hideHealing = function () {
			textSprite.setScale(0,0);
		};
	},

	GaugeContainer: function () {
		var c = {};
		var x = this.world.centerX;
		var y = this.world.height-50;
		var w = this.world.width-200;
		var h = 50;
		this.add.sprite(x,y,this.genGaugeBmpTpl(w+20,h+20,this.game.const.GAME_TEXT_COLOR)).anchor.setTo(.5);
		this.add.sprite(x,y,this.genGaugeBmpTpl(w+10,h+10,'#dcdcdc')).anchor.setTo(.5);
		this.add.sprite(x,y,this.genGaugeBmpTpl(w+5,h+5,this.game.const.GAME_TEXT_COLOR)).anchor.setTo(.5);
		var backGaugeSprite = this.add.sprite(x,y,this.genGaugeBmpTpl(w,h,'#dc143c'));
		backGaugeSprite.anchor.setTo(.5);
		var frontGaugeSprite = this.add.sprite(x-backGaugeSprite.width/2,y,this.genGaugeBmpTpl(w,h,'#ffff00'));
		frontGaugeSprite.anchor.setTo(0,.5);
		var self = this;
		c.setPercent = function (val){
			if(val < 0) {
				val = 0;
				self.GC.currentGauge = 0;
				self.GC.isHealing = true;
			}
			if(val >= 100) {
				val = 100;
				self.GC.currentGauge = 100;
				self.GC.isHealing = false;
			}
			if (self.GC.isHealing) {
				self.HUD.changeGauge('かいふくちゅう…');
			} else {
				self.HUD.changeGauge(self.GC.currentGauge);
			}
			var newWidth =  (val * w) / 100;
			self.add.tween(frontGaugeSprite).to({width: newWidth}, 200, Phaser.Easing.Linear.None, true);
		};
		c.addVal = function (val) {
			self.GC.currentGauge += val;
			c.setPercent(self.GC.currentGauge);
		};
		return c;
	},

	genGaugeBmpTpl: function (w,h,fillStyle) {
		var bmp = this.add.bitmapData(w,h);
		bmp.ctx.fillStyle = fillStyle;
		bmp.ctx.beginPath();
		bmp.ctx.rect(0,0,w,h);
		bmp.ctx.fill();
		bmp.update();
		return bmp;
	},

	ready: function () {
		this.start();
	},

	start: function () {
		this.GC.isPlaying = true;
		this.GC.inputEnable = true;
	},

	gameOver: function () {
		this.GC.isPlaying = false;
		this.RightFishGroup.on = false;
		this.LeftFishGroup.on = false;
		this.BonusFishGroup.on = false;
		this.EnemyFishGroup.on = false;
		this.genResultPanelContainer();
	},

	genResultPanelContainer: function () {
		// this.game.global.SoundManager.play({key:'Result',volume:2,});
		this.time.events.removeAll();
		var textStyle = {
			fontSize: '100px',
			fill: this.game.const.GAME_TEXT_COLOR,
			stroke:'#FFFFFF',
			strokeThickness: 20,
			multipleStroke: this.game.const.GAME_TEXT_COLOR,
			multipleStrokeThickness: 20,
		};
		var panelSprite = this.genPanelSprite();
		var panelTextSprite = this.genPanelTextSprite(textStyle);
		var modeTextSprite = this.genModeTextSprite(textStyle);
		var restartLabel = this.genRestartLabel();
		var tweetLabel = this.genTweetLabel();
		var backLabel = this.genBackLabel();
		var t = this.game.global.TweenManager;
		var tween = t.popUpB(panelSprite, 500, {x:8,y:13});
		t.onComplete(tween, function () {
			panelTextSprite.show();
			modeTextSprite.show();
			this.genPanelScoreTextSprite(0,400,textStyle);
			this.genPanelScoreTextSprite(1,400,textStyle);
			restartLabel.allShow(600);
			tweetLabel.allShow(800);
			backLabel.allShow(1000);
		}, this);
		tween.start();
		return panelSprite;
	},

	genPanelSprite: function () {
		var s = this.game.global.SpriteManager;
		var panelSprite = s.genSprite(this.world.centerX, this.world.centerY, 'greySheet', 'grey_panel');
		panelSprite.tint = this.game.const.GAME_MAIN_COLOR_B;
		panelSprite.scale.setTo(0);
		panelSprite.anchor.setTo(.5);
		return panelSprite;
	},

	genPanelTextSprite: function (textStyle) {
		var s = this.game.global.SpriteManager;
		var textSprite = s.genText(this.world.centerX, 300, '結果発表', textStyle);
		textSprite.setScale(0,0);
		var t = this.game.global.TweenManager;
		textSprite.show = function () {
			t.popUpB(textSprite, 800).start();
			t.popUpB(textSprite.multipleTextSprite, 800).start();
		};
		return textSprite;
	},

	genModeTextSprite: function (textStyle) {
		var s = this.game.global.SpriteManager;
		textStyle.fontSize = '80px';
		var m = this.game.conf.ModeInfo[this.game.global.currentMode];
		var textSprite = s.genText(this.world.centerX, 450, '難易度: '+m.text, textStyle);
		textSprite.setScale(0,0);
		var t = this.game.global.TweenManager;
		textSprite.show = function () {
			t.popUpB(textSprite, 800).start();
			t.popUpB(textSprite.multipleTextSprite, 800).start();
		};
		return textSprite;
	},

	genPanelScoreTextSprite: function (num,delay,textStyle) {
		var s = this.game.global.SpriteManager;
		var text = this.HUD.score.text; // TODO
		text = text.split(': ')[num];
		var textSprite = s.genText(this.world.centerX, 600+(num*150), text, textStyle);
		textSprite.setScale(0,0);
		this.game.global.TweenManager.popUpB(textSprite, 800, null, delay).start();
		this.game.global.TweenManager.popUpB(textSprite.multipleTextSprite, 800, null, delay).start();
	},

	genRestartLabel: function () {
		var label = this.genLabelTpl(this.world.centerX,this.world.centerY+100,function () {
			this.state.start(this.game.global.nextSceen);
		}, 'もう一度プレイ');
		label.UonInputDown(function () {
			// this.game.global.SoundManager.play({key:'SelectChar',volume:1,}); // TODO
		}, this);
		return label;
	},

	genTweetLabel: function () {
		var label = this.genLabelTpl(this.world.centerX,this.world.centerY+300,this.tweet, '結果をツイート');
		label.UonInputDown(function () {
			// this.game.global.SoundManager.play({key:'SelectChar',volume:1,}); // TODO
		}, this);
		return label;
	},

	genBackLabel: function () {
		var label = this.genLabelTpl(this.world.centerX,this.world.centerY+500,function () {
			this.game.global.nextSceen = 'Title';
			this.state.start(this.game.global.nextSceen);
		}, 'タイトルにもどる');
		label.UonInputDown(function () {
			// this.game.global.SoundManager.play({key:'SelectChar',volume:1,}); // TODO
		}, this);
		return label;
	},

	genLabelTpl: function (x,y,func,text) {
		var c = this.game.const;
		var textStyle = {
			fontSize:'45px',
			fill: c.GAME_TEXT_COLOR,
			stroke:'#FFFFFF',
			strokeThickness: 20,
			multipleStroke: c.GAME_TEXT_COLOR,
			multipleStrokeThickness: 20,
		};
		var s = this.game.global.SpriteManager;
		var btnSprite = s.genButton(x,y,'greySheet',func,this);
		btnSprite.setFrames('grey_button00', 'grey_button00', 'grey_button01', 'grey_button00');
		btnSprite.anchor.setTo(.5);
		btnSprite.scale.setTo(0);
		btnSprite.tint = c.GAME_MAIN_COLOR_B;
		var textSprite = s.genText(x,y,text,textStyle);
		textSprite.setScale(0,0);
		var t = this.game.global.TweenManager;
		btnSprite.allShow = function (delay) {
			delay = delay || 0;
			t.popUpB(btnSprite, 800, {x:2.3,y:2.3}, delay).start();
			t.popUpB(textSprite, 800, null, delay).start();
			t.popUpB(textSprite.multipleTextSprite, 800, null, delay).start();
		};
		btnSprite.allHide = function () {
			t.fadeOutA(btnSprite, 800).start();
			t.fadeOutA(textSprite, 800).start();
			t.fadeOutA(textSprite.multipleTextSprite, 800).start();
		};
		return btnSprite;
	},

	tweet: function () {
		var m = this.game.conf.ModeInfo[this.game.global.currentMode];
		var emoji = '';
		for (var i=0;i<6;i++) {
			var rndNum = this.rnd.integerInRange(1,3);
			if (rndNum == 1) {
				emoji += '🐟';
			} else if (rndNum == 2) {
				emoji += '🐠';
			} else {
				emoji += '🐡';
			}
		}
		var text = 'あみで魚をつかまえろ❣『'+this.game.const.GAME_TITLE+'』💃💃💃\n'
					+'あなたのスコアは '+__formatComma(this.GC.score)+' です❣❣【難易度: '+m.text+'】\n'
					+'🕸'+emoji+'🕸\n';
		var tweetText = encodeURIComponent(text);
		var tweetUrl = location.href;
		var tweetHashtags = 'アズリムゲーム'; // 'A,B,C'
		window.open(
			'https://twitter.com/intent/tweet?text='+tweetText+'&url='+tweetUrl+'&hashtags='+tweetHashtags, 
			'share window', 
			'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
		);
		return false;
	},

	renderT: function () {
		if (this.GC.netBodySprite) this.game.debug.body(this.GC.netBodySprite);
		for (var key in this.RightFishGroup.children) { this.game.debug.body(this.RightFishGroup.children[key]); }
		for (var key in this.LeftFishGroup.children) { this.game.debug.body(this.LeftFishGroup.children[key]); }
	},

	test: function () {
		if (__ENV!='prod') {
			this.GC.leftTime = getQuery('time') || this.GC.leftTime;
			// this.GC.CountLimit = getQuery('count') || this.GC.CountLimit;
			// this.game.global.currentChar = getQuery('char') || this.game.global.currentChar;
		}
	},
};