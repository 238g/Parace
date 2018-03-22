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
			GAME_TITLE: 'アズリム節',
			GAME_MAIN_COLOR: '#d494fd',
			GAME_MAIN_COLOR_B: 0xd494fd,
			GAME_TEXT_COLOR: '#9a53eb',
			EASY_MODE: 1,
			NORMAL_MODE: 2,
			HARD_MODE: 3,
		};
	},

	defineGlobal: function () {
		this.game.global = {
			nextSceen: null,
			loadedOnlyFirst: false,
			SpriteManager: new SpriteManager(this),
			SoundManager: null,
			TweenManager: new TweenManager(this),
			currentMode: 1,
			albumCount: 0,
		};
	},

	defineConf: function () {
		var c = this.game.const;
		this.game.conf = {
			ModeInfo: {},
		};
		this.game.conf.ModeInfo[c.EASY_MODE] = {
			key: c.EASY_MODE,
			array: 1,
			text: 'かんたん',
			modeScore: 1,
			fishFrequency: 100,
			healingVal: 20,
			bonusInfo: {
				gravityX: 0,
				gravityY: 200,
				frequency: 12000,
			},
		};
		this.game.conf.ModeInfo[c.NORMAL_MODE] = {
			key: c.NORMAL_MODE,
			array: 2,
			text: 'ふつう',
			modeScore: 3,
			fishFrequency: 200,
			healingVal: 15,
			bonusInfo: {
				gravityX: 0,
				gravityY: 300,
				frequency: 11000,
			},
		};
		this.game.conf.ModeInfo[c.HARD_MODE] = {
			key: c.HARD_MODE,
			array: 3,
			text: 'むずかしい',
			modeScore: 5,
			fishFrequency: 300,
			healingVal: 10,
			bonusInfo: {
				gravityX: 0,
				gravityY: 600,
				frequency: 9000,
			},
		};
	},
};