BasicGame.Preloader = function () {};
BasicGame.Preloader.prototype = {
	create: function () {
		this.sounds = null;
		this.chars = null;
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		this.genAdviceTextSprite();
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},

	genAdviceTextSprite: function () {
		this.M.S.genText(this.world.centerX, this.world.centerY*.5,this.rnd.pick(__ADVICE_WORDS),{fontSize:30});
	},

	loadAssets: function () {
		this.load.atlasXML('greySheet','./images/public/sheets/greySheet.png','./images/public/sheets/greySheet.xml');
		this.load.atlasXML('GameIconsBlack','images/public/sheets/GameIconsBlack.png','images/public/sheets/GameIconsBlack.xml');
		this.load.atlasJSONHash('VolumeIcon','images/public/VolumeIcon/VolumeIcon.png','images/public/VolumeIcon/VolumeIcon.json');
		var imageAssets = {
			'Logo': 'images/PeanutNinja/Logo.png',
			'Logo2': 'images/PeanutNinja/Logo2.png',
			'Title': 'images/PeanutNinja/Title.png',
			'Life': 'images/PeanutNinja/Life.png',
			'WhitePaper': 'images/PeanutNinja/WhitePaper.jpg',
			'Dialog': 'images/PeanutNinja/Dialog.png',
			'Peanutkun_Face': 'images/PeanutNinja/Peanutkun_Face.png',
			'PlayBg_1': 'images/PeanutNinja/CartoonBg/1.jpg',
			'PlayBg_2': 'images/PeanutNinja/CartoonBg/2.jpg',
			'PlayBg_3': 'images/PeanutNinja/CartoonBg/3.jpg',
			'Bg_1': 'images/PeanutNinja/Bg_1.jpg',
			'Bg_2': 'images/PeanutNinja/Bg_2.jpg',
		};
		for (var key in imageAssets) this.load.image(key, imageAssets[key]);
		this.loadSubChars();
		this.loadTargetInfo();
		this.loadAudio();
	},

	loadSubChars: function () {
		this.chars = this.M.getConst('SUB_CHARS');
		for (var key in this.chars) {
			var char = this.chars[key];
			this.load.image(char,'images/PeanutNinja/Chars/'+char+'.png');
		}
	},

	loadTargetInfo: function () {
		var TargetInfo = this.M.getConf('TargetInfo');
		for (var key in TargetInfo) {
			var info = TargetInfo[key];
			this.load.spritesheet(info.name+'_Cut','images/PeanutNinja/Chars/'+info.name+'.png',info.halfWidth,info.halfHeight);
			this.load.image(info.name,'images/PeanutNinja/Chars/'+info.name+'.png');
		}
	},

	loadAudio: function () {
		this.sounds = {
			'TitleBGM': [
				'sounds/BGM/H/hiyokonokakekko.mp3',
				'sounds/BGM/H/hiyokonokakekko.wav',
			],
			'PlayBGM': [
				'sounds/BGM/S/ShootingStair.mp3',
				'sounds/BGM/S/ShootingStair.wav',
			],
		};
		for (var key in this.sounds) this.load.audio(key, this.sounds[key]);
	},

	loadComplete: function () {
		if (this.game.device.desktop) document.body.style.cursor = 'pointer';
		this.M.SE.setSounds(this.sounds);
		this.M.H.setSPBrowserColor(BasicGame.MAIN_COLOR);
		this.add.sprite(0,this.world.height,this.rnd.pick(this.chars)).anchor.setTo(0,1);
		this.add.sprite(this.world.width,this.world.height,this.rnd.pick(this.chars)).anchor.setTo(1,1);
		this.M.S.genText(this.world.centerX, this.world.centerY*1.5,this.M.getConst('TOUCH_OR_CLICK')+'してスタート',{fontSize:30});
		this.game.input.onDown.add(this.start,this);
	},

	start: function () {
		this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');
	},
};