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
		this.load.spritesheet('Signboards','images/TruckGoddess/Signboards.png',32,64);
		this.load.spritesheet('Obstacles','images/TruckGoddess/Obstacles.png',32,32);
		this.load.atlasJSONHash('Explode_1','images/TruckGoddess/Explode_1/Explode_1.png','images/TruckGoddess/Explode_1/Explode_1.json');
		var imageAssets={
			'WP':'images/TruckGoddess/WhitePaper.jpg',
			'TWP':'images/FOckingGlasses/TranslucentWhitePaper.png',
			'Handle':'images/TruckGoddess/Handle.png',
			'Truck':'images/TruckGoddess/Vehicle/Truck.png',
			'Road_1':'images/TruckGoddess/Road_1.jpg',
			'Road_2':'images/TruckGoddess/Road_2.jpg',
			'DifficultyGauge':'images/TruckGoddess/DifficultyGauge.png',
			'TitleWord':'images/TruckGoddess/TitleWord.png',
			'TopBg':'images/TruckGoddess/TopBg.png',
			'Channel':'images/TruckGoddess/Channel.png',
			'Moira_1':'images/TruckGoddess/Moira_1.png',
			'Moira_2':'images/TruckGoddess/Moira_2.png',
			'Moira_3':'images/TruckGoddess/Moira_3.png',
			'Moira_4':'images/TruckGoddess/Moira_4.png',
		};
		for(var k in imageAssets)this.load.image(k,imageAssets[k]);
		this.loadVehicle();
		this.loadBg();
		this.loadAudio();
	},
	loadVehicle:function(){
		var v=this.M.getConf('Vehicle');
		for(var k in v)this.load.image(v[k],'images/TruckGoddess/Vehicle/'+v[k]+'.png');
	},
	loadBg:function(){
		var s=this.M.getConf('StageInfo');
		for(var k in s)this.load.image('Bg_'+k,'images/TruckGoddess/Bg_'+k+'.jpg');
	},
	loadAudio:function(){
		var playBGM=this.rnd.pick(['cyrf_solitary','cyrf_truth','cyrf_warm_up','cyrf_winter_season']);
		var s={
			TitleBGM:'sounds/BGM/TruckGoddess/yuuenchi',
			PlayBGM:'sounds/BGM/TruckGoddess/'+playBGM,
			CarExplode_1:'sounds/SE/Explode/explode',
			CarExplode_2:'sounds/SE/Explode/explodemini',
			ObstacleExplode_1:'sounds/SE/RetroEffect/Explosions/Various/sfx_exp_various1',
			ObstacleExplode_2:'sounds/SE/RetroEffect/Explosions/Various/sfx_exp_various2',
			ObstacleExplode_3:'sounds/SE/RetroEffect/Explosions/Various/sfx_exp_various3',
			ObstacleExplode_4:'sounds/SE/RetroEffect/Explosions/Various/sfx_exp_various4',
			ObstacleExplode_5:'sounds/SE/RetroEffect/Explosions/Various/sfx_exp_various5',
			ObstacleExplode_6:'sounds/SE/RetroEffect/Explosions/Various/sfx_exp_various6',
			Start:'sounds/SE/JingleSet1/receive',
			SelectStg:'sounds/SE/JingleSet1/click',
			Play:'sounds/SE/LabJP/Vehicle/car-gear-change1',
			VehicleSE_1:'sounds/SE/LabJP/Vehicle/car-horn1',
			VehicleSE_2:'sounds/SE/LabJP/Vehicle/car-sudden-braking1',
			F1:'sounds/SE/LabJP/Vehicle/f1-pass1',
			Ambulance:'sounds/SE/LabJP/Vehicle/ambulance-siren1_E',
			Police:'sounds/SE/LabJP/Vehicle/patrol-car1_E',
			Money:'sounds/SE/LabJP/Life/Money/clearing1',
			OnBtn:'sounds/SE/JingleSet1/starting',
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