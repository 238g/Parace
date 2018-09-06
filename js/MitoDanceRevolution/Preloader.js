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
			'Title':'images/MitoDanceRevolution/Title.png',
			'Start':'images/MitoDanceRevolution/Start.png',
			'Bg_1':'images/MitoDanceRevolution/Bg_1.jpg',
			'MitoShadow':'images/MitoDanceRevolution/MitoShadow.png',
			'Mito_Face_1':'images/MitoDanceRevolution/Mito_Face_1.png',
			'Mito_Face_2':'images/MitoDanceRevolution/Mito_Face_2.png',
			'SpotLight_1':'images/MitoDanceRevolution/SpotLight_1.png',
			'Mouse':'images/MitoDanceRevolution/Mouse.png',
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadMito();
		this.loadAudio();
	},
	loadMito:function(){
		this.load.atlasJSONHash('MitoDance_1','images/MitoDanceRevolution/MitoDance_1/MitoDance_1.png','images/MitoDanceRevolution/MitoDance_1/MitoDance_1.json');
		this.load.atlasJSONHash('MitoDance_2','images/MitoDanceRevolution/MitoDance_2/MitoDance_2.jpg','images/MitoDanceRevolution/MitoDance_2/MitoDance_2.json');
		this.load.atlasJSONHash('MitoDance_3','images/MitoDanceRevolution/MitoDance_3/MitoDance_3.jpg','images/MitoDanceRevolution/MitoDance_3/MitoDance_3.json');
	},
	loadAudio:function(){
		var s={
			TitleBGM:'sounds/BGM/MitoDanceRevolution/Game-Menu',
			Title:'sounds/SE/LabJP/Btn/decision27',
			OnBtn:'sounds/SE/LabJP/Btn/decision4',
			PlayBGM_1:'sounds/BGM/MitoDanceRevolution/plankton',
			PlayBGM_2:'sounds/BGM/MitoDanceRevolution/Bumblebee',
			A_1:'sounds/VOICE/MitoDanceRevolution/A_1',
			A_2:'sounds/VOICE/MitoDanceRevolution/A_2',
			A_3:'sounds/VOICE/MitoDanceRevolution/A_3',
			A_4:'sounds/VOICE/MitoDanceRevolution/A_4',
			A_5:'sounds/VOICE/MitoDanceRevolution/A_5',
			A_6:'sounds/VOICE/MitoDanceRevolution/A_6',
			Again:'sounds/VOICE/MitoDanceRevolution/Again',
			Clear:'sounds/VOICE/MitoDanceRevolution/Clear',
			Click:'sounds/SE/LabJP/PC/click1',
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