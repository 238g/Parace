BasicGame.Preloader = function () {};

BasicGame.Preloader.prototype = {

	create: function () {
		this.loadManager();
	},

	loadManager: function () {
		this.loadingAnim();
		this.loadingText();
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},

	loadingAnim: function () {
		var loadingSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'loading');
		loadingSprite.anchor.setTo(.5);
		loadingSprite.scale.setTo(1.5);
		loadingSprite.animations.add('loading').play(18, true);
	},

	loadingText: function () {
		var textSprite = this.add.text(
			this.world.centerX, this.world.centerY+120, '0%', 
			{ font: '30px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 10 }
		);
		textSprite.anchor.setTo(.5);
		this.load.onFileComplete.add(function (progress/*, cacheKey, success, totalLoaded, totalFiles*/) {
			textSprite.setText(progress+'%');
		}, this);
	},

	loadAssets: function () {
		this.load.atlasXML('greySheet', 
			'./images/public/sheets/greySheet.png', './images/public/sheets/greySheet.xml');
		var imageAssets = {
			'MiniZombie':       './images/ankimo_drrrr/player.png', // TODO fix
			'Takashi':       './images/eff/kaede_1.png', // TODO fix
			'Particle':       './images/eff/fire_1.png', // TODO fix
		};
		for (var key in imageAssets) { this.load.image(key, imageAssets[key]); }

		this.loadAudio();
	},

	loadAudio: function () {
		this.load.audio('Gunfire', [ // TODO change se!!
			'./sounds/SE/Gun/mono_shot_weak.mp3',
			'./sounds/SE/Gun/mono_shot_weak.wav',
		]);
		this.load.audio('MushroomDance', [ // TODO fix
			'./sounds/BGM/MushroomDance.mp3',
			'./sounds/BGM/MushroomDance.wav',
			'./sounds/BGM/MushroomDance.ogg',
		]);
	},

	loadOnlyFirst: function () {
		if (!this.game.global.loadedOnlyFirst) {
			if (this.game.device.desktop) { document.body.style.cursor = 'pointer'; }
			this.game.global.SoundManager = new SoundManager(this);
			this.game.global.loadedOnlyFirst = true;
		}
	},

	loadComplete: function () {
		this.loadOnlyFirst();
		this.state.start(this.game.global.nextSceen);
	},
};