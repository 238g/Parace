BasicGame.Title = function () {};

BasicGame.Title.prototype = {
	init: function () {
		this.stage.setBackgroundColor(0xfbf6d5);
	},

	create: function () {
		this.genTitleTextSprite();
		this.genStartTextSprite();
		this.inputController();
	},

	inputController: function () {
		this.game.input.onDown.add(function (/*pointer, event*/) {
			this.game.global.nextSceen = 'Play';
			this.state.start(this.game.global.nextSceen);
		}, this);
	},

	genTitleTextSprite: function () {
		var textStyle = {fill: '#00FF00',stroke:'#FFFF00',multipleStroke:'#000000'};
		this.game.global.spriteManager.genText(
			this.world.centerX, this.world.centerY-100, 'レッツ・あん肝！', textStyle
		);
	},

	genStartTextSprite: function () {
		var textStyle = {fill: '#00FF00',stroke:'#FFFF00',multipleStroke:'#000000'};
		this.game.global.spriteManager.genText(
			this.world.centerX, this.world.centerY+100, 'スタート', textStyle
		);
	}

};
