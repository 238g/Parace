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
			// currentMode: 3, // TODO del
			currentMode: 1,
			currentChar: 'T', // TODO del
			// currentChar: null,
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
					colorS: '#ee2324',
					mode: c.EASY_MODE,
					modeName: 'EASY',
					emoji: '👼👼👼👼👼👼',
				},
				M:{
					name: 'あっくん大魔王',
					color: 0x953ac3,
					colorS: '#953ac3',
					mode: c.EASY_MODE,
					modeName: 'EASY',
					emoji: '👿👿👿👿👿👿',
				},
				K:{
					name: 'ニーツ ',
					color: 0x0834ff,
					colorS: '#0834ff',
					mode: c.NORMAL_MODE,
					modeName: 'NORMAL',
					emoji: '🤖🤖🤖🤖🤖🤖',
				},
				N:{
					name: '乾伸一郎 ',
					color: 0x775746,
					colorS: '#775746',
					mode: c.NORMAL_MODE,
					modeName: 'NORMAL',
					emoji: '🐱‍💻🐱‍💻🐱‍💻🐱‍💻🐱‍💻🐱‍💻',
				},
				G:{
					name: 'バーチャルゴリラ',
					color: 0x333333,
					colorS: '#333333',
					mode: c.HARD_MODE,
					modeName: 'HARD',
					emoji: '🦍🦍🦍🦍🦍🦍',
				},
			},
			ModeInfo: {},
		};
		this.game.conf.ModeInfo[c.EASY_MODE] = {
			TotalFrame: 4,
			BonusScore: 1,
			TimeLimit: 180, // seconds
		};
		this.game.conf.ModeInfo[c.NORMAL_MODE] = {
			TotalFrame: 5,
			BonusScore: 5,
			TimeLimit: 120, // seconds
		};
		this.game.conf.ModeInfo[c.HARD_MODE] = {
			TotalFrame: 5,
			BonusScore: 10,
			TimeLimit: 90, // seconds
		};
	},
};