BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){
		/// Conf
		var CharInfo=this.M.getConf('CharInfo');
		this.curChar=this.M.getGlobal('curChar');
		this.curCharInfo=CharInfo[this.curChar];
		this.curEnemy=this.rnd.integerInRange(1,this.M.getGlobal('charCount'));
		this.curEnemyInfo=CharInfo[this.curEnemy];
		this.curStage=this.M.getGlobal('curStage');
		this.curStageInfo=this.M.getConf('StageInfo')[this.curStage];
		/// Val
		this.isPlaying=
		this.playerInput=!1;
		this.endSt=null;
		this.playerLifeWidth=this.enemyLifeWidth=
		this.correctCount=
		this.curSimonNum=
		this.endSummonSimonCount=0;
		this.goalCount=this.curStageInfo.goalCount;
		this.challengeCount=this.curStageInfo.firstChallengeCount;
		this.simonList=[];
		this.playBgm=this.M.getGlobal('rndBgm');
		////// this.charAnimCount=this.M.getConst('CHAR_ANIM_COUNT');
		/// GamePad
		this.gamePadFrames=['buttonA','buttonB','arrowLeft','arrowDown','arrowUp','arrowRight'];
		this.gamePadColors=[0xe8383d,0x00a960,0x444444,0x444444,0x444444,0x444444];
		this.btnCount=this.gamePadFrames.length;
		/// Gauge
		this.maxLife=
		this.curLife=
		this.curEnemyLife=100;
		this.dmge=this.curStageInfo.dmge;
		this.attack=100/((this.goalCount-this.challengeCount)+1);
		/// Obj
		this.TutSprite=this.RdyTxtSprite=this.FightTxtSprite=
		this.PlayerLifeSprite=this.EnemyLifeSprite=
		this.PlayerSprite=this.EnemySprite=null;
	},

	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#000000';
		this.M.SE.playBGM(this.playBgm,{volume:1.5});
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
		this.M.SE.play('Ready',{volume:1});
	},
	fight:function(){
		this.RdyTxtSprite.destroy();
		var tween=this.M.T.popUpB(this.FightTxtSprite,{duration:800});
		tween.start();
		tween.onComplete.add(this.start,this);
		this.M.SE.play('Fight',{volume:1});
	},
	start:function(){
		this.isPlaying=!0;
		this.time.events.add(300,function(){
			this.FightTxtSprite.destroy();
			this.summonSimon();
		},this);
	},
	end:function(){
		this.isPlaying=this.playerInput=!1;
		if(this.endSt=='WIN'){
			this.M.SE.play('Win',{volume:1});
			this.genResPopUp('WIN');
		}else
			if(this.curStageInfo.isEndless){
				this.M.SE.play('GameOver',{volume:1});
				this.genResPopUp('GAME OVER');
			}else{
				this.M.SE.play('Lose',{volume:1});
				this.genResPopUp('LOSE');
			}
		}
	},

	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function(){this.endSt='WIN';this.end();},this);
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(function(){this.endSt='LOSE';this.end();},this);
			this.M.H.getQuery('cc')&&(this.challengeCount=this.M.H.getQuery('cc'));
		}
	},
};
