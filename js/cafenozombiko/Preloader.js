BasicGame.Preloader = function () {};

BasicGame.Preloader.prototype = {

	create: function () {
		this.loadManager();
	},

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
			'Bg_1':         './images/cafenozombiko/Bg_1.jpg',
			'Zombiko_1':    './images/cafenozombiko/Zombiko_1.png',
			'Zombiko_2':    './images/cafenozombiko/Zombiko_2.png',
			'MiniZombie_1': './images/cafenozombiko/MiniZombie_1.png',
			'MiniZombie_2': './images/cafenozombiko/MiniZombie_2.png',
			'Human':        './images/cafenozombiko/Human.png',
			'Takashi':      './images/cafenozombiko/Takashi.png',
			'Particle':     './images/cafenozombiko/Shine.png',
		};
		for (var key in imageAssets) { this.load.image(key, imageAssets[key]); }
		this.loadAudio();
	},

	loadAudio: function () {
		for (var i=0;i<=20;i++) {
			var num = ('0'+i).slice(-2);
			this.load.audio('MiniZombieVoice_'+num, [
				'./sounds/VOICE/VSEL/Alien/Alien_Funny_'+num+'.mp3',
				'./sounds/VOICE/VSEL/Alien/Alien_Funny_'+num+'.wav',
			]);
		}
		this.load.audio('Click', [
			'./sounds/SE/GUI_Sound_Effects/misc_menu_4.mp3',
			'./sounds/SE/GUI_Sound_Effects/misc_menu_4.wav',
		]);
		this.load.audio('Gunfire', [
			'./sounds/SE/Digital_SFX/laser7.mp3',
			'./sounds/SE/Digital_SFX/laser7.wav',
		]);
		this.load.audio('ZombieVoice_1', [
			'./sounds/SE/Zombies/zombie-12.mp3',
			'./sounds/SE/Zombies/zombie-12.wav',
		]);
		this.load.audio('ZombieVoice_2', [
			'./sounds/SE/Fantasy/Goblin_01.mp3',
			'./sounds/SE/Fantasy/Goblin_01.wav',
		]);
		this.load.audio('HumanVoice', [
			'./sounds/VOICE/VSEL/Human/Human_Good_06.mp3',
			'./sounds/VOICE/VSEL/Human/Human_Good_06.wav',
		]);
		this.load.audio('HappyBGM_1', [
			'./sounds/BGM/HappyBGM_1.mp3',
			'./sounds/BGM/HappyBGM_1.wav',
			'./sounds/BGM/HappyBGM_1.ogg',
		]);
		this.load.audio('HappyBGM_2', [
			'./sounds/BGM/HappyBGM_2.mp3',
			'./sounds/BGM/HappyBGM_2.wav',
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