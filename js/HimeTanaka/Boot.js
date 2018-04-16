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
			GAME_TITLE: document.title,
			MAIN_COLOR: '#fba4d1',
			MAIN_TINT:  0xfba4d1,
			MAIN_TEXT_COLOR: '#e30c4f',
			WHITE_COLOR: '#f8e2e5',
			SUB_TINT: 0xffc9e5,
			YOUTUBE_URL: 'https://www.youtube.com/channel/UCFv2z4iM5vHrS8bZPq4fHQQ',
			ALBUM_COUNT: 12,
		});
	},

	defineGlobal: function () {
		this.M.defineGlobal({
			loadedOnlyFirst: false,
			currentLevel: 1,
		});
	},

	defineConf: function () {
		this.M.defineConf({
			LevelInfo: this.genLevelInfo(),
		});
	},
};
