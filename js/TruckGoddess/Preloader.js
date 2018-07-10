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
		var imageAssets={
			'WP':'images/TruckGoddess/WhitePaper.jpg',
			'TWP':'images/FOckingGlasses/TranslucentWhitePaper.png',
			'Handle':'images/TruckGoddess/Handle.png',
			'Truck':'images/TruckGoddess/Vehicle/Truck.png',
			'Road_1':'images/TruckGoddess/Road_1.jpg',
			'DifficultyGauge':'images/TruckGoddess/DifficultyGauge.png',
			'TitleChar':'images/eff/Tree.png',
		};
		for(var k in imageAssets)this.load.image(k,imageAssets[k]);
		this.loadVehicle();
		this.loadAudio();
	},
	loadVehicle:function(){
		var v=this.M.getConf('Vehicle');
		for(var k in v)this.load.image(v[k],'images/TruckGoddess/Vehicle/'+v[k]+'.png');
	},
	loadAudio:function(){
		var s={
			// TitleBGM:'sounds/BGM/FOckingGlasses/cyber41',
			// PlayBGM:'sounds/BGM/FOckingGlasses/Lets_Party2',
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