BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function () { 
		this.isPlaying=!1;
		this.correctCount=0;
		this.curSimonNum=0;
		this.goalCount=5;// TODO for info
		this.challengeCount=1;
		this.endSummonSimonCount=0;
		this.simonList=[];
		this.playerInput=!1;
		this.gamePadFrames=['buttonA','buttonB','arrowLeft','arrowDown','arrowUp','arrowRight'];
		this.btnCount=6; // TODO for info?
		this.gamePadColor=0x0000f0;
	},

	create:function () {
		this.time.events.removeAll();
		this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		this.playBGM();
		this.BtnContainer();
		for(var i=0;i<this.goalCount;i++)this.simonList.push(this.rnd.integerInRange(0,this.btnCount-1));
		this.start();
		this.test();
	},

	playBGM: function () {
		return; // TODO
		if (this.M.SE.isPlaying('PlayBGM')) return;
		this.M.SE.stop('currentBGM');
		this.M.SE.stop('TitleBGM');
		this.M.SE.play('PlayBGM',{isBGM:!0,loop:!0,volume:1});
	},

	start: function () {
		this.isPlaying=!0;
		this.summonSimon();
	},

	end:function(){
		console.log('end');
	},

	test: function () {
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.stage.backgroundColor=BasicGame.WHITE_COLOR;
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function(){this.end();},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
