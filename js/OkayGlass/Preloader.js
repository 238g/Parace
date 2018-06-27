BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	create:function(){
		this.sounds={};
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
		this.load.spritesheet('BrokenGlasses','images/OkayGlass/BrokenGlasses.png',400,225);
			
		var imageAssets={
			'Ttl':'images/OmesisCommanders/Ttl.png',
			'TWP':'images/Oda/TranslucentWhitePaper.png', // TODO fix size
			'Asahi_1':'images/OkayGlass/Asahi_1.png',
			'Channel':'images/Nekomiya/Channel.png', // TODO fix size
		};
		for(var k in imageAssets)this.load.image(k,imageAssets[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var s={
			TitleBGM:'sounds/BGM/OmesisCommanders/MaouCyber16',
			RepairGlasses:'sounds/SE/LabJP/Performance/Anime/shakin2',
			BreakGlasses_1:'sounds/SE/LabJP/Life/Collision/glass-break4',
		};
		for(var k in s){
			var p=s[k];
			this.sounds[k]=1;
			this.load.audio(k,[p+'.mp3',p+'wav']);
		}
	},
	loadComplete:function(){
		this.game.device.desktop&&(document.body.style.cursor='pointer');
		this.M.SE.setSounds(this.sounds);
		this.M.H.setSPBrowserColor(BasicGame.MAIN_COLOR);
		this.M.S.genText(this.world.centerX,this.world.centerY*1.7,
			this.M.getConst('TOUCH_OR_CLICK')+'してスタート\n'+this.M.getConst('EN_TOUCH_OR_CLICK')+' TO PLAY',{fontSize:25});
		// this.stage.disableVisibilityChange=!1;
		this.game.input.onDown.add(this.start,this);
		this.M.H.getQuery('mute')&&(this.sound.mute=!0);
	},
	start:function(){this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');},
};