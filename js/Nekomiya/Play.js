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


		this.ScoreTextSprite=null;
		this.TutorialSprite=null;
		this.Clays=null;
		this.Hinata=null;
	},
	initTrap:function(){
		this.checkTutorialName='endTutorialLevel';

		this.curLaunchCountTrap=0;
		this.launcherOrderTrap=[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2];
		Phaser.ArrayUtils.shuffle(this.launcherOrderTrap);
		this.leftClay=this.launcherOrderTrap.length;
		this.moveToXTrap=[160,320,480];

		this.TutorialText='飛んでいくクレーと呼ばれる素焼きの皿を\n撃ち壊していってください！\n\n25枚中何枚撃ち抜けるかな？';

		this.launchClay=this.launchClayTrap;
		this.addScore=this.addScoreTrap;

		this.TargetTextSprite=null;
	},
	initSD:function(){
		this.checkTutorialName='endTutorialSD';

		this.TutorialText='飛んでいくクレーと呼ばれる素焼きの皿を\n撃ち壊していってください！\n\n撃ち逃すとゲームオーバー！';

		this.launchClay=this.launchClaySD;
	},
	initScore:function(){
		this.checkTutorialName='endTutorialScore';

		this.TutorialText='飛んでいくクレーと呼ばれる素焼きの皿を\n撃ち壊していってください！\n\n制限時間内に何枚撃ち抜けるかな？';

		this.launchClay=this.launchClayScore;
	},

	create:function(){
		this.time.events.removeAll();
		this.M.SE.playBGM('PlayBGM',{volume:1});
		this.genContents();
		this.test();
	},

	update:function(){
		if(this.isPlaying){
			if(this.launcherTurn){
				this.launcherTimer-=this.time.elapsed;
				if(this.launcherTimer<0){
					this.launcherTurn=!1;
					this.launchClay();
					// TODO set next timer 
				}
			}
		}
	},

	start:function(){
		this.isPlaying=!0;
		this.nextClay();
	},

	end:function(type){
		this.isPlaying=!1;



		console.log('end');
	},

	test:function(){
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(function(){this.end();},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
