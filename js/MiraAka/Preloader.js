BasicGame.Preloader = function () {};
BasicGame.Preloader.prototype = {
	init: function () { this.sounds = null; },
	create: function () {
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},

	loadAssets: function () {
		this.load.spritesheet('WhiteBtnS','./images/public/Btns/WhiteBtnsS.png',215,50);
		this.load.atlasXML('GameIconsBlack', 
			'./images/public/sheets/GameIconsBlack.png', './images/public/sheets/GameIconsBlack.xml');
		this.load.atlasJSONHash('VolumeIcon', 
			'./images/public/VolumeIcon/VolumeIcon.png', './images/public/VolumeIcon/VolumeIcon.json');
		this.load.atlasJSONHash('CircleBtns', 
			'./images/MiraAka/CircleBtns/CircleBtns.png', './images/MiraAka/CircleBtns/CircleBtns.json');
		var imageAssets = {
			'Dialog': './images/public/dialogs/Dialog_5.jpg', // TODO
			'Logo': './images/ChihiroGame/Logo.jpg', // TODO
		};
		for (var key in imageAssets) this.load.image(key, imageAssets[key]);
		this.loadAudio();
	},

	loadAudio: function () {
		this.sounds = {
			// TODO
			'TitleBGM': [
				'./sounds/BGM/R/retrogamecenter3.mp3',
				'./sounds/BGM/R/retrogamecenter3.wav',
			],
		};
		for (var key in this.sounds) this.load.audio(key, this.sounds[key]);
	},

	loadOnlyFirst: function () {
		if (!this.M.getGlobal('loadedOnlyFirst')) {
			this.M.setGlobal('loadedOnlyFirst',true);
			if (this.game.device.desktop) document.body.style.cursor = 'pointer';
			this.M.SE.setSounds(this.sounds);
			this.M.H.setSPBrowserColor(this.M.getConst('MAIN_COLOR'));
		}
	},

	loadComplete: function () {
		this.loadOnlyFirst();
		this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');
	},
};