BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	create:function(){
		this.sounds={};
		this.M.S.genLoading();
		this.M.gGlb('curLang')=='en'?this.M.H.changeTtl(BasicGame.GAME_EN_TITLE):this.M.S.genTxt(this.world.centerX,this.world.height*.25,this.rnd.pick(__ADVICE_WORDS),this.M.S.txtstyl(25));
		this.load.onLoadComplete.add(this.loadComplete,this);
		this.loadAssets();
		this.load.start();
	},
	loadAssets:function(){
		this.M.S.loadLoadingAssets();
		var i={
			'PubLogo':'images/public/logo/logo.png',
			'WP':'images/TruckGoddess/WhitePaper.jpg',
			'TWP':'images/FOckingGlasses/TranslucentWhitePaper.png',
			'Bg_1':'images/Kazaki/Bg_1.jpg',
			'Bg_2':'images/Kazaki/Bg_2.png',
			'Bg_3':'images/Kazaki/Bg_3.jpg',
			'Bg_4':'images/Kazaki/Bg_4.png',
			'Kazaki_1':'images/Kazaki/Kazaki_1.png',
			'Kazaki_2':'images/Kazaki/Kazaki_2.png',
			'Kazaki_3':'images/Kazaki/Kazaki_3.png',
			'Yamada_1':'images/Kazaki/Yamada_1.png',
			'Kazaki_1_L':'images/Kazaki/Kazaki_1_L.png',
			'Kazaki_2_L':'images/Kazaki/Kazaki_2_L.png',
			'Kazaki_3_L':'images/Kazaki/Kazaki_3_L.png',
			'Yamada_1_L':'images/Kazaki/Yamada_1_L.png',
			'Banana_1':'images/Kazaki/Banana_1.png',
			'Banana_2':'images/Kazaki/Banana_2.png',
			'Banana_3':'images/Kazaki/Banana_3.png',
			'Food_1':'images/Kazaki/Food_1.png',
			'Food_2':'images/Kazaki/Food_2.png',
			'Food_3':'images/Kazaki/Food_3.png',
			'Food_4':'images/Kazaki/Food_4.png',
			'Food_5':'images/Kazaki/Food_5.png',
			'Food_6':'images/Kazaki/Food_6.png',
			'Obstacle_1':'images/Kazaki/Obstacle_1.png',
			'Obstacle_2':'images/Kazaki/Obstacle_2.png',
			'HealthHeart':'images/Kazaki/HealthHeart.png',
			'YouTube':'images/Kazaki/YouTube.png',
			'Osamu_1':'images/Kazaki/Osamu_1.png',
			'Hiroshi_1':'images/Kazaki/Hiroshi_1.png',
			'Title':'images/Kazaki/Title.png',
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadAudio();
	},

	loadAudio:function(){
		var s={
			TitleBGM:'sounds/BGM/Kazaki/Urara',
			PlayBGM:'sounds/BGM/Kazaki/harunopayapaya',
			OnStart:'sounds/SE/LabJP/Btn/decision4',
			OnBtn:'sounds/SE/LabJP/Btn/decision7',
			Bad_1:'sounds/SE/LabJP/Performance/Anime/feed1',
			Banana_1:'sounds/VOICE/Kazaki/Banana_1',
			LetsGo:'sounds/VOICE/Kazaki/LetsGo',
			DecoBeam:'sounds/VOICE/Kazaki/DecoBeam',
			AdultVer:'sounds/VOICE/Kazaki/AdultVer',
			Foo:'sounds/VOICE/Kazaki/Foo',
			GoodRes_1:'sounds/VOICE/Kazaki/GoodRes_1',
			BadRes_1:'sounds/VOICE/Kazaki/BadRes_1',
			GoodItem:'sounds/SE/JRPG_UI/Purchase',
			TimeoutRes:'sounds/SE/LabJP/Life/Other/police-whistle2',
			ResOpen:'sounds/SE/GUI_Sound_Effects/save',
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
		this.game.input.onDown.addOnce(this.showLogo,this);
		this.M.H.getQuery('mute')&&(this.sound.mute=!0);
	},
	showLogo:function(){
		this.M.S.genBmpSqrSp(0,0,this.world.width,this.world.height,'#000000');
		var logo=this.add.sprite(this.world.centerX,this.world.centerY,'PubLogo');
		logo.alpha=0;
		logo.anchor.setTo(.5);
		var twA=this.M.T.fadeInA(logo,{duration:1000,alpha:1});
		twA.start();
		var twB=this.M.T.fadeOutA(logo,{duration:500,delay:300});
		twA.chain(twB);
		twB.onComplete.add(this.start,this);
	},
	start:function(){this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title')},
};