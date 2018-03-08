BasicGame = {
	orientated: false,
};

BasicGame.Boot = function() {};

BasicGame.Boot.prototype = {
	init: function () {
		this.input.maxPointers = 1;
		this.stage.backgroundColor = '#424242';
		this.stage.disableVisibilityChange = true;

		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

		this.scale.parentIsWindow = true ;

		this.orientationController();

		this.scale.refresh();
	},

	preload: function () {
		this.load.crossOrigin = 'Anonymous';
		this.load.atlasJSONHash('loading', 'images/loading/loading.png', 'images/loading/loading.json');
	},

	create: function () {
		// this.defineConst();  // Const.js
		this.defineGlobal(); // Boot.js
		// this.defineConf();   // Conf.js

		var nextSceenName = (__ENV!='prod') ? getQuery('s') || 'Title' : 'Title';
		this.game.global.nextSceen = nextSceenName;
		this.state.start('Preloader');
	},

	defineGlobal: function () {
		this.game.global = {
			nextSceen: null,
			loadedOnlyFirst: false,
			SpriteManager: new SpriteManager(this),
			SoundManager: null,
			TweenManager: new TweenManager(this),
		};
	},

	orientationController: function () {
		if (!this.game.device.desktop) {
			this.scale.forceOrientation(true, false);
			this.scale.enterIncorrectOrientation.add(function () {
				BasicGame.orientated = false;
				document.getElementById('orientation').style.display = 'block';
			}, this);
			this.scale.leaveIncorrectOrientation.add(function () {
				BasicGame.orientated = true;
				document.getElementById('orientation').style.display = 'none';
			}, this);
		}
	},

};