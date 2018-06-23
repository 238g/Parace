BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	create:function(){
		this.sounds=null; 
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		this.M.S.genText(this.world.centerX,this.world.centerY*.5,this.rnd.pick(__ADVICE_WORDS),{fontSize:25});
		this.load.onLoadComplete.add(this.loadComplete,this);
		this.loadAssets();
		this.load.start();
	},

	loadAssets:function(){
		this.load.atlasXML('greySheet','images/public/sheets/greySheet.png','images/public/sheets/greySheet.xml');
		this.load.atlasXML('GameIconsWhite','images/public/sheets/GameIconsWhite.png','images/public/sheets/GameIconsWhite.xml');
		this.load.atlasJSONHash('VolumeIcon','images/public/VolumeIcon/VolumeIcon.png','images/public/VolumeIcon/VolumeIcon.json');
		var imageAssets={
			'Ttl':'images/OmesisCommanders/Ttl.png',
			'TtlBlink':'images/OmesisCommanders/TtlBlink.png',
			'StartBtn':'images/OmesisCommanders/StartBtn.png',
			'OkBtn':'images/OmesisCommanders/OkBtn.png',
			'BackBtn':'images/OmesisCommanders/BackBtn.png',
			'ReadyText':'images/Oda/Title_en.png',
			'GoText':'images/Oda/Title_jp.png',
			'TWP':'images/Nekomiya/TranslucentWhitePaper.png',
			'WP':'images/OmesisCommanders/WhitePaper.jpg',
			'Bg_1':'images/OmesisCommanders/Bg_1.jpg',
			'Bg_2':'images/OmesisCommanders/Bg_2.jpg',
		};
		for(var k in imageAssets)this.load.image(k,imageAssets[k]);
		this.loadAudio();
		this.loadInfo();
	},
	loadInfo:function(){
		var charCount=0;
		var charAnimCount=this.M.getConst('CHAR_ANIM_COUNT');
		var CI=this.M.getConf('CharInfo');
		for(var k in CI){
			var info=CI[k];
			this.load.image(info.charSquare,info.charSquarePath);
			this.load.image(info.idle,info.idlePath);
			this.load.image(info.ch,info.chPath);
			for(var i=1;i<=charAnimCount;i++)this.load.image(info.animBase+i,info.animBasePath+i+'.jpg'); // TODO del
			// for(var i=1;i<=charAnimCount;i++)this.load.image(info.animBase+i,info.animBasePath+i+'.png');
			charCount++;
		}
		this.M.setGlobal('charCount',charCount);
		var SI=this.M.getConf('StageInfo');
		for(var k in SI){
			var info=SI[k];
			this.load.image(info.selector,info.selectorPath);
			this.load.image(info.stgBg,info.stgBgPath);
		}
	},

	loadAudio:function(){
		this.sounds={
			'TitleBGM': [
				'sounds/BGM/O/OnPatrol.mp3',
				'sounds/BGM/O/OnPatrol.wav',
			],
		};
		for(var k in this.sounds)this.load.audio(k,this.sounds[k]);
	},

	loadComplete:function(){
		this.game.device.desktop&&(document.body.style.cursor='pointer');
		this.M.SE.setSounds(this.sounds);
		this.M.H.setSPBrowserColor(BasicGame.MAIN_COLOR);
		this.M.S.genText(this.world.centerX,this.world.centerY*1.7,
			this.M.getConst('TOUCH_OR_CLICK')+'してスタート\n'+this.M.getConst('EN_TOUCH_OR_CLICK')+' TO PLAY',{fontSize:25});
		// this.stage.disableVisibilityChange=!1;
		this.game.input.onDown.add(this.start,this);
	},
	start:function(){this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');},
};