BasicGame={
	GAME_TITLE:document.title,
	GAME_TITLE_EN:'KMNZ-Pazzle',
	MAIN_COLOR:'#ffffff',
	MAIN_TINT:0xffffff,
	MAIN_TEXT_COLOR:'#000000',
	MAIN_STROKE_COLOR:'#000000',
	WHITE_COLOR:'#ffffff',
	PIECE_ONE:320/3,//TODO 320
};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
init:function(){this.M.BootInit(!1)},
preload:function(){this.load.atlasJSONHash('loading','images/loading/loading.png','images/loading/loading.json')},
create:function(){
	this.M.dGlb({
		curLang:'jp',
		// curLang:(this.M.H.getQuery('lang')=='en')?'en':'jp',
		playCount:0,
		endTut:!1,
		Words:this.genWords(),
	});
	this.M.NextScene('Preloader');
},};