BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GM = {};
	},

	create: function () {
		this.GameManager();
		this.genStartBtnSprite();
		this.ready();
		this.test();
	},

	GameManager: function () {
		this.GM = {
			isPlaying: false,
		};
	},

	updateT: function () {
		if (this.GM.isPlaying) {
		}
	},

	genStartBtnSprite: function () {
		var textStyle = this.M.S.BaseTextStyleS(25);
		var btnSprite = this.add.button(
			this.world.centerX,this.world.centerY,
			'CircleBtns',function () {

			}, this,'Hover','Normal','Push','Normal'
		);
		btnSprite.anchor.setTo(.5);
		var textSprite = this.M.S.genText(0,0,'スタート',textStyle);
		textSprite.addToChild(btnSprite);
		// TODO this. -> changeText...
	},

	ready: function () {
		// TODO
		// this.stopBGM();
		// this.playBGM();
		// this.HUD.startGame();
		this.start(); // TODO del
	},

	playBGM: function () {
		var s = this.M.SE;
		if (s.isPlaying('Stage_1')) return;
		s.play('Stage_1',{isBGM:true,loop:true,volume:1});
	},

	stopBGM: function () {
		var s = this.M.SE;
		if (s.isPlaying('PlayBGM')) return;
		s.stop('currentBGM');
		s.stop('TitleBGM');
	},

	start: function () {
		this.GM.isPlaying = true;
	},

	gameOver: function () {
		this.GM.isPlaying = false;
	},

	renderT: function () {
		// this.game.debug.body(this.Paddle);
		// this.game.debug.body(this.Ball);
	},

	test: function () {
		if (__ENV!='prod') {
			this.game.debug.font='40px Courier';
			this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver, this);
			this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
		}
	},
};
