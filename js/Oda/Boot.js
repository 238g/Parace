BasicGame={
	GAME_TITLE: document.title,
	MAIN_COLOR: '#cbdf9c',
	MAIN_TINT:  0xcbdf9c,
	MAIN_TEXT_COLOR: '#ff549c',
	MAIN_STROKE_COLOR: '#ff549c',
	WHITE_COLOR: '#ffffff',
	YOUTUBE_URL_1: 'https://www.youtube.com/channel/UCnqDxEcVsvt7WpDy0px1HgA', // おだのぶ
	YOUTUBE_URL_2: 'https://www.youtube.com/channel/UCGcD5iUDG8xiywZeeDxye-A', // 織田信姫
	VOLUME_MAX_IMG: 'VolumeMax',
	VOLUME_HALF_IMG: 'VolumeHalf',
	VOLUME_MUTE_IMG: 'VolumeMute',
	FULL_SCREEN_OFF_IMG: 'smaller',
	FULL_SCREEN_ON_IMG: 'larger',
	MY_GAMES_URL: 'https://238g.github.io/Parace/238Games.html',
};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
init:function(){this.M.BootInit(!1);},
preload:function(){this.load.crossOrigin='Anonymous';this.load.atlasJSONHash('loading','images/loading/loading.png','images/loading/loading.json');},
create:function(){
	this.M.defineConst({
		MAIN_COLOR: BasicGame.MAIN_COLOR,
		MAIN_TEXT_COLOR: BasicGame.MAIN_TEXT_COLOR,
		MAIN_STROKE_COLOR: BasicGame.MAIN_STROKE_COLOR,
		WHITE_COLOR: BasicGame.WHITE_COLOR,
		TOUCH_OR_CLICK: (this.game.device.touch)?'タッチ':'クリック',
		EN_TOUCH_OR_CLICK: (this.game.device.touch)?'TOUCH':'CLICK',
	});
	this.M.defineGlobal({
		endTutorial:!1,
		curLevel:1,
		curChar:'Odanobu',
		curLang:(this.M.H.getQuery('lang')=='en')?'en':'jp',
	});
	this.M.defineConf({
		LevelInfo:this.LevelInfo(),
	});
	this.M.NextScene('Preloader');
},};
