BasicGame.Title = function (game) {};

BasicGame.Title.prototype = {

	init: function () {
		this.texts = {
			title: '10秒ゲーム',
			startBtn: 'START',
		};
	},

	create: function () {
		this.genTitle();
		this.genStartBtn();
		console.log(this);
	},

	play: function () {

		this.state.start('Play');

	},

	genTitle: function () {
		var textSprite = this.add.text(this.world.centerX, this.world.centerY, this.texts.title);
		textSprite.anchor.setTo(.5);
	},

	genStartBtn: function () {
		var btnSprite = this.add.button(100, 100, 'yellowSheet', this.play, this, 'yellow_button02', 'yellow_button04', 'yellow_button03');
		// TODO button text
	}
};