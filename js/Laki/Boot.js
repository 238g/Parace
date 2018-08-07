BasicGame={
	GAME_TITLE:document.title,
	GAME_EN_TITLE:'LakiPyokoPyoko',
	MAIN_COLOR:'#f6d48f',
	MAIN_TINT:0xf6d48f,
	MAIN_TEXT_COLOR:'#7ae66f',
	MAIN_STROKE_COLOR:'#51ce8d',
	WHITE_COLOR:'#fffeef',
	YOUTUBE_URL:'https://www.youtube.com/channel/UCp77Qho-YHhnklRr-DkjiOw',
	MY_GAMES_URL: 'https://238g.github.io/Parace/238Games.html',
};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
init:function(){this.M.BootInit(!1);},
preload:function(){this.load.atlasJSONHash('loading','images/loading/loading.png','images/loading/loading.json');},
create:function(){
	this.M.dGlb({
		endTut:!1,
		playCount:0,
		curStage:1,
		curLang:'jp',
		// curLang:(this.M.H.getQuery('lang')=='en')?'en':'jp',
		StageInfo:this.genStageInfo(),
		Words:this.genWords(),
	});
	this.M.NextScene('Preloader');
}};