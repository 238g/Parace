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
		this.load.spritesheet('Conveyor','images/Shizuzaren/Conveyor.png',235,59);
		this.load.spritesheet('Cords','images/Shizuzaren/Cords.png',16,26);
		var i={
			'PubLogo':'images/public/logo/logo.png',
			'WP':'images/TruckGoddess/WhitePaper.jpg',
			'TWP':'images/FOckingGlasses/TranslucentWhitePaper.png',
			'AbdominalMuscle':'images/Shizuzaren/AbdominalMuscle.png',
			'Gilzaren_1':'images/Shizuzaren/Gilzaren_1.png',
			'Gilzaren_2':'images/Shizuzaren/Gilzaren_2.png',
			'Bg_1':'images/Shizuzaren/Bg_1.jpg',
			'Bg_2':'images/Shizuzaren/Bg_2.jpg',
			'Bg_3':'images/Shizuzaren/Bg_3.jpg',
			'Bg_4':'images/Shizuzaren/Bg_4.jpg',
			'Bg_5':'images/Shizuzaren/Bg_5.jpg',
			'Machine_1':'images/Shizuzaren/Machine_1.png',
			'Bell':'images/Shizuzaren/Bell.png',
			'LastCord':'images/Shizuzaren/LastCord.png',
			'Gift':'images/Shizuzaren/Gift.png',
			'GiftL':'images/Shizuzaren/GiftL.png',
			'BackArrow':'images/Shizuzaren/BackArrow.png',
			'AbdominalMuscleIcon':'images/Shizuzaren/AbdominalMuscleIcon.png',
			'TwitterLogoBlue':'images/Shizuzaren/TwitterLogoBlue.png',
			'Title':'images/Shizuzaren/Title.png',
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var s={
			TitleBGM:'sounds/BGM/Shizuzaren/amenokoibitotachi_CUT',
			PlayBGM:'sounds/BGM/Shizuzaren/Factory',
			Play2BGM:'sounds/BGM/Shizuzaren/CasinoMan',
			GrabMuscle:'sounds/SE/LabJP/Performance/Anime/puyon1',
			GetMuscle:'sounds/SE/Digital_SFX/powerUp9',
			OnBtn:'sounds/SE/LabJP/Btn/decision22',
			OnStart:'sounds/SE/LabJP/Life/Run/dash-leather-shoes1_SHORT',
			Swing:'sounds/SE/LabJP/Battle/Fight/punch-swing1',
			Gift_1:'sounds/SE/LabJP/Performance/Anime/shakin1',
			Gift_2:'sounds/SE/LabJP/Btn/decision12',
			Gift_3:'sounds/SE/LabJP/Btn/decision9',
			Gift_4:'sounds/SE/LabJP/Btn/decision20',
			Gift_5:'sounds/SE/LabJP/Btn/decision10',
			Jackpot:'sounds/SE/LabJP/Performance/Other/trumpet1',
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