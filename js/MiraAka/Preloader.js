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
		this.load.spritesheet('RedBtns','images/MiraAka/RedBtns.png',100,100);
		this.load.spritesheet('BlueBtns','images/MiraAka/BlueBtns.png',100,100);
		this.load.atlasXML('GameIconsBlack','images/public/sheets/GameIconsBlack.png','images/public/sheets/GameIconsBlack.xml');
		this.load.atlasJSONHash('VolumeIcon','images/public/VolumeIcon/VolumeIcon.png','images/public/VolumeIcon/VolumeIcon.json');
		this.load.atlasJSONHash('CircleBtns','images/MiraAka/CircleBtns/CircleBtns.png','images/MiraAka/CircleBtns/CircleBtns.json');
		var i={
			'PubLogo':'images/public/logo/logo.png',
			'Logo': 'images/MiraAka/Logo.jpg',
			'TitleBg': 'images/MiraAka/TitleBg.jpg',
			'PlayBg': 'images/MiraAka/PlayBg.jpg',
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		this.sounds={
			'TitleBGM': [
				'sounds/BGM/C/CandyBouquet.mp3',
				'sounds/BGM/C/CandyBouquet.wav',
			],
			'PlayBGM': [
				'sounds/BGM/F/famipop2.mp3',
				'sounds/BGM/F/famipop2.wav',
			],
			'QuizVoice': [
				'sounds/VOICE/MiraAka/QuizVoice.mp3',
				'sounds/VOICE/MiraAka/QuizVoice.wav',
			],
		};
		for(var k in this.sounds)this.load.audio(k,this.sounds[k]);
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