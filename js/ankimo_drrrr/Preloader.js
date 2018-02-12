BasicGame.Preloader = function () {};

BasicGame.Preloader.prototype = {

	create: function () {
		this.loadManager();
	},

	loadingAnim: function () {
		var loadingSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'loading');
		loadingSprite.anchor.setTo(.5);
		loadingSprite.scale.setTo(1.5);

		var loadingAnim = loadingSprite.animations.add('loading');
		loadingAnim.play(18, true);
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

		this.loadOnlyFirst();
	},

	loadComplete: function () {
		// TODO
		// this.genSoundManager();
		// this.genTweenManager();

		this.state.start(this.game.global.nextSceen);
	},

	loadAssets: function () {
		var ip = './images/'
		var sp = './sounds/';
		this.load.audio('Male_1', sp+'Male/1.ogg');
		this.load.audio('Male_2', sp+'Male/2.ogg');
		this.load.audio('Male_3', sp+'Male/3.ogg');
		this.load.audio('game_over', sp+'Male/game_over.ogg');
		this.load.audio('go', sp+'Male/go.ogg');
	},

	loadOnlyFirst: function () {
		if (!this.game.global.loadedOnlyFirst) {
			this.userDatasController();
			this.game.global.loadedOnlyFirst = true;
		}
	},

	userDatasController: function () {
		var udc = new userDatasController(this.game.const.STORAGE_NAME);
		var datas = udc.get('0.0.0') || udc.init('0.0.0', {test:33333}/*, '0.0.0'*/);

		this.game.global.userDatasController = udc;
		this.game.global.userDatas = datas;
	}
};