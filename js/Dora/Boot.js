BasicGame={
	GAME_TITLE:document.title,
	GAME_TITLE_EN:'DoraGame',
	MAIN_COLOR:'#ffa424',
	MAIN_TINT:0xffa424,
	MAIN_TEXT_COLOR:'#c42021',
	MAIN_STROKE_COLOR:'#860404',
	WHITE_COLOR:'#ffffff',
	YOUTUBE_URL:'https://www.youtube.com/channel/UC53UDnhAAYwvNO7j_2Ju1cQ',
};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
init:function(){this.M.BootInit(!0)},
preload:function(){this.load.atlasJSONHash('loading','images/loading/loading.png','images/loading/loading.json')},
create:function(){
	this.M.dGlb({
		curLang:'jp',
		playCount:0,
		curStg:1,
		isClear:!1,
		fireCount:0,
		treasureNum:0,
		// curLang:(this.M.H.getQuery('lang')=='en')?'en':'jp',
		Words:this.genWords(),
		TreasureInfo:this.genTreasureInfo(),
	});
	this.M.NextScene('Preloader');
},};