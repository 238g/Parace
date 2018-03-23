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
		this.load.atlasXML('fishSpritesheet', 
			'./images/AzlimBushi/fishSpritesheet.png', './images/AzlimBushi/fishSpritesheet.xml');
		var imageAssets = {
			'Net': './images/AzlimBushi/Net.png',
			'BeefBowl': './images/AzlimBushi/BeefBowl.png',
			'Azlim_1': './images/AzlimBushi/Azlim_1.png',
			'Azlim_2': './images/AzlimBushi/Azlim_2.png',
			'Azlim_3': './images/AzlimBushi/Azlim_3.png',
			'Azlim_4': './images/AzlimBushi/Azlim_4.png',
		};
		for (var key in imageAssets) { this.load.image(key, imageAssets[key]); }
		for (var i=1;i<=12;i++) {
			this.load.image('album_'+i, './images/AzlimBushi/album_'+i+'.jpg');
			this.game.global.albumCount+=1;
		}
		this.loadAudio();
	},

	loadAudio: function () {
		this.sounds = {
			'TitleBGM': [
				'./sounds/BGM/ChoroBavarioLoop.mp3',
				'./sounds/BGM/ChoroBavarioLoop.wav',
				'./sounds/BGM/ChoroBavarioLoop.ogg',
			],
			'PageOpen': [
				'./sounds/SE/Cartoon/CartoonThrow.mp3',
				'./sounds/SE/Cartoon/CartoonThrow.wav',
			],
		};
		for (var key in this.sounds) {
			this.load.audio(key, this.sounds[key]);
		}
	},

	loadOnlyFirst: function () {
		var g = this.game.global;
		if (!g.loadedOnlyFirst) {
			g.loadedOnlyFirst = true;
			if (this.game.device.desktop) { document.body.style.cursor = 'pointer'; }
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