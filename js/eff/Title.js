BasicGame.Title = function () {};

BasicGame.Title.prototype = {
	init: function () {
		this.stage.backgroundColor = '#5beea0';
	},

	create: function () {
		this.genBgSprite();
		this.genTextContainer();
		// this.soundController();
		setTimeout(function () { this.inputController(); }.bind(this), 800);
	},

	soundController: function () {
		var s = this.game.global.SoundManager;
		s.stop('currentBGM');
		setTimeout(function () {
			s.play({key:'HappyArcadeTune',isBGM:true,loop:true,volume:.6});
		}, 500);
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
			fontSize:'80px',
			fill: '#dd5a52',
			stroke:'#FFFFFF',
			strokeThickness: 20,
			multipleStroke:'#dd5a52',
			multipleStrokeThickness: 30,
		};
		this.genTitleTextSprite(textStyle);
		this.genStartTextSprite(textStyle);
	},

	genTitleTextSprite: function (textStyle) {
		var textSprite = this.game.global.SpriteManager.genText(
			this.world.centerX, 250, '🔥🔥🔥　燃やせ　🔥🔥🔥', textStyle
		);
		this.tweenBeatA(textSprite);
		this.tweenBeatA(textSprite.multipleTextSprite);
		var textSprite2 = this.game.global.SpriteManager.genText(
			this.world.centerX, 450, '🌲🌲🌲　エルフの森　🌲🌲🌲', textStyle
		);
		this.tweenBeatA(textSprite2);
		this.tweenBeatA(textSprite2.multipleTextSprite);
	},

	genStartTextSprite: function (textStyle) {
		var textSprite = this.game.global.SpriteManager.genText(
			this.world.centerX, this.world.height-100, 'スタート！！', textStyle
		);
		this.tweenBeatA(textSprite);
		this.tweenBeatA(textSprite.multipleTextSprite);
	},

	tweenBeatA: function (sprite) {
		this.game.global.TweenManager.beatA(sprite, 220);
	},

	genBgSprite: function () {
		for (var i=0;i<4;i++) {
			var imgWidth = 411;
			this.game.global.SpriteManager.genSprite(i*imgWidth, 0, 'Elu_1');
		}
	},

};
