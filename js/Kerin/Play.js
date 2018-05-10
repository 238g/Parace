BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.DeclearConst();
		this.DeclearVal();
		this.DeclearObj();
	},

	DeclearConst: function () {
	},

	DeclearVal: function () {
		this.isPlaying = false;
		this.secTimer = 1000;
	},

	DeclearObj: function () {
	},

	create: function () {
		this.time.events.removeAll();
		this.ready();
		this.test();
	},

	updateT: function () {
		if (this.isPlaying) {
			this.TimeManager();
		}
	},

	TimeManager: function () {
		if (this.secTimer<0) {
			this.secTimer = 1000;
		}
		this.secTimer-=this.time.elapsed;
	},

	ready: function () {
		// TODO
		// this.stopBGM();
		// this.playBGM();
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
		this.isPlaying = true;
	},

	gameOver: function () {
		this.isPlaying = false;
	},

	renderT: function () {
	},

	test: function () {
		if (__ENV!='prod') {
			this.game.debug.font='40px Courier';
			this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function () {}, this);
			this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		}
	},
};
