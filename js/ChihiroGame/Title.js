BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.inputEnabled = false;
		this.Dialog = {};
		this.time.events.removeAll();
	},

	create: function () {
		this.BgContainer();
		this.BtnContainer();
		this.DialogContainer();
		this.soundController();
		this.inputController();
	},

	inputController: function () {
		this.time.events.add(800, function () {
			this.inputEnabled = true; 
		}, this);
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
		this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
		this.genBgCharSprite();
		this.genTitleTextSprite();
	},

	genBgCharSprite: function () {
		var bgGroup = this.add.group();
		var x = this.world.centerX;
		var y = this.world.centerY;
		for (var i=1;i<=this.M.getConst('ALBUM_COUNT');i++) {
			var sprite = this.add.sprite(x,y,'Album_'+i);
			sprite.anchor.setTo(.5);
			sprite.alpha = 0;
			bgGroup.add(sprite);
		}
		bgGroup.shuffle();
		this.M.T.slideshow(bgGroup,{duration:2000,delay:2000});
	},

	genTitleTextSprite: function () {
		var textSprite = this.M.S.genText(
			this.world.centerX,100,
			this.M.getConst('GAME_TITLE'),this.M.S.BaseTextStyle(80));
		textSprite.addTween('beatA',{duration:508});
		textSprite.startTween('beatA');
	},

	BtnContainer: function () {
		var textStyle = this.M.S.BaseTextStyle(50);
		var leftX = this.world.width*.25;
		var rightX = leftX*3;
		var y = this.world.centerY+400;
		var tint = this.M.getConst('MAIN_TINT');
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
				this.M.NextScene('CharSelect');
				// this.M.SE.play('Start',{volume:1}); // TODO
			}
		},text,textStyle,{tint:tint});
	},

	genVolumeBtnSprite: function (x,y,tint) {
		var maxImg = 'VolumeMax';
		var halfImg = 'VolumeHalf';
		var muteImg = 'VolumeMute';
		var curImg = this.sound.mute ? muteImg : (this.sound.volume==1) ? maxImg : halfImg;
		var volumeSprite = this.M.S.genSprite(x,y,'VolumeIcon',curImg);
		volumeSprite.anchor.setTo(.5);
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

	genOtherGameBtnSprite: function (x,y,textStyle,tint) {
		var text = '他のゲームを遊ぶ';
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			var url = 'https://238g.github.io/Parace/238Games.html';
			if (this.game.device.desktop) {
				window.open(url,'_blank');
			} else {
				location.href = url;
			}
		},text,textStyle,{tint:tint});
	},

	genHowtoBtnSprite: function (x,y,textStyle,tint) {
		var text = '遊び方';
		this.M.S.BasicGrayLabel(x,y,function () {
			// this.M.SE.play('OpenSE',{volume:1}); // TODO
			this.Dialog.bringToTop();
			this.Dialog.tweenShow();
		},text,textStyle,{tint:tint});
	},

	genLogoBtnSprite: function (x,y) {
		var logoSprite = this.M.S.genSprite(x,y,'Logo');
		logoSprite.anchor.setTo(.5);
		logoSprite.UonInputDown(function () {
			window.open(this.M.getConst('YOUTUBE_URL'),'_blank');
		});
		this.M.T.beatA(logoSprite,{duration:508}).start();
		var logoBgSprite = this.M.S.genBmpSprite(x,y,
			logoSprite.width+50,logoSprite.height+20,this.M.getConst('MAIN_COLOR'));
		logoBgSprite.anchor.setTo(.5);
		this.world.bringToTop(logoSprite);
	},

	DialogContainer: function () {
		this.genDialogSprite();
		this.genDialogCharSprite();
		this.genHowtoTextSprite();
	},

	genDialogSprite: function () {
		this.Dialog = this.M.S.genDialog('Dialog',{});
		this.Dialog.UonInputDown(function (sprite) {
			sprite.scale.setTo(0);
		});
	},

	genDialogCharSprite: function () {
		return; // TODO
		var charSprite = this.add.sprite(-600,0,'OhepanOrigin');
		charSprite.scale.setTo(2);
		this.Dialog.addChild(charSprite);
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
			+'ちょうどまんなかに\n'
			+'あてると\n'
			+'かんつうする\n'
			+'こうかがあります';
		var textSprite = this.M.S.genText(0,0,text,this.M.S.BaseTextStyle(50));
		this.Dialog.addChild(textSprite.multipleTextSprite);
		this.Dialog.addChild(textSprite);
	},
};
