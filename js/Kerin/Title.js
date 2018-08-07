BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){this.inputEnabled=!1;},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		this.genContent();
		this.playBGM();
		this.time.events.add(500,function () {
			this.inputEnabled=!0; 
		},this);
	},
	playBGM:function(){
		if(this.M.SE.isPlaying('TitleBGM')) return;
		this.M.SE.stop('currentBGM');
		this.M.SE.play('TitleBGM',{isBGM:!0,loop:!0,volume:1});
	},
	genContent:function(){
		var x=this.world.centerX;
		var y=this.world.centerY;
		var s=this.add.sprite(x,y,'LaughKerin');
		s.anchor.setTo(.5);
		s.animations.add('laugh').play(18,!0);
		s=this.add.sprite(x,y-s.height,'LaughKerin');
		s.anchor.setTo(.5);
		s.animations.add('laugh').play(18,!0);
		s=this.add.sprite(x,y+s.height,'LaughKerin');
		s.anchor.setTo(.5);
		s.animations.add('laugh').play(18,!0);
		var ts=this.M.S.genText(this.world.centerX,50,BasicGame.GAME_TITLE,this.M.S.BaseTextStyleS(35));
		ts.addTween('beatA',{duration:353});
		ts.startTween('beatA');
		this.BtnContainer();
	},
	BtnContainer:function(){
		var textStyle=this.M.S.BaseTextStyleS(25);
		var leftX=this.world.width*.25;
		var rightX=leftX*3;
		var y=this.world.centerY+200;
		var tint=BasicGame.MAIN_TINT;
		this.genStartBtnSprite(leftX,y,textStyle,tint);
		this.genOtherGameBtnSprite(leftX,y+75,textStyle,tint);
		this.genLogoBtnSprite(10,this.world.centerY);
		this.genVolumeBtnSprite(leftX-50,y+150,tint);
		this.genFullScreenBtnSprite(rightX+50,y+150,tint);
	},
	genStartBtnSprite:function(x,y,textStyle,tint){
		var text = 'プレイ！';
		this.M.S.BasicWhiteLabelS(x,y,function(){
			if (this.inputEnabled) {
				this.M.SE.play('OnBtn',{volume:1});
				this.M.NextScene('SelectLevel');
				myGa('start','Title','toSelectLevel',this.M.getGlobal('playCount'));
			} else {
				this.playBGM();
				this.inputEnabled=!0;
			}
		},text,textStyle,{tint:tint});
	},
	genVolumeBtnSprite:function(x,y,tint){
		var maxImg = BasicGame.VOLUME_MAX_IMG;
		var halfImg = BasicGame.VOLUME_HALF_IMG;
		var muteImg = BasicGame.VOLUME_MUTE_IMG;
		var curImg = this.sound.mute ? muteImg : (this.sound.volume==1) ? maxImg : halfImg;
		var volumeSprite = this.M.S.genSprite(x,y,'VolumeIcon',curImg);
		volumeSprite.anchor.setTo(.5);
		volumeSprite.scale.setTo(.5);
		volumeSprite.UonInputDown(this.onDownVolumeBtn);
	},
	onDownVolumeBtn:function(sprite){
		var f;
		if (this.sound.mute) {
			f=BasicGame.VOLUME_MAX_IMG;
			this.sound.mute = false;
			this.sound.volume = 1;
		} else {
			if (this.sound.volume == 1) {
				f=BasicGame.VOLUME_HALF_IMG;
				this.sound.volume = .5;
			} else {
				f=BasicGame.VOLUME_MUTE_IMG;
				this.sound.volume = 0;
				this.sound.mute = true;
			}
		}
		sprite.frameName=f;
		myGa('volume','Title',f);
	},
	genFullScreenBtnSprite:function(x,y,tint){
		var offImg = BasicGame.FULL_SCREEN_OFF_IMG;
		var onImg = BasicGame.FULL_SCREEN_ON_IMG;
		var curImg = this.scale.isFullScreen ? offImg : onImg;
		var fullScreenSprite = this.M.S.genButton(x,y,'GameIconsBlack',this.onDonwFullScreenBtn,this);
		fullScreenSprite.setFrames(curImg,curImg,curImg,curImg);
		fullScreenSprite.anchor.setTo(.5);
		fullScreenSprite.scale.setTo(.5);
	},
	onDonwFullScreenBtn:function(sprite){
		var curImg;
		var offImg = BasicGame.FULL_SCREEN_OFF_IMG;
		var onImg = BasicGame.FULL_SCREEN_ON_IMG;
		if (this.scale.isFullScreen) {
			curImg = onImg;
			this.scale.stopFullScreen(false);
			var curScreen='Small';
		} else {
			curImg = offImg;
			this.scale.startFullScreen(false);
			var curScreen='Large';
		}
		sprite.setFrames(curImg,curImg,curImg,curImg);
		myGa('fullscreen','Title',curScreen);
	},
	genOtherGameBtnSprite:function(x,y,textStyle,tint){
		var text = '他のゲームを遊ぶ';
		var label = this.M.S.BasicWhiteLabelS(x,y,function () {
			this.M.SE.play('OnBtn',{volume:1});
			if (this.game.device.desktop) {
				window.open(BasicGame.MY_GAMES_URL,'_blank');
			} else {
				location.href = BasicGame.MY_GAMES_URL;
			}
			myGa('othergames','Title','',this.M.getGlobal('playCount'));
		},text,textStyle,{tint:tint});
	},
	genLogoBtnSprite:function(x,y){
		var logoSprite = this.M.S.genButton(x,y,'Logo',function(){
			this.M.SE.play('OnBtn',{volume:1});
			if (this.game.device.desktop) {
				window.open(BasicGame.YOUTUBE_URL,'_blank');
			} else {
				location.href = BasicGame.YOUTUBE_URL;
			}
			myGa('youtube','Title','',this.M.getGlobal('playCount'));
		});
		logoSprite.anchor.setTo(0,.5);
	},
};
