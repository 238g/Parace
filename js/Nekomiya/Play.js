BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		this.isPlaying=!1;

		this.launcherTurn=!1;
		this.launcherTimer=0;

		this.launcherPoints=[];
		this.launcherOrderOfTrap=[0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2];
		this.leftClayCount=this.launcherOrderOfTrap.length;

		this.TargetTextSprite=null;
		this.ScoreTextSprite=null;
	},

	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.stage.backgroundColor='#555555';//TODO del
		// this.M.SE.playBGM('PlayBGM',{volume:1});


		var LauncherInfo={
			center:{x:this.world.centerX,y:this.world.height},
		};
		var LI=LauncherInfo;
		this.launcherPoints=[LI.center];

		Phaser.ArrayUtils.shuffle(this.launcherOrderOfTrap);



		this.launcherTimer=1000;//TODO del
		// this.launcherTimer=this.rnd.between(3000,5000);

		// this.Clay=this.add.sprite(0,0,'Clay');
		// this.physics.arcade.enable(this.Clay);
		this.Clay=this.add.button(0,0,'Clay',this.breakClay,this);
		this.Clay.anchor.setTo(.5);
		// this.Clay.body.gravity.y=500;
		// this.Clay.kill();


		this.TargetTextSprite=this.M.S.genTextM(this.world.width*.7,this.world.height*.9,'目標: '+this.leftClayCount);
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

	launchClay:function(){
		var launcherPoint=this.rnd.pick(this.launcherPoints);
		this.Clay.reset(launcherPoint.x,launcherPoint.y);

		// TODO x:rnd+-50 / x(160,320,480) / y:rnd+-yet / duration:rnd
		this.M.T.moveA(this.Clay,{xy:{x:160,y:this.world.centerY},duration:5000}).start();
		// TODO scale

		//this.time.physicsElapsedMS
	},

	breakClay:function(btn){
		btn.kill();

	},

	start:function(){
		this.isPlaying=!0;


		this.launcherTurn=!0;
	},

	end:function(type){
		this.isPlaying=!1;
	},

	test:function(){
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(function(){this.end();},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
