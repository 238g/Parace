BasicGame = {};
BasicGame.Boot = function() {};
BasicGame.Boot.prototype = {
	init: function () {
		this.M.BootInit(false);
	},

	preload: function () {
		this.load.crossOrigin = 'Anonymous';
		this.load.atlasJSONHash('loading', 'images/loading/loading.png', 'images/loading/loading.json');
	},

	create: function () {
		this.defineConst();
		this.defineGlobal();
		this.defineConf();
		this.M.NextScene('Preloader');
	},

	defineConst: function () {
		this.M.defineConst({
			GAME_TITLE: 'まりちゃんばりん',
			MAIN_COLOR: '#fffd3a',
			MAIN_TINT:  0xfffd3a,
			MAIN_TEXT_COLOR: '#eaad18',
			PERFECT: 1,
			COOL: 2,
			GOOD: 3,
			BAD: 4,
			FALSE: 5,
		});
	},

	defineGlobal: function () {
		this.M.defineGlobal({
			loadedOnlyFirst: false,
			currentMusicalScoresId: 1001,
		});
	},

	defineConf: function () {
		this.M.defineConf({
			MusicalScores: this.genMusicalScores(),
			YoutubeInfo: {
				1001: {
					title: 'やさしさに包まれたなら',
					youtubeId: 'cOtT55-SH4k',
					MusicalScores: 'MusicalScore_1',
				},
				1002: {
					title: 'メルト',
					youtubeId: 'wRmYHK14yyI',
					MusicalScores: 'MusicalScore_2',
				},
			},
			JudgeInfo: {
				1: { // PERFECT
					text:'PERFECT!!',
					score: 5000,
					combo: 1,
					color: '#ff00ff',
				},
				2: { // COOL
					text:'COOL!',
					score: 3000,
					combo: 1,
					color: '#00bfff',
				},
				3: { // GOOD
					text:'GOOD',
					score: 1000,
					combo: 1,
					color: '#d2691e',
				},
				4: { // BAD
					text:'BAD',
					score: 100,
					combo: 1,
					color: '#9400d3',
				},
				5: { // FALSE
					text:'FALSE',
					score: -1000,
					combo: 0,
					color: '#32cd32',
				},
			},
		});
	},
};
