BasicGame.Preloader = function () {};
BasicGame.Preloader.prototype = {
	init: function () { 
		this.sounds = null; 
	},
	create: function () {
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},

	loadAssets: function () {
		this.load.spritesheet('WhiteBtnS','images/public/Btns/WhiteBtnsS.png',215,50);
		this.load.atlasXML('GameIconsBlack', 
			'images/public/sheets/GameIconsBlack.png', 'images/public/sheets/GameIconsBlack.xml');
		this.load.atlasJSONHash('VolumeIcon', 
			'images/public/VolumeIcon/VolumeIcon.png', 'images/public/VolumeIcon/VolumeIcon.json');
		var imageAssets = {
			'Logo': 'images/Kerin/Logo.png',
			'Obstarcle': 'images/ChihiroGame/Particle.png', // TODO
		};
		for (var key in imageAssets) this.load.image(key, imageAssets[key]);
		this.loadTargetInfo();
		this.loadAudio();
	},

	loadTargetInfo: function () {
		var TargetInfo = this.M.getConf('TargetInfo');
		for (var key in TargetInfo) {
			var info = TargetInfo[key];
			this.load.spritesheet(info.name+'_Cut',info.imgPath,info.cutWidth,info.cutHeight);
			this.load.image(info.name,info.imgPath);
		}
	},

	loadAudio: function () {
		this.sounds = {
			'TitleBGM': [ // TODO
				'sounds/BGM/P/Positive5.mp3',
				'sounds/BGM/P/Positive5.wav',
			],
		};
		for (var key in this.sounds) this.load.audio(key, this.sounds[key]);
	},

	loadComplete: function () {
		if (this.game.device.desktop) document.body.style.cursor = 'pointer';
		this.M.SE.setSounds(this.sounds);
		this.M.H.setSPBrowserColor(BasicGame.MAIN_COLOR);
		this.M.S.genText(this.world.centerX, this.world.centerY*1.5,this.M.getConst('TOUCH_OR_CLICK')+'してスタート',{fontSize:30});
		this.game.input.onDown.add(this.start,this);
	},

	start: function () {
		this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');
	},
};