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
			'Elu_1':       './images/eff/elu_1.png',
			'Tree':        './images/eff/Tree.png',
			// 'TestTree':    './images/eff/TestTree.png',
			'DeadTree':    './images/eff/DeadTree.png',
			'Fire_1':      './images/eff/Fire_1.png',
			'Fire_2':      './images/eff/Fire_2.png',
			'Mito_1':      './images/eff/mito_1.png',
			'Kaede_1':     './images/eff/kaede_1.png',
			'WarotaPmang': './images/eff/Pmang_1.png',
			'IkaPonPmang': './images/eff/Pmang_2.png',
			'Flame':       './images/eff/Flame.png',
		};
		for (var key in imageAssets) { this.load.image(key, imageAssets[key]); }
		var soundAssets = {
			'MenuStart':       './sounds/SE/GUI_Sound_Effects/load.wav',
			'GetPmang':        './sounds/SE/GUI_Sound_Effects/positive.wav',
			'GameOver':        './sounds/SE/GUI_Sound_Effects/save.wav',
			'Miss':            './sounds/SE/GUI_Sound_Effects/negative.wav', 
			'Fire':            './sounds/SE/FireImpact_1.wav', 
			'Flame':           './sounds/SE/Fantasy/Spell_02.mp3', 
			'MushroomDance':   './sounds/BGM/MushroomDance.ogg', 
			'MushroomsForest': './sounds/BGM/MushroomsForest.ogg', 
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