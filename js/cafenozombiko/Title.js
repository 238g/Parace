BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.Panel=null;
	},
	create:function(){
		this.TOP = this.TextOption();
		this.genBgSprite();
		this.btnContainer();
		this.Panel = this.genPanelContainer();
		this.soundController();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	soundController:function(){
		var s=this.game.global.SoundManager;
		s.stop('currentBGM');
		setTimeout(function(){s.play({key:'HappyBGM_1',isBGM:true,loop:true,volume:1,})},500);
	},

	genBgSprite: function () {
		var s = this.game.global.SpriteManager;
		var t = this.game.global.TweenManager;
		var bgSprite = s.genSprite(0,this.world.height,'Bg_1');
		bgSprite.anchor.setTo(0,1);
		var charSprite = s.genSprite(this.world.centerX,this.world.height,'Zombiko_1');
		charSprite.anchor.setTo(.5,1);
		charSprite.scale.setTo(1.5);
		var duration = 280;
		t.beatA(charSprite, duration).start();
		var titleTextSprite = s.genText(this.world.centerX,this.world.height*.2,this.game.global.GAME_TITLE,this.TOP.textStyle_T);
		t.beatA(titleTextSprite, duration).start();
		t.beatA(titleTextSprite.multipleTextSprite, duration).start();
	},

	btnContainer: function () {
		var margin = this.world.height*.1;
		var x = this.world.centerX;
		var y = this.world.height-margin;
		this.genStartBtn(x/2,y);
		this.genHowtoBtn(x/2*3,y);
		y = margin;
		this.genFullScreenBtn(x/2,y);
		this.genMuteBtn(x/2*3,y);
	},

	genStartBtn: function (x,y) {
		this.genBtnTpl(x,y,function () {
			this.play();
		},'スターと');
	},

	genHowtoBtn: function (x,y) {
		this.genBtnTpl(x,y,function () {
			this.Panel.howtoShow();
		},'あそびカタ');
	},

	genFullScreenBtn: function (x,y) {
		var offText = 'ふルすクり～ンOFF';
		var onText = 'ふるスクりーンON';
		var text = this.scale.isFullScreen ? offText : onText;
		this.genBtnTpl(x,y,function (pointer) {
			if (this.scale.isFullScreen) {
				pointer.textSprite.changeText(onText);
				this.scale.stopFullScreen(false);
			} else {
				pointer.textSprite.changeText(offText);
				this.scale.startFullScreen(false);
			}
		},text);
	},

	genMuteBtn: function (x,y) {
		var offText = 'みゅートOfF';
		var onText = 'ミュうと0N';
		var text = this.sound.mute ? offText : onText;
		this.genBtnTpl(x,y,function (pointer) {
			if (this.sound.mute) {
				pointer.textSprite.changeText(onText);
				this.sound.mute = false;
			} else {
				pointer.textSprite.changeText(offText);
				this.sound.mute = true;
			}
		},text);
	},

	genPanelContainer: function () {
		var t = this.game.global.TweenManager;
		var s = this.game.global.SpriteManager;
		var panelSprite = s.genSprite(this.world.centerX, this.world.centerY, 'greySheet', 'grey_panel');
		panelSprite.scale.setTo(0);
		panelSprite.anchor.setTo(.5);
		panelSprite.tint = 0xfaebd7;
		panelSprite.hide();
		var howtoTextSprite = this.genHowtoTextSprite();
		var inquiryBtnSprite = this.genInquiryBtnSprite();
		var tween = t.popUpA(panelSprite, 500, {x:4,y:6});
		t.onComplete(tween, function () {
			if (panelSprite.visible) {
				howtoTextSprite.show();
				inquiryBtnSprite.show();
				inquiryBtnSprite.textSprite.show();
			}
		}, this);
		this.game.input.onDown.add(function () {
			if (panelSprite.visible) {
				panelSprite.hide();
				howtoTextSprite.hide();
				inquiryBtnSprite.hide();
				inquiryBtnSprite.textSprite.hide();
				panelSprite.scale.setTo(0);
			}
		}, this);
		panelSprite.howtoShow = function () {
			panelSprite.show();
			tween.start();
		};
		return panelSprite;
	},

	genHowtoTextSprite: function () {
		var s = this.game.global.SpriteManager;
		var text = 
			'ゾンビ子が生前働いていたカフェの '
			+'店長（ミニゾンビ）を '
			+'タッチして倒そう！！ '
			+'小さい店長ほどスコアが高いぞ！ '
			// +' '
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
			+'  ';
		var textSprite = s.genText(this.world.centerX, this.world.height*.45, text, this.TOP.textStyle_H);
		textSprite.hide();
		return textSprite;
	},

	genBtnTpl: function (x,y,func,text) {
		var s = this.game.global.SpriteManager;
		var btnSprite = s.genButton(x, y, 'greySheet',func,this);
		btnSprite.setFrames(
			// overFrame, outFrame, downFrame, upFrame
			'grey_button00', 'grey_button00', 'grey_button01', 'grey_button00');
		btnSprite.anchor.setTo(.5);
		btnSprite.tint = 0xf5deb3;
		btnSprite.textSprite = s.genText(x,y,text,this.TOP.textStyle_B);
		btnSprite.UonInputDown(function () {
			this.game.global.SoundManager.play({key:'Click',volume:1,});
		}, this);
		return btnSprite;
	},
	
	genInquiryBtnSprite: function () {
		var text = '他のゲームを遊ぶ';
		var labelSprite = this.genBtnTpl(this.world.centerX,this.world.height*.8,function () {
			var url = 'https://238g.github.io/Parace/238Games2.html';
			if (this.game.device.desktop) {
				window.open(url,'_blank');
			} else {
				location.href = url;
			}
		},text);
		labelSprite.hide();
		labelSprite.textSprite.hide();
		return labelSprite;
	},

	play: function () {
		if (this.inputEnabled) {
			this.game.global.nextSceen = 'Play';
			this.state.start(this.game.global.nextSceen);
		}
	},

	TextOption: function () {
		return {
			textStyle_T: {
				fontSize:35,
				fill: '#b8860b',
				stroke:'#f8f8ff',
				strokeThickness: 5,
				multipleStroke:'#b8860b',
				multipleStrokeThickness: 5,
			},
			textStyle_B: {
				fontSize:25,
				fill: '#b8860b',
				stroke:'#FFFFFF',
				strokeThickness: 5,
				multipleStroke:'#b8860b',
				multipleStrokeThickness: 5,
			},
			textStyle_H: {
				fontSize: 20,
				fill: '#a0522d',
				stroke:'#FFFFFF',
				multipleStroke:'#a0522d',
				wordWrap: true,
				wordWrapWidth: 300,
			},
		};
	},
};
