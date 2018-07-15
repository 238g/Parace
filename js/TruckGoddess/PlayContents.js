BasicGame.Play.prototype.PhysicsController=function(){
	this.physics.startSystem(Phaser.Physics.P2JS);
	this.physics.p2.setImpactEvents(!0);
	this.physics.p2.restitution=1;
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
	},this);
};
BasicGame.Play.prototype.PlayerContainer=function(){
	var x=(this.curStageInfo.lane=='RIGHT')?this.world.width*.73:this.world.width*.27;
	this.Player=this.add.sprite(x,this.world.height*.8,'Truck');
	this.Player.smoothed=!1;
	this.physics.p2.enable(this.Player, false);
	this.Player.anchor.setTo(.5,.1);
	this.Player.enableBody=!0;
	this.Player.body.collideWorldBounds=!0;
	this.Player.body.setRectangle(this.Player.width,this.Player.height,0,this.Player.height*.4,0);
	this.Player.body.setCollisionGroup(this.PlayerCollisionGroup);
	this.Player.body.collides(this.EnemyCollisionGroup,this.hitEnemy,this);
	this.Player.body.collides(this.ObstacleCollisionGroup,this.hitObstacle,this);
	this.Player.addChild(this.M.S.genTextM(0,this.Player.height*.5,this.Words.You,this.M.S.BaseTextStyleSS(20)));
	this.input.onDown.add(function(){
		this.onDownRot=this.physics.arcade.angleBetween(this.HandleSprite,this.input.activePointer);
	},this);
};
BasicGame.Play.prototype.respawnEnemy=function(LR){
	var s=this.rnd.pick(this.Enemies.children.filter(function(e){return!e.alive;}));
	if(s){
		if(s.children[0])s.removeChildAt(0);
		var x=y=v=0;
		var speed=this.curStageInfo.carSpeed;
		var l=this.curStageInfo.lane;
		if(l=='ALL'){
			if(this.rndTFNum()==1){
				x=this.rnd.between(this.laneLL,this.laneRR);
				v=speed*this.rnd.between(1,3)*this.time.physicsElapsedMS;
				s.scale.setTo(1);
			}else{
				x=this.rnd.between(this.laneLL,this.laneRR);
				y=this.world.height;
				v=-speed*this.rnd.between(1,3)*this.time.physicsElapsedMS;
				s.scale.setTo(1,-1);
			}
		}else{
			if(LR==1){
				if(l=='LEFT'){
					x=this.rnd.between(this.laneLL,this.laneLC);
					v=speed*this.time.physicsElapsedMS;
					s.scale.setTo(1);
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
					s.scale.setTo(1);
				}
			}
		}
		s.reset(x,y);
		s.body.velocity.y=v;
		this.RespawnSE(s.key);
	}
};
BasicGame.Play.prototype.RespawnSE=function(key){
		var r=this.rnd.between(1,100);
		if(r<50){
			if(key=='Police'){
				this.M.SE.play('Police',{volume:1});
			}else if(key=='Ambulance'){
				this.M.SE.play('Ambulance',{volume:1});
			}else if(key=='Black_viper'||key=='Audi'){
				this.M.SE.play('F1',{volume:1});
			}else{
				this.M.SE.play('VehicleSE_'+this.rnd.integerInRange(1,2),{volume:1});
			}
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
			var info=this.VehicleInfo[e.sprite.key];
			var addScore=this.curStageInfo.scoreRate*info.addScore;
			this.score+=addScore;
			this.ScoreTxtSprite.changeText(this.genScoreTxt());
			this.txtEffect(e.x,e.y,info.jp_name+this.Words.Break+addScore+this.Words.ScoreBaseBack,'#ff0000');
			var s=this.add.sprite(0,0,'Explode_1');
			s.anchor.setTo(.5);
			s.animations.add('running');
			s.animations.play('running',12,!0);
			e.sprite.addChild(s);
			this.appearMoira();
		}
		this.M.SE.play('CarExplode_'+this.rnd.integerInRange(1,2),{volume:1.5});
		this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_HORIZONTAL);
	}
};
BasicGame.Play.prototype.hitObstacle=function(p,o){
	if(this.isPlaying){
		if(o.sprite.alive){
			o.sprite.alive=!1;
			var info=this.ObstacleInfo[o.sprite.key][o.sprite.frame];
			var addScore=this.curStageInfo.scoreRate*info.addScore;
			this.score+=addScore;
			this.ScoreTxtSprite.changeText(this.genScoreTxt());
			this.txtEffect(o.x,o.y,info.jp_name+this.Words.Break+addScore+this.Words.ScoreBaseBack,'#ff0000');
			this.appearMoira();
		}
		this.M.SE.play('ObstacleExplode_'+this.rnd.integerInRange(1,6),{volume:1.7});
		this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_HORIZONTAL);
	}
};
BasicGame.Play.prototype.appearMoira=function(){
	if(this.score>this.appearMoiraCount*this.appearMoiraVal){
		this.appearMoiraCount+=1;
		var r=this.rnd.integerInRange(1,4);
		if(r==3||r==4){
			var hideX=-this.world.centerX;
			var x=0;
			var anchorX=0;
		}else{
			var hideX=this.world.height*1.5;
			var x=this.world.width;
			var anchorX=1;
		}
		var s=this.add.sprite(hideX,this.world.height,'Moira_'+r);
		s.anchor.setTo(anchorX,1);
		///// var txt='+'+this.appearMoiraVal+this.Words.ScoreBaseBack+'❤\n'+this.rnd.pick(this.Words.Quote);
		var txt=this.rnd.pick(this.Words.Quote);
		var txtstyle=this.M.S.BaseTextStyleSS(20);
		txtstyle.fill='#0000ff';
		txtstyle.multipleStroke='#0000ff';
		txtstyle.align='center';
		var t=this.M.S.genTextM(x==0?s.width*.5:-s.width*.5,-s.height*.2,txt,txtstyle);
		s.addChild(t);
		this.M.T.moveA(s,{xy:{x:x},duration:800}).start();
		this.time.events.add(1300,function(){this.destroy()},s);
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
	this.HandleSprite=this.add.sprite(this.world.centerX,this.world.height*.85,'Handle');
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
	if(this.score>=10000){
		return (this.Words.ScoreBaseFront+Math.floor(this.score*.0001)+this.Words.ScoreBaseMiddle+this.M.H.formatComma(Math.floor(String(this.score).slice(-4)))+this.Words.ScoreBaseBack);
	}else{
		return (this.Words.ScoreBaseFront+this.M.H.formatComma(Math.floor(this.score))+this.Words.ScoreBaseBack);
	}
};
BasicGame.Play.prototype.genTimeTxt=function(){
	return (this.Words.TimeBaseFront+this.leftTime+this.Words.TimeBaseBack);
};
BasicGame.Play.prototype.genResPopUp=function(){
	var tw1=this.M.T.popUpB(this.EndTxtSprite);
	tw1.onComplete.add(function(){
		this.M.SE.play('Police',{volume:1});
		var s=this.add.sprite(0,0,'TWP');
		s.tint=0x000000;
		s.alpha=0;
		var tw2=this.M.T.fadeInA(s,{delay:500,duration:800,alpha:1});
		tw2.onComplete.add(this.genRes,this);
		tw2.start();
	},this);
	tw1.start();
};
BasicGame.Play.prototype.genRes=function(){
	this.EndTxtSprite.hide();
	this.ScoreTxtSprite.hide();
	this.TimeTxtSprite.hide();
	var ts=this.M.S.BaseTextStyleS(45);
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
		this.M.SE.play('OnBtn',{volume:1});
		this.M.NextScene('Play');
	},this.Words.Again,ts,1400);
	this.genResBtnSprite(rightX,upperY,this.tweet,this.Words.Tweet,ts,1550);
	this.genResBtnSprite(leftX,middleY,function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.M.NextScene('SelectStage');
	},this.Words.GoToSS,ts,1700);
	this.genResBtnSprite(rightX,middleY,function(){
		this.M.SE.play('OnBtn',{volume:1});
		if (this.game.device.desktop) {
			window.open(BasicGame.MY_GAMES_URL,'_blank');
		} else {
			location.href=BasicGame.MY_GAMES_URL;
		}
	},this.Words.OtherGame,ts,1850);
	this.genChannelBtnSprite();
	this.time.events.add(900,function(){
		this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
		this.M.SE.play('Money',{volume:1});
	},this);
	this.time.events.add(2500,function(){
		this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
		this.M.SE.play('Money',{volume:1});
	},this);
	this.checkSecret();
};
BasicGame.Play.prototype.checkSecret=function(){
	if(!this.StageInfo[5].openSecret&&this.score<500){
		this.StageInfo[5].openSecret=!0;
		this.showOpenSecret(this.StageInfo[5].jp_name);
	}else if(!this.StageInfo[6].openSecret&&this.score>10000){
		this.StageInfo[6].openSecret=!0
		this.showOpenSecret(this.StageInfo[6].jp_name);
	}
};
BasicGame.Play.prototype.showOpenSecret=function(stage){
	var txtstyle=this.M.S.BaseTextStyleSS(30);
	txtstyle.align='center';
	txtstyle.fill='#ff0000';
	txtstyle.multipleStroke='#ff0000';
	var s=this.genResTxtSprite(this.world.width*.6,this.world.height*.2,'隠しステージオープン\n'+stage,txtstyle,2200);
	s.angle=20;
};
BasicGame.Play.prototype.genResTxtSprite=function(x,y,txt,ts,d){
	var s=this.M.S.genTextM(this.world.width*1.5,y,txt,ts);
	this.M.T.moveA(s,{xy:{x:x},duration:800,delay:d}).start();
	return s;
};
BasicGame.Play.prototype.genResBtnSprite=function(x,y,func,txt,ts,d){
	this.M.T.moveA(this.M.S.BasicGrayLabelM(this.world.width*1.5,y,func,txt,ts,{tint:BasicGame.MAIN_TINT}),{xy:{x:x},duration:800,delay:d}).start();
};
BasicGame.Play.prototype.genChannelBtnSprite=function(){
	var s=this.add.button(this.world.width*1.5,this.world.height*.7,'Channel',function(){
		this.M.SE.play('OnBtn',{volume:1});
		if (this.game.device.desktop) {
			window.open(BasicGame.YOUTUBE_URL,'_blank');
		} else {
			location.href=BasicGame.YOUTUBE_URL;
		}
	},this);
	s.anchor.setTo(.5,0);
	this.M.T.moveA(s,{xy:{x:this.world.centerX},duration:800,delay:1850}).start();
};
BasicGame.Play.prototype.tweet=function(){
	this.M.SE.play('OnBtn',{volume:1});
	var emoji1='🚚👼🚚👼🚚👼🚚';
	var emoji2='🚚😈🚚😈🚚😈🚚';
	var txt=this.Words.TweetTtl+'\n'
			+emoji1+'\n'
			+this.Words.DestinationBase+this.curStageInfo.jp_name+'\n'
			+this.genScoreTxt()+'\n'
			+emoji2+'\n';
	var hashtags='もいもいゲーム';
	this.M.H.tweet(txt,hashtags,location.href);
};
BasicGame.Play.prototype.rndTFNum=function(){
	return (Math.floor(this.rnd.normal())*-2-1);
};
