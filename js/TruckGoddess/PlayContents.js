BasicGame.Play.prototype.PhysicsController=function(){
	this.physics.startSystem(Phaser.Physics.P2JS);
	this.physics.p2.setImpactEvents(!0);
	this.physics.p2.restitution=1; // TODO think... bound
	// this.physics.p2.restitution=.1; // TODO think... bound
	this.PlayerCollisionGroup=this.physics.p2.createCollisionGroup();
	this.EnemyCollisionGroup=this.physics.p2.createCollisionGroup();
	this.physics.p2.updateBoundsCollisionGroup();
};
BasicGame.Play.prototype.EnemyContainer=function(){
	this.Enemies=this.add.group();
	this.Enemies.physicsBodyType=Phaser.Physics.P2JS;
	this.Enemies.enableBody=!0;
	this.Enemies.createMultiple(5,this.Vehicle);
	// this.Enemies.createMultiple(1,'Car');
	this.Enemies.forEach(function(e){
		e.body.setCollisionGroup(this.EnemyCollisionGroup);
		e.body.collides([this.EnemyCollisionGroup,this.PlayerCollisionGroup]);
		e.body.collideWorldBounds=!1;
	},this);
};
BasicGame.Play.prototype.PlayerContainer=function(){
	this.Player=this.add.sprite(this.world.centerX,this.playerStartY,'Truck');//TODO left right
	this.Player.smoothed=!1;
	this.physics.p2.enable(this.Player, false);
	this.Player.anchor.setTo(.5,.1);
	this.Player.enableBody=!0;
	this.Player.body.collideWorldBounds=!0;
	this.Player.body.setRectangle(this.Player.width,this.Player.height,0,this.Player.height*.4,0);
	this.Player.body.setCollisionGroup(this.PlayerCollisionGroup);
	this.Player.body.collides(this.EnemyCollisionGroup,this.hitEnemy,this);

	this.input.onDown.add(function(){
		this.onDownRot=this.physics.arcade.angleBetween(this.HandleSprite,this.input.activePointer);
	},this);
};
BasicGame.Play.prototype.respawnEnemy=function(){
	var s=this.rnd.pick(this.Enemies.children.filter(function(e){return!e.alive;}));
	if(s){
		// TODO left right rnd

		s.reset(this.world.randomX,0);
		s.body.velocity.y=100;// TODO rnd
	}
};
BasicGame.Play.prototype.hitEnemy=function(p,e){
	if(e.sprite.alive){
		e.sprite.alive=!1;
		// TODO score
		this.score++; // TODO
		this.ScoreTxtSprite.changeText(this.genScoreTxt());
		// TODO show text what's happen!!
		// TODO effect
	}
	this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_HORIZONTAL);
};
BasicGame.Play.prototype.HUDContainer=function(){
	this.HandleSprite=this.add.sprite(this.world.centerX,this.world.height*.95,'Handle');
	this.HandleSprite.anchor.setTo(.5);
	this.HandleSprite.scale.setTo(.3);
	// TODO x,y
	this.ScoreTxtSprite=this.M.S.genTextM(100,100,this.genScoreTxt(),this.M.S.BaseTextStyle(30));
};
BasicGame.Play.prototype.genScoreTxt=function(){
	return (this.ScoreBaseFrontTxt+this.M.H.formatComma(this.score)+this.ScoreBaseBackTxt);
};
BasicGame.Play.prototype.genResPopUp=function(){
	var ts=this.M.S.genTextM(this.world.centerX,this.world.centerY,'目的地に到着！',this.M.S.BaseTextStyleS(80));
	ts.anchor.setTo(.5);
	ts.scale.setTo(0);
	var t=this.M.T.popUpB(ts);
	t.onComplete.add(function(){
		// TODO all
		// this.M.SE.play('Death',{volume:1.5}); // TODO
		// this.Enemies.killAll();
		// this.Obstacles.killAll();
		// this.ScoreTxtSprite.visible=!1;
		// this.TimeTxtSprite.visible=!1;
		// this.TiredBtnSprite.visible=!1;
		var twp=this.add.sprite(0,0,'TWP');
		twp.tint=0x000000;
		twp.alpha=0;
		var tw=this.M.T.fadeInA(twp,{delay:500,duration:800,alpha:1});
		tw.onComplete.add(this.genRes,this);
		tw.start();
	},this);
	t.start();
};
BasicGame.Play.prototype.openSecret=function(){
	if(this.score<1000){
		// TODO openSecret japan open true
	}
	if(this.score>100000){
		// TODO openSecret heaven open true
	}
};
BasicGame.Play.prototype.genRes=function(){
	// TODO all
	var resTextStyle=this.M.S.BaseTextStyleS(55);
	resTextStyle.align='center';
	var textStyle=this.M.S.BaseTextStyleSS(30);
	var upperY=this.world.height*.55;
	var middleY=this.world.height*.65;
	var leftX=this.world.width*.25;
	var rightX=this.world.width*.75;
	this.genResTxtSprite(this.world.centerX,this.world.height*.1,'結果',resTextStyle,0);
	this.genResTxtSprite(this.world.centerX,this.world.height*.35,'スコア\n'+this.M.H.formatComma(this.score),resTextStyle,0);
	textStyle=this.M.S.BaseTextStyleSS(25);
	this.genResBtnSprite(leftX,upperY,function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.M.NextScene('Play');
	},'ワンモア',textStyle,150);
	this.genResBtnSprite(rightX,upperY,this.scoreModeTweet,'結果をツイート',textStyle,300);
	this.genResBtnSprite(leftX,middleY,function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.M.NextScene('Title');
	},'タイトルへ',textStyle,450);
	this.genResBtnSprite(rightX,middleY,function(){
		this.M.SE.play('OnBtn',{volume:1});
		if (this.game.device.desktop) {
			window.open(BasicGame.MY_GAMES_URL,'_blank');
		} else {
			location.href=BasicGame.MY_GAMES_URL;
		}
	},'他のゲーム',textStyle,600);
	this.genYtSprite(this.world.centerX,this.world.height*.85,750);
};
