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
			'WC':'images/HoneyStrap/WhiteCircle.png',
			'Title':'images/HoneyStrap/Title.png',

			'Bg_1':'images/HoneyStrap/Bg_1.jpg',
			'Bg_2':'images/HoneyStrap/Bg_2.jpg',
			'Bg_3':'images/HoneyStrap/Bg_3.jpg',
			'Bg_4':'images/HoneyStrap/Bg_4.jpg',
			'Bg_5':'images/HoneyStrap/Bg_5.jpg',
			'Bg_6':'images/HoneyStrap/Bg_6.jpg',
			'Bg_7':'images/HoneyStrap/Bg_7.jpg',
			'Bg_8':'images/HoneyStrap/Bg_8.jpg',
			'Bg_9':'images/HoneyStrap/Bg_9.jpg',
			'Bg_10':'images/HoneyStrap/Bg_10.jpg',

			'PlayBg_1':'images/HoneyStrap/PlayBg_1.jpg',
			'PlayBg_2':'images/HoneyStrap/PlayBg_2.jpg',
			'PlayBg_3':'images/HoneyStrap/PlayBg_3.jpg',
			'PlayBg_4':'images/HoneyStrap/PlayBg_4.jpg',
			'PlayBg_5':'images/HoneyStrap/PlayBg_5.jpg',

			'Player_1':'images/HoneyStrap/Player_1.png',
			'Player_2':'images/HoneyStrap/Player_2.png',
			'Player_3':'images/HoneyStrap/Player_3.png',
			'Player_4':'images/HoneyStrap/Player_4.png',
			'Player_5':'images/HoneyStrap/Player_5.png',

			'Earth_1_1':'images/HoneyStrap/Earth_1_1.png',
			'Earth_1_2':'images/HoneyStrap/Earth_1_2.png',
			'Earth_2_1':'images/HoneyStrap/Earth_2_1.png',
			'Earth_2_2':'images/HoneyStrap/Earth_2_2.png',
			'Earth_3_1':'images/HoneyStrap/Earth_3_1.png',
			'Earth_3_2':'images/HoneyStrap/Earth_3_2.png',
			'Earth_4_1':'images/HoneyStrap/Earth_4_1.png',
			'Earth_4_2':'images/HoneyStrap/Earth_4_2.png',
			'Earth_5_1':'images/HoneyStrap/Earth_5_1.png',
			'Earth_5_2':'images/HoneyStrap/Earth_5_2.png',

			'Nanashi_1':'images/HoneyStrap/Nanashi_1.png',
			'Mask_1':'images/HoneyStrap/Mask_1.png',
			'Mask_2':'images/HoneyStrap/Mask_2.png',
			'Mask_3':'images/HoneyStrap/Mask_3.png',

			'Select':'images/AniMare/Select.png',
			'Select_1':'images/HoneyStrap/Select_1.png',
			'Select_2':'images/HoneyStrap/Select_2.png',
			'Select_3':'images/HoneyStrap/Select_3.png',
			'Select_4':'images/HoneyStrap/Select_4.png',
			'Select_5':'images/HoneyStrap/Select_5.png',
			
			'Kanikama':'images/HoneyStrap/Kanikama.png',
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var s={
			TitleBGM:'sounds/BGM/HoneyStrap/Tea_party',
			PlayBGM_1:'sounds/BGM/HoneyStrap/neorock72',
			PlayBGM_2:'sounds/BGM/HoneyStrap/beautiful',
			PlayBGM_3:'sounds/BGM/HoneyStrap/utopia',
			OnBtn:'sounds/SE/LabJP/Btn/decision9',
			OnStart:'sounds/SE/LabJP/Btn/decision4',
			Dmg:'sounds/SE/LabJP/Battle/Fight/punch-high2',
			Jump_1:'sounds/SE/HoneyStrap/system45',
			Jump_2:'sounds/SE/HoneyStrap/system42',
			Jump_3:'sounds/SE/HoneyStrap/system43',
			GenStart:'sounds/SE/LabJP/Life/Other/police-whistle1',
			End:'sounds/SE/LabJP/Life/Other/police-whistle2',
			Res:'sounds/SE/Cartoon/ApricotJumpBounce',
			Appear:'sounds/SE/LabJP/Performance/Anime/eye-shine1',
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