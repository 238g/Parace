BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function(){this.inputEnabled=!1;},
	create: function () {
		this.time.events.removeAll();
		this.playBGM();
		this.BgContainer();
		this.BtnContainer();
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},

	playBGM: function () {
		return; // TODO
		if(this.M.SE.isPlaying('TitleBGM'))return;
		this.M.SE.stop('currentBGM');
		this.M.SE.play('TitleBGM',{isBGM:!0,loop:!0,volume:1});
	},

	BgContainer: function () {
		this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		var textSprite = this.M.S.genText(this.world.centerX,this.world.height*.2,
			BasicGame.GAME_TITLE,this.M.S.BaseTextStyleS(40));
	},

	BtnContainer: function () {
		var tint = BasicGame.MAIN_TINT;
		this.genStartBtnSprite(this.world.centerX,this.world.height*.75);
		this.genLogoBtnSprite(this.world.centerX,this.world.height);
		this.genVolumeBtnSprite(this.world.width*.1,30,tint);
		this.genFullScreenBtnSprite(this.world.width*.9,30,tint);
	},

	genStartBtnSprite: function (x,y,tint) {
		this.add.button(x,y,'CircleBtn',this.start,this,0,0,1,0).anchor.setTo(.5);
		this.M.S.genText(x,y,'スタート',this.M.S.BaseTextStyleSS(18),tint);
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
		this.M.S.genButton(x,y,'Logo',function () {
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			if (this.game.device.desktop) {
				window.open(BasicGame.YOUTUBE_URL,'_blank');
			} else {
				location.href = BasicGame.YOUTUBE_URL;
			}
		}).anchor.setTo(.5,1);
	},
};
