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
			'bg_2':'images/vtuber_game_2/bg_2.jpg',
			'bg_3':'images/vtuber_game_2/bg_3.jpg',
			'bg_4':'images/vtuber_game_2/bg_4.jpg',
			'rare_N':'images/vtuber_game_2/rare_N.png',
			'rare_R':'images/vtuber_game_2/rare_R.png',
			'rare_SR':'images/vtuber_game_2/rare_SR.png',
			'rare_SSR':'images/vtuber_game_2/rare_SSR.png',
			'rare_UR':'images/vtuber_game_2/rare_UR.png',
			'skip_on':'images/vtuber_game_2/skip_on.png',
			'skip_off':'images/vtuber_game_2/skip_off.png',
			'CircleBlock':'images/dotlive/CircleBlock.png',
			'SlideWP':'images/vtuber_game_2/SlideWP.png',
			'Title':'images/vtuber_game_2/Title.png',
		};
		for(var k in a)this.load.image(k,a[k]);
		this.loadChars();
		this.loadAudio();
	},
	loadChars:function(){
		var charInfo=this.M.gGlb('CharInfo');
		for(var k in charInfo){
			var rare=charInfo[k].rare;
			for(var l in rare){
				var img=k+'_'+rare[l];
				this.load.image(img,'images/vtuber_game_2/chars/'+img+'.jpg');
			}
		}
	},
	loadAudio:function(){
		var s={
			TitleBGM:'sounds/BGM/vtuber_game_2/buy_something',
			OnBtn:'sounds/SE/LabJP/Btn/decision9',
			OnStart:'sounds/SE/LabJP/Btn/decision24',
			Slide:'sounds/SE/LabJP/Btn/decision22',
			OnCollection:'sounds/SE/LabJP/Btn/decision7',
			OnBack:'sounds/SE/LabJP/Btn/decision6',
			StopRare:'sounds/SE/LabJP/Btn/decision16',
			MoveCard:'sounds/SE/LabJP/Btn/decision10',
			LastShow:'sounds/SE/LabJP/Btn/decision25',
			GetUR:'sounds/SE/LabJP/Performance/Anime/eye-shine1',
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