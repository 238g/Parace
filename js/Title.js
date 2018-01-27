BasicGame.Title = function (game) {};

BasicGame.Title.prototype = {

	init: function () {},

	create: function () {
		this.genBackGround();
		this.genTitleText();
		this.genBGM();
		this.genStartBtn();

		// TODO setting hamburger menu
	},

	goToNextSceen: function () {
        this.game.global.goToNextSceen('CharacterSelect');
	},

	genBackGround: function () {
		this.stage.setBackgroundColor(0xfbf6d5);
	},

	genBGM: function () {
		// TODO
	},

	genTitleText: function () {
		var textStyle = { font: "50px Arial", fill: "#fff", align: "center" };
		var textSprite = this.add.text(this.world.centerX, this.world.centerY/2, '秒当てゲーム', textStyle);
		textSprite.anchor.setTo(.5);
		textSprite.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 10);
		textSprite.stroke = '#000000';
		textSprite.strokeThickness = 3;
	},

	genStartBtn: function () {
		var x = this.world.centerX;
		var y = this.world.centerY+100;

		var btnSprite = this.add.button(
			x, y, 'yellowSheet', 
			function () {
				this.game.global.sounds.click.play();
				this.goToNextSceen();
			}, this, 
			'yellow_button04', 'yellow_button02', 'yellow_button05'
		);
		btnSprite.anchor.setTo(.5);

		var textStyle = { fill: "#fff", align: "center" };
		var textSprite = this.add.text(x, y, '  START  ', textStyle);
		textSprite.anchor.setTo(.5);
		textSprite.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 10);
		textSprite.stroke = '#000000';
		textSprite.strokeThickness = 3;
	}
};