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
		this.load.spritesheet('BrokenClay','images/Nekomiya/BrokenClay.png',50,50);
		var imageAssets={
			'Title':'images/Nekomiya/Title.png',
			'TitleBlink':'images/Nekomiya/TitleBlink.png',
			'Clay':'images/Nekomiya/Clay.png',
			'Bg_1':'images/Nekomiya/Bg_1.jpg',
			'Bg_2':'images/Nekomiya/Bg_2.jpg',
			'Bg_3':'images/Nekomiya/Bg_3.jpg',
			'Bg_4':'images/Nekomiya/Bg_4.jpg',
			'Bg_5':'images/Nekomiya/Bg_5.jpg',
			'PlayBg':'images/Nekomiya/PlayBg.jpg',
			'PlayHinata':'images/Nekomiya/PlayHinata.png',
			'WP':'images/Nekomiya/TranslucentWhitePaper.png',
			'Channel':'images/Nekomiya/Channel.png',
			'ChannelBlink':'images/Nekomiya/ChannelBlink.png',
		};
		for(var k in imageAssets)this.load.image(k,imageAssets[k]);
		this.loadAudio();
	},

	loadAudio:function(){
		this.sounds={
			'TitleBGM':[
				'sounds/BGM/O/OnPatrol.mp3',
				'sounds/BGM/O/OnPatrol.wav',
			],
			'PlayBGM':[
				'sounds/BGM/P/PerpetualTension.mp3',
				'sounds/BGM/P/PerpetualTension.wav',
			],
			'OnBtn':[
				'sounds/SE/GUI_Sound_Effects/misc_menu_4.mp3',
				'sounds/SE/GUI_Sound_Effects/misc_menu_4.wav',
			],
			'Slide':[
				'sounds/SE/JRPG_UI/Close.mp3',
				'sounds/SE/JRPG_UI/Close.wav',
			],
			'Play':[
				'sounds/SE/JRPG_UI/Close.mp3',
				'sounds/SE/JRPG_UI/Close.wav',
			],
			'Shot1':[
				'sounds/SE/Gun/mono_shot_strong_1.mp3',
				'sounds/SE/Gun/mono_shot_strong_1.wav',
			],
			'Shot2':[
				'sounds/SE/Gun/mono_shot_strong_2.mp3',
				'sounds/SE/Gun/mono_shot_strong_2.wav',
			],
			'Shot3':[
				'sounds/SE/Gun/mono_shot_strong_3.mp3',
				'sounds/SE/Gun/mono_shot_strong_3.wav',
			],
			'Break':[
				'sounds/SE/LabJP/Life/Collision/stone-break1.mp3',
				'sounds/SE/LabJP/Life/Collision/stone-break1.wav',
			],
		};
		for(var k in this.sounds)this.load.audio(k,this.sounds[k]);
	},

	loadComplete:function(){
		this.game.device.desktop&&(document.body.style.cursor='pointer');
		this.M.SE.setSounds(this.sounds);
		this.M.H.setSPBrowserColor(BasicGame.MAIN_COLOR);
		this.M.S.genText(this.world.centerX, this.world.centerY*1.7,
			this.M.getConst('TOUCH_OR_CLICK')+'してスタート\n'+this.M.getConst('EN_TOUCH_OR_CLICK')+' TO PLAY',{fontSize:25});
		// this.stage.disableVisibilityChange=!1;
		this.game.input.onDown.add(this.start,this);
	},
	start:function(){this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');},
};