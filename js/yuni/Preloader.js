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
		var i={
			'PubLogo':'images/public/logo/logo.png',
			'WP':'images/TruckGoddess/WhitePaper.jpg',
			'TWP':'images/FOckingGlasses/TranslucentWhitePaper.png',
			'Title':'images/yuni/Title.png',
			'Ob':'images/yuni/obstacle.png',
			'Tg':'images/yuni/target.png',
			'Player_1':'images/yuni/YuNi_1.png',
			'Player_2':'images/yuni/Otomemaru_1.png',
			'YuNi_2':'images/yuni/YuNi_2.png',
			'Otomemaru_2':'images/yuni/Otomemaru_2.png',
			'Drop_1':'images/yuni/Drop_1.png',
			'Drop_2':'images/yuni/Drop_2.png',
			'PlayBg_1':'images/yuni/PlayBg_1.jpg',
		};
		for(var k in i)this.load.image(k,i[k]);
		for(var i=1;i<=41;i++)this.load.image('Bg_'+i,'images/yuni/Bg/Bg_'+i+'.jpg');
		this.loadAudio();
	},
	loadAudio:function(){
		var s={
			TitleBGM:'sounds/BGM/yuni/ukiukilalala',
			PlayBGM:'sounds/BGM/yuni/tsukitoiruka',
			OnBtn:'sounds/SE/LabJP/Btn/decision22',
			OnStart:'sounds/SE/LabJP/Btn/decision24',
			GetScore:'sounds/SE/LabJP/Btn/decision9',
			Damage:'sounds/SE/LabJP/Btn/decision18',
			Clear:'sounds/SE/LabJP/Btn/decision24',
			GameOver:'sounds/SE/JingleSet1/lose',
			Res:'sounds/SE/LabJP/Btn/decision25',
			GenStart:'sounds/SE/LabJP/Btn/decision8',
			Move:'sounds/SE/LabJP/Battle/Fight/setup1',
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