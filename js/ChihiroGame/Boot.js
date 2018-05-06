BasicGame = {};
BasicGame.Boot = function() {};
BasicGame.Boot.prototype = {
	init: function () {
		this.M.BootInit(false);
		// this.stage.disableVisibilityChange = false;
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
			GAME_TITLE: document.title,
			MAIN_COLOR: '#a9aee5',
			MAIN_TINT:  0xa9aee5,
			MAIN_TEXT_COLOR: '#7169d9',
			WHITE_COLOR: '#eaecf7',
			YOUTUBE_URL: 'https://www.youtube.com/channel/UCLO9QDxVL4bnvRRsz6K4bsQ',
			ALBUM_COUNT: 3,
		});
	},

	defineGlobal: function () {
		this.M.defineGlobal({
			loadedOnlyFirst: false,
			CharInfoLength: 0,
			curCharKey: 'Char_1',
		});
	},

	defineConf: function () {
		this.M.defineConf({
			CharInfo: this.genCharInfo(),
		});
	},
};
