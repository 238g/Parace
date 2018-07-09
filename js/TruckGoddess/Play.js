BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		this.isPlaying=!1;

		this.curStage=this.M.getGlobal('curStage');
		this.curStageInfo=this.M.getConf('StageInfo')[this.curStage];

		this.score=
		this.onDownRot=0;

		this.playerStartY=this.world.height*.6;

		this.secTimer=1E3;
		this.leftTime=this.curStageInfo.leftTime;

		// TODO jp en
		this.ScoreBaseFrontTxt='罰金: ';
		this.ScoreBaseBackTxt='円';

		this.Vehicle=this.M.getConf('Vehicle');


		this.BgSprite=this.TutSprite=
		this.StartTxtSprite=
		this.Player=this.Enemies=
		this.HandleSprite=this.ScoreTxtSprite=
		this.PlayerCollisionGroup=this.EnemyCollisionGroup=
		null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('PlayBGM',{volume:1}); // TODO

		this.BgSprite=this.add.tileSprite(0,0,this.world.width,this.world.height,'Road_1');

		this.PhysicsController();
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
				if(this.Player.body.y>this.playerStartY)this.Player.body.y-=.1*this.time.physicsElapsedMS;
			}else{
				this.Player.body.y+=.01*this.time.physicsElapsedMS;
			}
			this.secTimer-=this.time.elapsed;
			if(this.secTimer<0){
				this.secTimer=1E3;
				this.leftTime--;
				if(this.leftTime<=0)this.end();
				this.respawnEnemy();
				// this.respawnEnemy();
				this.Enemies.forEachAlive(function(e){
					if(e.y>this.world.height)e.kill();
					if(e.y<0)e.kill();
				},this);
			}
			this.BgSprite.tilePosition.y+=.1*this.time.physicsElapsedMS;
		}
	},
	tut:function(){
		this.TutSprite=this.add.sprite(this.world.centerX,this.world.centerY,'TWP');
		this.TutSprite.anchor.setTo(.5);
		this.TutSprite.tint=0x000000;
		this.input.onDown.addOnce(function(){
			this.TutSprite.destroy();
			this.start();
		},this);
		var txt='usage handle\naaaaaaaa'; // TODO usage handle
		var ts=this.M.S.BaseTextStyleS(50);
		ts.align='center';
		var t=this.M.S.genTextM(0,0,txt,ts);
		this.TutSprite.addChild(t);
	},
	start:function(){
		this.isPlaying=!0;
		return;// TODO del
		// this.M.SE.play('Cheer_s1',{volume:1});
		this.StartTxtSprite=this.M.S.genTextM(this.world.centerX,this.world.centerY,'スタート！',this.M.S.BaseTextStyleS(60));
		this.StartTxtSprite.anchor.setTo(.5);
		this.StartTxtSprite.scale.setTo(0);
		var t=this.M.T.popUpB(this.StartTxtSprite);
		t.onComplete.add(function(){
			this.isPlaying=!0;
			this.StartTxtSprite.destroy();
			this.respawnEnemy();
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
		}
	},
};
