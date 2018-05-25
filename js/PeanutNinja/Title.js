BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function(){this.inputEnabled=!1;this.Dialog=null;},
	create: function () {
		this.time.events.removeAll();
		this.playBGM();
		this.BgContainer();
		this.BtnContainer();
		this.DialogContainer();
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},

	playBGM: function () {
		if (this.M.SE.isPlaying('TitleBGM')) return;
		this.M.SE.stop('currentBGM');
		this.M.SE.play('TitleBGM',{isBGM:!0,loop:!0,volume:1.5});
	},

	BgContainer: function () {
		this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		var emitter = this.add.emitter(this.world.centerX,0,100);
		emitter.width = this.world.width;
		emitter.makeParticles('Peanutkun_Face');
		emitter.minParticleScale = .1;
		emitter.maxParticleScale = .5;
		emitter.setYSpeed(300, 500);
		emitter.setXSpeed(-5, 5);
		emitter.minRotation = 0;
		emitter.maxRotation = 0;
		emitter.start(false,1500,this.time.physicsElapsedMS,0);
		var textSprite = this.M.S.genText(this.world.centerX,this.world.height*.7,
			BasicGame.GAME_TITLE,this.M.S.BaseTextStyleS(40));
		textSprite.addTween('stressA',null);
		textSprite.startTween('stressA');
	},

	BtnContainer: function () {
		var textStyle = this.M.S.BaseTextStyleS(25);
		var tint = BasicGame.MAIN_TINT;
		this.genHowToSprite(this.world.centerX*1.6,this.world.height*.85,textStyle,tint);
		this.genStartBtnSprite(this.world.centerX*.4,this.world.height*.85,textStyle,tint);
		this.genOtherGameBtnSprite(this.world.centerX,this.world.height*.95,textStyle,tint);
		this.genLogoBtnSprite(10,10);
		this.genLogo2BtnSprite(this.world.width-10,10);
		var bottomY = this.world.height*.95;
		this.genVolumeBtnSprite(this.world.width*.1,bottomY,tint);
		this.genFullScreenBtnSprite(this.world.width*.9,bottomY,tint);
	},

	genStartBtnSprite: function (x,y,textStyle,tint) {
		this.M.S.BasicGrayLabelS(x,y,function () {
			if (this.inputEnabled) {
				// this.M.SE.play('OnBtn',{volume:1}); // TODO
				this.M.NextScene('SelectLevel');
			} else {
				this.playBGM();
				this.inputEnabled = true;
			}
		},'プレイ！',textStyle,{tint:tint});
	},

	genHowToSprite: function (x,y,textStyle,tint) {
		this.M.S.BasicGrayLabelS(x,y,function () {
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			this.Dialog.bringToTop();
			this.Dialog.tweenShow();
		},'遊び方',textStyle,{tint:tint});
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

	genOtherGameBtnSprite: function (x,y,textStyle,tint) {
		this.M.S.BasicGrayLabelS(x,y,function () {
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			if (this.game.device.desktop) {
				window.open(BasicGame.MY_GAMES_URL,'_blank');
			} else {
				location.href = BasicGame.MY_GAMES_URL;
			}
		},'他ゲームを遊ぶ',textStyle,{tint:tint});
	},

	genLogoBtnSprite: function (x,y) {
		this.M.S.genButton(x,y,'Logo',function () {
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			if (this.game.device.desktop) {
				window.open(BasicGame.YOUTUBE_URL,'_blank');
			} else {
				location.href = BasicGame.YOUTUBE_URL;
			}
		});
	},

	genLogo2BtnSprite: function (x,y) {
		this.M.S.genButton(x,y,'Logo2',function () {
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			if (this.game.device.desktop) {
				window.open(BasicGame.YOUTUBE_URL_2,'_blank');
			} else {
				location.href = BasicGame.YOUTUBE_URL_2;
			}
		}).anchor.setTo(1,0);
	},

	DialogContainer: function () {
		this.Dialog = this.M.S.genDialog('Dialog');
		this.Dialog.UonInputDown(function(s){s.scale.setTo(0);});
		var action = (this.game.device.touch)?'画面をスワイプさせて\n（画面をこすって）':'マウスをドラッグさせて';
		var text = 
			action+'\n'
			+'飛んでくるピーナッツくんを\n'
			+'切って切って切りまくれ！\n'
			+'ぽんぽこは切らないでね！\n'
			+'\n'
			+'レベルモードでは\n'
			+'ライフがなくなったら\n'
			+'ゲームオーバー！\n'
			+'◯秒チャレンジは切り放題！！\n'
			+'素早いピーナッツくんは\n'
			+'高得点！？\n'
			+'\n'
			+'みんなも Let\'s 切る切る〜!'
			;
			// TODO char???
		var textSprite = this.M.S.genText(0,0,text,this.M.S.BaseTextStyleS(20));
		this.Dialog.addChild(textSprite.multipleTextSprite);
		this.Dialog.addChild(textSprite);
	},
};
