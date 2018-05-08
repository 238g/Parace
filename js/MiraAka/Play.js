BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GM = {};
	},

	create: function () {
		this.GameManager();
		this.BtnContainer();
		this.ready();
		this.test();
	},

	GameManager: function () {
		this.GM = {
			isPlaying: false,
			QuestionInfo: this.M.getConf('QuestionInfo'),
		};
	},

	updateT: function () {
		if (this.GM.isPlaying) {
		}
	},

	BtnContainer: function () {
		var x = this.world.centerX;
		var y = this.world.centerY;
		var textStyle = this.M.S.BaseTextStyleS(25);
		var tint = this.M.getConst('MAIN_TINT');
		this.genStartBtnSprite(x,y);
		this.genVolumeBtnSprite(50,this.world.height-40,tint);
		this.genFullScreenBtnSprite(this.world.width-50,this.world.height-40,tint);
		this.genBackBtnSprite(x,this.world.height-40,tint,textStyle);
		this.genTweetBtnSprite(x,this.world.height-100,tint,textStyle);
	},

	genStartBtnSprite: function (x,y) {
		var textStyle = this.M.S.BaseTextStyleS(40);
		var btnSprite = this.add.button(x,y+100,'CircleBtns',this.start,this,'Hover','Normal','Push','Normal');
		btnSprite.anchor.setTo(.5);
		var textSprite = this.M.S.genText(0,0,'スタート',textStyle);
		textSprite.addToChild(btnSprite);
		// TODO this. -> changeText...
	},

	genVolumeBtnSprite: function (x,y,tint) {
		var maxImg = 'VolumeMax';
		var halfImg = 'VolumeHalf';
		var muteImg = 'VolumeMute';
		var curImg = this.sound.mute ? muteImg : (this.sound.volume==1) ? maxImg : halfImg;
		var volumeSprite = this.M.S.genSprite(x,y,'VolumeIcon',curImg);
		volumeSprite.anchor.setTo(.5);
		volumeSprite.scale.setTo(.5);
		volumeSprite.UonInputDown(function (sprite) {
			if (this.sound.mute) {
				sprite.frameName = maxImg;
				this.sound.mute = false;
				this.sound.volume = 1;
			} else {
				if (this.sound.volume == 1) {
					sprite.frameName = halfImg;
					this.sound.volume = .5;
				} else {
					sprite.frameName = muteImg;
					this.sound.volume = 0;
					this.sound.mute = true;
				}
			}
		});
	},

	genFullScreenBtnSprite: function (x,y,tint) {
		var offImg = 'smaller';
		var onImg = 'larger';
		var curImg = this.scale.isFullScreen ? offImg : onImg;
		var fullScreenSprite = this.M.S.genSprite(x,y,'GameIconsBlack',curImg);
		fullScreenSprite.anchor.setTo(.5);
		fullScreenSprite.scale.setTo(.5);
		fullScreenSprite.UonInputDown(function (sprite) {
			if (this.scale.isFullScreen) {
				sprite.frameName = onImg;
				this.scale.stopFullScreen(false);
			} else {
				sprite.frameName = offImg;
				this.scale.startFullScreen(false);
			}
		});
	},

	genBackBtnSprite: function (x,y,tint,textStyle) {
		this.M.S.BasicWhiteLabelS(x,y,function () {
			this.M.NextScene('Title');
		},'戻る',textStyle,{tint:tint});
	},

	genTweetBtnSprite: function (x,y,tint,textStyle) {
		this.M.S.BasicWhiteLabelS(x,y,this.tweet,'結果をツイート',textStyle,{tint:tint});
	},

	tweet: function () {
		// TODO
	},

	ready: function () {
		// TODO
		// this.stopBGM();
		// this.playBGM();
	},

	playBGM: function () {
		var s = this.M.SE;
		if (s.isPlaying('Stage_1')) return;
		s.play('Stage_1',{isBGM:true,loop:true,volume:1});
	},

	stopBGM: function () {
		var s = this.M.SE;
		if (s.isPlaying('PlayBGM')) return;
		s.stop('currentBGM');
		s.stop('TitleBGM');
	},

	start: function () {
		this.GM.isPlaying = true;
	},

	gameOver: function () {
		this.GM.isPlaying = false;
	},

	renderT: function () {
		// this.game.debug.body(this.Paddle);
		// this.game.debug.body(this.Ball);
	},

	test: function () {
		if (__ENV!='prod') {
			this.game.debug.font='40px Courier';
			this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver, this);
			this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
		}
	},
};
