// TODO re-refer newest each js
BasicGame={
	GAME_TITLE:document.title,
	GAME_TITLE_EN:'VT-Stopwatch',
	MAIN_COLOR:'#ffffff',
	MAIN_TINT:0xffffff,
	MAIN_TEXT_COLOR:'#000000',
	MAIN_STROKE_COLOR:'#000000',
	WHITE_COLOR:'#ffffff',
	// YOUTUBE_URL:'',
	MY_GAMES_URL:'https://238g.github.io/Parace/238Games2.html',
};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
init:function(){this.M.BootInit(!1);},
preload:function(){this.load.atlasJSONHash('loading','images/loading/loading.png','images/loading/loading.json');},
create:function(){
	this.M.dGlb({
		curChar:1,
		curLang:(this.M.H.getQuery('lang')=='en')?'en':'jp',
		CharInfo:this.genCharInfo(),
		Words:this.genWords(),
	});
	this.M.NextScene('Preloader');
}};