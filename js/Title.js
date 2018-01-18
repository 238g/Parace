BasicGame.Title = function (game) {};

BasicGame.Title.prototype = {

	init: function () {},

	create: function () {
		this.genBackGround();
		this.genTitle();
		this.genStartBtn();
	},

	play: function () {
		nextSceen.bind(this)('CharacterSelect');
	},

	genBackGround: function () {
		this.stage.setBackgroundColor(0xfbf6d5);
	},

	genTitle: function () {
		var textStyle = { font: "50px Arial", fill: "#fff", align: "center" };
		var textSprite = this.add.text(this.world.centerX, this.world.centerY/2, '10秒当てゲーム', textStyle);
		textSprite.anchor.setTo(.5);
		textSprite.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 10);
	},

	genStartBtn: function () {
		var x = this.world.centerX;
		var y = this.world.centerY+100;

		var btnSprite = this.add.button(
			x, y, 'yellowSheet', 
			this.play, this, 
			'yellow_button02', 'yellow_button04', 'yellow_button03'
		);
		btnSprite.anchor.setTo(.5);

		var textStyle = { fill: "#fff", align: "center" };
		var textSprite = this.add.text(x, y, '  START  ', textStyle);
		textSprite.anchor.setTo(.5);
		textSprite.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 5);
	}
};