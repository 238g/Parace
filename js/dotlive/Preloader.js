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
		this.load.atlasJSONHash('snowflakes','images/dotlive/snowflake/snowflake.png','images/dotlive/snowflake/snowflake.json');
		var i,a={
			'PubLogo':'images/public/logo/logo.png',
			'WP':'images/TruckGoddess/WhitePaper.jpg',
			'TWP':'images/FOckingGlasses/TranslucentWhitePaper.png',
			'SkyBg':'images/dotlive/SkyBg.jpg',
			'Thorn':'images/dotlive/Thorn.png',
			'CircleBlock':'images/dotlive/CircleBlock.png',
			'Item_1':'images/dotlive/Item_1.png',
			'Item_2':'images/dotlive/Item_2.png',
			'Item_3':'images/dotlive/Item_3.png',
			'Item_4':'images/dotlive/Item_4.png',
			'Title':'images/dotlive/Title.png',
		};
		for(i=1;i<=12;i++)this.load.image('Char_'+i,'images/dotlive/chars/'+i+'.jpg');
		for(var k in a)this.load.image(k,a[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var s={
			TitleBGM:'sounds/BGM/dotlive/caramelkoubou',
			PlayBGM_1:'sounds/BGM/dotlive/midnightmoon',
			PlayBGM_2:'sounds/BGM/dotlive/moonspring',
			OnBtn:'sounds/SE/LabJP/Btn/decision7',
			OnStart:'sounds/SE/LabJP/Btn/decision5',
			Back:'sounds/SE/LabJP/Btn/decision6',
			Res:'sounds/SE/LabJP/Btn/decision26',
			GenStart:'sounds/SE/LabJP/Btn/decision24',
			End:'sounds/SE/LabJP/Btn/decision18',
			Jump_1:'sounds/SE/HoneyStrap/system45',
			Jump_2:'sounds/SE/HoneyStrap/system42',
			Jump_3:'sounds/SE/HoneyStrap/system43',
			AppearItem:'sounds/SE/LabJP/Performance/Anime/jump-anime1',
			GetItem:'sounds/SE/LabJP/Performance/Anime/shakin1',
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