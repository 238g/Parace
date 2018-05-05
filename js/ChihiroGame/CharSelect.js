BasicGame.CharSelect = function () {};
BasicGame.CharSelect.prototype = {
	init: function () {
	},

	create: function () {
		this.M.setGlobal('curCharKey', 'Char_1');
		this.start();
	},

	start: function () {
		this.M.NextScene('Play');
	},
};
