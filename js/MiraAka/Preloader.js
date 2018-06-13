BasicGame.Preloader = function () {};
BasicGame.Preloader.prototype = {
	init: function () { 
		this.sounds = null; 
		// this.isChecking = false;
		// this.touchOrClick = (this.game.device.touch)?'タッチ':'クリック';
	},
	create: function () {
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},

	/*
	update: function () {
		if (this.isChecking) {
			if (this.cache.isSoundDecoded('TitleBGM')) {
				this.isChecking = false;
				this.start();
			}
		}
	},
	*/

	loadAssets: function () {
		this.load.spritesheet('WhiteBtnS','images/public/Btns/WhiteBtnsS.png',215,50);
		this.load.spritesheet('RedBtns','images/MiraAka/RedBtns.png',100,100);
		this.load.spritesheet('BlueBtns','images/MiraAka/BlueBtns.png',100,100);
		this.load.atlasXML('GameIconsBlack', 
			'images/public/sheets/GameIconsBlack.png', 'images/public/sheets/GameIconsBlack.xml');
		this.load.atlasJSONHash('VolumeIcon', 
			'images/public/VolumeIcon/VolumeIcon.png', 'images/public/VolumeIcon/VolumeIcon.json');
		this.load.atlasJSONHash('CircleBtns', 
			'images/MiraAka/CircleBtns/CircleBtns.png', 'images/MiraAka/CircleBtns/CircleBtns.json');
		var imageAssets = {
			'Logo': 'images/MiraAka/Logo.jpg',
			'TitleBg': 'images/MiraAka/TitleBg.jpg',
			'PlayBg': 'images/MiraAka/PlayBg.jpg',
		};
		for (var key in imageAssets) this.load.image(key, imageAssets[key]);
		this.loadAudio();
	},

	loadAudio: function () {
		this.sounds = {
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
		for (var key in this.sounds) this.load.audio(key, this.sounds[key]);
	},

	loadComplete: function () {
		if (this.game.device.desktop) document.body.style.cursor = 'pointer';
		this.M.SE.setSounds(this.sounds);
		this.M.H.setSPBrowserColor(BasicGame.MAIN_COLOR);
		// this.isChecking = true;
		this.M.S.genText(this.world.centerX, this.world.centerY*1.7,
			this.M.getConst('TOUCH_OR_CLICK')+'してスタート\n'+this.M.getConst('EN_TOUCH_OR_CLICK')+' TO PLAY',{fontSize:30});
		// this.M.S.genText(this.world.centerX, this.world.centerY*1.5,this.touchOrClick+'してスタート',{fontSize:30});
		this.game.input.onDown.add(this.start,this);
		// this.M.S.genText(this.world.centerX, this.world.centerY*1.5,'アセット読み込み完了！\nBGM読み込み中…',{fontSize:30});
	},

	start: function () {
		this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');
	},
};