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
			GAME_TITLE: 'aaaaaaaaaaaa',
		});
	},

	defineGlobal: function () {
		this.M.defineGlobal({
		});
	},

	defineConf: function () {
		this.M.defineConf({
			scores: this.scores(),
		});
	},
};
