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
			'Dialog': './images/public/dialogs/Dialog_3.png',
			'Logo': './images/AliceMononobe/Logo.jpg',
			'Player': './images/eff/Tree.png',
			'Bullet': './images/HimeTanaka/Nikuman_1.png',
			'Attack': './images/AzlimBushi/BeefBowl.png',

			// TODO get enemyInfo?
			'Enemy_1': './images/HimeTanaka/Turtle_1.png',
			'Enemy_2': './images/HimeTanaka/Pig_1.png',
			'Enemy_3': './images/HimeTanaka/Chair_1.png',
		};
		for (var key in imageAssets) this.load.image(key, imageAssets[key]);
		this.loadAudio();
	},

	loadAudio: function () {
		this.sounds = {
			'TitleBGM': [
				'./sounds/BGM/P/PerituneMaterial_Folk_Chinese.mp3',
				'./sounds/BGM/P/PerituneMaterial_Folk_Chinese.wav',
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