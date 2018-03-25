BasicGame.Preloader = function () {};
BasicGame.Preloader.prototype = {
	init: function () { this.sounds = null; },
	create: function () { this.loadManager(); },

	loadManager: function () {
		var s = this.game.global.SpriteManager;
		s.MidLoadingAnim();
		s.MidLoadingText(this);
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},

	loadAssets: function () {
		this.load.atlasXML('greySheet', 
			'./images/public/sheets/greySheet.png', './images/public/sheets/greySheet.xml');
		this.load.atlasXML('GameIcons', 
			'./images/public/sheets/GameIconsWhite.png', './images/public/sheets/GameIconsWhite.xml');
		var imageAssets = {
			'Toya_1': './images/rei_Toya_rei/Toya_1.png',
			'Toya_2': './images/rei_Toya_rei/Toya_2.png',
			'Toya_3': './images/rei_Toya_rei/Toya_3.png',
			'ToyaFace_1': './images/rei_Toya_rei/ToyaFace_1.png',
			'ToyaFace_R': './images/rei_Toya_rei/ToyaFace_R.png',
			'Chihiro_1': './images/rei_Toya_rei/Chihiro_1.png',
		};
		for (var key in imageAssets) this.load.image(key, imageAssets[key]);
		this.loadAudio();
	},

	loadAudio: function () {
		this.sounds = {
			// TODO
			'TitleBGM': [
				'./sounds/BGM/RainbowRush_loop.ogg',
				'./sounds/BGM/RainbowRush_loop.mp3',
				'./sounds/BGM/RainbowRush_loop.wav',
			],
			'Hit': [
				'./sounds/SE/LabJP/Performance/Anime/feed1.mp3',
				'./sounds/SE/LabJP/Performance/Anime/feed1.wav',
			],
		};
		for (var key in this.sounds) this.load.audio(key, this.sounds[key]);
	},

	loadOnlyFirst: function () {
		var g = this.game.global;
		if (!g.loadedOnlyFirst) {
			g.loadedOnlyFirst = true;
			if (this.game.device.desktop) document.body.style.cursor = 'pointer';
			g.SoundManager = new SoundManager(this, this.sounds);
			g.SpriteManager.useTween(g.TweenManager);
		}
	},

	loadComplete: function () {
		this.loadOnlyFirst();
		__setSPBrowserColor(this.game.const.GAME_MAIN_COLOR);
		this.state.start(this.game.global.nextSceen);
	},
};