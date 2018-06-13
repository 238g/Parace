BasicGame = {};
BasicGame.Boot = function() {};
BasicGame.Boot.prototype = {
	init: function () {
		this.input.maxPointers = 1;
		this.stage.backgroundColor = '#424242';
		this.stage.disableVisibilityChange = true;

		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		
		if (this.game.device.desktop) {
			this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		} else {
			this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		}

		this.scale.parentIsWindow = true;
		this.scale.refresh();
	},

	preload: function () {
		this.load.crossOrigin = 'Anonymous';
		this.load.atlasJSONHash('loading', 'images/loading/loading.png', 'images/loading/loading.json');
	},

	create: function () {
		this.defineConst();
		this.defineGlobal();
		this.defineConf();
		var nextSceenName = (__ENV!='prod') ? getQuery('s') || 'Title' : 'Title';
		this.game.global.nextSceen = nextSceenName;
		this.state.start('Preloader');
	},

	defineConst: function () {
		this.game.const = {
			GAME_TITLE: '虚空の果てに',
			GAME_MAIN_COLOR: '#a1a4ad',
			GAME_MAIN_COLOR_B: 0xa1a4ad,
			GAME_TEXT_COLOR: '#917492',
			TOUCH_OR_CLICK: (this.game.device.touch)?'タッチ':'クリック',
			EN_TOUCH_OR_CLICK: (this.game.device.touch)?'TOUCH':'CLICK',
		};
	},

	defineGlobal: function () {
		this.game.global = {
			nextSceen: null,
			loadedOnlyFirst: false,
			SpriteManager: new SpriteManager(this),
			SoundManager: null,
			TweenManager: new TweenManager(this),
		};
	},

	defineConf: function () {
		var c = this.game.const;
		this.game.conf = {
		};
	},
};