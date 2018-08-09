BasicGame={
	GAME_TITLE:document.title,
	MAIN_COLOR:'#ff7f26',
	MAIN_TINT:0xff7f26,
	MAIN_TEXT_COLOR:'#f8978f',
	MAIN_STROKE_COLOR:'#f8978f',
	WHITE_COLOR:'#ffffff',
	YOUTUBE_URL:'https://www.youtube.com/channel/UCevD0wKzJFpfIkvHOiQsfLQ',
	MY_GAMES_URL:'https://238g.github.io/Parace/238Games2.html',
};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
init:function(){this.M.BootInit(!0);},
preload:function(){this.load.crossOrigin='Anonymous';this.load.atlasJSONHash('loading','images/loading/loading.png','images/loading/loading.json');},
create:function(){
	this.M.defineConst({
		TOUCH_OR_CLICK:(this.game.device.touch)?'タッチ':'クリック',
		EN_TOUCH_OR_CLICK:(this.game.device.touch)?'TOUCH':'CLICK',
	});
	this.M.defineGlobal({
		curLevel:1,
		endTutorialLevel:!1,
		endTutorialScore:!1,
		endTutorialSD:!1,
		playCount:0,
	});
	this.M.defineConf({
		LevelInfo:this.genLevelInfo(),
	});
	this.M.NextScene('Preloader');
},};