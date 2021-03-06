BasicGame={};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
	init:function(){this.M.BootInit(!1);},
	preload:function(){
		this.load.crossOrigin='Anonymous';
		this.load.atlasJSONHash('loading','images/loading/loading.png','images/loading/loading.json');
	},
	create:function(){
		this.M.defineConst({
			GAME_TITLE: document.title,
			MAIN_COLOR: '#fde5b1',
			MAIN_TINT:  0xfde5b1,
			MAIN_TEXT_COLOR: '#89beff',
			WHITE_COLOR: '#ffffff',
			YOUTUBE_URL: 'https://www.youtube.com/channel/UCt0clH12Xk1-Ej5PXKGfdPA',
			TOUCH_OR_CLICK: (this.game.device.touch)?'タッチ':'クリック',
			EN_TOUCH_OR_CLICK: (this.game.device.touch)?'TOUCH':'CLICK',
		});
		this.M.defineGlobal({
			playCount:0,
			loadedOnlyFirst:!1,
		});
		this.M.defineConf({});
		this.M.NextScene('Preloader');
	},
};
