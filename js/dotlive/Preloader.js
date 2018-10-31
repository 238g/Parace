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
		var i,a={
			'PubLogo':'images/public/logo/logo.png',
			'WP':'images/TruckGoddess/WhitePaper.jpg',
			'TWP':'images/FOckingGlasses/TranslucentWhitePaper.png',
			
			'todo_1':'images/yuni/Otomemaru_1.png',
		};
		for(var k in a)this.load.image(k,a[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var s={
			/*
			TitleBGM:'sounds/BGM/Hololive/song17',
			PlayBGM_1:'sounds/BGM/Hololive/hoshinonagare',
			PlayBGM_2:'sounds/BGM/Hololive/technorhythm',
			OnBtn:'sounds/SE/LabJP/Btn/decision8',
			OnStart:'sounds/SE/LabJP/Btn/decision25',
			Back:'sounds/SE/LabJP/Btn/decision6',
			Catch:'sounds/SE/LabJP/Performance/Anime/nyu2',
			Shoot:'sounds/SE/LabJP/Battle/Other/knife-throw1',
			Miss:'sounds/SE/LabJP/Battle/Fight/highspeed-movement1',
			GenStart:'sounds/SE/LabJP/Btn/decision24',
			GenEnd:'sounds/SE/LabJP/Btn/decision27',
			Res:'sounds/SE/LabJP/Btn/decision26',
			GetItem:'sounds/SE/LabJP/Performance/Anime/jump-anime1',
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