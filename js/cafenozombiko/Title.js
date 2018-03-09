BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.stage.backgroundColor = '#5beea0';
		this.inputEnabled = false;
		this.Panel = null;
	},

	create: function () {
		this.GOP = this.GameOption();
		this.btnContainer();
		this.Panel = this.genPanelContainer();
		// this.soundController();

		this.time.events.add(800, function () {
			this.inputEnabled = true; 
		}, this);
	},

	soundController: function () {
		var s = this.game.global.SoundManager;
		s.stop('currentBGM');
		setTimeout(function () {
			s.play({key:'MushroomDance',isBGM:true,loop:true,volume:1,});
		}, 500);
	},

	btnContainer: function () {
		var margin = 150;
		var x = this.world.centerX;
		var y = this.world.height-margin;
		this.genStartBtn(x/2,y);
		this.genHowtoBtn(x/2*3,y);
		y = margin;
		this.genFullScreenBtn(x/2,y);
		this.genMuteBtn(x/2*3,y);
	},

	genStartBtn: function (x,y) {
		// var startBtnSprite = 
		this.genBtnTpl(x,y,function () {
			// TODO popup panel mode select
			this.play();
		},'スタート',this.GOP.textStyle_B);
	},

	genHowtoBtn: function (x,y) {
		this.genBtnTpl(x,y,function () {
			this.Panel.show();
			this.Panel.howto.show();
		},'遊び方',this.GOP.textStyle_B);
	},

	genFullScreenBtn: function (x,y) {
		var text = this.scale.isFullScreen ? 'フルスクリーンOFF' : 'フルスクリーンON';
		this.genBtnTpl(x,y,function (pointer) {
			if (this.scale.isFullScreen) {
				pointer.textSprite.changeText('フルスクリーンON');
				this.scale.stopFullScreen(false);
			} else {
				pointer.textSprite.changeText('フルスクリーンOFF');
				this.scale.startFullScreen(false);
			}
		},text,this.GOP.textStyle_B);
	},

	genMuteBtn: function (x,y) {
		var text = this.sound.mute ? 'ミュートOFF' : 'ミュートON';
		this.genBtnTpl(x,y,function (pointer) {
			if (this.sound.mute) {
				pointer.textSprite.changeText('ミュートON');
				this.sound.mute = false;
			} else {
				pointer.textSprite.changeText('ミュートOFF');
				this.sound.mute = true;
			}
		},text,this.GOP.textStyle_B);
	},

	genPanelContainer: function () {
		var s = this.game.global.SpriteManager;
		var panelSprite = s.genSprite(this.world.centerX, this.world.centerY, 'greySheet', 'grey_panel');
		panelSprite.scale.setTo(7, 12);
		panelSprite.anchor.setTo(.5);
		panelSprite.hide();
		panelSprite.howto = this.genHowtoText();
		this.game.input.onDown.add(function () {
			if (panelSprite.visible) {
				panelSprite.hide();
				panelSprite.howto.hide();
			}
		}, this);
		return panelSprite;
	},

	genHowtoText: function () {
		var s = this.game.global.SpriteManager;
		var text = 
			// TODO fix
			'木に表示された番号を '
			+'小さい順にタッチして森を燃やせ！ '
			+' '
			+'素早く連続タッチで '
			+'燃やし度アップ！ '
			+'『ワロタピーマン』と '
			+'『イカレポンチピーマン』を '
			+'拾うと秒間 '
			+'さらに燃やし度アップ！ '
			+'【キャラタッチでスタート】';
		var textSprite = s.genText(this.world.centerX, this.world.centerY, text, this.GOP.textStyle_H);
		textSprite.hide();
		return textSprite;
	},

	genBtnTpl: function (x,y,func,text,textStyle) {
		var s = this.game.global.SpriteManager;
		var btnSprite = s.genButton(x, y, 'greySheet',func,this);
		btnSprite.setFrames(
			// overFrame, outFrame, downFrame, upFrame
			'grey_button00', 'grey_button00', 'grey_button01', 'grey_button00');
		btnSprite.anchor.setTo(.5);
		btnSprite.scale.setTo(2.3);
		btnSprite.textSprite = s.genText(x,y,text,textStyle);
		return btnSprite;
	},

	play: function () {
		if (this.inputEnabled) {
			// this.game.global.SoundManager.play('MenuStart'); // TODO change
			this.game.global.nextSceen = 'Play';
			this.state.start(this.game.global.nextSceen);
		}
	},

	GameOption: function () {
		return {
			textStyle_B: {
				fontSize:'45px',
				fill: '#000000',
				stroke:'#FFFFFF',
				strokeThickness: 10,
				multipleStroke:'#000000',
				multipleStrokeThickness: 10,
			},
			textStyle_H: {
				fontSize: '40px',
				fill: '#48984b',
				stroke:'#FFFFFF',
				multipleStroke:'#48984b',
				wordWrap: true,
				wordWrapWidth: 300,
			},
		};
	},
};
