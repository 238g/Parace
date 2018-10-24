BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	create:function(){
		this.sounds={};
		this.M.S.genLoading();
		this.M.gGlb('curLang')=='en'?this.M.H.changeTtl(BasicGame.GAME_TITLE_EN):this.M.S.genTxt(this.world.centerX,this.world.height*.25,this.rnd.pick(__ADVICE_WORDS),this.M.S.txtstyl(25));
		this.load.onLoadComplete.add(this.loadComplete,this);
		this.loadAssets();
		this.load.start();
	},
	loadAssets:function(){
		this.M.S.loadLoadingAssetsW();
		var a={
			'PubLogo':'images/public/logo/logo.png',
			'WP':'images/TruckGoddess/WhitePaper.jpg',
			'TWP':'images/FOckingGlasses/TranslucentWhitePaper.png',
			'70TWP':'images/vtuber_game_1/70TranslucentWhitePaper.png',

			'todo_1':'images/vtuber_game_1/Parachute.png',
			'todo_2':'images/yuni/obstacle.png',
			'todo_3':'images/yuni/Otomemaru_1.png',
			/*
			'WB':'images/AniMare/WhiteBlock5x5.jpg',
			*/
		};
		for(var k in a)this.load.image(k,a[k]);
		// for(var i=1;i<=57;i++)this.load.image('intro_'+i,'images/vtuber_game_1/frame/'+i+'.png');
		this.loadAudio();
	},
	loadAudio:function(){
		var s={
			/*
			TitleBGM:'sounds/BGM/vtuber_game_1/store',
			PlayBGM_1:'sounds/BGM/vtuber_game_1/zangyousenshi',
			PlayBGM_2:'sounds/BGM/vtuber_game_1/brightening',
			PlayBGM_3:'sounds/BGM/vtuber_game_1/wild-king',
			OnBtn:'sounds/SE/LabJP/Btn/decision22',
			OnStart:'sounds/SE/LabJP/Btn/decision5',
			OnCancel:'sounds/SE/LabJP/Btn/decision6',
			OnSelect:'sounds/SE/LabJP/Btn/decision26',
			OnPlay:'sounds/SE/LabJP/Btn/decision24',
			OnPanel:'sounds/SE/LabJP/Btn/decision9',
			GenStart:'sounds/SE/LabJP/Life/Other/police-whistle1',
			End:'sounds/SE/LabJP/Life/Other/police-whistle2',
			Miss:'sounds/SE/LabJP/Btn/decision19',
			Shoot:'sounds/SE/LabJP/Btn/decision20',
			HitFloor:'sounds/SE/LabJP/Btn/decision18',
			Res:'sounds/SE/Cartoon/ApricotJumpBounce',
			*/
		};
		for(var k in s){
			var p=s[k];
			this.sounds[k]=1;
			this.load.audio(k,[p+'.mp3',p+'wav']);
		}
	},
	loadComplete:function(){
		this.M.S.loadCmpl();
		this.M.SE.setSounds(this.sounds);
		this.sound.volume=.5;
		this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		this.game.input.onDown.addOnce((__ENV!='prod')?this.start:this.showLogo,this);
	},
	showLogo:function(){
		this.M.S.genBmpSqrSp(0,0,this.world.width,this.world.height,'#000000');
		var logo=this.add.sprite(this.world.centerX,this.world.centerY,'PubLogo');
		logo.alpha=0;
		logo.anchor.setTo(.5);
		var twA=this.M.T.fadeInA(logo,{duration:1E3,alpha:1});
		twA.start();
		var twB=this.M.T.fadeOutA(logo,{duration:500,delay:300});
		twA.chain(twB);
		twB.onComplete.add(this.start,this);
	},
	start:function(){this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title')},
};