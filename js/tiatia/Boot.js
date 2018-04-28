BasicGame = {};
BasicGame.Boot = function() {};
BasicGame.Boot.prototype = {
	init: function () {
		this.M.BootInit(true);
		this.stage.disableVisibilityChange = false;
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
			MAIN_COLOR: '#9dddef',
			MAIN_TINT:  0x9dddef,
			MAIN_TEXT_COLOR: '#ff94fc',
			WHITE_COLOR: '#fdfaf5',
			YOUTUBE_URL: 'https://www.youtube.com/channel/UCk7UMlCJ6dlluad9GLKhHzg',
			ALBUM_COUNT: 16,
		});
	},

	defineGlobal: function () {
		this.M.defineGlobal({
			loadedOnlyFirst: false,
			EnemyInfoLength: 0,
		});
	},

	defineConf: function () {
		this.M.defineConf({
			EnemyInfo: this.genEnemyInfo(),
		});
	},
};
