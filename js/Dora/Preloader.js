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
		this.load.atlasJSONHash('DoraJumpRope','images/Dora/DoraJumpRope/DoraJumpRope.png','images/Dora/DoraJumpRope/DoraJumpRope.json');
		this.M.S.loadLoadingAssets();
		var i={
			'WP':'images/OmesisCommanders/WhitePaper.jpg',
			'TWP':'images/Nekomiya/TranslucentWhitePaper.png',
			'MiniDora_1':'images/Dora/MiniDora_1.jpg',
			'MiniDora_2':'images/Dora/MiniDora_2.jpg',
			'MiniDora_3':'images/Dora/MiniDora_3.jpg',
			'MiniDora_4':'images/Dora/MiniDora_4.jpg',
			'Dora_1':'images/Dora/Dora_1.png',
			'Dora_2':'images/Dora/Dora_2.jpg',
			'Dora_3':'images/Dora/Dora_3.jpg',
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadAudio();
	},

	loadAudio:function(){
		var s={
			// TitleBGM:'sounds/BGM/Iincyo/Game-Menu',// TODO
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
		this.game.input.onDown.add(this.start,this);
		this.M.H.getQuery('mute')&&(this.sound.mute=!0);
	},
	start:function(){this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title')},
};