BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.stage.backgroundColor = '#5beea0';
		this.inputEnabled = false;
	},

	create: function () {
		// this.genBgSprite();
		// this.genTextContainer();
		// this.soundController();
		var self = this;
		setTimeout(function () { 
			self.inputEnabled = true; 
		}, 800);
	},

	soundController: function () {
		var s = this.game.global.SoundManager;
		s.stop('currentBGM');
		setTimeout(function () {
			s.play({key:'MushroomDance',isBGM:true,loop:true,volume:3,});
		}, 500);
	},

	genTextContainer: function () {
		var textStyle = {
			fontSize:'80px',
			fill: '#dd5a52',
			stroke:'#FFFFFF',
			strokeThickness: 20,
			multipleStroke:'#dd5a52',
			multipleStrokeThickness: 30,
		};
		this.genTitleTextSprite(textStyle);
		this.genStartTextSprite(textStyle);
		textStyle.fontSize = '50px';
		textStyle.fill = '#48984b';
		textStyle.multipleStroke = '#48984b';
		this.genFullScreenTextSprite(textStyle);
		this.genMuteTextSprite(textStyle);
	},

	genTitleTextSprite: function (textStyle) {
		var textSprite = this.game.global.SpriteManager.genText(
			this.world.centerX, 250, 'TITLE', textStyle);
		this.tweenBeatA(textSprite);
		this.tweenBeatA(textSprite.multipleTextSprite);
		textSprite.onInputDown(this.play, this);
	},

	genStartTextSprite: function (textStyle) {
		var textSprite = this.game.global.SpriteManager.genText(
			this.world.centerX, this.world.height-100, 'スタート！！', textStyle
		);
		this.tweenBeatA(textSprite);
		this.tweenBeatA(textSprite.multipleTextSprite);
		textSprite.onInputDown(this.play, this);
	},

	genFullScreenTextSprite: function (textStyle) {
		var s = this.game.global.SpriteManager;
		var x = this.world.width-200;
		var y = this.world.height-100;
		if (this.scale.isFullScreen) {
			var textSprite = s.genText(x, y, 'フルスクリーン\nモードOFF', textStyle);
		} else {
			var textSprite = s.genText(x, y, 'フルスクリーン\nモードON', textStyle);
		}
		textSprite.onInputDown(function () {
			if (this.scale.isFullScreen) {
				textSprite.changeText('フルスクリーン\nモードON');
				this.scale.stopFullScreen(false);
			} else {
				textSprite.changeText('フルスクリーン\nモードOFF');
				this.scale.startFullScreen(false);
			}
		});
	},

	genMuteTextSprite: function (textStyle) {
		if (this.sound.mute) {
			var textSprite = this.game.global.SpriteManager.genText(
				200,this.world.height-100, 'ミュートOFF', textStyle);
		} else {
			var textSprite = this.game.global.SpriteManager.genText(
				200,this.world.height-100, 'ミュートON', textStyle);
		}
		textSprite.onInputDown(function () {
			if (this.sound.mute) {
				textSprite.changeText('ミュートON');
				this.sound.mute = false;
			} else {
				textSprite.changeText('ミュートOFF');
				this.sound.mute = true;
			}
		});
	},

	tweenBeatA: function (sprite) {
		this.game.global.TweenManager.beatA(sprite, 220).start();
	},

	play: function () {
		if (this.inputEnabled) {
			this.game.global.SoundManager.play('MenuStart');
			this.game.global.nextSceen = 'Play';
			this.state.start(this.game.global.nextSceen);
		}
	},

	genBgSprite: function () {
	},

};
