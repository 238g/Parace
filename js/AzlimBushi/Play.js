BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GC = null;
		this.HUD = null;
	},

	create: function () {
		this.GC = this.GameController();
		this.HUD = this.HUDContainer();
		this.test();
	},

	GameController: function () {
		return {
			// started: false,
			isPlaying: false,
			// touched: false,
			score: 0,
		};

	},

	HUDContainer: function () {
		var c = {};
		return c;
	},

	test: function () {
		if (__ENV!='prod') {
			// this.GC.TimeLimit = getQuery('time') || this.GC.TimeLimit;
			// this.GC.CountLimit = getQuery('count') || this.GC.CountLimit;
			// this.game.global.currentChar = getQuery('char') || this.game.global.currentChar;
		}
	},
};