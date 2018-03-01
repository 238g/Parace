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
		// MEMO this.load.baseURL = 'https://238g.github.io/Parace/';
		this.load.atlasJSONHash('player', './images/sirorun/siro_running.png', './images/sirorun/siro_running.json');
		var imageAssets = {
			'obstacle_1':   './images/sirorun/virtual_1.png',
			'obstacle_2':   './images/sirorun/virtual_2.png',
			'obstacle_3':   './images/sirorun/virtual_3.png',
			'obstacle_4':   './images/sirorun/virtual_4.png',
			'nuisance':     './images/sirorun/virtual_5.png',
			'sky':          './images/sirorun/sky.png',
			'mountain':     './images/sirorun/mountain.png',
			'ground':       './images/sirorun/ground.png',
			'siro_res':     './images/sirorun/siro_res.png',
			'siro_title_1': './images/sirorun/siro_title_1.png',
			'siro_title_2': './images/sirorun/siro_title_2.png',
			'siro_title_3': './images/sirorun/siro_title_3.png',
		};
		for (var key in imageAssets) { this.load.image(key, imageAssets[key]); }
		var soundAssets = {
			'MenuClick':       './sounds/SE/Menu_Select_00.mp3', 
			'Jump':            './sounds/SE/phaseJump5.mp3', 
			'GameOver':        './sounds/VOICE/Female/game_over.ogg', 
			'LevelUp':         './sounds/VOICE/Female/level_up.ogg', 
			'HappyArcadeTune': './sounds/BGM/HappyArcadeTune.mp3', 
			'DaytimeBGM':      './sounds/BGM/ChiptuneAdventuresStage2.wav', 
			'EveningBGM':      './sounds/BGM/Awake.mp3', 
			'NightBGM':        './sounds/BGM/RailJet.mp3', 

		};
		for (var key in soundAssets) { this.load.audio(key, soundAssets[key]); }
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