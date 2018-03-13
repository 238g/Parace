BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.inputEnabled = false;
		this.Panel = {};
	},

	create: function () {
		this.genBgContainer();
		this.genBtnContainer();
		this.Panel = this.genPanelContainer();
		// this.soundController();
		this.inputController();
	},

	inputController: function () {
		this.time.events.add(800, function () {
			this.inputEnabled = true; 
		}, this);
	},

	soundController: function () {
		var s = this.game.global.SoundManager;
		s.stop('currentBGM');
		this.time.events.add(500, function () {
			s.play({key:'HappyBGM_1',isBGM:true,loop:true,volume:1,});
		}, this);
	},

	genBgContainer: function () {
		this.genBgEffect();
		this.genTitleSprite();
	},

	genBgEffect: function () {
		var emitter = this.add.emitter(this.world.centerX, 0, 200);
		emitter.makeParticles('CharStones', [0,1,2,3,4]);
		emitter.setYSpeed(80, 500);
		emitter.gravity = 0;
		emitter.width = this.world.width;
		emitter.start(false, 14000, 100);
		var emitter2 = this.add.emitter(this.world.centerX, this.world.height, 200);
		emitter2.makeParticles('CharStones', [0,1,2,3,4]);
		emitter2.setYSpeed(-80, -500);
		emitter2.gravity = 0;
		emitter2.width = this.world.width;
		emitter2.start(false, 14000, 100);
	},

	genTitleSprite: function () {
		var s = this.game.global.SpriteManager;
		var logoSprite = s.genSprite(this.world.centerX, this.world.height/4, 'Logo');
		logoSprite.anchor.setTo(.5);
		logoSprite.scale.setTo(1.2);
		this.game.global.TweenManager.stressA(logoSprite,null,3000).start();
	},

	genBtnContainer: function () {
		var textStyle = {
			fontSize: '43px',
			// fill: '#a0522d',
			// stroke:'#FFFFFF',
			// strokeThickness: 10,
			// multipleStroke:'#a0522d',
			// multipleStrokeThickness: 10,
		};
		var margin = 150;
		var x = this.world.centerX;
		var y = this.world.height-margin;
		this.genStartBtn(x/2,y,textStyle);
		this.genHowtoBtn(x/2*3,y,textStyle);
		y = margin;
		this.genMuteBtnSprite(x/2,y,textStyle);
		this.genFullScreenBtnSprite(x/2*3,y,textStyle);
	},

	genStartBtn: function (x,y,textStyle) {
		var text = 'スタート';
		this.genLabel(x,y,function () {
			this.Panel.selectShow();
		},text,textStyle,'K');
	},

	genHowtoBtn: function (x,y,textStyle) {
		var text = '遊び方';
		this.genLabel(x,y,function () {
			this.Panel.howtoShow();
		},text,textStyle,'N');
	},

	genMuteBtnSprite: function (x,y,textStyle) {
		var offText = 'ミュートOFF';
		var onText = 'ミュートON';
		var text = this.sound.mute ? offText : onText;
		this.genLabel(x,y,function (pointer) {
			if (this.sound.mute) {
				pointer.textSprite.changeText(onText);
				this.sound.mute = false;
			} else {
				pointer.textSprite.changeText(offText);
				this.sound.mute = true;
			}
		},text,textStyle,'T');
	},

	genFullScreenBtnSprite: function (x,y,textStyle) {
		var offText = 'フルスクリーンOFF';
		var onText = 'フルスクリーンON';
		var text = this.scale.isFullScreen ? offText : onText;
		this.genLabel(x,y,function (pointer) {
			if (this.scale.isFullScreen) {
				pointer.textSprite.changeText(onText);
				this.scale.stopFullScreen(false);
			} else {
				pointer.textSprite.changeText(offText);
				this.scale.startFullScreen(false);
			}
		},text,textStyle,'M');
	},

	genLabel: function (x,y,func,text,textStyle,charType) {
		var s = this.game.global.SpriteManager;
		var btnSprite = s.genButton(x, y, 'greySheet',func,this);
		btnSprite.setFrames( // overFrame, outFrame, downFrame, upFrame
			'grey_button00', 'grey_button00', 'grey_button01', 'grey_button00');
		btnSprite.anchor.setTo(.5);
		btnSprite.scale.setTo(2.2);
		btnSprite.tint = this.game.conf.CharInfo[charType].color;
		btnSprite.textSprite = s.genText(x,y,text,textStyle);
		btnSprite.UonInputDown(function () {
			// TODO sound
			// this.game.global.SoundManager.play({key:'Click',volume:1,});
		}, this);
		var delay = this.rnd.integerInRange(1000, 3000);
		this.game.global.TweenManager.stressA(btnSprite,null,delay).start();
		this.game.global.TweenManager.stressA(btnSprite.textSprite,null,delay).start();
		return btnSprite;
	},

	genPanelContainer: function () {
		var c = {};
		var panelSprite = this.genPanelSprite();
		var selectContainer = this.genSelectContainer();
		var howtoTextSprite = this.genHowtoTextSprite();
		var t = this.game.global.TweenManager;
		t.onComplete(panelSprite.popUpTween, function () {
			if (panelSprite.visible) {
				if (panelSprite.showWhat == 'select') {
					selectContainer.show();
				} else {
					howtoTextSprite.show();
				}
			}
		}, this);
		c.selectShow = function () {
			panelSprite.show();
			panelSprite.showWhat = 'select';
			panelSprite.popUpTween.start();
		};
		c.howtoShow = function () {
			panelSprite.show();
			panelSprite.showWhat = 'howto';
			panelSprite.popUpTween.start();
		};
		this.game.input.onDown.add(function (p) {
			if (panelSprite.visible) {
				var t = p.targetObject;
				if (t && t.sprite && t.sprite.charType) { return; }
				panelSprite.hide();
				howtoTextSprite.hide();
				selectContainer.hide();
				panelSprite.scale.setTo(0);
			}
		}, this);
		return c;
	},

	genPanelSprite: function () {
		var t = this.game.global.TweenManager;
		var s = this.game.global.SpriteManager;
		var panelSprite = s.genSprite(this.world.centerX, this.world.centerY, 'greySheet', 'grey_panel');
		panelSprite.scale.setTo(0);
		panelSprite.anchor.setTo(.5);
		// panelSprite.tint = 0xfaebd7; // TODO think....
		panelSprite.hide();
		var tween = t.popUpA(panelSprite, 500, {x:8,y:13});
		panelSprite.popUpTween = tween;
		return panelSprite;
	},

	genSelectContainer: function () {
		var c = {};
		var selectTitleTextSprite = this.genSelectTitleTextSprite();
		var charGroup = this.add.group();
		for (var key in this.game.conf.CharInfo) {
			this.genCharContainer(key,charGroup);
		}
		charGroup.visible = false;
		c.show = function () {
			selectTitleTextSprite.show();
			charGroup.visible = true;
		};
		c.hide = function () {
			selectTitleTextSprite.hide();
			charGroup.visible = false;
		};
		return c;
	},

	genSelectTitleTextSprite: function () {
		var textStyle = {
			fontSize: '60px',
			fill: '#a0522d', // TODO color
			stroke:'#FFFFFF',
			multipleStroke:'#a0522d', // TODO color
		};
		var s = this.game.global.SpriteManager;
		var text = 'キャラクター選択';
		var textSprite = s.genText(this.world.centerX, 280, text, textStyle);
		textSprite.hide();
		return textSprite;
	},

	genCharContainer: function (charType, group) {
		var x=this.world.centerX,y=this.world.centerY+50,xm=200,ym=340;
		switch (charType) {
			case 'T': x-=xm;y-=ym;break;
			case 'M': x+=xm;y-=ym;break;
			case 'K': x-=xm;y+=ym;break;
			case 'N': x+=xm;y+=ym;break;
			case 'G': break;
		}
		var frameSprite = this.genCharFrameSprite(x,y,charType);
		var charSprite = this.genCharSprite(x,y,charType);
		var charNameTextSprite = this.genCharNameTextSprite(x,y,charType);
		var modeTextSprite = this.genModeTextSprite(x,y,charType);
		group.add(frameSprite);
		group.add(charSprite);
		group.add(charNameTextSprite);
		group.add(modeTextSprite);
	},

	genCharFrameSprite: function (x,y,charType) {
		var s = this.game.global.SpriteManager;
		var frameSprite = s.genButton(x,y, 'greySheet', this.selectedChar, this);
		frameSprite.frameName = 'grey_panel';
		frameSprite.anchor.setTo(.5);
		frameSprite.scale.setTo(3, 3.2);
		frameSprite.charType = charType;
		frameSprite.tint = this.game.conf.CharInfo[charType].color;
		return frameSprite;
	},

	genCharSprite: function (x,y,charType) {
		var s = this.game.global.SpriteManager;
		var sprite = s.genSprite(x,y,'Char_'+charType);
		sprite.anchor.setTo(.5);
		return sprite;
	},

	genCharNameTextSprite: function (x,y,charType) {
		var textStyle = { fontSize: '30px', };
		var text = this.game.conf.CharInfo[charType].name;
		var s = this.game.global.SpriteManager;
		var textSprite = s.genText(x,y+120,text,textStyle);
		return textSprite;
	},

	genModeTextSprite: function (x,y,charType) {
		var textStyle = { fontSize: '40px', };
		var text = this.game.conf.CharInfo[charType].modeName;
		var s = this.game.global.SpriteManager;
		var textSprite = s.genText(x,y-120,text,textStyle);
		return textSprite;
	},

	selectedChar: function (p) {
		// TODO sound
		// this.game.global.SoundManager.play({key:'Click',volume:1,});
		this.game.global.currentMode = this.game.conf.CharInfo[p.charType].mode;
		this.game.global.currentChar = p.charType;
		this.play();
	},

	genHowtoTextSprite: function () {
		var textStyle = {
			fontSize: '40px',
			fill: '#a0522d',
			stroke:'#FFFFFF',
			multipleStroke:'#a0522d',
			wordWrap: true,
			wordWrapWidth: 300,
		};
		var s = this.game.global.SpriteManager;
		// TODO
		var text = 
			'ゾンビ子が生前働いていたカフェの '
			+'店長（ミニゾンビ）を '
			+'タッチして倒そう！！ '
			+'小さい店長ほどスコアが高いぞ！ '
			+' '
			+'タッチする度にスコアは減るので '
			+'タッチのしすぎに注意！ '
			+'人間を倒すと3秒間スコア5倍！ '
			+'ゾンビ子やタカシを倒すと '
			+'スコアが減るよ！ '
			+' '
			+'高得点を目指して頑張ろう！ '
			+' '
			+'※PCでのプレイは '
			+'スコアが常時1.2倍です。 '
			+' '
			+'お問い合わせはこちら '
			+__DEVELOPER_TWITTER;
		var textSprite = s.genText(this.world.centerX, this.world.centerY, text, textStyle);
		textSprite.hide();
		return textSprite;
	},

	play: function () {
		if (this.inputEnabled) {
			this.game.global.nextSceen = 'Play';
			this.state.start(this.game.global.nextSceen);
		}
	},
};
