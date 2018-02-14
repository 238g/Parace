BasicGame.Title = function () {};

BasicGame.Title.prototype = {
	init: function () {
		this.stage.setBackgroundColor(0xfbf6d5);
	},

	create: function () {
		this.genTextContainer();
		this.inputController();
	},

	inputController: function () {
		this.game.input.onDown.add(function (/*pointer, event*/) {
			this.game.global.nextSceen = 'Play';
			this.state.start(this.game.global.nextSceen);
		}, this);
	},

	genTextContainer: function () {
		var textStyle = {
			fontSize:'100px',
			fill: '#000000',
			stroke:'#FFFFFF',
			strokeThickness: 20,
			multipleStroke:'#000000',
			multipleStrokeThickness: 20,
		};
		this.genTitleTextSprite(textStyle);
		this.genStartTextSprite(textStyle);
	},

	genTitleTextSprite: function (textStyle) {
		this.game.global.spriteManager.genText(
			this.world.centerX, this.world.centerY-100, 'レッツ・あん肝！', textStyle
		);
	},

	genStartTextSprite: function (textStyle) {
		this.game.global.spriteManager.genText(
			this.world.centerX, this.world.centerY+100, 'スタート', textStyle
		);
	}

};
