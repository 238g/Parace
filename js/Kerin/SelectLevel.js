BasicGame.SelectLevel = function () {};
BasicGame.SelectLevel.prototype = {
	init: function () {
		this.DeclearConst();
	},

	DeclearConst: function () {
		this.BEAT_DURATION = 353;
	},

	create: function () {
		this.time.events.removeAll();
		this.BgContainer();
		this.BtnContainer();
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
		charSprite.scale.setTo(-1,1);
		charSprite.anchor.setTo(.5);
		charSprite.animations.add('laugh').play(18, true);
		charSprite = this.add.sprite(x,y-charSprite.height,'LaughKerin');
		charSprite.scale.setTo(-1,1);
		charSprite.anchor.setTo(.5);
		charSprite.animations.add('laugh').play(18, true);
		charSprite = this.add.sprite(x,y+charSprite.height,'LaughKerin');
		charSprite.scale.setTo(-1,1);
		charSprite.anchor.setTo(.5);
		charSprite.animations.add('laugh').play(18, true);
	},

	genTitleTextSprite: function () {
		var textSprite = this.M.S.genText(this.world.centerX,50,
			'目的地を選べ！',this.M.S.BaseTextStyleS(40));
		textSprite.addTween('beatA',{duration:this.BEAT_DURATION});
		textSprite.startTween('beatA');
	},

	BtnContainer: function () {
		var textStyle = this.M.S.BaseTextStyleS(25);
		var leftX = this.world.width*.25;
		var rightX = leftX*3;
		var y = this.world.centerY+200;
		var tint = BasicGame.MAIN_TINT;
		this.genLevels();
		this.genBackBtnSprite(rightX,y+75,textStyle,tint);
		this.genVolumeBtnSprite(leftX-50,y+150,tint);
		this.genFullScreenBtnSprite(rightX+50,y+150,tint);
	},

	genLevels: function () {
		var textStyle = this.M.S.BaseTextStyleS(20);
		var levelsGroup = this.add.group();
		var LevelInfo = this.M.getConf('LevelInfo');
		var margin = 0;
		for (var key in LevelInfo) {
			var levelBtnSprite = this.genLevelBtnSprite(key,LevelInfo[key].name,textStyle,BasicGame.MAIN_TINT,margin);
			levelsGroup.add(levelBtnSprite);
			margin+=levelBtnSprite.height+50;
		}
		levelsGroup.alignIn(this.world.bounds,Phaser.RIGHT_CENTER,0,0);
	},

	genLevelBtnSprite: function (key,text,textStyle,tint,margin) {
		var label = this.M.S.BasicWhiteLabelS(0,margin,function () {
			this.M.SE.play('OnBtn',{volume:1});
			this.M.setGlobal('curLevelKey', key);
			this.M.NextScene('Play');
		},text,textStyle,{tint:tint});
		return label;
	},

	genBackBtnSprite: function (x,y,textStyle,tint) {
		var text = '戻る';
		this.M.S.BasicWhiteLabelS(x,y,function () {
			this.M.SE.play('OnBtn',{volume:1});
			this.M.NextScene('Title');
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
};
