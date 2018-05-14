BasicGame.Preloader = function () {};
BasicGame.Preloader.prototype = {
	init: function () { 
		this.sounds = null; 
	},
	create: function () {
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},

	loadAssets: function () {
		this.load.spritesheet('WhiteBtnS','images/public/Btns/WhiteBtnsS.png',215,50);
		this.load.atlasXML('GameIconsBlack', 
			'images/public/sheets/GameIconsBlack.png', 'images/public/sheets/GameIconsBlack.xml');
		this.load.atlasJSONHash('VolumeIcon', 
			'images/public/VolumeIcon/VolumeIcon.png', 'images/public/VolumeIcon/VolumeIcon.json');
		this.load.atlasJSONHash('LaughKerin', 
			'images/Kerin/LaughKerinSpritesheet/LaughKerinSpritesheet.png', 'images/Kerin/LaughKerinSpritesheet/LaughKerinSpritesheet.json');
		var imageAssets = {
			'Logo': 'images/Kerin/Logo.png',
			'Player': 'images/Kerin/KerinOnMissile.png',
			'HappyEnd': 'images/Kerin/BadEnd.jpg', // TODO
			'BadEnd': 'images/Kerin/BadEnd.jpg',
			'Sky': 'images/tiatia/Bg/SkyBg_1.jpg',
		};
		for (var key in imageAssets) this.load.image(key, imageAssets[key]);
		this.loadAudio();
		this.loadLevelInfo();
	},

	loadLevelInfo: function () {
		var LevelInfo = this.M.getConf('LevelInfo');
		for (var key in LevelInfo) {
			var info = LevelInfo[key];
			if (info.guardImgPath) this.load.image(info.guardImgName,info.guardImgPath);
			if (info.goalImgPath) this.load.image(info.goalImg,info.goalImgPath);
		}
	},

	loadAudio: function () {
		this.sounds = {
			'TitleBGM': [
				'sounds/BGM/P/Positive5.mp3',
				'sounds/BGM/P/Positive5.wav',
			],
			'PlayBGM': [
				'sounds/BGM/K/Konggyo.mp3',
				'sounds/BGM/K/Konggyo.wav',
			],
			'BombKerin': [
				'sounds/VOICE/Kerin/BombKerinVoice.mp3',
				'sounds/VOICE/Kerin/BombKerinVoice.wav',
			],
		};
		for (var key in this.sounds) this.load.audio(key, this.sounds[key]);
	},

	loadComplete: function () {
		if (this.game.device.desktop) document.body.style.cursor = 'pointer';
		this.M.SE.setSounds(this.sounds);
		this.M.H.setSPBrowserColor(BasicGame.MAIN_COLOR);
		this.M.S.genText(this.world.centerX, this.world.centerY*1.5,this.M.getConst('TOUCH_OR_CLICK')+'してスタート',{fontSize:30});
		this.game.input.onDown.add(this.start,this);
	},

	start: function () {
		this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');
	},
};