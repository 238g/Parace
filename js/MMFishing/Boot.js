BasicGame={
	GAME_TITLE:document.title,
	GAME_EN_TITLE:'bbbbbbbbbbbb',
	MAIN_COLOR:'#f6d48f',//TODO
	MAIN_TINT:0xf6d48f,//TODO
	MAIN_TEXT_COLOR:'#7ae66f',//TODO
	MAIN_STROKE_COLOR:'#51ce8d',//TODO
	WHITE_COLOR:'#fffeef',//TODO
	YOUTUBE_URL:'',//TODO
	MY_GAMES_URL: 'https://238g.github.io/Parace/238Games.html',
};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
init:function(){this.M.BootInit(!0)},
preload:function(){this.load.atlasJSONHash('loading','images/loading/loading.png','images/loading/loading.json')},
create:function(){
	this.M.dGlb({
		// endTut:!1,
		// curStage:1,
		curLang:'jp',
		// curLang:(this.M.H.getQuery('lang')=='en')?'en':'jp',
		StageInfo:this.genStageInfo(),
		Words:this.genWords(),
	});
	this.M.NextScene('Preloader');
}};