BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.DeclearVal();
		this.DeclearObj();
	},

	DeclearVal: function () {
		this.inputEnabled = false;
	},

	DeclearObj: function () {
		this.DialogSprite = null;
	},

	create: function () {
		this.time.events.removeAll();
		this.BgContainer();
		this.BtnContainer();
		this.DialogContainer();
		this.soundController();
		this.inputController();
	},

	inputController: function () {
		return this.inputEnabled = true; // TODO check
		this.time.events.add(800,function () {
			this.inputEnabled = true; 
		},this);
	},

	soundController: function () {
		return; // TODO
		var s = this.M.SE;
		s.stop('currentBGM');
		this.time.events.add(500, function () {
			s.stop('currentBGM');
			s.play('TitleBGM',{isBGM:true,loop:true,volume:1});
		}, this);
		this.time.events.add(1200, function () {
			if (s.isPlaying('TitleBGM')) return;
			s.stop('currentBGM');
			s.play('TitleBGM',{isBGM:true,loop:true,volume:1});
		});
	},

	BgContainer: function () {
		this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		this.genBgCharSprite();
		this.genTitleTextSprite();
	},

	genBgCharSprite: function () {

	},

	genTitleTextSprite: function () {
		var textSprite = this.M.S.genText(
			this.world.centerX,50,
			BasicGame.GAME_TITLE,this.M.S.BaseTextStyle(40));
		textSprite.addTween('beatA',{duration:508});
		textSprite.startTween('beatA');
	},

	BtnContainer: function () {
		var textStyle = this.M.S.BaseTextStyleS(25);
		var leftX = this.world.width*.25;
		var rightX = leftX*3;
		var y = this.world.centerY+200;
		var tint = BasicGame.MAIN_TINT;
		this.genStartBtnSprite(leftX,y,textStyle,tint);
		this.genHowtoBtnSprite(rightX,y,textStyle,tint);
		this.genOtherGameBtnSprite(leftX,y+75,textStyle,tint);
		this.genInqueryBtnSprite(rightX,y+75,textStyle,tint);
		// this.genLogoBtnSprite(this.world.centerX,y+150); // TODO make img
		this.genVolumeBtnSprite(leftX-50,y+150,tint);
		this.genFullScreenBtnSprite(rightX+50,y+150,tint);
	},

	genStartBtnSprite: function (x,y,textStyle,tint) {
		var text = 'プレイ！';
		this.M.S.BasicWhiteLabelS(x,y,function () {
			if (this.inputEnabled) {
				this.M.NextScene('Play');
				// this.M.SE.play('Start',{volume:1}); // TODO
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
		var maxImg = BasicGame.VOLUME_MAX_IMG;
		var halfImg = BasicGame.VOLUME_HALF_IMG;
		var muteImg = BasicGame.VOLUME_MUTE_IMG;
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
		var offImg = BasicGame.FULL_SCREEN_OFF_IMG;
		var onImg = BasicGame.FULL_SCREEN_ON_IMG;
		if (this.scale.isFullScreen) {
			sprite.frameName = onImg;
			this.scale.stopFullScreen(false);
		} else {
			sprite.frameName = offImg;
			this.scale.startFullScreen(false);
		}
	},

	genOtherGameBtnSprite: function (x,y,textStyle,tint) {
		var text = '他のゲームを遊ぶ';
		var label = this.M.S.BasicWhiteLabelS(x,y,function () {
			var url = BasicGame.MY_GAMES_URL;
			if (this.game.device.desktop) {
				window.open(url,'_blank');
			} else {
				location.href = url;
			}
		},text,textStyle,{tint:tint});
	},

	genInqueryBtnSprite: function (x,y,textStyle,tint) {
		var text = '情報提供等';
		var label = this.M.S.BasicWhiteLabelS(x,y,function () {
			var url = 'https://twitter.com/'+__DEVELOPER_TWITTER_ID;
			if (this.game.device.desktop) {
				window.open(url,'_blank');
			} else {
				location.href = url;
			}
		},text,textStyle,{tint:tint});
	},

	genHowtoBtnSprite: function (x,y,textStyle,tint) {
		var text = '遊び方';
		this.M.S.BasicWhiteLabelS(x,y,function () {
			// this.M.SE.play('OpenSE',{volume:1}); // TODO
			this.DialogSprite.bringToTop();
			this.DialogSprite.tweenShow();
		},text,textStyle,{tint:tint});
	},

	genLogoBtnSprite: function (x,y) {
		var logoSprite = this.M.S.genSprite(x,y,'Logo');
		logoSprite.anchor.setTo(.5);
		logoSprite.UonInputDown(function () {
			window.open(BasicGame.YOUTUBE_URL,'_blank');
		});
		this.M.T.beatA(logoSprite,{duration:508}).start();
		var logoBgSprite = this.M.S.genBmpSprite(x,y,
			logoSprite.width+50,logoSprite.height+20,BasicGame.MAIN_COLOR);
		logoBgSprite.anchor.setTo(.5);
		this.world.bringToTop(logoSprite);
	},

	DialogContainer: function () {
		this.genDialogSprite();
		this.genHowtoTextSprite();
	},

	genDialogSprite: function () {
		this.DialogSprite = this.M.S.genDialog('Dialog',{});
		this.DialogSprite.UonInputDown(function (sprite) {
			sprite.scale.setTo(0);
		});
	},

	genHowtoTextSprite: function () {
		var text = 
			'ピーンコーン。\n'
			+'くわわります';
		var textSprite = this.M.S.genText(0,0,text,this.M.S.BaseTextStyle(50));
		this.DialogSprite.addChild(textSprite.multipleTextSprite);
		this.DialogSprite.addChild(textSprite);
	},
};
