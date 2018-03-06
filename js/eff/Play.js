BasicGame.Play = function () {};

BasicGame.Play.prototype = {
	init: function () {
		this.stage.backgroundColor = '#5beea0';
		this.GC = {};
		this.HUD = {};
		this.Panel = {};
		this.treeGroup = null;
		this.panelGroup = null;
	},

	create: function () {
		this.GC = this.gameController();
		this.HUD = this.genHUDContainer();
		this.Panel = this.genPanelContainer();
		this.test();
	},

	soundController: function () {
		var s = this.game.global.SoundManager;
		s.stop('currentBGM');
		setTimeout(function () {
			s.stop('currentBGM');
			s.play({key:'MushroomsForest',isBGM:true,loop:true,volume:.8,});
		}, 500);
	},

	update: function () {
		if (this.GC.isPlaying) {
			this.timerController();
		}
	},

	gameController: function () {
		var c = {};
		c.timeCounter = 0;
		c.leftTime = 30;
		c.currentTreeCount = 0;
		c.score = 0;
		c.bonusScore = 1;
		c.isPlaying = false;
		c.showPmang = false;
		c.preFire = null;
		c.nowFire = null;
		c.pmangEffectTime = 3;
		c.horizontal = 6;
		c.vertical = 3;
		return c;
	},

	ready: function (leftTime) {
		this.GC.leftTime = leftTime;
		this.HUD.changeTimerText(this.GC.leftTime);
		this.genStartTextSprite();
		this.soundController();
	},

	genStartTextSprite: function () {
		var g = this.game.global;
		var textSprite = g.SpriteManager.genText(
			this.world.centerX,this.world.centerY,'スタート',{fontSize:'150px'});
		textSprite.scale.setTo(.5);
		var tween = g.TweenManager.popUpA(textSprite, 500);
		g.TweenManager.onComplete(tween, function () {
			textSprite.hide();
			this.start();
		}, this);
		tween.start();
	},

	start: function () {
		this.GC.isPlaying = true;
		this.genTreeContainer();
	},

	gameOver: function () {
		this.GC.isPlaying = false;
		this.HUD.changeTimerText(0);
		this.game.global.SoundManager.play('GameOver');
		this.panelGroup = this.add.group();
		var panelSprite = this.genPanelSprite();
		var t = this.game.global.TweenManager;
		var tween = t.popUpA(panelSprite, 500, panelSprite.scale);
		t.onComplete(tween, function () {
			this.genGameOverTextSprite();
			this.HUD.gameoverScoreText(this.world.centerX,this.world.centerY);
			this.genRestartBtn();
			this.genTweetBtn();
		}, this);
		panelSprite.scale.setTo(.5);
		tween.start();
		this.panelGroup.add(panelSprite);
	},

	genGameOverTextSprite: function () {
		var s = this.game.global.SpriteManager;
		var textSprite = s.genText(this.world.centerX, this.world.centerY-150, 'ゲームオーバー', {fontSize: '80px'});
		this.panelGroup.add(textSprite);
	},

	genRestartBtn: function () {
		var s = this.game.global.SpriteManager;
		var x = this.world.centerX-300;
		var y = this.world.centerY+200;
		var btn = s.genButton(x,y,'greySheet',function () {
			this.game.global.SoundManager.play('MenuStart');
			this.state.start(this.game.global.nextSceen);
		},this);
		btn.frame = 'grey_button00';
		btn.anchor.setTo(.5);
		btn.scale.setTo(2.5);
		this.panelGroup.add(btn);
		s.genText(x,y,'もう一度');
	},

	genTweetBtn: function () {
		var s = this.game.global.SpriteManager;
		var x = this.world.centerX+300;
		var y = this.world.centerY+200;
		var btn = s.genButton(x,y,'greySheet',function () {
			this.game.global.SoundManager.play('MenuStart');
			var text = 'あなたが燃やした森は、燃やし度: '+this.GC.score+' です！\n🔥🔥🌲🌲🔥🔥\n『燃やせ！エルフの森！』';
			if (this.GC.score == 0) {
				text = 'あなたが燃やした森は、燃やし度: 0 です！\nあなたはエルフです。人間ではありません。\n🌲🌲🌲🌲🌲🌲\n『燃やせ！エルフの森！』'
			}
			var tweetText = encodeURIComponent(text);
			var tweetUrl = location.href;
			var tweetHashtags = 'えるゲーム'; // 'A,B,C'
			window.open(
				'https://twitter.com/intent/tweet?text='+tweetText+'&url='+tweetUrl+'&hashtags='+tweetHashtags, 
				'share window', 
				'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
			);
			return false;
		},this);
		btn.frame = 'grey_button00';
		btn.anchor.setTo(.5);
		btn.scale.setTo(2.5);
		this.panelGroup.add(btn);
		s.genText(x,y,'結果をツイート');
	},

	timerController: function () {
		this.GC.timeCounter += this.time.elapsed;
		if (this.GC.timeCounter > 1000) {
			this.GC.timeCounter = 0;
			this.GC.leftTime--;
			this.HUD.changeTimerText(this.GC.leftTime);
		}
		if (this.GC.leftTime <= 0) {
			this.gameOver();
		}
	},

	genTreeContainer: function () {
		this.treeGroup = this.add.group();
		var textStyle = {
			fontSize:'80px',
			fill: '#dd5a52',
			stroke:'#FFFFFF',
			strokeThickness: 20,
			multipleStroke:'#dd5a52',
			multipleStrokeThickness: 30,
		};
		this.GC.currentTreeCount = 1;
		this.GC.preFire = this.nowTime();
		var horizontal = this.GC.horizontal;
		var vertical = this.GC.vertical;
		var maxTreeCount = horizontal*vertical;
		var countArr = [];
		for (var i=1;i<=maxTreeCount;i++) { countArr.push(i); }
		for (var i=0;i<horizontal;i++) {
			for (var j=0;j<vertical;j++) {
				var rndNum = countArr[Math.floor(Math.random() * countArr.length)];
				countArr = countArr.filter(function(v){ return v != rndNum; });
				var x = i*256+(i+1)*9+128;
				var y = j*240+(j+1)*10+260;
				var fireSprite = this.genFireSprite(x, y);
				var treeSprite = this.genTreeSprite(x, y);
				var treeNumberTSprite = this.genTreeNumberTSprite(x, y, rndNum, textStyle);
				treeSprite.count = rndNum;
				treeSprite.maxTreeCount = maxTreeCount;
				treeSprite.fireSprite = fireSprite;
				treeSprite.treeNumberTSprite = treeNumberTSprite;
			}
		}
	},

	genTreeSprite: function (x, y) {
		var treeSprite = this.add.button(x, y, 'Tree', function (pointer) {
			if (this.GC.isPlaying) {
				if (pointer.count == this.GC.currentTreeCount) {
					this.fireTree(pointer);
				} else {
					this.missTouch();
				}
			}
		}, this);
		treeSprite.anchor.setTo(.5);
		this.treeGroup.add(treeSprite);
		return treeSprite;
	},

	fireTree: function (pointer) {
		pointer.loadTexture('DeadTree');
		pointer.fireSprite.show();
		pointer.treeNumberTSprite.hide();
		this.GC.currentTreeCount += 1;
		this.plusScore();
		this.game.global.SoundManager.play({key:'Fire',volume:.6,});
		this.HUD.changeScoreText(this.GC.score);
		if (pointer.count == pointer.maxTreeCount) {
			return this.clearField();
		}
		if (pointer.count%3==0) {
			this.showPmang();
		}
	},

	plusScore: function () {
		this.GC.nowFire = this.nowTime();
		var a = 10000-(this.GC.nowFire-this.GC.preFire);
		if (a<1) { a=1; }
		var b = a*(1+parseInt(a/10))*(1+parseInt(a/100))*(1+parseInt(a/1000));
		var c = parseInt(b/1000000);
		if (c<1) { c=1; }
		this.GC.preFire = this.GC.nowFire;
		var score = c * this.GC.bonusScore;
		this.GC.score += score;
		this.genPlusMinusLeftTimeTextSprite(this.HUD.scoreTextSprite,'+'+score);
	},

	missTouch: function () {
		this.GC.leftTime -= 2;
		this.genPlusMinusLeftTimeTextSprite(this.HUD.timerTextSprite,'-2');
		this.game.global.SoundManager.play('Miss');
		this.HUD.changeTimerText(this.GC.leftTime);
	},

	clearField: function () {
		var self = this;
		this.game.global.SoundManager.play({key:'Flame',volume:.8,});
		setTimeout(function () {
			self.treeGroup.destroy();
			self.genFlameSprite();
			self.GC.currentTreeCount = 1;
			self.showPmang();
			setTimeout(function() {
				if (self.GC.isPlaying) {
					self.GC.leftTime += 3;
					self.genPlusMinusLeftTimeTextSprite(self.HUD.timerTextSprite,'+3');
					self.genTreeContainer();
				}
			}, 500);
		}, 500);
	},

	genFlameSprite: function () {
		var t = this.game.global.TweenManager;
		var s = this.game.global.SpriteManager;
		var flameSprite = s.genSprite(0, this.world.height, 'Flame');
		flameSprite.scale.setTo(3);
		var tween = t.moveB(flameSprite, {y:-flameSprite.height},500);
		t.onComplete(tween, function () { flameSprite.destroy(); }, this);
		tween.start();
	},

	genPlusMinusLeftTimeTextSprite: function (target, text) {
		var s = this.game.global.SpriteManager;
		var t = this.game.global.TweenManager;
		var textStyle = {stroke:'#48984b'};
		if (text[0]=='-') {
			textStyle.stroke = '#dd5a52';
		}
		var textSprite = s.genText(target.right, target.y, text,textStyle);
		var tween = t.moveA(textSprite, {y:'+50'});
		t.onComplete(tween,function () {
			setTimeout(function () {
				textSprite.destroy();
			},this);
		},this);
		tween.start();
	},

	genFireSprite: function (x, y) {
		var fireSprite = this.game.global.SpriteManager.genSprite(x, y, 'Fire_'+this.rand(1,2));
		fireSprite.hide();
		fireSprite.anchor.setTo(.5);
		this.treeGroup.add(fireSprite);
		return fireSprite;
	},

	genTreeNumberTSprite: function (x, y, text, textStyle) {
		var textSprite = this.game.global.SpriteManager.genText(x, y, text, textStyle);
		textSprite.anchor.setTo(.5);
		textSprite.addGroup(this.treeGroup);
		return textSprite;
	},

	showPmang: function () {
		var rndNum = this.rand(1, 100)
		if (rndNum < 10) {
			this.genPmangBtnSprite('IkaPonPmang');
		} else if (rndNum < 50) {
			this.genPmangBtnSprite('WarotaPmang');
		}
	},

	genPmangBtnSprite: function (pmangName) {
		if (!this.GC.showPmang) {
			this.GC.showPmang = true;
			var s = this.game.global.SpriteManager;
			var pmangBtn = s.genButton(this.world.width-200,80,pmangName);
			pmangBtn.anchor.setTo(.5);
			pmangBtn.scale.setTo(.5);
			if (pmangName == 'IkaPonPmang') {
				var text = 'x5';
				var bonusScore = 5;
			} else { // WarotaPmang
				var text = 'x3';
				var bonusScore = 3;
			}
			var bonusTextSprite = s.genText(pmangBtn.right,pmangBtn.bottom-30,text);
			pmangBtn.UonInputDown(function () {
				this.GC.showPmang = false;
				this.GC.bonusScore = bonusScore;
				pmangBtn.hide();
				bonusTextSprite.hide();
				var self = this;
				setTimeout(function () {
					self.GC.bonusScore = 1;
				}, this.GC.pmangEffectTime*1000);
			}, this);
		}
	},

	genHUDContainer: function () {
		var s = this.game.global.SpriteManager;
		var c = {};
		c.timerTextSprite = s.genText(this.world.centerX/4, 50, 'タイム: 0');
		c.changeTimerText = function (time) {
			c.timerTextSprite.changeText('タイム: '+time);
		};
		c.scoreTextSprite = s.genText(this.world.centerX, 50, '燃やし度: 0');
		c.changeScoreText = function (score) {
			c.scoreTextSprite.changeText('燃やし度: '+score);
		};
		var self = this;
		c.gameoverScoreText = function (x, y) {
			c.scoreTextSprite.move(x, y);
			self.panelGroup.add(c.scoreTextSprite);
			c.scoreTextSprite.setTextStyle({fontSize: '80px'});
		};
		return c;
	},

	genPanelContainer: function () {
		var container = {};
		var panelSprite = this.genPanelSprite();
		var howtoTextSprite = this.genHowtoTextSprite();
		var charSprites = this.genCharSprite(panelSprite);
		container.hide = function () {
			for (var key in charSprites) { 
				charSprites[key].hide(); 
				charSprites[key].words.hide(); 
			}
			panelSprite.hide();
			howtoTextSprite.hide();
		};
		return container;
	},

	genPanelSprite: function () {
		var s = this.game.global.SpriteManager;
		var panelSprite = s.genSprite(this.world.centerX, this.world.centerY, 'greySheet', 'grey_panel');
		panelSprite.scale.setTo(12, 7);
		panelSprite.anchor.setTo(.5);
		return panelSprite;
	},

	genHowtoTextSprite: function () {
		var s = this.game.global.SpriteManager;
		var textStyle = {
			fontSize: '40px',
			fill: '#48984b',
			stroke:'#FFFFFF',
			multipleStroke:'#48984b',
			wordWrap: true,
			wordWrapWidth: 300,
		};
		var text = 
			'木に表示された番号を '
			+'小さい順にタッチして森を燃やせ！ '
			+' '
			+'素早く連続タッチで '
			+'燃やし度アップ！ '
			+'『ワロタピーマン』と '
			+'『イカレポンチピーマン』を '
			+'拾うと'+this.GC.pmangEffectTime+'秒間 '
			+'さらに燃やし度アップ！ '
			+'【キャラタッチでスタート】';
		var textSprite = s.genText(this.world.centerX, this.world.centerY, text, textStyle);
		return textSprite;
	},

	genCharSprite: function (ps) {
		var s = this.game.global.SpriteManager;
		var textStyle = { fill: '#dd5a52', stroke:'#FFFFFF', multipleStroke:'#dd5a52', };
		var spriteConf = [
			{key:'Mito_1',x:ps.left+20,ax:0,text:'わたくしではじめる',leftTime:this.GC.leftTime},
			{key:'Kaede_1',x:ps.right-20,ax:1,text:'燃やせ！エルフの森を燃やせ！',leftTime:this.GC.leftTime*2},
		];
		var res = [];
		for (var i=0;i<2;i++) {
			var c = spriteConf[i];
			var btnSprite = s.genButton(c.x,ps.bottom-10,c.key,function (pointer) {
				this.game.global.SoundManager.play('MenuStart');
				this.Panel.hide();
				this.ready(pointer.leftTime);
			}, this);
			btnSprite.leftTime = c.leftTime;
			btnSprite.anchor.setTo(c.ax,1);
			btnSprite.alpha = .5;
			var words = s.genText(btnSprite.centerX,btnSprite.bottom-10,c.text,textStyle);
			words.hide();
			btnSprite.words = words;
			btnSprite.UonInputOver(function (p) {
				p.alpha = 1;
				p.words.show();
			}, this);
			btnSprite.UonInputOut(function (p) {
				p.alpha = .5;
				p.words.hide();
			}, this);
			res.push(btnSprite);
		}
		return res;
	},

	nowTime: function () {
		return new Date().getTime();
	},

	rand: function (min, max) {
		return this.rnd.integerInRange(min, max);
	},

	test: function () {
		if (__ENV!='prod') {
			if (getQuery('gameOver')) { this.Panel.hide();this.gameOver(); }
			this.GC.horizontal = getQuery('h') || this.GC.horizontal;
			this.GC.vertical = getQuery('v') || this.GC.vertical;
		}
	},
};