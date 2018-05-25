BasicGame.Preloader = function () {};
BasicGame.Preloader.prototype = {
	create: function () {
		this.sounds=null; 
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		this.genAdviceTextSprite();
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},

	genAdviceTextSprite: function () {
		this.M.S.genText(this.world.centerX,this.world.centerY*.5,this.rnd.pick(__ADVICE_WORDS),{fontSize:30});
	},

	loadAssets: function () {
		this.load.atlasXML('greySheet','./images/public/sheets/greySheet.png','./images/public/sheets/greySheet.xml');
		this.load.atlasXML('GameIconsWhite','images/public/sheets/GameIconsWhite.png','images/public/sheets/GameIconsWhite.xml');
		this.load.atlasJSONHash('VolumeIcon','images/public/VolumeIcon/VolumeIcon.png','images/public/VolumeIcon/VolumeIcon.json');
		var imageAssets = {
			'Logo': 'images/Kerin/KerinOnMissile.png',
			'Dialog': 'images/PeanutNinja/WhitePaper.jpg', // TODO
		};
		for(var k in imageAssets)this.load.image(k,imageAssets[k]);
		this.loadAudio();
	},

	loadAudio: function () {
		this.sounds = {
			'TitleBGM': [
				'sounds/BGM/O/OnPatrol.mp3',
				'sounds/BGM/O/OnPatrol.wav',
			],
		};
		for(var k in this.sounds)this.load.audio(k,this.sounds[k]);
	},

	loadComplete: function () {
		this.game.device.desktop&&(document.body.style.cursor='pointer');
		this.M.SE.setSounds(this.sounds);
		this.M.H.setSPBrowserColor(BasicGame.MAIN_COLOR);
		this.M.S.genText(this.world.centerX, this.world.centerY*1.5,this.M.getConst('TOUCH_OR_CLICK')+'してスタート',{fontSize:30});
		this.game.input.onDown.add(this.start,this);
	},

	start: function () {
		this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');
	},
};