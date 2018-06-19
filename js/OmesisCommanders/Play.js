BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		this.isPlaying=!1;
		this.correctCount=0;
		this.curSimonNum=0;

		var CharInfo=this.M.getConf('CharInfo');

		this.curChar=this.M.getGlobal('curChar');
		this.curCharInfo=CharInfo[this.curChar];

		this.curEnemy=this.rnd.integerInRange(1,this.M.getGlobal('charCount'));
		this.curEnemyInfo=CharInfo[this.curEnemy];

		this.curStage=this.M.getGlobal('curStage');
		this.curStageInfo=this.M.getConf('StageInfo')[this.curStage];

		this.goalCount=this.curStageInfo.goalCount;

		this.challengeCount=1;
		this.endSummonSimonCount=0;
		this.simonList=[];
		this.playerInput=!1;
		this.gamePadFrames=['buttonA','buttonB','arrowLeft','arrowDown','arrowUp','arrowRight'];
		this.btnCount=6; // TODO for info?
		this.gamePadColor=0x0000f0;

		this.maxLife=
		this.curLife=100;
		this.damage=35; // TODO for info

		this.ReadyTextSprite=this.GoTextSprite=
		this.PlayerSprite=this.EnemySprite=
		null;
	},

	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('PlayBGM',{volume:1});
		this.genContents();
		for(var i=0;i<this.goalCount;i++)this.simonList.push(this.rnd.integerInRange(0,this.btnCount-1));
		this.rdy();
		this.test();
	},

	rdy:function(){
		// TODO tut // tutorial

		var tween=this.M.T.popUpB(this.ReadyTextSprite);
		tween.start();
		tween.onComplete.add(this.go,this);
	},
	go:function(){
		//TODO destroy timing -> refer other game
		this.ReadyTextSprite.destroy();
		var tween=this.M.T.popUpB(this.GoTextSprite);
		tween.start();
		tween.onComplete.add(this.start,this);
	},
	start:function(){
		//TODO destroy timing -> refer other game
		this.GoTextSprite.destroy();
		this.isPlaying=!0;
		this.summonSimon();
	},

	end:function(type){
		this.isPlaying=!1;
		this.playerInput=!1;
		if(type=='clear'){
			// TODO enemy health =0
			// TODO winner res
		}else{//gameover
			if(this.curStageInfo.isEndless){
				// TODO endless res
			}else{
				// TODO loser res
				// TODO player health =0
			}
		}
		console.log(type);
	},

	test:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function(){this.end('clear');},this);
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(function(){this.end('gameover');},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
