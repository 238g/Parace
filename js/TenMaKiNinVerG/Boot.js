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
			GAME_TITLE: '天魔機忍ストーンズverG',
			EASY_MODE: 1,
			NORMAL_MODE: 2,
			HARD_MODE: 3,
		};
	},

	defineGlobal: function () {
		this.game.global = {
			currentMode: 3,
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
			CharInfo: {
				T: {
					name: 'ぜったい天使くるみちゃん ',
					color: 0xee2324,
					mode: c.EASY_MODE,
					modeName: 'EASY',
				},
				M:{
					name: 'あっくん大魔王',
					color: 0x953ac3,
					mode: c.EASY_MODE,
					modeName: 'EASY',
				},
				K:{
					name: 'ニーツ ',
					color: 0x0834ff,
					mode: c.NORMAL_MODE,
					modeName: 'NORMAL',
				},
				N:{
					name: '乾伸一郎 ',
					color: 0x775746,
					mode: c.NORMAL_MODE,
					modeName: 'NORMAL',
				},
				G:{
					name: 'バーチャルゴリラ',
					color: 0x333333,
					mode: c.HARD_MODE,
					modeName: 'HARD',
				},
			},
			ModeInfo: {},
		};
		this.game.conf.ModeInfo[c.EASY_MODE] = {
			TotalFrame: 2, // 0~4
		};
		this.game.conf.ModeInfo[c.NORMAL_MODE] = {
			TotalFrame: 3, // 0~4
		};
		this.game.conf.ModeInfo[c.HARD_MODE] = {
			TotalFrame: 4, // 0~4
		};
	},
};