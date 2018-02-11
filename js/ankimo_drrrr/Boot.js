BasicGame = {};

BasicGame.Boot = function(game) {};

BasicGame.Boot.prototype = {
	init: function () {
		this.input.maxPointers = 1;
		this.stage.backgroundColor = '#424242';

		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

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

        // var nextSceenName = (__ENV!='prod') ? getQuery('s') || 'Title' : 'Title';
	},

    defineGlobal: function () {
        this.game.global = {
            nextSceen: null,
        };
    },

    goToNextSceen: function (sceenName) {
        this.state.start(sceenName);
    }

};