BasicGame.Title = function (game) {};

BasicGame.Title.prototype = {

	init: function () {
	},

	preload: function () {
		// loadingAnim.bind(this)();
		// loadAssets.bind(this)('title');
	},

	create: function () {
		var t = this.add.text(this.world.centerX, this.world.centerY, '- phaser text stroke -');
		console.log(this);
	},

	play: function () {

		this.state.start('Play');

	}

};