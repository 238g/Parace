BasicGame={
	GAME_TITLE:document.title,
	MAIN_COLOR:'#aee9f3',//TODO
	MAIN_TINT:0xaee9f3,//TODO
	MAIN_TEXT_COLOR:'#503110',//TODO
	MAIN_STROKE_COLOR:'#424242',//TODO
	WHITE_COLOR:'#ffffff',
	YOUTUBE_URL:'',//TODO
	MY_GAMES_URL:'https://238g.github.io/Parace/238Games.html',
};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
init:function(){this.M.BootInit(!1);},
preload:function(){this.load.crossOrigin='Anonymous';this.load.atlasJSONHash('loading','images/loading/loading.png','images/loading/loading.json');},
create:function(){
	this.M.defineConst({
		TOUCH_OR_CLICK: (this.game.device.touch)?'タッチ':'クリック',
		EN_TOUCH_OR_CLICK: (this.game.device.touch)?'TOUCH':'CLICK',
	});
	this.M.defineGlobal({
		endTut:!1,
	});
	this.M.defineConf({
		Vehicle:['Ambulance','Audi','Black_viper','Car','Mini_truck','Mini_van','Police','Taxi','Truck_2'],
	});
	this.M.NextScene('Preloader');
},};