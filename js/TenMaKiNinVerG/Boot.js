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
					name: 'ぜったい天使くるみちゃん',
					color: 0xee2324,
					colorS: '#ee2324',
					textColorS: '#ff6347',
					mode: c.EASY_MODE,
					modeName: 'EASY',
					emoji: '👼👼👼👼👼👼',
					frame: 0,
					spellName: '',// TODO
					// ゲリラライブ,おまえのことなどひとにぎり,子羊,酒焼け天使,僕に年齢という概念はないのだ！
					themeBGM: 'ThemeBGM_T',
					themeVol: 1,
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
					spellName: '', // TODO
					// フゥーハハハ！,い゛ろ゛は゛す゛,永遠の999歳,やめてやめてやめて！
					themeBGM: 'ThemeBGM_M',
					themeVol: 1,
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
					spellName: '', // TODO
					// VT-212,たけのこ派メカ,もちろんたけのこ派、ですよね？
					themeBGM: 'ThemeBGM_K',
					themeVol: 1,
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
					spellName: '', // TODO
					// お屋形様,お屋形ぁ今何キロ！？,おはござ～,然らば御免！ドロン！
					themeBGM: 'ThemeBGM_N',
					themeVol: 1,
				},
				G:{
					name: 'バーチャルゴリラ',
					color: 0x333333,
					colorS: '#333333',
					textColorS: '#333333',
					mode: c.HARD_MODE,
					modeName: 'HARD',
					emoji: '🦍🦍🦍🦍🦍🦍',
					frame: 4,
					spellName: '', // TODO
					// 恐縮です。,めずらし！！喋れるゴリラだ！！
					themeBGM: 'ThemeBGM_G',
					themeVol: 1,
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