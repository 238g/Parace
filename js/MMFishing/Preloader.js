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
			'WP':'images/OmesisCommanders/WhitePaper.jpg',
			'TWP':'images/Nekomiya/TranslucentWhitePaper.png',
			'Fish_1':'images/MM_Fishing/Fish_1.png',
			'Fish_2':'images/MM_Fishing/Fish_2.png',
			'Fish_3':'images/MM_Fishing/Fish_3.png',
			'Fish_4':'images/MM_Fishing/Fish_4.png',
			'Fish_5':'images/MM_Fishing/Fish_5.png',
			'Fish_6':'images/MM_Fishing/Fish_6.png',
			'Bg_1':'images/MM_Fishing/Bg_1.jpg',
			'PlayBg_1':'images/MM_Fishing/PlayBg_1.jpg',
			'Rod':'images/MM_Fishing/Rod_1.png',
			'Float_1':'images/MM_Fishing/Float_1.png',
			'Float_2':'images/MM_Fishing/Float_2.png',
			'Hit_1':'images/MM_Fishing/Hit_1.png',
			'Hit_2':'images/MM_Fishing/Hit_2.png',
			'Frame':'images/MM_Fishing/Frame.png',
			'Arrow':'images/MM_Fishing/Arrow.png',
			'Ichigo_1':'images/MM_Fishing/Ichigo_1.png',
			'Ichigo_2':'images/MM_Fishing/Ichigo_2.png',
			'Ichigo_3':'images/MM_Fishing/Ichigo_3.png',
			'Ichigo_4':'images/MM_Fishing/Ichigo_4.png',
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var s={
			BGM:'sounds/BGM/MMFishing/illumination_am300',
			Hit:'sounds/SE/LabJP/Performance/Anime/feed1',
			OnStart:'sounds/SE/LabJP/Vehicle/ship-big-whistle1_CUT',
			OnBtn:'sounds/SE/LabJP/Btn/decision7',
			Cast:'sounds/SE/LabJP/Battle/Other/whip-gesture1',
			Water_1:'sounds/SE/Fantasy/Footsteps/Footstep_Water_04',
			Water_2:'sounds/SE/Fantasy/Footsteps/Footstep_Water_05',
			Water_3:'sounds/SE/Fantasy/Footsteps/Footstep_Water_06',
			Miss:'sounds/SE/LabJP/Performance/Anime/stupid3',
			Splashes:'sounds/SE/S/Splashes',
			Fishing:'sounds/SE/LabJP/Performance/Anime/shakin1',
			GetFish:'sounds/SE/LabJP/Performance/Other/trumpet1',
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
	start:function(){this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');},
};