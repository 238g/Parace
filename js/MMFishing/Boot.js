BasicGame={
	GAME_TITLE:document.title,
	GAME_EN_TITLE:'MochiMochiFishing',
	MAIN_COLOR:'#e5c6cd',
	MAIN_TINT:0xe5c6cd,
	MAIN_TEXT_COLOR:'#a981af',
	MAIN_STROKE_COLOR:'#a67daf',
	WHITE_COLOR:'#ffffff',
	YOUTUBE_URL:'https://www.youtube.com/channel/UCmUjjW5zF1MMOhYUwwwQv9Q',
	MY_GAMES_URL: 'https://238g.github.io/Parace/238Games2.html',
};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
init:function(){this.M.BootInit(!0)},
preload:function(){this.load.atlasJSONHash('loading','images/loading/loading.png','images/loading/loading.json')},
create:function(){
	this.M.dGlb({
		endTut:!1,
		playCount:0,
		curLang:'jp',
		// curLang:(this.M.H.getQuery('lang')=='en')?'en':'jp',
		FishInfo:this.genFishInfo(),
		Words:this.genWords(),
	});
	this.M.NextScene('Preloader');
}};