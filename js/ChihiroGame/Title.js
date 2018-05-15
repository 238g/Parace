BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.inputEnabled = false;
		this.BEAT_DURATION = 508;
		this.Dialog = {};
	},

	create: function () {
		this.time.events.removeAll();
		this.BgContainer();
		this.BtnContainer();
		this.DialogContainer();
		this.soundController();
		this.inputController();
	},

	soundController: function () {
		this.playBGM();
	},

	playBGM: function () {
		if (this.M.SE.isPlaying('TitleBGM')) return;
		this.M.SE.stop('currentBGM');
		this.M.SE.play('TitleBGM',{isBGM:true,loop:true,volume:1});
	},

	inputController: function () {
		this.time.events.add(800, function () {
			this.inputEnabled = true;
		}, this);
	},

	BgContainer: function () {
		this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		this.genBgCharSprite();
		this.genTitleTextSprite();
	},

	genBgCharSprite: function () {
		var bgGroup = this.add.group();
		var x = this.world.centerX;
		var y = this.world.centerY;
		var albumCount = BasicGame.ALBUM_COUNT;
		for (var i=1;i<=albumCount;i++) {
			var sprite = this.add.sprite(x,y,'Album_'+i);
			sprite.anchor.setTo(.5);
			sprite.alpha = 0;
			bgGroup.add(sprite);
		}
		bgGroup.shuffle();
		this.M.T.slideshow(bgGroup,{duration:2000,delay:2000});
	},

	genTitleTextSprite: function () {
		var textSprite = this.M.S.genText(this.world.centerX,100,BasicGame.GAME_TITLE,this.M.S.BaseTextStyle(80));
		textSprite.addTween('beatA',{duration:this.BEAT_DURATION});
		textSprite.startTween('beatA');
	},

	BtnContainer: function () {
		var textStyle = this.M.S.BaseTextStyle(50);
		var leftX = this.world.width*.25;
		var rightX = leftX*3;
		var y = this.world.centerY+400;
		var tint = BasicGame.MAIN_TINT;
		this.genStartBtnSprite(leftX,y,textStyle,tint);
		this.genHowtoBtnSprite(rightX,y,textStyle,tint);
		this.genLogoBtnSprite(this.world.centerX,y+150);
		this.genOtherGameBtnSprite(this.world.centerX,y+300,textStyle,tint);
		this.genVolumeBtnSprite(leftX-100,y+300,tint);
		this.genFullScreenBtnSprite(rightX+100,y+300,tint);
	},

	genStartBtnSprite: function (x,y,textStyle,tint) {
		var text = 'スタート';
		this.M.S.BasicGrayLabel(x,y,function () {
			if (this.inputEnabled) {
				this.M.SE.play('Start',{volume:1});
				this.M.NextScene('CharSelect');
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

	genOtherGameBtnSprite: function (x,y,textStyle,tint) {
		var text = '他のゲームを遊ぶ';
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			this.M.SE.play('OnBtn',{volume:1});
			if (this.game.device.desktop) {
				window.open(BasicGame.MY_GAMES_URL,'_blank');
			} else {
				location.href = BasicGame.MY_GAMES_URL;
			}
		},text,textStyle,{tint:tint});
	},

	genHowtoBtnSprite: function (x,y,textStyle,tint) {
		var text = '遊び方';
		this.M.S.BasicGrayLabel(x,y,function () {
			this.M.SE.play('OnBtn',{volume:1});
			this.Dialog.bringToTop();
			this.Dialog.tweenShow();
		},text,textStyle,{tint:tint});
	},

	genLogoBtnSprite: function (x,y) {
		var logoSprite = this.M.S.genSprite(x,y,'Logo');
		logoSprite.anchor.setTo(.5);
		logoSprite.UonInputDown(function () {
			this.M.SE.play('OnBtn',{volume:1});
			if (this.game.device.desktop) {
				window.open(BasicGame.YOUTUBE_URL,'_blank');
			} else {
				location.href = BasicGame.YOUTUBE_URL;
			}
		});
		this.M.T.beatA(logoSprite,{duration:this.BEAT_DURATION}).start();
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
		this.Dialog = this.M.S.genDialog('Dialog',{});
		this.Dialog.UonInputDown(function (sprite) {
			sprite.scale.setTo(0);
		});
	},

	genHowtoTextSprite: function () {
		var text = 
			'ピーンコーン。\n'
			+'ちゅうい：こちらのゲームは\n'
			+'ぜんねんれいむけゲームです\n'
			+'けんぜんです\n'
			+'いたってけんぜんです\n'
			+'\n'
			+'ほんだい：\n'
			+'このゲームはブロックくずしです\n'
			+'とくべつなアイテムは\n'
			+'よういしていません\n'
			+'\n'
			+'パドル（バー）の\n'
			+'まんなかに\n'
			+'ピッタリあてると\n'
			+'かんつうこうかが\n'
			+'くわわります';
		var textSprite = this.M.S.genText(0,0,text,this.M.S.BaseTextStyle(50));
		this.Dialog.addChild(textSprite.multipleTextSprite);
		this.Dialog.addChild(textSprite);
	},
};
