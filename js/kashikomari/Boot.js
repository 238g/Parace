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
			GAME_TITLE: 'まりちゃんばりん',
			MAIN_COLOR: '#fffd3a',
			MAIN_TINT:  0xfffd3a,
			MAIN_TEXT_COLOR: '#eaad18',
			PERFECT: 1,
			COOL: 2,
			GOOD: 3,
			BAD: 4,
			FALSE: 5,
		});
	},

	defineGlobal: function () {
		this.M.defineGlobal({
		});
	},

	defineConf: function () {
		this.M.defineConf({
			MusicalScores: this.genMusicalScores(),
		});
	},
};
