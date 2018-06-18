BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		this.isPlaying=!1;
		this.tutorial=!0;
		this.checkTutorialName=null;
		this.launcherTurn=!1;
		this.launcherTimer=0;
		this.score=0;
		this.curLevel=this.M.getGlobal('curLevel');
		this.LevelInfo=this.M.getConf('LevelInfo')[this.curLevel];
		this.launcherPointWidth=this.LevelInfo.respawnWitdh;
		if(this.LevelInfo.isTrap){
			this.initTrap();
		}else if(this.LevelInfo.isSD){
			this.initSD();
		}else{
			this.initScore();
		}
		if(this.M.getGlobal(this.checkTutorialName)){
			this.tutorial=!1;
		}else{
			this.M.setGlobal(this.checkTutorialName,!0);
		}
		this.ScoreTextSprite=this.TutorialSprite=this.Clays=this.Hinata=null;
	},
	initTrap:function(){
		this.checkTutorialName='endTutorialLevel';
		this.scoreBaseText='現在: ';
		this.resultBaseText='得点: ';
		this.TutorialText='飛んでいくクレーと呼ばれる素焼きの皿を\n撃ち壊していってください！\n\n25枚中何枚撃ち抜けるかな？';
		this.curLaunchCountTrap=0;
		this.launcherOrderTrap=[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2];
		Phaser.ArrayUtils.shuffle(this.launcherOrderTrap);
		this.leftClay=this.launcherOrderTrap.length;
		this.moveToXTrap=[160,320,480];
		this.launchClay=this.launchClayTrap;
		this.addScore=this.addScoreTrap;
		this.missClay=this.none;
		this.TargetTextSprite=null;
	},
	initSD:function(){
		this.checkTutorialName='endTutorialSD';
		this.scoreBaseText='現在: ';
		this.resultBaseText='得点: ';
		this.TutorialText='飛んでいくクレーと呼ばれる素焼きの皿を\n撃ち壊していってください！\n\n撃ち逃すとゲームオーバー！\n空撃ちは大丈夫だから\n撃って撃って撃ちまくれ！';
		this.addScore=this.addScoreTrap;
		this.launchClay=this.launchClaySD;
		this.missClay=this.missClaySD;
	},
	initScore:function(){
		this.checkTutorialName='endTutorialScore';
		this.scoreBaseText='スコア: ';
		this.resultBaseText='スコア: ';
		this.TutorialText='飛んでいくクレーと呼ばれる素焼きの皿を\n撃ち壊していってください！\n\n制限時間内に何枚撃ち抜けるかな？\n撃って撃ってスコアを稼げ…！';
		this.leftTime=90;
		this.timer=0;
		this.addScore=this.addScoreScore;
		this.launchClay=this.launchClayScore;
		this.missClay=this.none;
		this.onInput=this.onInputScore;
		this.TimeTextSprite=null;
	},
	none:function(){},
	
	create:function(){
		this.time.events.removeAll();
		this.M.SE.playBGM('PlayBGM',{volume:1});
		this.genContents();
		if(this.tutorial){
			this.genTutorial();
		}else{
			this.start();
		}
		this.test();
	},

	update:function(){
		if(this.isPlaying){
			if(this.launcherTurn){
				this.launcherTimer-=this.time.elapsed;
				if(this.launcherTimer<0){
					this.launcherTurn=!1;
					this.launchClay();
				}
			}
			if(this.LevelInfo.isScore){
				this.timer-=this.time.elapsed;
				if(this.timer<0){
					this.timer=1E3;
					this.leftTime--;
					this.TimeTextSprite.changeText('制限時間: '+this.leftTime);
					if(this.leftTime==0)this.end();
				}
			}
			var r=this.physics.arcade.angleToPointer(this.Hinata);
			if(r<-.51){
				this.Hinata.rotation=-.51;
			}else{
				this.Hinata.rotation=r;
			}
		}
	},
	start:function(){
		this.isPlaying=!0;
		this.nextClay();
		this.input.onDown.add(this.onInput,this);
	},
	end:function(type){
		this.isPlaying=!1;
		this.genResult();
	},
	test:function(){
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(function(){this.end();},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
