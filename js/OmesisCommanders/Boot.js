BasicGame={
	GAME_TITLE:document.title,
	MAIN_COLOR:'#668af6',
	MAIN_TINT:0x668af6,
	MAIN_TEXT_COLOR:'#557be4',
	MAIN_STROKE_COLOR:'#d16769',
	WHITE_COLOR:'#ffffff',
	MY_GAMES_URL:'https://238g.github.io/Parace/238Games2.html',
};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
init:function(){this.M.BootInit(!0);},
preload:function(){this.load.crossOrigin='Anonymous';this.load.atlasJSONHash('loading','images/loading/loading.png','images/loading/loading.json');},
create:function(){
	this.M.defineConst({
		TOUCH_OR_CLICK: (this.game.device.touch)?'タッチ':'クリック',
		EN_TOUCH_OR_CLICK: (this.game.device.touch)?'TOUCH':'CLICK',
		////// CHAR_ANIM_COUNT:6,
	});
	this.M.defineGlobal({
		curChar:1,
		curStage:1,
		charCount:0,
		endTutLevel:!1,
		endTutEndless:!1,
		rndBgm:null,
	});
	this.M.defineConf({
		CharInfo:this.genCharInfo(),
		StageInfo:this.genStageInfo(),
	});
	this.M.NextScene('Preloader');
},};