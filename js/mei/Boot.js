BasicGame={
	GAME_TITLE:document.title,
	GAME_TITLE_EN:document.title,
	MAIN_COLOR:'#ffffff', // TODO
	MAIN_TINT:0xffffff, // TODO
	MAIN_TEXT_COLOR:'#6e6d6b', // TODO
	MAIN_STROKE_COLOR:'#6e6d6b', // TODO
	WHITE_COLOR:'#ffffff',
	YOUTUBE_URL:'',//TODO
};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
init:function(){this.M.BootInit(!1)},
preload:function(){this.load.atlasJSONHash('loading','images/loading/loading.png','images/loading/loading.json')},
create:function(){
	this.M.dGlb({
		curLang:(this.M.H.getQuery('lang')=='en')?'en':'jp',
		playCount:0,
		endTut:!1,
		curStg:1,
		Words:this.genWords(),
		StageInfo:this.genStageInfo(),
	});
	this.M.NextScene('Preloader');
},};