BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.inputEnabled = false;
		this.Dialog = null;
	},

	create: function () {
		this.BgContainer();
		this.BtnContainer();
		this.Dialog = this.DialogContainer();
		this.soundController();
		this.inputController();
	},

	inputController: function () {
		return;
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
			s.play({key:'TitleBGM',isBGM:true,loop:true,volume:1});
		}, this);
		this.time.events.add(1200, function () {
			if (s.isPlaying('TitleBGM')) return;
			s.stop('currentBGM');
			s.play({key:'TitleBGM',isBGM:true,loop:true,volume:1});
		});
	},

	BgContainer: function () {
	},

	BtnContainer: function () {
	},

	genStartBtnSprite: function (x,y) {
		var text = 'スタート';
		this.genLabel(x,y,function () {
			this.Dialog.selectShow();
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
		var c = this.game.const;
		var textStyle = {
			fontSize: '43px',
			fill: c.GAME_TEXT_COLOR,
			stroke: '#FFFFFF',
			strokeThickness: 20,
			multipleStroke: c.GAME_TEXT_COLOR,
			multipleStrokeThickness: 20,
		};
		var s = this.game.global.SpriteManager;
		var labelSprite = s.genLabel(x,y,'greySheet',func,this,text,textStyle);
		labelSprite.btnSprite.setFrames('grey_button00', 'grey_button00', 'grey_button01', 'grey_button00');
		labelSprite.btnSprite.scale.setTo(2.2);
		labelSprite.btnSprite.tint = c.GAME_MAIN_COLOR_B;
		labelSprite.btnSprite.UonInputDown(function () {
			this.game.global.SoundManager.play({key:'Ou',volume:1,});
		}, this);
		return labelSprite;
	},

	genSoundBtnSprite: function (x,y) {
	},

	DialogContainer: function () {
	},

	genDialogSprite: function () {
		var c = this.game.const;
		var s = this.game.global.SpriteManager;
		var panelSprite = s.genSprite(this.world.centerX, this.world.centerY, 'greySheet', 'grey_panel');
		panelSprite.hide();
		return s.setMidDialog(panelSprite,{
			tween:'popUpA',
			duration: 500,
			scale:{x:8,y:13},
			tint:c.GAME_MAIN_COLOR_B,
		});
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
