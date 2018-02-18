BasicGame.Play = function () {};

BasicGame.Play.prototype = {
	init: function () {
	},

	create: function () {
	},
	
	render: function () {
		this.game.debug.pointer(this.game.input.activePointer);
	},

};
