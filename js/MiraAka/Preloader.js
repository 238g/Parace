BasicGame.Preloader = function () {};
BasicGame.Preloader.prototype = {
	init: function () { 
		this.sounds = null; 
		this.isChecking = false;
	},
	create: function () {
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},

	update: function () {
		if (this.isChecking) {
			if (this.cache.isSoundDecoded('TitleBGM')) {
				this.isChecking = false;
				this.start();
			}
		}
	},

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
			'Dialog': 'images/public/dialogs/Dialog_5.jpg', // TODO
			'Logo': 'images/ChihiroGame/Logo.jpg', // TODO
		};
		for (var key in imageAssets) this.load.image(key, imageAssets[key]);
		this.loadAudio();
	},

	loadAudio: function () {
		this.sounds = {
			// TODO
			'TitleBGM': [
				// 'sounds/BGM/R/retrogamecenter3.mp3',
				// 'sounds/BGM/R/retrogamecenter3.wav',
				'sounds/SE/phaseJump1.mp3',
				'sounds/SE/phaseJump1.wav',
			],
		};
		for (var key in this.sounds) this.load.audio(key, this.sounds[key]);
	},

	loadComplete: function () {
		if (this.game.device.desktop) document.body.style.cursor = 'pointer';
		this.M.SE.setSounds(this.sounds);
		this.M.H.setSPBrowserColor(BasicGame.MAIN_COLOR);
		this.isChecking = true;
		this.M.S.genText(this.world.centerX, this.world.centerY*1.5,'アセット読み込み完了！\nBGM読み込み中…',{fontSize:30});
	},

	start: function () {
		this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');
	},
};