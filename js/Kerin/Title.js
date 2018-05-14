BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.DeclearConst();
		this.DeclearVal();
	},

	DeclearConst: function () {
		this.BEAT_DURATION = 353;
	},

	DeclearVal: function () {
		this.inputEnabled = false;
	},

	create: function () {
		this.time.events.removeAll();
		this.BgContainer();
		this.BtnContainer();
		this.soundController();
		this.inputController();
	},

	inputController: function () {
		this.time.events.add(800,function () {
			this.inputEnabled = true; 
		},this);
	},

	soundController: function () {
		this.playBGM();
	},

	playBGM: function () {
		if (this.M.SE.isPlaying('TitleBGM')) return;
		this.M.SE.stop('currentBGM');
		this.M.SE.play('TitleBGM',{isBGM:true,loop:true,volume:1});
	},

	BgContainer: function () {
		this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		this.genBgCharSprite();
		this.genTitleTextSprite();
	},

	genBgCharSprite: function () {
		var x = this.world.centerX;
		var y = this.world.centerY;
		var charSprite = this.add.sprite(x,y,'LaughKerin');
		charSprite.anchor.setTo(.5);
		charSprite.animations.add('laugh').play(18, true);
		charSprite = this.add.sprite(x,y-charSprite.height,'LaughKerin');
		charSprite.anchor.setTo(.5);
		charSprite.animations.add('laugh').play(18, true);
		charSprite = this.add.sprite(x,y+charSprite.height,'LaughKerin');
		charSprite.anchor.setTo(.5);
		charSprite.animations.add('laugh').play(18, true);
	},

	genTitleTextSprite: function () {
		var textSprite = this.M.S.genText(this.world.centerX,50,
			BasicGame.GAME_TITLE,this.M.S.BaseTextStyleS(40));
		textSprite.addTween('beatA',{duration:this.BEAT_DURATION});
		textSprite.startTween('beatA');
	},

	BtnContainer: function () {
		var textStyle = this.M.S.BaseTextStyleS(25);
		var leftX = this.world.width*.25;
		var rightX = leftX*3;
		var y = this.world.centerY+200;
		var tint = BasicGame.MAIN_TINT;
		this.genStartBtnSprite(leftX,y,textStyle,tint);
		this.genOtherGameBtnSprite(leftX,y+75,textStyle,tint);
		this.genLogoBtnSprite(10,this.world.centerY);
		this.genVolumeBtnSprite(leftX-50,y+150,tint);
		this.genFullScreenBtnSprite(rightX+50,y+150,tint);
	},

	genStartBtnSprite: function (x,y,textStyle,tint) {
		var text = 'プレイ！';
		this.M.S.BasicWhiteLabelS(x,y,function () {
			if (this.inputEnabled) {
				// this.M.SE.play('Start',{volume:1}); // TODO
				this.M.NextScene('SelectLevel');
			} else {
				this.playBGM();
				this.inputEnabled = true;
			}
		},text,textStyle,{tint:tint});
	},

	genVolumeBtnSprite: function (x,y,tint) {
		var maxImg = BasicGame.VOLUME_MAX_IMG;
		var halfImg = BasicGame.VOLUME_HALF_IMG;
		var muteImg = BasicGame.VOLUME_MUTE_IMG;
		var curImg = this.sound.mute ? muteImg : (this.sound.volume==1) ? maxImg : halfImg;
		var volumeSprite = this.M.S.genSprite(x,y,'VolumeIcon',curImg);
		volumeSprite.anchor.setTo(.5);
		volumeSprite.scale.setTo(.5);
		volumeSprite.UonInputDown(this.onDownVolumeBtn);
	},

	onDownVolumeBtn: function (sprite) {
		if (this.sound.mute) {
			sprite.frameName = BasicGame.VOLUME_MAX_IMG;
			this.sound.mute = false;
			this.sound.volume = 1;
		} else {
			if (this.sound.volume == 1) {
				sprite.frameName = BasicGame.VOLUME_HALF_IMG;
				this.sound.volume = .5;
			} else {
				sprite.frameName = BasicGame.VOLUME_MUTE_IMG;
				this.sound.volume = 0;
				this.sound.mute = true;
			}
		}
	},

	genFullScreenBtnSprite: function (x,y,tint) {
		var offImg = BasicGame.FULL_SCREEN_OFF_IMG;
		var onImg = BasicGame.FULL_SCREEN_ON_IMG;
		var curImg = this.scale.isFullScreen ? offImg : onImg;
		var fullScreenSprite = this.M.S.genSprite(x,y,'GameIconsBlack',curImg);
		fullScreenSprite.anchor.setTo(.5);
		fullScreenSprite.scale.setTo(.5);
		fullScreenSprite.UonInputDown(this.onDonwFullScreenBtn);
	},

	onDonwFullScreenBtn: function (sprite) {
		if (this.scale.isFullScreen) {
			sprite.frameName = BasicGame.FULL_SCREEN_OFF_IMG;
			this.scale.stopFullScreen(false);
		} else {
			sprite.frameName = BasicGame.FULL_SCREEN_ON_IMG;
			this.scale.startFullScreen(false);
		}
	},

	genOtherGameBtnSprite: function (x,y,textStyle,tint) {
		var text = '他のゲームを遊ぶ';
		var label = this.M.S.BasicWhiteLabelS(x,y,function () {
			if (this.game.device.desktop) {
				window.open(BasicGame.MY_GAMES_URL,'_blank');
			} else {
				location.href = BasicGame.MY_GAMES_URL;
			}
		},text,textStyle,{tint:tint});
	},

	genLogoBtnSprite: function (x,y) {
		var logoSprite = this.M.S.genSprite(x,y,'Logo');
		logoSprite.anchor.setTo(0,.5);
		logoSprite.UonInputDown(function () {
			if (this.game.device.desktop) {
				window.open(BasicGame.YOUTUBE_URL,'_blank');
			} else {
				location.href = BasicGame.YOUTUBE_URL;
			}
		});
	},
};
