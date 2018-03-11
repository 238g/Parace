BasicGame.Title = function () {};

BasicGame.Title.prototype = {
	init: function () {
		this.stage.backgroundColor = '#b0d8fb';
		this.inputEnabled = false;
	},

	create: function () {
		this.genBgSprite();
		this.genTextContainer();
		this.genBtnContainer();
		this.soundController();
		this.time.events.add(800, function () {
			this.inputEnabled = true; 
		}, this);
	},

	soundController: function () {
		var s = this.game.global.SoundManager;
		s.stop('currentBGM');
		setTimeout(function () {
			s.play({key:'HappyArcadeTune',isBGM:true,loop:true,volume:.6});
		}, 500);
	},

	genTextContainer: function () {
		var textStyle = {
			fontSize:'100px',
			fill: '#5fa0dc',
			stroke:'#FFFFFF',
			strokeThickness: 20,
			multipleStroke:'#5fa0dc',
			multipleStrokeThickness: 30,
		};
		this.textSpriteTpl(this.world.centerX-200, this.world.centerY-100, '🏃　シロラン　🏃', textStyle);
		this.textSpriteTpl(this.world.centerX-200, this.world.centerY+100, '🐬　スタート　🐬', textStyle);
	},

	textSpriteTpl: function (x,y,text,textStyle) {
		var s = this.game.global.SpriteManager;
		var textSprite = s.genText(x,y,text,textStyle);
		textSprite.onInputDown(this.startGame, this);
		this.add.tween(textSprite.scale).to({x: '+.1', y: '+.1'}, 220, Phaser.Easing.Sinusoidal.Out, true, 0, -1, true);
		this.add.tween(textSprite.multipleTextSprite.scale).to({x: '+.1', y: '+.1'}, 220, Phaser.Easing.Sinusoidal.Out, true, 0, -1, true);
	},

	genBtnContainer: function () {
		var textStyle = {
			fontSize:'40px',
		};
		this.genFullScreenBtnSprite(250,80,textStyle);
		this.genMuteBtnSprite(700,80,textStyle);
	},

	genFullScreenBtnSprite: function (x,y,textStyle) {
		var offText = 'フルスクリーンOFF';
		var onText = 'フルスクリーンON';
		var text = this.scale.isFullScreen ? offText : onText;
		this.genBtnTpl(x,y,function (pointer) {
			if (this.scale.isFullScreen) {
				pointer.textSprite.changeText(onText);
				this.scale.stopFullScreen(false);
			} else {
				pointer.textSprite.changeText(offText);
				this.scale.startFullScreen(false);
			}
		},text,textStyle);
	},

	genMuteBtnSprite: function (x,y,textStyle) {
		var offText = 'ミュートOFF';
		var onText = 'ミュートON';
		var text = this.sound.mute ? offText : onText;
		this.genBtnTpl(x,y,function (pointer) {
			if (this.sound.mute) {
				pointer.textSprite.changeText(onText);
				this.sound.mute = false;
			} else {
				pointer.textSprite.changeText(offText);
				this.sound.mute = true;
			}
		},text,textStyle);
	},

	genBtnTpl: function (x,y,func,text,textStyle) {
		var s = this.game.global.SpriteManager;
		var btnSprite = s.genButton(x, y, 'greySheet',func,this);
		btnSprite.setFrames(
			// overFrame, outFrame, downFrame, upFrame
			'grey_button00', 'grey_button00', 'grey_button01', 'grey_button00');
		btnSprite.anchor.setTo(.5);
		btnSprite.scale.setTo(2);
		btnSprite.tint = 0x5fa0dc;
		btnSprite.textSprite = s.genText(x,y,text,textStyle);
		btnSprite.UonInputDown(function () {
			this.game.global.SoundManager.play({key:'MenuClick',volume:1,});
		}, this);
		return btnSprite;
	},

	genBgSprite: function () {
		var s = this.game.global.SpriteManager;
		var key = 'siro_title_' + this.rnd.integerInRange(1, 3);
		var sprite = s.genSprite(this.world.width, this.world.height, key);
		sprite.anchor.setTo(1);
		sprite.UonInputDown(this.startGame, this);
	},

	startGame: function () {
		if (this.inputEnabled) {
			this.game.global.SoundManager.play('MenuClick');
			this.game.global.nextSceen = 'Play';
			this.state.start(this.game.global.nextSceen);
		}
	},
};
