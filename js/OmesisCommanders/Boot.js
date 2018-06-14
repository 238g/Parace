BasicGame={
	GAME_TITLE:document.title,
	MAIN_COLOR: '#fef106', // TODO
	MAIN_TINT:  0xfef106, // TODO
	MAIN_TEXT_COLOR: '#a17b63', // TODO
	MAIN_STROKE_COLOR: '#8f8e8f', // TODO
	WHITE_COLOR: '#ffffff', // TODO
	YOUTUBE_URL: '', // TODO
	MY_GAMES_URL: 'https://238g.github.io/Parace/238Games.html',
};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
init:function(){this.M.BootInit(!0);},
preload:function(){this.load.crossOrigin='Anonymous';this.load.atlasJSONHash('loading','images/loading/loading.png','images/loading/loading.json');},
create: function () {
	this.M.defineConst({
	});
	this.M.defineGlobal({
	});
	this.M.defineConf({
	});
	this.M.NextScene('Preloader');
},};