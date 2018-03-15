BasicGame.Preloader = function () {};
BasicGame.Preloader.prototype = {
	create: function () { this.loadManager(); },

	loadManager: function () {
		this.loadingAnim();
		this.loadingText();
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},

	loadingAnim: function () {
		var loadingSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'loading');
		loadingSprite.anchor.setTo(.5);
		loadingSprite.scale.setTo(1.5);
		loadingSprite.animations.add('loading').play(18, true);
	},

	loadingText: function () {
		var textSprite = this.add.text(
			this.world.centerX, this.world.centerY+120, '0%', 
			{ font: '30px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 10 }
		);
		textSprite.anchor.setTo(.5);
		this.load.onFileComplete.add(function (progress/*, cacheKey, success, totalLoaded, totalFiles*/) {
			textSprite.setText(progress+'%');
		}, this);
	},

	loadAssets: function () {
		this.load.atlasXML('greySheet', 
			'./images/public/sheets/greySheet.png', './images/public/sheets/greySheet.xml');
		var imageAssets = {
			'Logo':             './images/TenMaKiNinVerG/Logo.png',
			'Char_T':           './images/TenMaKiNinVerG/Char_T.png',
			'Char_M':           './images/TenMaKiNinVerG/Char_M.png',
			'Char_K':           './images/TenMaKiNinVerG/Char_K.png',
			'Char_N':           './images/TenMaKiNinVerG/Char_N.png',
			'Char_G':           './images/TenMaKiNinVerG/Char_G.png',
			'Bg_T':        './images/eff/Pmang_2.png',
			'Bg_M':        './images/eff/DeadTree.png',
			'Bg_K':        './images/eff/TestTree.png',
			'Bg_N':        './images/eff/Tree.png',
			'Bg_G':        './images/eff/Pmang_1.png',
			'Particle':         './images/cafenozombiko/Shine.png',
			'PlayBgDecoration': './images/eff/Fire_1.png',
		};
		for (var key in imageAssets) { this.load.image(key, imageAssets[key]); }
		this.load.spritesheet('CharStones', './images/TenMaKiNinVerG/CharStones.png', 100, 100);
		this.loadAudio();
	},

	loadAudio: function () {
		this.load.audio('TitleBGM', [
			'./sounds/BGM/ChoroBavarioLoop.mp3',
			'./sounds/BGM/ChoroBavarioLoop.wav',
			'./sounds/BGM/ChoroBavarioLoop.ogg',
		]);
		this.load.audio('ThemeBGM_T', [
			'./sounds/BGM/BusyDayAtTheMarketLoop.mp3',
			'./sounds/BGM/BusyDayAtTheMarketLoop.wav',
		]);
		this.load.audio('ThemeBGM_M', [
			'./sounds/BGM/GreatBoss.mp3',
			'./sounds/BGM/GreatBoss.wav',
			'./sounds/BGM/GreatBoss.ogg',
		]);
		this.load.audio('ThemeBGM_K', [
			'./sounds/BGM/SpeedWay.mp3',
			'./sounds/BGM/SpeedWay.wav',
		]);
		this.load.audio('ThemeBGM_N', [
			'./sounds/BGM/ThemeNinja.mp3',
			'./sounds/BGM/ThemeNinja.wav',
			'./sounds/BGM/ThemeNinja.ogg',
		]);
		this.load.audio('ThemeBGM_G', [
			'./sounds/BGM/ANewDay.mp3',
			'./sounds/BGM/ANewDay.wav',
			'./sounds/BGM/ANewDay.wav',
		]);
		this.load.audio('PageOpen', [
			'./sounds/SE/Cartoon/CartoonThrow.mp3',
			'./sounds/SE/Cartoon/CartoonThrow.wav',
		]);
		this.load.audio('Cheer', [
			'./sounds/SE/SpellSet1/cheer.mp3',
			'./sounds/SE/SpellSet1/cheer.wav',
		]);
		this.load.audio('SelectChar', [
			'./sounds/SE/GUI_Sound_Effects/positive.mp3',
			'./sounds/SE/GUI_Sound_Effects/positive.wav',
		]);
		this.load.audio('KillStone', [
			'./sounds/SE/SpellSet2/spell1.mp3',
			'./sounds/SE/SpellSet2/spell1.wav',
		]);
		this.load.audio('UseSpell', [
			'./sounds/SE/SpellSet2/teleport.mp3',
			'./sounds/SE/SpellSet2/teleport.wav',
		]);
		this.load.audio('GameOver', [
			'./sounds/SE/JingleSet1/leave.mp3',
			'./sounds/SE/JingleSet1/leave.wav',
		]);
		this.load.audio('NoneKillStone', [
			'./sounds/SE/GUI_Sound_Effects/negative.mp3',
			'./sounds/SE/GUI_Sound_Effects/negative.wav',
		]);
		this.load.audio('SwapStone', [
			'./sounds/SE/GUI_Sound_Effects/sharp_echo.mp3',
			'./sounds/SE/GUI_Sound_Effects/sharp_echo.wav',
		]);
		this.load.audio('Result', [
			'./sounds/SE/GUI_Sound_Effects/save.mp3',
			'./sounds/SE/GUI_Sound_Effects/save.wav',
		]);
	},

	loadOnlyFirst: function () {
		if (!this.game.global.loadedOnlyFirst) {
			if (this.game.device.desktop) { document.body.style.cursor = 'pointer'; }
			this.game.global.SoundManager = new SoundManager(this);
			this.game.global.loadedOnlyFirst = true;
		}
	},

	loadComplete: function () {
		this.loadOnlyFirst();
		this.state.start(this.game.global.nextSceen);
	},
};