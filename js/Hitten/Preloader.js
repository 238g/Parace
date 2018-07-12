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
		this.loadChar();
		this.loadAudio();
	},
	loadChar:function(){
		var CharInfo=this.M.gCnf('CharInfo');
		for(var k in CharInfo){
			var info=CharInfo[k];
			var icon='icon_'+k;
			this.load.image(icon,'images/Hitten/character_imgs/icons/'+icon+'.jpg');
			info.icon=icon;
			info.playImg={};
			for(var i=1;i<=5;i++){
				var playImg=k+'_'+i;
				this.load.image(playImg,'images/Hitten/character_imgs/portraits/'+playImg+'.png');
				info.playImg[i]=playImg;
			}
			var normal='normal_'+k;
			this.load.image(normal,'images/Hitten/character_imgs/portraits/'+normal+'.png');
			info.normal=normal;
			var smile='smile_'+k;
			this.load.image(smile,'images/Hitten/character_imgs/portraits/'+smile+'.png');
			info.smile=smile;
		}
	},
	loadAudio:function(){
		var s={
			TitleBGM:'sounds/BGM/Hitten/stageSelectBGM',
			SelectSE:'sounds/SE/Hitten/selectSE',
			CancelSE:'sounds/SE/Hitten/cancelSE',
			StopwatchSE:'sounds/SE/Hitten/stopwatchSE',
			// closeWindowSE:'sounds/SE/Hitten/closeWindowSE',
			// openWindowSE:'sounds/SE/Hitten/openWindowSE',
			// volumeControlBtnSE:'sounds/SE/Hitten/volumeControlBtnSE',
			PanelOverSE:'sounds/SE/Hitten/panelOverSE',
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