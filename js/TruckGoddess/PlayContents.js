BasicGame.Play.prototype.PhysicsController=function(){
	this.physics.startSystem(Phaser.Physics.P2JS);
	this.physics.p2.setImpactEvents(!0);
	this.physics.p2.restitution=1; // TODO think... bound
	// this.physics.p2.restitution=.1; // TODO think... bound
	this.PlayerCollisionGroup=this.physics.p2.createCollisionGroup();
	this.EnemyCollisionGroup=this.physics.p2.createCollisionGroup();
	this.ObstacleCollisionGroup=this.physics.p2.createCollisionGroup();
	this.physics.p2.updateBoundsCollisionGroup();
};
BasicGame.Play.prototype.ObstacleContainer=function(){
	this.Obstacles=this.add.group();
	this.Obstacles.physicsBodyType=Phaser.Physics.P2JS;
	this.Obstacles.enableBody=!0;
	this.Obstacles.createMultiple(2,'Obstacles',[0,1,2,3,4,5,6,7]);
	this.Obstacles.createMultiple(2,'Signboards',[0,1,2,3,4]);
	this.Obstacles.forEach(function(s){
		s.body.setCollisionGroup(this.ObstacleCollisionGroup);
		s.body.collides([this.ObstacleCollisionGroup,this.PlayerCollisionGroup]);
		s.body.collideWorldBounds=!1;
		s.body.fixedRotation=!0;
		// TODO add name???
	},this);
};
BasicGame.Play.prototype.EnemyContainer=function(){
	this.Enemies=this.add.group();
	this.Enemies.physicsBodyType=Phaser.Physics.P2JS;
	this.Enemies.enableBody=!0;
	this.Enemies.createMultiple(20,this.Vehicle);
	this.Enemies.forEach(function(s){
		s.body.setCollisionGroup(this.EnemyCollisionGroup);
		s.body.collides([this.EnemyCollisionGroup,this.PlayerCollisionGroup]);
		s.body.collideWorldBounds=!1;
		// TODO add name???
	},this);
};
BasicGame.Play.prototype.PlayerContainer=function(){
	var x=(this.curStageInfo.lane=='RIGHT')?this.world.width*.73:this.world.width*.27;
	this.Player=this.add.sprite(x,this.playerStartY,'Truck');//TODO left right
	this.Player.smoothed=!1;
	this.physics.p2.enable(this.Player, false);
	this.Player.anchor.setTo(.5,.1);
	this.Player.enableBody=!0;
	this.Player.body.collideWorldBounds=!0;
	this.Player.body.setRectangle(this.Player.width,this.Player.height,0,this.Player.height*.4,0);
	this.Player.body.setCollisionGroup(this.PlayerCollisionGroup);
	this.Player.body.collides(this.EnemyCollisionGroup,this.hitEnemy,this);
	this.Player.body.collides(this.ObstacleCollisionGroup,this.hitObstacle,this);

	this.input.onDown.add(function(){
		this.onDownRot=this.physics.arcade.angleBetween(this.HandleSprite,this.input.activePointer);
	},this);
};
BasicGame.Play.prototype.respawnEnemy=function(LR){
	var s=this.rnd.pick(this.Enemies.children.filter(function(e){return!e.alive;}));
	if(s){
		var x,v=0;
		var speed=this.curStageInfo.carSpeed;
		var l=this.curStageInfo.lane;
		if(l=='ALL'){
			x=this.rnd.between(this.laneLL,this.laneRR);
			v=speed*this.rnd.between(1,3)*this.time.physicsElapsedMS;
		}else{
			if(LR==1){
				if(l=='LEFT'){
					x=this.rnd.between(this.laneLL,this.laneLC);
					v=speed*this.time.physicsElapsedMS;
				}else{
					x=this.rnd.between(this.laneLL,this.laneLC);
					v=speed*3*this.time.physicsElapsedMS;
					s.scale.setTo(1,-1);
				}
			}else{
				if(l=='LEFT'){
					x=this.rnd.between(this.laneRC,this.laneRR);
					v=speed*3*this.time.physicsElapsedMS;
					s.scale.setTo(1,-1);
				}else{
					x=this.rnd.between(this.laneRC,this.laneRR);
					v=speed*this.time.physicsElapsedMS;
				}
			}
		}
		s.reset(x,0);
		s.body.velocity.y=v;
	}
};
BasicGame.Play.prototype.respawnObstacle=function(LR){
	var s=this.rnd.pick(this.Obstacles.children.filter(function(e){return!e.alive;}));
	if(s){
		s.reset((LR==1)?this.world.width*.1:this.world.width*.9,0);
		s.body.velocity.y=this.curStageInfo.carSpeed*this.time.physicsElapsedMS;
	}
};
BasicGame.Play.prototype.hitEnemy=function(p,e){
	if(this.isPlaying){
		if(e.sprite.alive){
			e.sprite.alive=!1;
			// TODO score per vehicle
			var addScore=this.curStageInfo.scoreRate*10;
			this.score+=addScore; // TODO
			this.ScoreTxtSprite.changeText(this.genScoreTxt());
			console.log(e); // TODO check name???
			this.txtEffect(e.x,e.y,'車両'+this.Words.Break+addScore+this.Words.ScoreBaseBack,'#ff0000');
			// TODO effect // car explode
		}
		this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_HORIZONTAL);
	}
};
BasicGame.Play.prototype.hitObstacle=function(p,o){
	if(this.isPlaying){
		if(o.sprite.alive){
			o.sprite.alive=!1;
			// TODO score per obstacle frame
			var addScore=this.curStageInfo.scoreRate*10;
			this.score+=addScore; // TODO
			this.ScoreTxtSprite.changeText(this.genScoreTxt());
			console.log(o); // TODO check name???
			this.txtEffect(o.x,o.y,'****'+this.Words.Break+addScore+this.Words.ScoreBaseBack,'#ff0000');
			// TODO effect // ???
		}
		this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_HORIZONTAL);
	}
};
BasicGame.Play.prototype.txtEffect=function(x,y,txt,color){
	this.EffectTxtStyle.align='center';
	this.EffectTxtStyle.fill=color;
	this.EffectTxtStyle.multipleStroke=color;
	var t=this.M.S.genTextM(x,y,txt,this.EffectTxtStyle);
	var tw=this.M.T.moveA(t,{xy:{y:'-30'},duration:500});
	tw.onComplete.add(function(){this.destroy();},t);
	tw.start();
};
BasicGame.Play.prototype.HUDContainer=function(){
	this.HandleSprite=this.add.sprite(this.world.centerX,this.world.height*.95,'Handle');
	this.HandleSprite.anchor.setTo(.5);
	this.HandleSprite.scale.setTo(.3);
	this.ScoreTxtSprite=this.M.S.genTextM(this.world.centerX,this.world.height*.05,this.genScoreTxt(),this.M.S.BaseTextStyleSS(30));
	this.TimeTxtSprite=this.M.S.genTextM(this.world.centerX,this.world.height*.95,this.genTimeTxt(),this.M.S.BaseTextStyleSS(30));
	this.StartTxtSprite=this.M.S.genTextM(this.world.centerX,this.world.centerY,this.Words.Start,this.M.S.BaseTextStyleS(60));
	this.StartTxtSprite.anchor.setTo(.5);
	this.StartTxtSprite.scale.setTo(0);
	var ts=this.M.S.BaseTextStyleS(80);
	ts.align='center';
	this.EndTxtSprite=this.M.S.genTextM(this.world.centerX,this.world.centerY,this.Words.End,ts);
	this.EndTxtSprite.anchor.setTo(.5);
	this.EndTxtSprite.scale.setTo(0);
};
BasicGame.Play.prototype.genScoreTxt=function(){
	return (this.Words.ScoreBaseFront+this.M.H.formatComma(this.score)+this.Words.ScoreBaseBack);
};
BasicGame.Play.prototype.genTimeTxt=function(){
	return (this.Words.TimeBaseFront+this.leftTime+this.Words.TimeBaseBack);
};
BasicGame.Play.prototype.genResPopUp=function(){
	var tw1=this.M.T.popUpB(this.EndTxtSprite);
	tw1.onComplete.add(function(){
		// this.M.SE.play('Death',{volume:1.5}); // TODO
		var s=this.add.sprite(0,0,'TWP');
		s.tint=0x000000;
		s.alpha=0;
		var tw2=this.M.T.fadeInA(s,{delay:500,duration:800,alpha:1});
		tw2.onComplete.add(this.genRes,this);
		tw2.start();
	},this);
	tw1.start();
};
BasicGame.Play.prototype.openSecret=function(){
	// TODO score think...
	if(this.score<1)this.StageInfo[5].openSecret=!0;
	if(this.score>1)this.StageInfo[6].openSecret=!0;
};
BasicGame.Play.prototype.genRes=function(){
	this.EndTxtSprite.hide();
	this.ScoreTxtSprite.hide();
	this.TimeTxtSprite.hide();
	var ts=this.M.S.BaseTextStyleS(50);
	ts.align='center';
	var upperY=this.world.height*.55;
	var middleY=this.world.height*.65;
	var leftX=this.world.width*.25;
	var rightX=this.world.width*.75;
	this.M.S.genTextM(this.world.centerX,this.world.height*.1,this.Words.ResTtl,ts);
	this.genResTxtSprite(this.world.centerX,this.world.height*.28,this.Words.DestinationBase+this.curStageInfo.jp_name,ts,0);
	this.genResTxtSprite(this.world.centerX,this.world.height*.42,this.genScoreTxt(),ts,300);
	ts=this.M.S.BaseTextStyleSS(27);
	this.genResBtnSprite(leftX,upperY,function(){
		// this.M.SE.play('OnBtn',{volume:1}); // TODO
		this.M.NextScene('Play');
	},this.Words.Again,ts,1400);
	this.genResBtnSprite(rightX,upperY,this.tweet,this.Words.Tweet,ts,1550);
	this.genResBtnSprite(leftX,middleY,function(){
		// this.M.SE.play('OnBtn',{volume:1}); // TODO
		this.M.NextScene('SelectStage');
	},this.Words.GoToSS,ts,1700);
	this.genResBtnSprite(rightX,middleY,function(){
		// this.M.SE.play('OnBtn',{volume:1}); // TODO
		if (this.game.device.desktop) {
			window.open(BasicGame.MY_GAMES_URL,'_blank');
		} else {
			location.href=BasicGame.MY_GAMES_URL;
		}
	},this.Words.OtherGame,ts,1850);
	// TODO char and channel


	// TODO NEED?
	this.time.events.add(900,function(){
		this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
	},this);
	this.time.events.add(2500,function(){
		this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
	},this);
	
	// TODO check stage 5,6 open if ok-> popup open secret stg
};
BasicGame.Play.prototype.genResTxtSprite=function(x,y,txt,ts,d){
	var t=this.M.S.genTextM(this.world.width*1.5,y,txt,ts);
	this.M.T.moveA(t,{xy:{x:x},duration:800,delay:d}).start();
};
BasicGame.Play.prototype.genResBtnSprite=function(x,y,func,txt,ts,d){
	var b=this.M.S.BasicGrayLabelS(this.world.width*1.5,y,func,txt,ts,{tint:BasicGame.MAIN_TINT});
	this.M.T.moveA(b,{xy:{x:x},duration:800,delay:d}).start();
};
BasicGame.Play.prototype.tweet=function(){
	// this.M.SE.play('OnBtn',{volume:1}); // TODO
	var emoji='';
	var txt=this.Words.TweetTtl+'\n'
			+emoji+'\n'
			+this.Words.DestinationBase+this.curStageInfo.jp_name+'\n'
			+this.genScoreTxt()+'\n'
			+emoji+'\n';
	var hashtags='aaaaaaaaaa';
	this.M.H.tweet(txt,hashtags,location.href);
};
BasicGame.Play.prototype.rndTFNum=function(){
	return (Math.floor(this.rnd.normal())*-2-1);
};
