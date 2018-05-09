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
			MAIN_COLOR: '#52deff',
			MAIN_TINT:  0x52deff,
			MAIN_TEXT_COLOR: '#52deff',
			MAIN_STROKE_COLOR: '#f9d682',
			WHITE_COLOR: '#f1f7fc',
			YOUTUBE_URL: 'https://www.youtube.com/watch?v=f1zpkixJLmA', // 【ミラアカゲーム】オリジナルゲーム作ったった！
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
