BasicGame={
	GAME_TITLE:document.title,
	MAIN_COLOR:'#c8f7f4',//TODO
	MAIN_TINT:0xc8f7f4,//TODO
	MAIN_TEXT_COLOR:'#28ceff',//TODO
	MAIN_STROKE_COLOR:'#7ed0e6',//TODO
	WHITE_COLOR:'#e9f0f4',//TODO
	YOUTUBE_URL_1:'https://www.youtube.com/channel/UCvmppcdYf4HOv-tFQhHHJMA',//TODO
	YOUTUBE_URL_2:'https://www.youtube.com/channel/UCvmppcdYf4HOv-tFQhHHJMA',//TODO
	MY_GAMES_URL:'https://238g.github.io/Parace/238Games.html',
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
		
	});
	this.M.defineConf({

	});
	this.M.NextScene('Preloader');
},};