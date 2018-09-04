BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	create:function(){
		this.sounds={};
		this.inputEnabled=!0;
		this.M.S.genLoading();
		this.M.gGlb('curLang')=='en'?this.M.H.changeTtl(BasicGame.GAME_EN_TITLE):this.M.S.genTxt(this.world.centerX,this.world.height*.25,this.rnd.pick(__ADVICE_WORDS),this.M.S.txtstyl(25));
		this.load.onLoadComplete.add(this.loadComplete,this);
		this.loadAssets();
		this.load.start();
	},
	loadAssets:function(){
		this.M.S.loadLoadingAssets();
		var i={
			'Logo':'images/public/logo/logo.png',
			'WP':'images/TruckGoddess/WhitePaper.jpg',
			'TWP':'images/FOckingGlasses/TranslucentWhitePaper.png',
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadAudio();
	},

	loadAudio:function(){
		var s={
			// TitleBGM:'sounds/BGM/Kazaki/Urara',
			// PlayBGM:'sounds/BGM/Kazaki/harunopayapaya',
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
		this.game.input.onDown.add(this.start,this);
		this.M.H.getQuery('mute')&&(this.sound.mute=!0);
	},
	start:function(){
		if(this.inputEnabled){
			this.inputEnabled=!1;
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			var logo=this.add.sprite(this.world.centerX,this.world.centerY,'Logo');
			logo.alpha=0;
			logo.anchor.setTo(.5);
			var twA=this.M.T.fadeInA(logo,{duration:800,alpha:1});
			twA.start();
			var twB=this.M.T.fadeOutA(logo,{duration:400,delay:300});
			twA.chain(twB);
			twB.onComplete.add(function(){this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title')},this);
		}
	},
};