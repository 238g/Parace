BasicGame.Title=function(){};
BasicGame.Title.prototype = {
	init: function(){
		this.inputEnabled=!1;
		this.Dialog=null;
	},
	create: function () {
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});
		this.BgContainer();
		this.BtnContainer();
		this.DialogContainer();
		this.time.events.add(500,function(){this.inputEnabled=!0;},this);
	},

	BgContainer: function () {
		// genTextM
		var textSprite = this.M.S.genText(this.world.centerX,this.world.height*.7,
			BasicGame.GAME_TITLE,this.M.S.BaseTextStyleS(40));
		textSprite.addTween('stressA',null);
		textSprite.startTween('stressA');
	},

	BtnContainer: function () {
		var textStyle = this.M.S.BaseTextStyleS(25);
		this.genHowToSprite(this.world.centerX*1.6,this.world.height*.85,textStyle);
		this.genStartBtnSprite(this.world.centerX*.4,this.world.height*.85,textStyle);
		this.genOtherGameBtnSprite(this.world.centerX,this.world.height*.95,textStyle);
		this.genLogoBtnSprite(10,10);
		var bottomY = this.world.height*.95;
		this.genVolumeBtnSprite(this.world.width*.1,bottomY);
		this.genFullScreenBtnSprite(this.world.width*.9,bottomY);
	},

	genStartBtnSprite: function (x,y,textStyle) {
		this.M.S.BasicGrayLabelS(x,y,function () {
			if (this.inputEnabled) {
				// this.M.SE.play('OnBtn',{volume:1}); // TODO
				this.M.NextScene('Play');
				// this.M.NextScene('SelectLevel');
			} else {
				// this.M.SE.playBGM('TitleBGM',{volume:1});
				this.inputEnabled = true;
			}
		},'プレイ！',textStyle,{tint:BasicGame.MAIN_TIN});
	},

	genHowToSprite: function (x,y,textStyle) {
		this.M.S.BasicGrayLabelS(x,y,function () {
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			this.Dialog.bringToTop();
			this.Dialog.tweenShow();
		},'遊び方',textStyle,{tint:BasicGame.MAIN_TIN});
	},

	genVolumeBtnSprite: function (x,y) {
		var volumeSprite=this.M.S.genSprite(x,y,'VolumeIcon',this.sound.mute?BasicGame.VOLUME_MUTE_IMG:(this.sound.volume==1)?BasicGame.VOLUME_MAX_IMG:BasicGame.VOLUME_HALF_IMG);
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
		var curImg=this.scale.isFullScreen?BasicGame.FULL_SCREEN_OFF_IMG:BasicGame.FULL_SCREEN_ON_IMG;
		var fullScreenSprite = this.M.S.genButton(x,y,'GameIconsWhite',this.onDonwFullScreenBtn,this);
		fullScreenSprite.tint=0x000000;
		fullScreenSprite.setFrames(curImg,curImg,curImg,curImg);
		fullScreenSprite.anchor.setTo(.5);
		fullScreenSprite.scale.setTo(.5);
	},

	onDonwFullScreenBtn: function (sprite) {
		if (this.scale.isFullScreen) {
			var curImg = BasicGame.FULL_SCREEN_ON_IMG;
			this.scale.stopFullScreen(false);
		} else {
			var curImg = BasicGame.FULL_SCREEN_OFF_IMG;
			this.scale.startFullScreen(false);
		}
		sprite.setFrames(curImg,curImg,curImg,curImg);
	},

	genOtherGameBtnSprite: function (x,y,textStyle) {
		this.M.S.BasicGrayLabelS(x,y,function () {
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			if (this.game.device.desktop) {
				window.open(BasicGame.MY_GAMES_URL,'_blank');
			} else {
				location.href = BasicGame.MY_GAMES_URL;
			}
		},'他ゲームを遊ぶ',textStyle,{tint:BasicGame.MAIN_TIN});
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

	DialogContainer: function () {
		this.Dialog = this.M.S.genDialog('Dialog');
		this.Dialog.UonInputDown(function(s){s.scale.setTo(0);});
		var action = (this.game.device.touch)?'画面をスワイプさせて\n（画面をこすって）':'マウスをドラッグさせて';
		var text = 
			action+'\n'
			+'飛んでくるピーナッツくんを\n'
			+'';
			// TODO char???
		// genTextM
		var textSprite = this.M.S.genText(0,0,text,this.M.S.BaseTextStyleS(25));
		textSprite.addToChild(this.Dialog);
	},
};
