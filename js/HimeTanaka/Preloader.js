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
		this.load.atlasXML('greySheet', 
			'./images/public/sheets/greySheet.png', './images/public/sheets/greySheet.xml');
		var imageAssets = {
			'Dialog_1': './images/public/dialogs/Dialog_1.png',
			'Player': './images/ankimo_drrrr/player.png',
			'Nikuman_1': './images/HimeTanaka/Nikuman_1.png',
			'Turtle_1': './images/HimeTanaka/Turtle_1.png',
			'Pig_1': './images/HimeTanaka/Pig_1.png',
			'Chair_1': './images/HimeTanaka/Chair_1.png',
		};
		for (var key in imageAssets) this.load.image(key, imageAssets[key]);
		this.loadAudio();
	},

	loadAudio: function () {
		this.sounds = {
			/*
			'TitleBGM': [
				'./sounds/BGM/H/HappymelancholicWhole.ogg',
				'./sounds/BGM/H/HappymelancholicWhole.mp3',
				'./sounds/BGM/H/HappymelancholicWhole.wav',
			],
			'Result': [
				'./sounds/SE/LabJP/Performance/Other/dondonpafupafu1.mp3',
				'./sounds/SE/LabJP/Performance/Other/dondonpafupafu1.wav',
			],
			*/
		};
		for (var key in this.sounds) this.load.audio(key, this.sounds[key]);
	},

	loadOnlyFirst: function () {
		if (!this.M.getGlobal('loadedOnlyFirst')) {
			this.M.setGlobal('loadedOnlyFirst',true);
			if (this.game.device.desktop) document.body.style.cursor = 'pointer';
			this.M.SE.setSounds(this.sounds);
		}
	},

	loadComplete: function () {
		this.loadOnlyFirst();
		this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');
	},
};