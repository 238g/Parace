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
		this.load.atlasXML('greySheet','./images/public/sheets/greySheet.png','./images/public/sheets/greySheet.xml');
		this.load.atlasXML('GameIconsWhite','images/public/sheets/GameIconsWhite.png','images/public/sheets/GameIconsWhite.xml');
		this.load.atlasJSONHash('VolumeIcon','images/public/VolumeIcon/VolumeIcon.png','images/public/VolumeIcon/VolumeIcon.json');
		var imageAssets = {
			'Title': 'images/AoiGame/Title.png',
			'Logo': 'images/AoiGame/Logo.png',
			'WhitePaper': 'images/PeanutNinja/WhitePaper.jpg',
		};
		for(var k in imageAssets)this.load.image(k,imageAssets[k]);
		for(var i=0;i<=this.M.getConst('BG_COUNT');i++)this.load.image('Bg_'+i,'images/AoiGame/Bg/Bg_'+i+'.jpg');
		this.loadAudio();
	},

	loadAudio:function(){
		this.sounds = {
			'TitleBGM': [
				'sounds/BGM/H/Hanagoyomi.mp3',
				'sounds/BGM/H/Hanagoyomi.wav',
			],
		};
		for(var k in this.sounds)this.load.audio(k,this.sounds[k]);
	},

	loadComplete:function(){
		this.game.device.desktop&&(document.body.style.cursor='pointer');
		this.M.SE.setSounds(this.sounds);
		this.M.H.setSPBrowserColor(BasicGame.MAIN_COLOR);
		this.M.S.genText(this.world.centerX, this.world.centerY*1.5,this.M.getConst('TOUCH_OR_CLICK')+'してスタート',{fontSize:25});
		this.game.input.onDown.add(this.start,this);
	},

	start:function(){this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');},
};