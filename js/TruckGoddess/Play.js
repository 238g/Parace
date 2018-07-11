BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=!1;

		// Conf
		this.StageInfo=this.M.getConf('StageInfo');
		this.curStage=this.M.getGlobal('curStage');
		this.curStageInfo=this.StageInfo[this.curStage];
		this.Vehicle=this.M.getConf('Vehicle');
		this.VehicleInfo=this.M.getConf('VehicleInfo');
		this.ObstacleInfo=this.M.getConf('ObstacleInfo');
		this.Words=this.M.getConf('Words')['jp'];

		// Dinamic
		this.score=
		this.onDownRot=0;

		// Pos
		this.laneLL=this.world.width*.25;
		this.laneLC=this.world.width*.45;
		this.laneRC=this.world.width*.55;
		this.laneRR=this.world.width*.75;
		this.playerStartY=this.world.height*.6;

		// Option
		this.EffectTxtStyle=this.M.S.BaseTextStyleSS(20);

		// Timer
		this.secTimer=1E3;
		this.leftTime=this.curStageInfo.leftTime;
		this.respawnRateTimeBase=this.curStageInfo.respawnRateTimeBase;
		this.respawnRateTimer=this.respawnRateTimeBase;

		// Obj
		this.BgSprite=this.TutSprite=
		this.StartTxtSprite=
		this.Player=this.Obstacles=this.Enemies=
		this.HandleSprite=this.ScoreTxtSprite=this.TimeTxtSprite=
		this.PlayerCollisionGroup=this.ObstacleCollisionGroup=this.EnemyCollisionGroup=
		this.EndTxtSprite=
		null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#000000';
		this.M.SE.playBGM('PlayBGM',{volume:1});

		this.BgSprite=this.add.tileSprite(0,0,this.world.width,this.world.height,'Road_1');

		this.PhysicsController();
		this.ObstacleContainer();
		this.EnemyContainer();
		this.PlayerContainer();
		this.HUDContainer();

		this.M.getGlobal('endTut')?this.start():this.tut();
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			if(this.input.activePointer.isDown){
				this.HandleSprite.rotation=this.physics.arcade.angleBetween(this.HandleSprite,this.input.activePointer)-this.onDownRot;
				this.Player.body.rotation=this.HandleSprite.rotation;
			}
			this.Player.body.x+=this.HandleSprite.angle*.03;
			if(Math.abs(this.Player.angle)<90){
				// if(this.Player.body.y>this.playerStartY)this.Player.body.y-=.1*this.time.physicsElapsedMS;
				if(this.Player.body.y>this.world.centerY)this.Player.body.y-=.1*this.time.physicsElapsedMS;
			}else{
				this.Player.body.y+=.01*this.time.physicsElapsedMS;
			}
			this.secTimer-=this.time.elapsed;
			if(this.secTimer<0){
				this.secTimer=1E3;
				this.leftTime--;
				this.TimeTxtSprite.changeText(this.genTimeTxt());
				if(this.leftTime<=0)this.end();
				this.Enemies.forEachAlive(function(e){
					if(e.y>this.world.height)e.kill();
					if(e.y<0)e.kill();
					if(e.x>this.world.width)e.kill();
					if(e.x<0)e.kill();
				},this);
				this.Obstacles.forEachAlive(function(e){
					if(e.y>this.world.height)e.kill();
					if(e.y<0)e.kill();
					if(e.x>this.world.width)e.kill();
					if(e.x<0)e.kill();
				},this);
			}
			this.respawnRateTimer-=this.time.elapsed;
			if(this.respawnRateTimer<0){
				this.respawnRateTimer=this.respawnRateTimeBase;
				var r=this.rnd.between(1,10);
				if(r==1){
					this.respawnEnemy(1);
					this.respawnEnemy(-1);
					this.respawnEnemy(this.rndTFNum());
					this.respawnObstacle(this.rndTFNum());
				}else if(r==2){
					this.respawnEnemy(1);
					this.respawnEnemy(1);
					this.respawnObstacle(1);
					this.respawnObstacle(-1);
				}else{
					this.respawnEnemy(1);
					this.respawnEnemy(-1);
					this.respawnObstacle(this.rndTFNum());
				}
			}
			this.BgSprite.tilePosition.y+=this.curStageInfo.tileSpeed*this.time.physicsElapsedMS;
		}
	},
	tut:function(){
		this.TutSprite=this.add.sprite(this.world.centerX,this.world.centerY,'TWP');
		this.TutSprite.anchor.setTo(.5);
		this.TutSprite.tint=0x000000;
		this.input.onDown.addOnce(function(){
			this.TutSprite.destroy();
			this.M.setGlobal('endTut',!0);
			this.start();
		},this);
		var ts=this.M.S.BaseTextStyleS(50);
		ts.align='center';
		var t=this.M.S.genTextM(0,0,this.Words.HowTo,ts);
		this.TutSprite.addChild(t);
	},
	start:function(){
		this.isPlaying=!0; // TODO del
		return;// TODO del
		// this.M.SE.play('Cheer_s1',{volume:1});
		var t=this.M.T.popUpB(this.StartTxtSprite);
		t.onComplete.add(function(){
			this.isPlaying=!0;
			this.StartTxtSprite.destroy();
			this.respawnEnemy(1);
			this.respawnEnemy(-1);
		},this);
		t.start();
	},
	end:function(){
		this.isPlaying=!1;
		this.genResPopUp();
		this.openSecret();
	},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.end,this);
			// this.M.H.getQuery('time')&&(this.leftTime=this.M.H.getQuery('time'));
			this.Player.body.debug=!0;
			this.Enemies.forEach(function(e){e.body.debug=!0;},this);
			this.Obstacles.forEach(function(e){e.body.debug=!0;},this);
		}
	},
};
