BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		this.isPlaying=!1;

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

		this.ScoreTextSprite=null;
		this.Clays=null;
	},
	initTrap:function(){
		this.curLaunchCountTrap=0;
		this.launcherOrderTrap=[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2];
		this.moveToXTrap=[160,320,480];
		Phaser.ArrayUtils.shuffle(this.launcherOrderTrap);
		this.launchClay=this.launchClayTrap;

		this.TargetTextSprite=null;
	},
	initSD:function(){
		// TODO
	},
	initScore:function(){
		this.launchClay=this.launchClayScore;
	},

	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.stage.backgroundColor='#555555';//TODO del
		// this.M.SE.playBGM('PlayBGM',{volume:1});

		this.Clays=this.add.group();
		this.Clays.inputEnableChildren=!0;
		this.Clays.createMultiple(30,'Clay');
		this.Clays.children.forEach(function(t){t.anchor.setTo(.5);});
		this.Clays.onChildInputDown.add(this.breakClay,this);


		if(this.LevelInfo.isTrap){
			this.TargetTextSprite=this.M.S.genTextM(this.world.width*.7,this.world.height*.9,'目標: '+this.launcherOrderTrap.length);
		}

		this.ScoreTextSprite=this.M.S.genTextM(this.world.width*.85,this.world.height*.9,'現在: 0');

		this.start();
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
	launchClay:function(){},
	launchClayBase:function(moveToX){
		var clay=this.Clays.getFirstDead();
		if(clay){
			var w=this.LevelInfo.respawnWidth;
			var launcherX=this.world.centerX+this.rnd.between(-w,w);

			clay.scale.setTo(1);
			clay.reset(launcherX,this.world.height+clay.height);
	
			var delay=this.rnd.between(0,1000);
			var duration=4000-this.rnd.between(0,this.LevelInfo.durationMinusRange);
	
			var h=this.LevelInfo.moveRangeY;
			var moveToY=180+this.rnd.between(-h,h);
			var tween=this.M.T.moveA(clay,{xy:{x:moveToX,y:moveToY},duration:duration,delay:delay}).start();
			tween.onComplete.add(this.missClay,this);
			this.add.tween(clay.scale).to({x:0,y:0},duration,Phaser.Easing.Cubic.Out,!0,delay);
		}
	},

	launchClayTrap:function(){
		var to=this.launcherOrderTrap[this.curLaunchCountTrap];
		var moveToX=this.moveToXTrap[to]+this.rnd.between(-50,50);

		this.launchClayBase(moveToX);

		this.curLaunchCountTrap++;
	},

	launchClayScore:function(){
		// TODO launch cycle...
		var r=this.rnd.integerInRange(1,3);
		for(var i=0;i<r;i++){
			var moveToX=this.world.centerX+this.rnd.between(-280,280);
			this.launchClayBase(moveToX);
		}

	},

	breakClay:function(btn){
		btn.kill();
		console.log('break');

		this.score++;
		this.ScoreTextSprite.changeText('現在: '+this.score);

		this.nextClay();
	},

	missClay:function(s){
		s.kill();
		this.nextClay();
	},

	nextClay:function(){
		if(this.LevelInfo.isTrap&&(this.curLaunchCountTrap==this.launcherOrderTrap.length)){
			this.end();
		}
		this.launcherTimer=this.rnd.between(this.LevelInfo.launcherMinTimer,this.LevelInfo.launcherMaxTimer);
		this.time.events.add(500,function(){this.launcherTurn=!0;},this);
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
