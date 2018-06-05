BasicGame.Title=function(){};
BasicGame.Title.prototype = {
	init: function(){
		this.inputEnabled=!1;
		this.StartBtnSprite=this.DialogTween=null;
	},
	create: function () {
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});
		this.BtnContainer();
		this.DialogContainer();
		this.time.events.add(500,function(){this.inputEnabled=!0;},this);
	},

	BtnContainer: function () {
		this.genStartBtnSprite(this.world.centerX,this.world.height*.75);
		this.genVolumeBtnSprite(this.world.width*.1,30);
		this.genFullScreenBtnSprite(this.world.width*.9,30);
	},

	genStartBtnSprite: function (x,y) {
		// TODO
		this.StartBtnSprite=this.M.S.BasicGrayLabelS(x,y,this.showCharSelecter,'スタート',this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT});
	},

	showCharSelecter:function(){
		if (this.inputEnabled) {
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			// this.M.SE.playBGM('TitleBGM',{volume:1});
			this.StartBtnSprite.hide();
			this.DialogTween.start();
		}
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

	DialogContainer:function(){
		var dialogSprite=this.add.sprite(this.world.width*1.5,this.world.centerY,'TWP');
		dialogSprite.anchor.setTo(.5);
		dialogSprite.tint = 0x000000;
		this.DialogTween=this.M.T.moveD(dialogSprite,{xy:{x:this.world.centerX},duration:1000});
		// TODO char dialogSprite.addChild();
	},

	start: function () {
		// this.M.SE.play('OnBtn',{volume:1}); // TODO
		this.M.NextScene('Play');
	},
};
