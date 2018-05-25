BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function () { 
		////////// Val
		this.isPlaying=!1;
		this.curSimonFrame=null;
		////////// Obj
		this.Btns=null;
	},

	create:function () {
		this.time.events.removeAll();
		this.playBGM();
		// this.BtnContainer();
		this.start(); // TODO del
		this.test();
	},

	updateT: function () {
		if (this.isPlaying) {
		}
	},

	TimeManager: function () {
		if (this.countdownTimer<0) {
			this.countdownTimer=1E3;
			this.countdown--;
		}
		this.countdownTimer-=this.time.elapsed;
	},

	playBGM: function () {
		return; // TODO
		if (this.M.SE.isPlaying('PlayBGM')) return;
		this.M.SE.stop('currentBGM');
		this.M.SE.stop('TitleBGM');
		this.M.SE.play('PlayBGM',{isBGM:!0,loop:!0,volume:1});
	},

	start: function () {
		if (this.isPlaying==0) {
			this.isPlaying=!0;
		}
	},

	renderT: function () {
		// this.game.debug.geom(this.BladeLine);
		// for (var key in this.Targets.children) this.game.debug.body(this.Targets.children[key]);
	},

	test: function () {
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.stage.backgroundColor=BasicGame.WHITE_COLOR;
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function(){this.end('clear');},this);
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(function(){this.end('gameOver');},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
