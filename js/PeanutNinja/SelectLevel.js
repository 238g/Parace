BasicGame.SelectLevel = function () {};
BasicGame.SelectLevel.prototype = {
	init: function () {
		this.LevelInfo = this.M.getConf('LevelInfo');
	},

	create: function () {
		this.time.events.removeAll();
		this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		var textStyle = this.M.S.BaseTextStyleS(25);
		var levelBtnGroup = this.add.group();
		var btnSprite;
		var tint = 0x00FF00;
		for (var level in this.LevelInfo) {
			if (level>=60) {
				btnSprite = this.M.S.BasicGrayLabelS(0,0,this.selectLevel,level+'秒アタック',textStyle,{tint:0x00FFFF});
				btnSprite.level = level;
				levelBtnGroup.add(btnSprite);
			} else {
				var info = this.LevelInfo[level];
				btnSprite = this.M.S.BasicGrayLabelS(0,0,this.selectLevel,'レベル'+level,textStyle,{tint:tint});
				btnSprite.level = level;
				levelBtnGroup.add(btnSprite);
				tint*=2;
			}
		}
		levelBtnGroup.align(1,-1,btnSprite.width,btnSprite.height+10);
		levelBtnGroup.alignIn(this.world.bounds,Phaser.RIGHT_CENTER,0,0);
		this.M.S.BasicGrayLabelS(this.world.centerX,this.world.height-40,this.backToTitle,'戻る',textStyle,{tint:BasicGame.MAIN_TINT});
		var bottomY = this.world.height*.95;
		this.genVolumeBtnSprite(this.world.width*.1,bottomY,BasicGame.MAIN_TINT);
		this.genFullScreenBtnSprite(this.world.width*.9,bottomY,BasicGame.MAIN_TINT);
	},

	selectLevel: function (btnSprite) {
		this.M.setGlobal('curLevel',btnSprite.level);
		this.M.NextScene('Play');
	},

	backToTitle: function () {
		this.M.NextScene('Title');
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
		var fullScreenSprite = this.M.S.genButton(x,y,'GameIconsBlack',this.onDonwFullScreenBtn,this);
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
};
