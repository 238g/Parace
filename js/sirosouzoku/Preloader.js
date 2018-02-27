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
		// MEMO this.load.baseURL = 'https://238g.github.io/Parace/';
		var ip = './images/sirosouzoku/';
		this.load.atlasJSONHash('player', ip+'/siro_running.png', ip+'/siro_running.json');
		for (var key in this.game.conf.soundAssets) {
			this.load.audio(key, this.game.conf.soundAssets[key]);
		}
		this.load.image('obstacle_1', ip+'/virtual_1.png');
		this.load.image('obstacle_2', ip+'/virtual_2.png');
		this.load.image('sky', ip+'/sky.png');
		this.load.image('mountain', ip+'/mountain.png');
		this.load.image('ground', ip+'/ground.png');
		this.load.image('siro_res', ip+'/siro_res.png');
		this.load.image('siro_title_1', ip+'/siro_title_1.png');
		this.load.image('siro_title_2', ip+'/siro_title_2.png');
		this.load.image('siro_title_3', ip+'/siro_title_3.png');
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