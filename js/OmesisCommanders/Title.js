BasicGame.Title=function(){};
BasicGame.Title.prototype = {
	init: function(){
		this.inputEnabled=!1;
	},
	create: function () {
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});
		this.genContents();
		this.time.events.add(500,function(){this.inputEnabled=!0;},this);
	},

	genContents: function () {
		// TODO sprite
		var sprite=this.M.S.genTextM(this.world.centerX,this.world.height*.3,BasicGame.GAME_TITLE,this.M.S.BaseTextStyleS(40));
		sprite.scale.setTo(0);
		this.M.T.popUpB(sprite,{delay:500}).start();
		this.genStartBtnSprite(this.world.centerX,this.world.height*.7,this.M.S.BaseTextStyleS(25));
		var bottomY=this.world.height*.9;
		this.genVolumeBtnSprite(this.world.width*.1,bottomY);
		this.genFullScreenBtnSprite(this.world.width*.9,bottomY);
	},

	genStartBtnSprite: function (x,y,textStyle) {
		// TODO sprite
		var sprite=this.M.S.BasicGrayLabelM(x,y,function () {
			if (this.inputEnabled) {
				// this.M.SE.play('OnBtn',{volume:1}); // TODO
				this.M.NextScene('SelectChar');
			} else {
				// this.M.SE.playBGM('TitleBGM',{volume:1});
				this.inputEnabled=!0;
			}
		},'スタート',textStyle,{tint:BasicGame.MAIN_TIN});
		sprite.scale.setTo(0);
		this.M.T.popUpB(sprite,{delay:800}).start();
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
};
