BasicGame={
	GAME_TITLE:document.title,
	MAIN_COLOR:'#aee9f3',
	MAIN_TINT:0xaee9f3,
	MAIN_TEXT_COLOR:'#503110',
	MAIN_STROKE_COLOR:'#424242',
	WHITE_COLOR:'#ffffff',
	YOUTUBE_URL:'https://www.youtube.com/channel/UCuE6xoui7gZOTUiF0OtWWJw',
	MY_GAMES_URL:'https://238g.github.io/Parace/238Games2.html',
};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
init:function(){this.M.BootInit(!1);},
preload:function(){this.load.crossOrigin='Anonymous';this.load.atlasJSONHash('loading','images/loading/loading.png','images/loading/loading.json');},
create:function(){
	this.M.defineConst({
		TOUCH_OR_CLICK: (this.game.device.touch)?'タッチ':'クリック',
		EN_TOUCH_OR_CLICK: (this.game.device.touch)?'TOUCH':'CLICK',
	});
	this.M.defineGlobal({
		curMode:'FREE',
		endTut:!1,
	});
	this.M.defineConf({
	});
	this.M.NextScene('Preloader');
},};