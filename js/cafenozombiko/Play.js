BasicGame.Play = function () {};

BasicGame.Play.prototype = {
	init: function () {
	},

	create: function () {
		// this.GOP = this.GameOption();
		// this.HUD = this.genHUDContainer();
		this.test();
	},

	soundController: function () {
		var s = this.game.global.SoundManager;
		s.stop('currentBGM');
		setTimeout(function () {
			s.stop('currentBGM');
			s.play({key:'MushroomsForest',isBGM:true,loop:true,volume:.8,});
		}, 500);
	},

	update: function () {
	},

	GameOption: function () {
		return {
			a: 0,
			b:0,
		};
	},

	ready: function () {
	},

	start: function () {
	},

	gameOver: function () {
	},

	rand: function (min, max) {
		return this.rnd.integerInRange(min, max);
	},

	test: function () {
		if (__ENV!='prod') {
			// if (getQuery('gameOver')) { this.Panel.hide();this.gameOver(); }
			// this.GC.horizontal = getQuery('h') || this.GC.horizontal;
			// this.GC.vertical = getQuery('v') || this.GC.vertical;
		}
	},
};