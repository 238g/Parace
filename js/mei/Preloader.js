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
		this.M.S.loadLoadingAssets();
		var i={
			'PubLogo':'images/public/logo/logo.png',
			'WP':'images/TruckGoddess/WhitePaper.jpg',
			'TWP':'images/FOckingGlasses/TranslucentWhitePaper.png',
			'TofuOnFire':'images/mei/TofuOnFire.png',
			'Fire':'images/mei/Fire.png',
			'Tofu_1':'images/mei/Tofu_1.png',
			'Tofu_2':'images/mei/Tofu_2.jpg',
			'Bg_1':'images/mei/Bg_1.jpg',
			'Bg_2':'images/mei/Bg_2.jpg',
			'Bg_3':'images/mei/Bg_3.jpg',
			'Bg_4':'images/mei/Bg_4.jpg',
			'Bg_5':'images/mei/Bg_5.jpg',
			'Earth_1':'images/mei/Earth_1.png',
			'Earth_2':'images/mei/Earth_2.png',
			'Earth_3':'images/mei/Earth_3.png',
			'Earth_4':'images/mei/Earth_4.png',
			'Satellite':'images/mei/Misosita_1.png',
			'BurnedSatellite':'images/mei/Misosita_2.png',
			'Mei_1':'images/mei/Mei_1.png',
			'Mei_2':'images/mei/Mei_2.png',
		};
		for(var k in i)this.load.image(k,i[k]);
		for(var i=1;i<=14;i++)this.load.image('Album_'+i,'images/mei/Album/'+i+'.jpg');
		this.loadAudio();
	},
	loadAudio:function(){
		var s={
			TitleBGM:'sounds/BGM/mei/comicalpizzicato',
			PlayBGM:'sounds/BGM/mei/MagicSpace',
			OnStart:'sounds/SE/LabJP/Btn/decision27',
			OnBtn:'sounds/SE/LabJP/Btn/decision26',
			CastFire:'sounds/SE/Fire/Flame_1',
			Get:'sounds/SE/Digital_SFX/powerUp8',
			Hit:'sounds/SE/JRPG_UI/Open',
			Damage:'sounds/SE/Fire/FireImpact_1',
			ChgGravity:'sounds/SE/SpellSet2/teleport',
			Clear:'sounds/SE/GUI_Sound_Effects/positive',
			GameOver:'sounds/SE/SpellSet1/explode1',
			Start:'sounds/SE/JingleSet1/receive',
			End:'sounds/SE/JingleSet1/arrive',
			Miss:'sounds/VOICE/VSEL/Human/Human_Good_06',
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