BasicGame = {
	GAME_TITLE: document.title,
	MAIN_COLOR: '#ffffff',
	MAIN_TINT:  0xffffff,
	MAIN_TEXT_COLOR: '#000000',
	MAIN_STROKE_COLOR: '#ffffff',
	WHITE_COLOR: '#ffffff',
};
BasicGame.Boot = function() {};
BasicGame.Boot.prototype = {
	init:function(){this.M.BootInit(false);},
	preload: function () {
		this.load.crossOrigin = 'Anonymous';
		this.load.atlasJSONHash('loading', 'images/loading/loading.png', 'images/loading/loading.json');
	},
	create: function () {
		this.M.defineConst({
			MAIN_COLOR: BasicGame.MAIN_COLOR,
			MAIN_TEXT_COLOR: BasicGame.MAIN_TEXT_COLOR,
			MAIN_STROKE_COLOR: BasicGame.MAIN_STROKE_COLOR,
			WHITE_COLOR: BasicGame.WHITE_COLOR,
			TOUCH_OR_CLICK: (this.game.device.touch)?'タッチ':'クリック',
		});
		this.M.defineGlobal({
			isEn:(this.M.H.getQuery('lang')=='en')?true:false,
		});
		this.M.defineConf(this.genGamesInfo());
		this.M.NextScene('Preloader');
	},
};