BasicGame = {
	GAME_TITLE: document.title,
	MAIN_COLOR: '#a9aee5',
	MAIN_TINT:  0xa9aee5,
	MAIN_TEXT_COLOR: '#7169d9',
	MAIN_STROKE_COLOR: '#7169d9',
	WHITE_COLOR: '#eaecf7',
	YOUTUBE_URL: 'https://www.youtube.com/channel/UCLO9QDxVL4bnvRRsz6K4bsQ',
	VOLUME_MAX_IMG: 'VolumeMax',
	VOLUME_HALF_IMG: 'VolumeHalf',
	VOLUME_MUTE_IMG: 'VolumeMute',
	FULL_SCREEN_OFF_IMG: 'smaller',
	FULL_SCREEN_ON_IMG: 'larger',
	MY_GAMES_URL: 'https://238g.github.io/Parace/238Games.html',
	ALBUM_COUNT: 3,
};
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
			MAIN_COLOR: BasicGame.MAIN_COLOR,
			MAIN_TEXT_COLOR: BasicGame.MAIN_TEXT_COLOR,
			MAIN_STROKE_COLOR: BasicGame.MAIN_STROKE_COLOR,
			WHITE_COLOR: BasicGame.WHITE_COLOR,
			TOUCH_OR_CLICK: (this.game.device.touch)?'タッチ':'クリック',
			EN_TOUCH_OR_CLICK: (this.game.device.touch)?'TOUCH':'CLICK',
		});
	},

	defineGlobal: function () {
		this.M.defineGlobal({
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
