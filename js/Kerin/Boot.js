BasicGame = {
	GAME_TITLE: document.title,
	MAIN_COLOR: '#dfc6a7',
	MAIN_TINT:  0xdfc6a7,
	MAIN_TEXT_COLOR: '#56665b',
	MAIN_STROKE_COLOR: '#56665b',
	WHITE_COLOR: '#e8e5e6',
	YOUTUBE_URL: 'https://www.youtube.com/channel/UCeAfiVvEuyICYJW-f3GnQjQ',
	VOLUME_MAX_IMG: 'VolumeMax',
	VOLUME_HALF_IMG: 'VolumeHalf',
	VOLUME_MUTE_IMG: 'VolumeMute',
	FULL_SCREEN_OFF_IMG: 'smaller',
	FULL_SCREEN_ON_IMG: 'larger',
	MY_GAMES_URL: 'https://238g.github.io/Parace/238Games.html',
};
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
			MAIN_COLOR: BasicGame.MAIN_COLOR,
			MAIN_TEXT_COLOR: BasicGame.MAIN_TEXT_COLOR,
			MAIN_STROKE_COLOR: BasicGame.MAIN_STROKE_COLOR,
			WHITE_COLOR: BasicGame.WHITE_COLOR,
			TOUCH_OR_CLICK: (this.game.device.touch)?'タッチ':'クリック',
		});
	},

	defineGlobal: function () {
		this.M.defineGlobal({
			curLevelKey: 1,
			clearFlag: false,
			spawnCount: 0,
		});
	},

	defineConf: function () {
		this.M.defineConf({
			LevelInfo: this.genLevelInfo(),
		});
	},
};
