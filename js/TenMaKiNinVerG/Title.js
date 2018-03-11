BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.inputEnabled = false;
	},

	create: function () {
		this.genBgContainer();
		this.genBtnContainer();
		// this.soundController();
		// this.inputController();
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
		var tint = 0xffffff;
		this.genLabel(x,y,function () {
		},text,textStyle,tint);
	},

	genHowtoBtn: function (x,y,textStyle) {
		var text = '遊び方';
		var tint = 0xffffff;
		this.genLabel(x,y,function () {
		},text,textStyle,tint);
	},

	genMuteBtnSprite: function (x,y,textStyle) {
		var offText = 'ミュートOFF';
		var onText = 'ミュートON';
		var text = this.sound.mute ? offText : onText;
		var tint = 0x953ac3;
		this.genLabel(x,y,function (pointer) {
			if (this.sound.mute) {
				pointer.textSprite.changeText(onText);
				this.sound.mute = false;
			} else {
				pointer.textSprite.changeText(offText);
				this.sound.mute = true;
			}
		},text,textStyle,tint);
	},

	genFullScreenBtnSprite: function (x,y,textStyle) {
		var offText = 'フルスクリーンOFF';
		var onText = 'フルスクリーンON';
		var text = this.scale.isFullScreen ? offText : onText;
		var tint = 0xee2324;
		this.genLabel(x,y,function (pointer) {
			if (this.scale.isFullScreen) {
				pointer.textSprite.changeText(onText);
				this.scale.stopFullScreen(false);
			} else {
				pointer.textSprite.changeText(offText);
				this.scale.startFullScreen(false);
			}
		},text,textStyle,tint);
	},

	genLabel: function (x,y,func,text,textStyle,tint) {
		var s = this.game.global.SpriteManager;
		var btnSprite = s.genButton(x, y, 'greySheet',func,this);
		btnSprite.setFrames(
			// overFrame, outFrame, downFrame, upFrame
			'grey_button00', 'grey_button00', 'grey_button01', 'grey_button00');
		btnSprite.anchor.setTo(.5);
		btnSprite.scale.setTo(2.2);
		btnSprite.tint = tint;
		btnSprite.textSprite = s.genText(x,y,text,textStyle);
		btnSprite.UonInputDown(function () {
			// this.game.global.SoundManager.play({key:'Click',volume:1,});
		}, this);
		return btnSprite;
	},

	play: function () {
		if (this.inputEnabled) {
			this.game.global.nextSceen = 'Play';
			this.state.start(this.game.global.nextSceen);
		}
	},
};
