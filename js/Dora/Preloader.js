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
		this.load.atlasJSONHash('DoraJumpRope','images/Dora/DoraJumpRope/DoraJumpRope.png','images/Dora/DoraJumpRope/DoraJumpRope.json');
		this.M.S.loadLoadingAssets();
		var i={
			'PubLogo':'images/public/logo/logo.png',
			'WP':'images/OmesisCommanders/WhitePaper.jpg',
			'TWP':'images/Nekomiya/TranslucentWhitePaper.png',
			'Bg_horror':'images/Dora/Bg_horror.jpg',
			'Bg_1':'images/Dora/Bg_1.jpg',
			'Bg_2':'images/Dora/Bg_2.jpg',
			'Bg_3':'images/Dora/Bg_3.jpg',
			'MiniDora_1':'images/Dora/MiniDora_1.jpg',
			'MiniDora_2':'images/Dora/MiniDora_2.jpg',
			'MiniDora_3':'images/Dora/MiniDora_3.jpg',
			'MiniDora_4':'images/Dora/MiniDora_4.jpg',
			'Dora_1':'images/Dora/Dora_1.png',
			'Dora_2':'images/Dora/Dora_2.jpg',
			'Dora_3':'images/Dora/Dora_3.jpg',
			'Chaika_1':'images/Dora/Chaika_1.png',
			'Chaika_2':'images/Dora/Chaika_2.png',
			'TreasureChest_1':'images/Dora/TreasureChest_1.png',
			'TreasureChest_2':'images/Dora/TreasureChest_2.png',
			'Molotov':'images/Dora/Molotov.png',
			'Fire':'images/Dora/Fire.png',
			'Cave':'images/Dora/Cave.jpg',
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadAudio();
	},

	loadAudio:function(){
		var s={
			TitleBGM:'sounds/BGM/Dora/AvantJazz',
			PlayBGM:'sounds/BGM/Dora/arabiantechno',
			FireVOMito_1:'sounds/VOICE/Dora/FireVOMito_1',
			FireVOMito_2:'sounds/VOICE/Dora/FireVOMito_2',
			FireVOMito_3:'sounds/VOICE/Dora/FireVOMito_3',
			FireVOMito_4:'sounds/VOICE/Dora/FireVOMito_4',
			FireVOMito_5:'sounds/VOICE/Dora/FireVOMito_5',
			ClickJump:'sounds/SE/phaseJump4',
			Cheer:'sounds/SE/LabJP/People/people_people-performance-cheer1',
			OnBtn:'sounds/SE/LabJP/Btn/decision1',
			Enter:'sounds/SE/LabJP/Life/Run/dash-leather-shoes1_SHORT',
			Okay:'sounds/SE/LabJP/Btn/decision4',
			Incorrect:'sounds/SE/LabJP/Performance/Quiz/incorrect2',
			OpenChest:'sounds/SE/Fantasy/Inventory_Open_00',
			Surprise:'sounds/SE/UISoundLibrary/Click_Electronic/Click_Heavy_00',
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