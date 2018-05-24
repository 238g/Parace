BasicGame = {
	GAME_TITLE: document.title,
	MAIN_COLOR: '#fef106', // TODO
	MAIN_TINT:  0xfef106, // TODO
	MAIN_TEXT_COLOR: '#a17b63', // TODO
	MAIN_STROKE_COLOR: '#8f8e8f', // TODO
	WHITE_COLOR: '#ffffff', // TODO
	YOUTUBE_URL: '', // TODO
	VOLUME_MAX_IMG: 'VolumeMax',
	VOLUME_HALF_IMG: 'VolumeHalf',
	VOLUME_MUTE_IMG: 'VolumeMute',
	FULL_SCREEN_OFF_IMG: 'smaller',
	FULL_SCREEN_ON_IMG: 'larger',
	MY_GAMES_URL: 'https://238g.github.io/Parace/238Games.html',
};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype = {
	init:function(){this.M.BootInit(true);this.stage.disableVisibilityChange=false;},
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
		});
		this.M.defineConf({
		});
		this.M.NextScene('Preloader');
	},
};
