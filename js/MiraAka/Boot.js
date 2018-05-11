BasicGame = {
	GAME_TITLE: document.title,
	MAIN_COLOR: '#52deff',
	MAIN_TINT:  0x52deff,
	MAIN_TEXT_COLOR: '#2ca0eb',
	MAIN_STROKE_COLOR: '#f9d682',
	WHITE_COLOR: '#f1f7fc',
	YOUTUBE_URL: 'https://www.youtube.com/channel/UCMYtONm441rBogWK_xPH9HA',
	YOUTUBE_HOWTO_URL: 'https://www.youtube.com/watch?v=f1zpkixJLmA&t=67s', // 【ミラアカゲーム】オリジナルゲーム作ったった！
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
		});
	},

	defineGlobal: function () {
		this.M.defineGlobal({
		});
	},

	defineConf: function () {
		this.M.defineConf({
			QuestionInfo: this.genQuestionInfo(),
		});
	},
};
