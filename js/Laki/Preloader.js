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
			'Bg_1':'images/Laki/Bg_1.jpg',
			'PlayBg_1':'images/Laki/PlayBg_1.jpg',
			'Laki_Crouch':'images/Laki/Laki_Crouch.png',
			'Laki_Jump':'images/Laki/Laki_Jump.png',
			'Laki_Clear':'images/Laki/Laki_Clear.png',
			'Laki_GameOver':'images/Laki/Laki_GameOver.png',
			'Laki_ResPointer':'images/Laki/Laki_ResPointer.png',
			'Floor_1':'images/Laki/Floor_1.png',
			'Floor_2':'images/Laki/Floor_2.png',
			'Floor_3':'images/Laki/Floor_3.png',
			'Floor_4':'images/Laki/Floor_4.png',
			'Obstacle_1':'images/Laki/Obstacle_1.png',
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var s={
			TitleBGM:'sounds/BGM/Laki/fc',
			PlayBGM:'sounds/BGM/Laki/fruitsparfait',
			OnStart:'sounds/SE/LabJP/Btn/decision8',
			OnBtn:'sounds/SE/LabJP/Btn/decision17',
			Jump_1:'sounds/SE/Digital_SFX/phaserUp3',
			Jump_2:'sounds/SE/Digital_SFX/phaserUp4',
			Jump_3:'sounds/SE/Digital_SFX/phaserUp5',
			Jump_4:'sounds/SE/Digital_SFX/phaserUp6',
			ClearA:'sounds/SE/LabJP/Performance/Anime/eye-shine1',
			ClearB:'sounds/SE/GUI_Sound_Effects/positive',
			Blink:'sounds/SE/LabJP/Performance/Anime/blink1',
			Fall:'sounds/SE/LabJP/Performance/Anime/flee1',
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
		// this.stage.disableVisibilityChange=!1;
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