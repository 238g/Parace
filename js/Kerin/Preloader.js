BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	init:function(){this.sounds=null},
	create:function(){
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},
	loadAssets:function(){
		this.load.spritesheet('WhiteBtnS','images/public/Btns/WhiteBtnsS.png',215,50);
		this.load.atlasXML('GameIconsBlack','images/public/sheets/GameIconsBlack.png','images/public/sheets/GameIconsBlack.xml');
		this.load.atlasJSONHash('VolumeIcon','images/public/VolumeIcon/VolumeIcon.png','images/public/VolumeIcon/VolumeIcon.json');
		this.load.atlasJSONHash('LaughKerin','images/Kerin/LaughKerinSpritesheet/LaughKerinSpritesheet.png','images/Kerin/LaughKerinSpritesheet/LaughKerinSpritesheet.json');
		var i={
			'PubLogo':'images/public/logo/logo.png',
			'Logo':'images/Kerin/Logo.png',
			'Player':'images/Kerin/KerinOnMissile.png',
			'HappyEnd':'images/Kerin/HappyEnd.jpg',
			'BadEnd':'images/Kerin/BadEnd.jpg',
			'Sky':'images/tiatia/Bg/SkyBg_1.jpg',
			'Result_1':'images/Kerin/Result_1.jpg',
			'Result_2':'images/Kerin/Result_2.jpg',
			'Result_3':'images/Kerin/Result_3.jpg',
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadAudio();
		this.loadLevelInfo();
	},

	loadLevelInfo:function(){
		var LI=this.M.getConf('LevelInfo');
		for(var k in LI){
			var info = LI[k];
			if(info.guardImgPath)this.load.image(info.guardImgName,info.guardImgPath);
			if(info.goalImgPath)this.load.image(info.goalImg,info.goalImgPath);
		}
	},
	loadAudio:function(){
		this.sounds={
			'TitleBGM': [
				'sounds/BGM/P/Positive5.mp3',
				'sounds/BGM/P/Positive5.wav',
			],
			'PlayBGM': [
				'sounds/BGM/K/Konggyo.mp3',
				'sounds/BGM/K/Konggyo.wav',
			],
			'PlayBGM2': [
				'sounds/BGM/K/KonggyoHinako.mp3',
				'sounds/BGM/K/KonggyoHinako.wav',
			],
			'BombKerin': [
				'sounds/VOICE/Kerin/BombKerinVoice.mp3',
				'sounds/VOICE/Kerin/BombKerinVoice.wav',
			],
			'Jump': [
				'sounds/SE/Fire/Flame_1.mp3',
				'sounds/SE/Fire/Flame_1.wav',
			],
			'Success': [
				'sounds/SE/GUI_Sound_Effects/save.mp3',
				'sounds/SE/GUI_Sound_Effects/save.wav',
			],
			'OnBtn': [
				'sounds/SE/LabJP/Btn/decision15.mp3',
				'sounds/SE/LabJP/Btn/decision15.wav',
			],
		};
		for(var key in this.sounds)this.load.audio(key,this.sounds[key]);
	},
	loadComplete:function(){
		if(this.game.device.desktop)document.body.style.cursor='pointer';
		this.M.SE.setSounds(this.sounds);
		this.M.H.setSPBrowserColor(BasicGame.MAIN_COLOR);
		this.M.S.genText(this.world.centerX, this.world.centerY*1.7,
			this.M.getConst('TOUCH_OR_CLICK')+'してスタート\n'+this.M.getConst('EN_TOUCH_OR_CLICK')+' TO PLAY',{fontSize:30});
		this.game.input.onDown.addOnce(this.showLogo,this);
	},
	showLogo:function(){
		this.M.S.genBmpSprite(0,0,this.world.width,this.world.height,'#000000');
		var logo=this.add.sprite(this.world.centerX,this.world.centerY,'PubLogo');
		logo.alpha=0;
		logo.anchor.setTo(.5);
		var twA=this.M.T.fadeInA(logo,{duration:1000,alpha:1});
		twA.start();
		var twB=this.M.T.fadeOutA(logo,{duration:500,delay:300});
		twA.chain(twB);
		twB.onComplete.add(this.start,this);
	},
	start:function(){this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title')},
};