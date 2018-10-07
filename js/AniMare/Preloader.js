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
			'WB':'images/AniMare/WhiteBlock5x5.jpg',
			
			'Title':'images/AniMare/Title.png',

			'Bg_1':'images/AniMare/Bg_1.jpg',
			'Bg_2':'images/AniMare/Bg_2.jpg',
			'Bg_3':'images/AniMare/Bg_3.jpg',
			'Bg_4':'images/AniMare/Bg_4.jpg',
			'Bg_5':'images/AniMare/Bg_5.jpg',
			'Bg_6':'images/AniMare/Bg_6.jpg',
			'Bg_7':'images/AniMare/Bg_7.jpg',
			'Bg_8':'images/AniMare/Bg_8.jpg',
			'Bg_9':'images/AniMare/Bg_9.jpg',
			'Bg_10':'images/AniMare/Bg_10.jpg',

			'BgP_1':'images/AniMare/BgP_1.jpg',
			'BgP_2':'images/AniMare/BgP_2.jpg',
			'BgP_3':'images/AniMare/BgP_3.jpg',
			'BgP_4':'images/AniMare/BgP_4.jpg',
			'BgP_5':'images/AniMare/BgP_5.jpg',

			'Select':'images/AniMare/Select.png',
			'Select_1':'images/AniMare/Select_1.png',
			'Select_2':'images/AniMare/Select_2.png',
			'Select_3':'images/AniMare/Select_3.png',
			'Select_4':'images/AniMare/Select_4.png',
			'Select_5':'images/AniMare/Select_5.png',

			'Nanashi_1':'images/AniMare/Nanashi_1.png',

			'Player_1':'images/AniMare/Player_1.png',
			'Player_2':'images/AniMare/Player_2.png',
			'Player_3':'images/AniMare/Player_3.png',
			'Player_4':'images/AniMare/Player_4.png',
			'Player_5':'images/AniMare/Player_5.png',
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var s={
			TitleBGM:'sounds/BGM/Animare/chocolatedaisakusen',
			PlayBGM_1:'sounds/BGM/Animare/kikaikoujou',
			PlayBGM_2:'sounds/BGM/Animare/koritokanenoodori',
			PlayBGM_3:'sounds/BGM/Animare/latenightbridge',
			OnBtn:'sounds/SE/LabJP/Btn/decision9',
			OnStart:'sounds/SE/LabJP/Btn/decision4',
			Dmg:'sounds/SE/LabJP/Battle/Fight/kick-high1',
			Jump:'sounds/SE/LabJP/Battle/Fight/punch-swing1',
			WallJump:'sounds/SE/LabJP/Battle/Fight/highspeed-movement1',
			End:'sounds/SE/LabJP/Life/Other/police-whistle2',
			Res:'sounds/SE/Cartoon/ApricotJumpBounce',
			GenStart:'sounds/SE/LabJP/Life/Other/police-whistle1',
			Go:'sounds/SE/LabJP/Battle/Fight/setup1',
			HitOb_1:'sounds/SE/LabJP/Performance/Anime/nyu1',
			HitOb_2:'sounds/SE/LabJP/Performance/Anime/nyu2',
			HitOb_3:'sounds/SE/LabJP/Performance/Anime/nyu3',
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
		var twA=this.M.T.fadeInA(logo,{duration:1000,alpha:1});
		twA.start();
		var twB=this.M.T.fadeOutA(logo,{duration:500,delay:300});
		twA.chain(twB);
		twB.onComplete.add(this.start,this);
	},
	start:function(){this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title')},
};