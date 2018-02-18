BasicGame.Preloader = function () {};

BasicGame.Preloader.prototype = {

	create: function () {
		this.loadManager();
	},

	loadManager: function () {
		this.loadingAnim();

		var textStyle = { font: '30px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 10 };
		var textSprite = this.add.text(this.world.centerX, this.world.centerY+120, '0%', textStyle);
		textSprite.anchor.setTo(.5);
		this.load.onFileComplete.add(function (progress/*, cacheKey, success, totalLoaded, totalFiles*/) {
			textSprite.setText(progress+'%');
		}, this);
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},

	loadingAnim: function () {
		var loadingSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'loading');
		loadingSprite.anchor.setTo(.5);
		loadingSprite.scale.setTo(1.5);

		var loadingAnim = loadingSprite.animations.add('loading');
		loadingAnim.play(18, true);
	},

	loadComplete: function () {
		this.loadOnlyFirst();
		this.state.start(this.game.global.nextSceen);
	},

	loadAssets: function () {
		var ip = './images/ankimo_drrrr/'
		this.load.image('player', ip+'player.png');
		for (var key in this.game.conf.soundAssets) {
			this.load.audio(key, this.game.conf.soundAssets[key]);
		}
		this.load.atlasXML('roundAnimals', ip+'/roundAnimals.png', ip+'/roundAnimals.xml');
		this.load.atlasXML('squareAnimals', ip+'/squareAnimals.png', ip+'/squareAnimals.xml');
	},

	loadOnlyFirst: function () {
		if (!this.game.global.loadedOnlyFirst) {
			if (this.game.device.desktop) { document.body.style.cursor = 'pointer'; }
			this.game.global.SoundManager = new SoundManager(this);
			// this.userDatasController();
			this.game.global.loadedOnlyFirst = true;
		}
	},

	userDatasController: function () {
		var udc = new UserDatasController(this.game.const.STORAGE_NAME);
		var datas = udc.get('0.0.0') || udc.init('0.0.0', {
			total_score: 0,
			best_score: 0,
		}/*, '0.0.0'*/);

		this.game.global.UserDatasController = udc;
		// ENHANCE set totalscore,bestscore to global
	}
};