BasicGame.Title = function () {};

BasicGame.Title.prototype = {
	init: function () {
		this.stage.backgroundColor = '#b0d8fb';
	},

	create: function () {
		this.genTextContainer();
		this.soundController();
		setTimeout(function () { this.inputController(); }.bind(this), 500);
	},

	soundController: function () {
		/*
		var s = this.game.global.SoundManager;
		s.stop('currentBGM');
		s.play({key:'TowerDefenseTheme',isBGM:true,loop:true});
		*/
	},

	inputController: function () {
		this.game.input.onDown.add(function (/*pointer, event*/) {
			this.game.global.SoundManager.play('MenuClick');
			this.game.global.nextSceen = 'Play';
			this.state.start(this.game.global.nextSceen);
		}, this);
	},

	genTextContainer: function () {
		var textStyle = {
			fontSize:'100px',
			fill: '#5fa0dc',
			stroke:'#FFFFFF',
			strokeThickness: 20,
			multipleStroke:'#5fa0dc',
			multipleStrokeThickness: 30,
		};
		this.genTitleTextSprite(textStyle);
		this.genStartTextSprite(textStyle);
	},

	genTitleTextSprite: function (textStyle) {
		var textSprite = this.game.global.SpriteManager.genText(
			this.world.centerX, this.world.centerY-100, '🏍　シロ走族　🏍', textStyle
		);
		this.tween(textSprite);
		this.tween(textSprite.multipleTextSprite);
	},

	genStartTextSprite: function (textStyle) {
		var textSprite = this.game.global.SpriteManager.genText(
			this.world.centerX, this.world.centerY+100, '🐬　スタート　🐬', textStyle
		);
		this.tween(textSprite);
		this.tween(textSprite.multipleTextSprite);
	},

	tween: function (sprite) {
		var scaleX = sprite.scale.x+.1;
		var scaleY = sprite.scale.y+.1;
		this.add.tween(sprite.scale).to({x: scaleX, y: scaleY}, 220, Phaser.Easing.Sinusoidal.Out, true, 0, -1, true);
	},
	
	render: function () {
		this.game.debug.pointer(this.game.input.activePointer);
	},

};
