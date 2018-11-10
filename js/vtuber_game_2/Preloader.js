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
		var a={
			'PubLogo':'images/public/logo/logo.png',
			'WP':'images/TruckGoddess/WhitePaper.jpg',
			'TWP':'images/FOckingGlasses/TranslucentWhitePaper.png',
			'70TWP':'images/vtuber_game_1/70TranslucentWhitePaper.png',
			'hide_card':'images/vtuber_game_2/hide_card.jpg',
			'gacha_1':'images/vtuber_game_2/gacha_1.png',
			'gacha_2':'images/vtuber_game_2/gacha_2.png',
			'gacha_3':'images/vtuber_game_2/gacha_3.png',
			'gacha_4':'images/vtuber_game_2/gacha_4.png',
			'bg_1':'images/vtuber_game_2/bg_1.jpg',

			'todo_1':'images/vtuber_game_1/Parachute.png',
			'todo_2':'images/yuni/obstacle.png',
			'todo_3':'images/yuni/Otomemaru_1.png',
		};
		for(var k in a)this.load.image(k,a[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var s={
			TitleBGM:'sounds/BGM/vtuber_game_2/buy_something',
			OnBtn:'sounds/SE/LabJP/Btn/decision9',
			OnStart:'sounds/SE/LabJP/Btn/decision24',
			Slide:'sounds/SE/LabJP/Btn/decision22',
			OnCollection:'sounds/SE/LabJP/Btn/decision7',
			OnBack:'sounds/SE/LabJP/Btn/decision6',
			/*
			PlayBGM_1:'sounds/BGM/vtuber_game_1/zangyousenshi',
			PlayBGM_2:'sounds/BGM/vtuber_game_1/brightening',
			PlayBGM_3:'sounds/BGM/vtuber_game_1/wild-king',
			OnPanel:'sounds/SE/LabJP/Btn/decision9',
			GenStart:'sounds/SE/LabJP/Life/Other/police-whistle1',
			End:'sounds/SE/LabJP/Life/Other/police-whistle2',
			Miss:'sounds/SE/LabJP/Btn/decision19',
			Shoot:'sounds/SE/LabJP/Btn/decision20',
			HitFloor:'sounds/SE/LabJP/Btn/decision18',
			Res:'sounds/SE/Cartoon/ApricotJumpBounce',
			*/
		};
		for(var k in s){
			var p=s[k];
			this.sounds[k]=1;
			this.load.audio(k,[p+'.mp3',p+'wav']);
		}
	},
	setInitUserInfo:function(){
		var UserInfo=this.M.gGlb('UserInfo');
		if(!UserInfo.setInit){
			UserInfo.setInit=!0;
			var GachaInfo=this.M.gGlb('GachaInfo');
			for(var k in GachaInfo)UserInfo.playCount[k]=0;
			var CharInfo=this.M.gGlb('CharInfo');
			var count=0;
			for(var k in CharInfo){
				UserInfo.collection[k]={};
				for(var l in CharInfo[k].rare){
					UserInfo.collection[k][CharInfo[k].rare[l]]=0;
					count++;
				}
			}
			UserInfo.allCards=count;
		}
	},
	loadComplete:function(){
		this.M.S.loadCmpl();
		this.M.SE.setSounds(this.sounds);
		this.sound.volume=.5;
		this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		this.game.input.onDown.addOnce((__ENV!='prod')?this.start:this.showLogo,this);
		this.setInitUserInfo();
		this.stage.disableVisibilityChange=!1;
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