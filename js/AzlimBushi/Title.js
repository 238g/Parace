BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.inputEnabled = false;
		this.Dialog = null;
	},

	create: function () {
		// TODO favicon
		this.BgContainer();
		this.BtnContainer();
		this.Dialog = this.DialogContainer();
		this.soundController();
		this.inputController();
	},

	inputController: function () {
		this.time.events.add(800, function () {
			this.inputEnabled = true; 
		}, this);
	},

	soundController: function () {
		return;
		var s = this.game.global.SoundManager;
		s.stop('currentBGM');
		this.time.events.add(500, function () {
			s.stop('currentBGM');
			s.play({key:'TitleBGM',isBGM:true,loop:true,volume:1.5,});
		}, this);
	},

	BgContainer: function () {

	},

	BtnContainer: function () {
		var x = this.world.width*3/4;
		var y = this.world.height;
		this.genStartBtnSprite(x,y-100);
		this.genHowtoBtnSprite(x,y-250);
		this.genMuteBtnSprite(x,y-400);
		this.genFullScreenBtnSprite(x,y-550);
		this.genInquiryBtnSprite(x,y-700);
	},

	genStartBtnSprite: function (x,y) {
		var text = 'スタート';
		this.genLabel(x,y,function () {
			this.Dialog.selectShow();
		},text);
	},

	genHowtoBtnSprite: function (x,y) {
		var text = '遊び方';
		this.genLabel(x,y,function () {
			this.Dialog.howtoShow();
		},text);
	},

	genMuteBtnSprite: function (x,y) {
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
		},text);
	},

	genFullScreenBtnSprite: function (x,y) {
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
		},text);
	},

	genLabel: function (x,y,func,text) {
		var textStyle = {
			fontSize: '43px',
			fill: '#000000',
			stroke: '#FFFFFF',
			strokeThickness: 20,
			multipleStroke: '#000000',
			multipleStrokeThickness: 20,
		};
		var s = this.game.global.SpriteManager;
		var labelSprite = s.genLabel(x,y,'greySheet',func,this,text,textStyle);
		labelSprite.btnSprite.setFrames('grey_button00', 'grey_button00', 'grey_button01', 'grey_button00');
		labelSprite.btnSprite.scale.setTo(2.2);
		// btnSprite.tint = c.color; // TODO
		labelSprite.btnSprite.UonInputDown(function () {
			// this.game.global.SoundManager.play({key:'PageOpen',volume:1,}); // TODO
		}, this);
		return labelSprite;
	},

	DialogContainer: function () {
		var c = {};
		var panelSprite = this.genDialogSprite();
		var selectContainer = this.SelectContainer();
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
				if (t && t.sprite) { return; }
				panelSprite.hide();
				panelSprite.scale.setTo(0);
				selectContainer.hide();
				howtoTextSprite.hide();
				// this.game.global.SoundManager.play({key:'PageOpen',volume:1,}); // TODO
			}
		}, this);
		return c;
	},

	genDialogSprite: function () {
		var t = this.game.global.TweenManager;
		var s = this.game.global.SpriteManager;
		var panelSprite = s.genSprite(this.world.centerX, this.world.centerY, 'greySheet', 'grey_panel');
		panelSprite.scale.setTo(0);
		panelSprite.anchor.setTo(.5);
		// panelSprite.tint = 0xffe4b5; // TODO
		panelSprite.hide();
		var tween = t.popUpA(panelSprite, 500, {x:8,y:13});
		panelSprite.popUpTween = tween;
		return panelSprite;
	},

	SelectContainer: function () {
		var c = {};
		/*
		var selectTitleTextSprite = this.genSelectTitleTextSprite();
		var charGroup = this.add.group();
		for (var key in this.game.conf.CharInfo) {
			this.genCharContainer(key,charGroup);
		}
		charGroup.visible = false;
		*/
		c.show = function () {
			// selectTitleTextSprite.show();
			// charGroup.visible = true;
		};
		c.hide = function () {
			// selectTitleTextSprite.hide();
			// charGroup.visible = false;
		};
		return c;
	},

	genHowtoTextSprite: function () {
		var textStyle = {
			fontSize: '40px',
			fill: '#800000', // TODO
			stroke:'#FFFFFF',
			strokeThickness: 15,
			multipleStroke:'#800000', // TODO
			multipleStrokeThickness: 15,
			wordWrap: true,
			wordWrapWidth: 300,
		};
		var s = this.game.global.SpriteManager;
		var text = 
			'石をひとつずつ移動させて同じ '
			+'Vtuberの石を3つ以上そろえよう。 '
			+' '
			+'制限時間が0になるとゲーム終了だよ。 '
			+'移動回数が0になっても '
			+'ゲーム終了だよ。 '
			+' '
			+'連鎖をするほど得点が高くなるぞ！ '
			+'同時に消す石が多いほど '
			+'得点が高くなるぞ！ '
			+' '
			+'移動できない時は下の '
			+'スキルボタンを押そう！ '
			+'まとめて石が消えるよ！ '
			+' '
			+'高得点を目指してがんばろう！ '
			+'  ';
		var textSprite = s.genText(this.world.centerX, this.world.centerY, text, textStyle);
		textSprite.hide();
		return textSprite;
	},

	genInquiryBtnSprite: function (x,y) {
		var text = 'お問い合わせ';
		this.genLabel(x,y,function () {
			window.open('https://twitter.com/'+__DEVELOPER_TWITTER_ID,'_blank');
		},text);
	},

	play: function () {
		if (this.inputEnabled) {
			this.game.global.nextSceen = 'Play';
			this.state.start(this.game.global.nextSceen);
		}
	},
};
