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
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var s={
			// TitleBGM:'sounds/BGM/Upd8Game/TranceMenu',
			// OnStart:'sounds/SE/LabJP/Btn/decision4',
			// OnBtn:'sounds/SE/LabJP/Btn/decision7',
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
		this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		return this.start();
		this.game.input.onDown.addOnce(this.showLogo,this);
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