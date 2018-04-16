BasicGame = {};
BasicGame.Boot = function() {};
BasicGame.Boot.prototype = {
	init: function () {
		this.M.BootInit(false);
	},

	preload: function () {
		this.load.crossOrigin = 'Anonymous';
		this.load.atlasJSONHash('loading', 'images/loading/loading.png', 'images/loading/loading.json');
	},

	create: function () {
		this.defineConst();
		this.defineGlobal();
		this.defineConf();
		this.M.NextScene('Preloader');
	},

	defineConst: function () {
		this.M.defineConst({
			// TODO color
			GAME_TITLE: document.title,
			MAIN_COLOR: '#fde5b1',
			MAIN_TINT:  0xfde5b1,
			MAIN_TEXT_COLOR: '#89beff',
			WHITE_COLOR: '#ffffff',
			SUB_TINT: 0xe7161b,
			YOUTUBE_URL: 'https://www.youtube.com/channel/UCt0clH12Xk1-Ej5PXKGfdPA',
		});
	},

	defineGlobal: function () {
		this.M.defineGlobal({
			loadedOnlyFirst: false,
		});
	},

	defineConf: function () {
		this.M.defineConf({
		});
	},
};
