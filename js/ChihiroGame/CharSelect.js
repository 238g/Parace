BasicGame.CharSelect = function () {};
BasicGame.CharSelect.prototype = {

	create: function () {
		this.BgContainer();
		this.BtnContainer();
		this.HUDContainer();
	},

	BgContainer: function () {
		var bgSprite = this.add.sprite(this.world.centerX,this.world.centerY,'Dialog');
		bgSprite.anchor.setTo(.5);
		bgSprite.scale.setTo(1.2);
	},

	BtnContainer: function () {
		var textStyle = this.M.S.BaseTextStyle(50);
		var leftX = this.world.width*.25;
		var rightX = leftX*3;
		var tint = BasicGame.MAIN_TINT;
		this.genChars(textStyle,tint);
		this.genBackBtnSprite(this.world.centerX,this.world.centerY+700,textStyle,tint);
		this.genVolumeBtnSprite(leftX-100,this.world.centerY+700,tint);
		this.genFullScreenBtnSprite(rightX+100,this.world.centerY+700,tint);
	},

	genChars: function (textStyle,tint) {
		var charsGroup = this.add.group();
		var CharInfo = this.M.getConf('CharInfo');
		var margin = 0;
		for (var key in CharInfo) {
			margin+=150;
			var charLabel = this.genCharBtnSprite(key,CharInfo[key].name,textStyle,tint,margin);
			charLabel.addGroup(charsGroup);
		}
		charsGroup.alignIn(this.world.bounds,Phaser.CENTER,0,0);
	},

	genCharBtnSprite: function (key,text,textStyle,tint,margin) {
		var label = this.M.S.BasicGrayLabel(0,margin,function () {
			this.M.setGlobal('curCharKey', key);
			this.start();
		},text,textStyle,{tint:tint});
		return label;
	},

	genBackBtnSprite: function (x,y,textStyle,tint) {
		this.M.S.BasicGrayLabel(x,y,function () {
			this.M.NextScene('Title');
		},'もどる',textStyle,{tint:tint});
	},

	genVolumeBtnSprite: function (x,y,tint) {
		var maxImg = BasicGame.VOLUME_MAX_IMG;
		var halfImg = BasicGame.VOLUME_HALF_IMG;
		var muteImg = BasicGame.VOLUME_MUTE_IMG;
		var curImg = this.sound.mute ? muteImg : (this.sound.volume==1) ? maxImg : halfImg;
		var volumeSprite = this.M.S.genSprite(x,y,'VolumeIcon',curImg);
		volumeSprite.anchor.setTo(.5);
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
		fullScreenSprite.UonInputDown(this.onDonwFullScreenBtn);
	},

	onDonwFullScreenBtn: function (sprite) {
		if (this.scale.isFullScreen) {
			sprite.frameName = BasicGame.FULL_SCREEN_ON_IMG;
			this.scale.stopFullScreen(false);
		} else {
			sprite.frameName = BasicGame.FULL_SCREEN_OFF_IMG;
			this.scale.startFullScreen(false);
		}
	},

	HUDContainer: function () {
		var textStyle = this.M.S.BaseTextStyle(60);
		var textSprite = this.M.S.genText(this.world.centerX,100,'ビキニにしたいひとを\nえらんでね💙',textStyle);
		textSprite.setAnchor(.5,.5);
	},

	start: function () {
		this.M.NextScene('Play');
	},
};
