BasicGame.Preloader = function () {};
BasicGame.Preloader.prototype = {
	init: function () { 
		this.sounds = null;
		this.touchOrClick = (this.game.device.touch)?'タッチ':'クリック';
	},
	create: function () {
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},

	loadAssets: function () {
		this.load.atlasXML('greySheet', 
			'./images/public/sheets/greySheet.png', './images/public/sheets/greySheet.xml');
		this.load.atlasXML('GameIconsBlack', 
			'./images/public/sheets/GameIconsBlack.png', './images/public/sheets/GameIconsBlack.xml');
		this.load.atlasJSONHash('VolumeIcon', 
			'./images/public/VolumeIcon/VolumeIcon.png', './images/public/VolumeIcon/VolumeIcon.json');
		var imageAssets = {
			'Dialog': './images/public/dialogs/Dialog_5.jpg',
			'Logo': './images/ChihiroGame/Logo.jpg',
			'Chihiro_1': './images/ChihiroGame/Chihiro_1.png',
			'Particle': './images/ChihiroGame/Particle.png',
		};
		this.loadCharInfo();
		for (var key in imageAssets) this.load.image(key, imageAssets[key]);
		this.loadAlbum();
		this.loadAudio();
	},

	loadCharInfo: function () {
		var CharInfo = this.M.getConf('CharInfo');
		var CharInfoLength = 0;
		for (var key in CharInfo) {
			var info = CharInfo[key];
			this.load.spritesheet(key,info.imgPath,info.width,info.height);
			this.load.spritesheet(info.backKey,info.bgImgPath,info.width,info.height);
			this.load.image(info.panelKey,info.bgImgPath);
			CharInfoLength++;
		}
		this.M.setGlobal('CharInfoLength', CharInfoLength);
	},

	loadAlbum: function () {
		var albumCount = BasicGame.ALBUM_COUNT;
		for (var i=1;i<=albumCount;i++) 
			this.load.image('Album_'+i, './images/ChihiroGame/Albums/Album_'+i+'.jpg');
	},

	loadAudio: function () {
		this.sounds = {
			'TitleBGM': [
				'sounds/BGM/L/lovelyflower.mp3',
				'sounds/BGM/L/lovelyflower.wav',
			],
			'PlayBGM': [
				'sounds/BGM/B/BirdAmaCha.mp3',
				'sounds/BGM/B/BirdAmaCha.wav',
			],
			'HitPaddle': [
				'sounds/SE/LabJP/System/cursor1.mp3',
				'sounds/SE/LabJP/System/cursor1.wav',
			],
			'BallPenetrate': [
				'sounds/SE/LabJP/Btn/decision12.mp3',
				'sounds/SE/LabJP/Btn/decision12.wav',
			],
			'BreakBlock': [
				'sounds/SE/LabJP/System/cursor8.mp3',
				'sounds/SE/LabJP/System/cursor8.wav',
			],
			'LostBall': [
				'sounds/SE/Digital_SFX/laser2.mp3',
				'sounds/SE/Digital_SFX/laser2.wav',
			],
			'Clear': [
				'sounds/SE/JingleSet1/receive.mp3',
				'sounds/SE/JingleSet1/receive.wav',
			],
			'GameOver': [
				'sounds/SE/JingleSet1/lose.mp3',
				'sounds/SE/JingleSet1/lose.wav',
			],
			'Start': [
				'sounds/SE/LabJP/Btn/decision5.mp3',
				'sounds/SE/LabJP/Btn/decision5.wav',
			],
			'Back': [
				'sounds/SE/LabJP/Btn/decision6.mp3',
				'sounds/SE/LabJP/Btn/decision6.wav',
			],
			'OnBtn': [
				'sounds/SE/LabJP/Btn/decision7.mp3',
				'sounds/SE/LabJP/Btn/decision7.wav',
			],
		};
		for (var key in this.sounds) this.load.audio(key, this.sounds[key]);
	},

	loadComplete: function () {
		if (this.game.device.desktop) document.body.style.cursor = 'pointer';
		this.M.SE.setSounds(this.sounds);
		this.M.H.setSPBrowserColor(BasicGame.MAIN_COLOR);
		this.M.S.genText(this.world.centerX, this.world.centerY*1.5,this.touchOrClick+'してスタート',{fontSize:80});
		this.game.input.onDown.add(this.start,this);
	},

	start: function () {
		this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');
	},
};