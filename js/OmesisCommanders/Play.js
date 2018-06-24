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

		this.charAnimCount=this.M.getConst('CHAR_ANIM_COUNT');

		this.challengeCount=this.curStageInfo.firstChallengeCount;
		this.endSummonSimonCount=0;
		this.simonList=[];
		this.playerInput=!1;

		this.gamePadFrames=['buttonA','buttonB','arrowLeft','arrowDown','arrowUp','arrowRight'];
		this.gamePadColors=[0xe8383d,0x00a960,0x444444,0x444444,0x444444,0x444444];
		this.btnCount=this.gamePadFrames.length;

		this.maxLife=
		this.curLife=100;
		this.dmge=this.curStageInfo.dmge;

		this.endSt=null;

		this.TutSprite=
		this.PlayerLifeSprite=this.EnemyLifeSprite=
		this.RdyTxtSprite=this.FightTxtSprite=
		this.PlayerSprite=this.EnemySprite=
		null;
	},

	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('G_Alpha',{volume:1});
		this.genContents();
		for(var i=0;i<this.goalCount;i++)this.simonList.push(this.rnd.integerInRange(0,this.btnCount-1));
		this.tut();
		this.tes();
	},

	tut:function(){
		if(this.M.getGlobal('endTut'))return this.rdy();
		this.genTut();
	},
	rdy:function(){
		var tween=this.M.T.popUpB(this.RdyTxtSprite,{duration:800});
		tween.start();
		tween.onComplete.add(this.fight,this);
	},
	fight:function(){
		//TODO destroy timing -> refer other game
		this.RdyTxtSprite.destroy();
		var tween=this.M.T.popUpB(this.FightTxtSprite,{duration:800});
		tween.start();
		tween.onComplete.add(this.start,this);
	},
	start:function(){
		//TODO destroy timing -> refer other game
		this.FightTxtSprite.destroy();
		this.isPlaying=!0;
		this.summonSimon();
	},
	end:function(){
		this.isPlaying=!1;
		this.playerInput=!1;

		if(this.endSt=='WIN'){
			// TODO enemy health =0
			this.genResPopUp('WIN');
		}else{//gameover
			if(this.curStageInfo.isEndless){
				// TODO endless res
				this.genResPopUp('GAME OVER');
			}else{
				// TODO player health =0
				this.genResPopUp('LOSE');
			}
		}
	},

	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function(){this.endSt='WIN';this.end();},this);
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(function(){this.endSt='LOSE';this.end();},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
			this.M.H.getQuery('cc')&&(this.challengeCount=this.M.H.getQuery('cc'));
		}
	},
};
