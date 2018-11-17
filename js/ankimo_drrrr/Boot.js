BasicGame = {};
BasicGame.Boot = function() {};
BasicGame.Boot.prototype = {
	init: function () {
		this.input.maxPointers=1;
		this.stage.backgroundColor='#424242';
		this.stage.disableVisibilityChange=true;
		this.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
		if (this.game.device.desktop) {
			this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		} else {
			this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		}
        this.scale.parentIsWindow = true ;
		this.scale.refresh();
	},
	preload: function () {
		this.load.crossOrigin = 'Anonymous';
		this.load.atlasJSONHash('loading', 'images/loading/loading.png', 'images/loading/loading.json');
	},
	create: function () {
		this.defineConst(); // Const.js
		this.defineGlobal();
		this.defineConf(); // Conf.js
		this.game.global.nextSceen = (__ENV!='prod') ? getQuery('s') || 'Title' : 'Title';
		this.state.start('Preloader');
	},
	defineGlobal: function () {
		this.game.global = {
			nextSceen: null,
            loadedOnlyFirst: false,
            SpriteManager: new SpriteManager(this),
            SoundManager: null,
		};
	}
};