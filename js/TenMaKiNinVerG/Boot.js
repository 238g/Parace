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
			currentMode: 1,
			currentChar: 'T',
			nextSceen: null,
			loadedOnlyFirst: false,
			SpriteManager: new SpriteManager(this),
			SoundManager: null,
			TweenManager: new TweenManager(this),
			lowSpec: getQuery('spec') ? true : false,
		};
	},

	defineConf: function () {
		var c = this.game.const;
		this.game.conf = {
			CharInfo: {
				T: {
					name: 'ぜったい天使くるみちゃん',
					color: 0xee2324,
					colorS: '#ee2324',
					textColorS: '#ff6347',
					mode: c.EASY_MODE,
					modeName: 'EASY',
					emoji: '👼👼👼👼👼👼',
					frame: 0,
					spellName: [
						'ゲリラライブ',
						'ひとにぎり',
						'くるみちゃんまじ天使',
					],
					themeBGM: 'ThemeBGM_T',
					themeVol: .8,
				},
				M:{
					name: 'あっくん大魔王',
					color: 0x953ac3,
					colorS: '#953ac3',
					textColorS: '#9932cc',
					mode: c.EASY_MODE,
					modeName: 'EASY',
					emoji: '👿👿👿👿👿👿',
					frame: 1,
					spellName: [
						'フゥーハハハ！',
						'い゛ろ゛は゛す゛',
						'やめてやめてやめて！',
					],
					themeBGM: 'ThemeBGM_M',
					themeVol: .7,
				},
				K:{
					name: 'ニーツ',
					color: 0x0834ff,
					colorS: '#1e90ff',
					textColorS: '#1e90ff',
					mode: c.NORMAL_MODE,
					modeName: 'NORMAL',
					emoji: '🤖🤖🤖🤖🤖🤖',
					frame: 2,
					spellName: [
						'たけのこ派メカ',
						'ロケットパンチ',
						'ビームサーベル',
					],
					themeBGM: 'ThemeBGM_K',
					themeVol: .7,
				},
				N:{
					name: '乾伸一郎',
					color: 0x775746,
					colorS: '#775746',
					textColorS: '#d2691e',
					mode: c.NORMAL_MODE,
					modeName: 'NORMAL',
					emoji: '🐱‍💻🐱‍💻🐱‍💻🐱‍💻🐱‍💻🐱‍💻',
					frame: 3,
					spellName: [
						'禁術使いでは？',
						'おはござ～！',
						'90 55 86',
					],
					themeBGM: 'ThemeBGM_N',
					themeVol: 1,
				},
				G:{
					name: 'バーチャルゴリラ',
					color: 0x58ea73,
					colorS: '#333333',
					textColorS: '#333333',
					mode: c.HARD_MODE,
					modeName: 'HARD',
					emoji: '🦍🦍🦍🦍🦍🦍',
					frame: 4,
					spellName: [
						'恐縮です。',
						'喋れるゴリラだ！',
						'森の賢人',
					],
					themeBGM: 'ThemeBGM_G',
					themeVol: .7,
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