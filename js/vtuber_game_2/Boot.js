BasicGame={
	GAME_TITLE:document.title,
	GAME_TITLE_EN:'Hodgepodge2',
	MAIN_COLOR:'#ffffff',
	MAIN_TINT:0xffffff,
	MAIN_TEXT_COLOR:'#000000',
	MAIN_STROKE_COLOR:'#000000',
	WHITE_COLOR:'#ffffff',
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
		curGacha:1,
		Words:this.genWords(),
		CharInfo:this.genCharInfo(),
		GachaInfo:this.genGachaInfo(),
		UserInfo:{
			setInit:!1,
			playCount:{},
			collection:{},
			allCards:0,
			haveAllCards:0,
			haveKindCards:0,
			haveRare:{N:0,R:0,SR:0,SSR:0,UR:0},
		},
		onSkip:!1,
	});
	this.M.NextScene('Preloader');
},};