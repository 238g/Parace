BasicGame={
	GAME_TITLE:document.title,
	GAME_EN_TITLE:'Shizuzaren',
	MAIN_COLOR:'#d0c7cc',
	MAIN_TINT:0xd0c7cc,
	MAIN_TEXT_COLOR:'#4f5790',
	MAIN_STROKE_COLOR:'#4f5790',
	WHITE_COLOR:'#ffffff',
	YOUTUBE_URL_1:'https://www.youtube.com/channel/UC6oDys1BGgBsIC3WhG1BovQ',
	YOUTUBE_URL_2:'https://www.youtube.com/channel/UCUzJ90o1EjqUbk2pBAy0_aw',
	TW_URL:'https://twitter.com/sikimaru69',
};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
init:function(){this.M.BootInit(!1)},
preload:function(){this.load.atlasJSONHash('loading','images/loading/loading.png','images/loading/loading.json')},
create:function(){
	this.M.dGlb({
		endTut:!1,
		playCount:0,
		curLang:'jp',
		// curLang:(this.M.H.getQuery('lang')=='en')?'en':'jp',
		growMuscleCount:1,
		havingMuscleCount:0,
		Words:this.genWords(),
	});
	this.M.NextScene('Preloader');
},};