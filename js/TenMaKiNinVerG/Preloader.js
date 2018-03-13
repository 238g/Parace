BasicGame.Preloader = function () {};
BasicGame.Preloader.prototype = {
	create: function () { this.loadManager(); },

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
			'Char_T': './images/cafenozombiko/Human.png',
			'Char_M': './images/cafenozombiko/Human.png',
			'Char_K': './images/cafenozombiko/Human.png',
			'Char_N': './images/cafenozombiko/Human.png',
			'Char_G': './images/cafenozombiko/Human.png',
			'Logo': './images/TenMaKiNinVerG/Logo.png',
		};
		for (var key in imageAssets) { this.load.image(key, imageAssets[key]); }
		this.load.spritesheet('CharStones', './images/TenMaKiNinVerG/CharStones.png', 100, 100);
		this.loadAudio();
	},

	loadAudio: function () {
		/*
		this.load.audio('HumanVoice', [
			'./sounds/VOICE/VSEL/Human/Human_Good_06.mp3',
			'./sounds/VOICE/VSEL/Human/Human_Good_06.wav',
		]);
		this.load.audio('HappyBGM_1', [
			'./sounds/BGM/HappyBGM_1.mp3',
			'./sounds/BGM/HappyBGM_1.wav',
			'./sounds/BGM/HappyBGM_1.ogg',
		]);
		this.load.audio('HappyBGM_2', [
			'./sounds/BGM/HappyBGM_2.mp3',
			'./sounds/BGM/HappyBGM_2.wav',
		]);
		*/
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