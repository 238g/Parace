BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
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

		this.life=100;
		this.damage=35; // TODO for info
	},

	create:function () {
		this.time.events.removeAll();
		this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('PlayBGM',{volume:1});
		this.BtnContainer();
		for(var i=0;i<this.goalCount;i++)this.simonList.push(this.rnd.integerInRange(0,this.btnCount-1));
		this.start();
		this.test();
	},

	start: function () {
		this.isPlaying=!0;
		this.summonSimon();
	},

	end:function(type){
		this.isPlaying=!1;
		this.playerInput=!1;
		if(type=='clear'){
		}else{//gameover
		}
		console.log(type);
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
