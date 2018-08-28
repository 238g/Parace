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
			'WP':'images/TruckGoddess/WhitePaper.jpg',
			'TWP':'images/FOckingGlasses/TranslucentWhitePaper.png',
			'Bg_1':'images/Kazaki/Bg_1.jpg',
			'Kazaki_1':'images/Kazaki/Kazaki_1.png',
			'Banana_1':'images/Kazaki/Banana_1.png',
			'Banana_2':'images/Kazaki/Banana_2.png',
			'Banana_3':'images/Kazaki/Banana_3.png',
			'Food_1':'images/Kazaki/Food_1.png',
			'Food_2':'images/Kazaki/Food_2.png',
			'Food_3':'images/Kazaki/Food_3.png',
			'Food_4':'images/Kazaki/Food_4.png',
			'Food_5':'images/Kazaki/Food_5.png',
			'Food_6':'images/Kazaki/Food_6.png',
			'Obstacle_1':'images/Kazaki/Obstacle_1.png',
			'Obstacle_2':'images/Kazaki/Obstacle_2.png',
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadAudio();
	},

	loadAudio:function(){
		var s={
			// TitleBGM:'sounds/BGM/Dora/AvantJazz',
			// PlayBGM:'sounds/BGM/Dora/arabiantechno',
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
	start:function(){this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title')},
};