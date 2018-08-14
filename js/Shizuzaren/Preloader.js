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
		this.load.spritesheet('Conveyor','images/Shizuzaren/Conveyor.png',940/4,354/6);
		this.load.spritesheet('Cords','images/Shizuzaren/Cords.png',16,26);
		var i={
			'WP':'images/TruckGoddess/WhitePaper.jpg',
			'TWP':'images/FOckingGlasses/TranslucentWhitePaper.png',
			'AbdominalMuscle':'images/Shizuzaren/AbdominalMuscle.png',
			'Gilzaren_1':'images/Shizuzaren/Gilzaren_1.png',
			'Gilzaren_2':'images/Shizuzaren/Gilzaren_2.png',
			'Bg_1':'images/Shizuzaren/Bg_1.jpg',
			'Bg_2':'images/Shizuzaren/Bg_2.jpg',
			'Bg_3':'images/Shizuzaren/Bg_3.jpg',
			'Bg_4':'images/Shizuzaren/Bg_4.jpg',
			'Machine_1':'images/Shizuzaren/Machine_1.png',
			'Bell':'images/Shizuzaren/Bell.png',
			'LastCord':'images/Shizuzaren/LastCord.png',
			'Gift':'images/Shizuzaren/Gift.png',
			'BackArrow':'images/Shizuzaren/BackArrow.png',
			'AbdominalMuscleIcon':'images/Shizuzaren/AbdominalMuscleIcon.png',
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var s={
			// BGM:'sounds/BGM/MMFishing/illumination_am300',
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
		// this.stage.disableVisibilityChange=!1; // TODO ok
		this.game.input.onDown.add(this.start,this);
		this.M.H.getQuery('mute')&&(this.sound.mute=!0);
	},
	start:function(){this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title')},
};