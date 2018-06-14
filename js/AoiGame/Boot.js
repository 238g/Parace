BasicGame = {
	GAME_TITLE: document.title,
	MAIN_COLOR: '#6aa3d9',
	MAIN_TINT:  0x6aa3d9,
	MAIN_TEXT_COLOR: '#106ab7',
	MAIN_STROKE_COLOR: '#0b69b6',
	WHITE_COLOR: '#ffffff',
	YOUTUBE_URL: 'https://www.youtube.com/channel/UC3Ruo_5doyu514PesWGvCAg',
	VOLUME_MAX_IMG: 'VolumeMax',
	VOLUME_HALF_IMG: 'VolumeHalf',
	VOLUME_MUTE_IMG: 'VolumeMute',
	FULL_SCREEN_OFF_IMG: 'smaller',
	FULL_SCREEN_ON_IMG: 'larger',
	MY_GAMES_URL: 'https://238g.github.io/Parace/238Games.html',
};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
	init:function(){this.M.BootInit(!1);},
	preload:function(){this.load.crossOrigin='Anonymous';this.load.atlasJSONHash('loading','images/loading/loading.png','images/loading/loading.json');},
	create:function(){
		this.M.defineConst({
			MAIN_COLOR: BasicGame.MAIN_COLOR,
			MAIN_TEXT_COLOR: BasicGame.MAIN_TEXT_COLOR,
			MAIN_STROKE_COLOR: BasicGame.MAIN_STROKE_COLOR,
			WHITE_COLOR: BasicGame.WHITE_COLOR,
			TOUCH_OR_CLICK: (this.game.device.touch)?'タッチ':'クリック',
			EN_TOUCH_OR_CLICK: (this.game.device.touch)?'TOUCH':'CLICK',
			BG_COUNT:12,
		});
		this.M.defineGlobal({
			curMode:0,
			stage2Score:0,
			stage3Score:0,
			stage4Score:0,
			doneTutorial:false,
		});
		this.M.defineConf({
			ModeInfo:{
				0:{name:'ハズレ',tweetName:'ハズレモード',
					scoreRate:1,
					st2Scale:1,st3Speed:3,st4TimerInterval:3E3,},
				1:{name:'Easyモード',tweetName:'Easyモード',
					scoreRate:1,
					st2Scale:1.5,st3Speed:1,st4TimerInterval:5E3,},
				2:{name:'Hardモード\nスコア2倍',tweetName:'Hardスコア2倍モード',
					scoreRate:2,
					st2Scale:.5,st3Speed:5,st4TimerInterval:1E3,},
				3:{name:'スコア1.5倍',tweetName:'スコア1.5倍モード',
					scoreRate:1.5,
					st2Scale:1,st3Speed:3,st4TimerInterval:3E3,},
			}
		});
		this.M.NextScene('Preloader');
	},
};
