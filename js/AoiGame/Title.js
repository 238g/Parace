BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function(){this.inputEnabled=!1;this.EmitterPool=null;},
	create: function () {
		this.time.events.removeAll();
		this.playBGM();
		this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		var sprite=this.add.sprite(0,0,'Aoi_Title');
		var anim=sprite.animations.add('move');
		anim.play(.3,true);
		this.EmitFlower();
		var titleSprite=this.add.sprite(this.world.centerX,this.world.centerY,'Title');
		titleSprite.anchor.setTo(.5);
		titleSprite.scale.setTo(.6);
		// this.M.S.genText(this.world.centerX,this.world.height*.2,BasicGame.GAME_TITLE,this.M.S.BaseTextStyleS(40));
		this.BtnContainer();
		this.world.bringToTop(this.EmitterPool);
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},

	playBGM: function () {
		if(this.M.SE.isPlaying('TitleBGM'))return;
		this.M.SE.stop('currentBGM');
		this.M.SE.play('TitleBGM',{isBGM:!0,loop:!0,volume:1});
	},

	EmitFlower: function () {
		var back_emitter=this.add.emitter(this.world.centerX*.7,-32,Math.floor(16000/this.time.physicsElapsedMS));
		back_emitter.makeParticles('Flower');
		back_emitter.maxParticleScale=.3;
		back_emitter.minParticleScale=.1;
		back_emitter.setYSpeed(50,150);
		back_emitter.setXSpeed(20,20);
		back_emitter.gravity = 0;
		back_emitter.width=this.world.width*1.5;
		back_emitter.minRotation=0;
		back_emitter.maxRotation=40;
		var mid_emitter = this.add.emitter(this.world.centerX*.7,-32,Math.floor(5000/this.time.physicsElapsedMS));
		mid_emitter.makeParticles('Flower');
		mid_emitter.minParticleScale=.4;
		mid_emitter.maxParticleScale=.7;
		mid_emitter.setYSpeed(80,180);
		mid_emitter.setXSpeed(30,30);
		mid_emitter.gravity = 0;
		mid_emitter.width=this.world.width*1.5;
		mid_emitter.minRotation = 0;
		mid_emitter.maxRotation = 40;
		var front_emitter = this.add.emitter(this.world.centerX*.7,-32,Math.floor(3000/this.time.physicsElapsedMS));
		front_emitter.makeParticles('Flower');
		front_emitter.maxParticleScale=1;
		front_emitter.minParticleScale=.8;
		front_emitter.setYSpeed(100,200);
		front_emitter.setXSpeed(50,50);
		front_emitter.gravity = 0;
		front_emitter.width=this.world.width * 1.5;
		front_emitter.minRotation = 0;
		front_emitter.maxRotation = 40;
		this.EmitterPool=front_emitter;
		back_emitter.start(false,8000,this.time.physicsElapsedMS*1.5);
		mid_emitter.start(false,7000,this.time.physicsElapsedMS*15);
		front_emitter.start(false,6000,this.time.physicsElapsedMS*50);
		// this.camera.scale.x=.5; this.camera.scale.y=.5;
	},

	BtnContainer: function () {
		this.genStartBtnSprite(this.world.centerX,this.world.height*.75);
		this.genLogoBtnSprite(this.world.centerX,this.world.height);
		this.genVolumeBtnSprite(this.world.width*.1,30);
		this.genFullScreenBtnSprite(this.world.width*.9,30);
	},

	genStartBtnSprite: function (x,y,tint) {
		var btnSprite=this.add.button(x,y,'CircleBtn',this.start,this,0,0,1,0);
		btnSprite.anchor.setTo(.5);
		btnSprite.scale.setTo(.5);
		// var startSprite=this.add.sprite(x,y,'StartText');
		// startSprite.anchor.setTo(.5);
		// startSprite.scale.setTo(.2);
		this.M.S.genText(x,y,'スタート',this.M.S.BaseTextStyleSS(18),tint);
	},

	start: function () {
		if (this.inputEnabled) {
			this.M.SE.play('OnBtn',{volume:1});
			this.M.NextScene('Stage1');
		} else {
			this.playBGM();
			this.inputEnabled=!0;
		}
	},

	genVolumeBtnSprite: function (x,y) {
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

	genFullScreenBtnSprite: function (x,y) {
		var offImg = BasicGame.FULL_SCREEN_OFF_IMG;
		var onImg = BasicGame.FULL_SCREEN_ON_IMG;
		var curImg = this.scale.isFullScreen ? offImg : onImg;
		var fullScreenSprite = this.M.S.genButton(x,y,'GameIconsWhite',this.onDonwFullScreenBtn,this);
		fullScreenSprite.tint=0x000000;
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

	genLogoBtnSprite: function (x,y) {
		var logoSprite=this.M.S.genButton(x,y,'Logo',function () {
			this.M.SE.play('OnBtn',{volume:1});
			if (this.game.device.desktop) {
				window.open(BasicGame.YOUTUBE_URL,'_blank');
			} else {
				location.href = BasicGame.YOUTUBE_URL;
			}
		});
		logoSprite.anchor.setTo(.5,1.05);
		logoSprite.scale.setTo(.9);
	},
};
