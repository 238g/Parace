BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function(){this.inputEnabled=!1;},
	create: function () {
		this.time.events.removeAll();
		this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		this.playBGM();
		this.BtnContainer();
	},

	playBGM: function () {
		return; // TODO
		if(this.M.SE.isPlaying('TitleBGM'))return;
		this.M.SE.stop('currentBGM');
		this.M.SE.play('TitleBGM',{isBGM:!0,loop:!0,volume:1});
	},

	BtnContainer: function () {
		this.genStartBtnSprite(this.world.centerX,this.world.height*.75);
		this.genLogoBtnSprite(this.world.centerX,this.world.height);
		this.genVolumeBtnSprite(this.world.width*.1,30);
		this.genFullScreenBtnSprite(this.world.width*.9,30);
	},

	genStartBtnSprite: function (x,y) {
		//TODO btnlabel
	},

	start: function () {
		if (this.inputEnabled) {
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			this.M.NextScene('Stage1');
		} else {
			this.playBGM();
			this.inputEnabled=!0;
		}
	},

	genVolumeBtnSprite: function (x,y) {
		var maxImg=BasicGame.VOLUME_MAX_IMG;
		var halfImg=BasicGame.VOLUME_HALF_IMG;
		var muteImg=BasicGame.VOLUME_MUTE_IMG;
		var curImg=this.sound.mute?muteImg:(this.sound.volume==1)?maxImg:halfImg;
		var volumeSprite=this.M.S.genSprite(x,y,'VolumeIcon',curImg);
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

	genFullScreenBtnSprite: function (x,y) {
		var offImg = BasicGame.FULL_SCREEN_OFF_IMG;
		var onImg = BasicGame.FULL_SCREEN_ON_IMG;
		var curImg = this.scale.isFullScreen ? offImg : onImg;
		var fullScreenSprite = this.M.S.genButton(x,y,'GameIconsWhite',this.onDonwFullScreenBtn,this);
		fullScreenSprite.tint=0x000000;
		fullScreenSprite.setFrames(curImg,curImg,curImg,curImg);
		fullScreenSprite.anchor.setTo(.5);
		fullScreenSprite.scale.setTo(.5);
	},

	onDonwFullScreenBtn: function (sprite) {
		var curImg;
		var offImg = BasicGame.FULL_SCREEN_OFF_IMG;
		var onImg = BasicGame.FULL_SCREEN_ON_IMG;
		if (this.scale.isFullScreen) {
			curImg = onImg;
			this.scale.stopFullScreen(false);
		} else {
			curImg = offImg;
			this.scale.startFullScreen(false);
		}
		sprite.setFrames(curImg,curImg,curImg,curImg);
	},

	genLogoBtnSprite: function (x,y) {
		var logoSprite=this.M.S.genButton(x,y,'Logo',function () {
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			if (this.game.device.desktop) {
				window.open(BasicGame.YOUTUBE_URL,'_blank');
			} else {
				location.href = BasicGame.YOUTUBE_URL;
			}
		});
		logoSprite.anchor.setTo(.5,1.05);
		logoSprite.scale.setTo(.9);
	},
};
