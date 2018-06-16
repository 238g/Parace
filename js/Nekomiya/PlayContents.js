BasicGame.Play.prototype.genContents=function(){
	var bgSprite=this.add.sprite(0,0,'PlayBg');
	bgSprite.tint=this.LevelInfo.tint;

	this.BrokenClay=this.add.emitter(0,0,300);
	this.BrokenClay.makeParticles('BrokenClay', [0,1,2,3,4,5]);
	this.BrokenClay.gravity = 200;
	this.BrokenClay.forEach(function(c){c.tint=this.LevelInfo.tint},this);

	this.Clays=this.add.group();
	this.Clays.inputEnableChildren=!0;
	this.Clays.createMultiple(30,'Clay');
	this.Clays.children.forEach(function(c){
		c.anchor.setTo(.5);
		c.tint=this.LevelInfo.tint;
	},this);
	this.Clays.onChildInputDown.add(this.breakClay,this);

	this.Hinata=this.add.sprite(20,this.world.height,'PlayHinata');
	this.Hinata.anchor.setTo(.2,.8);
	this.input.onDown.add(this.onInput,this);

	var textStyle=this.M.S.BaseTextStyleS(25);

	// TODO HUD
	if(this.LevelInfo.isTrap){
		this.TargetTextSprite=this.M.S.genTextM(this.world.width*.7,this.world.height*.95,'残り: '+this.leftClay,textStyle);
	}

	this.ScoreTextSprite=this.M.S.genTextM(this.world.width*.9,this.world.height*.95,'現在: 0',textStyle);

	if(this.tutorial){
		this.TutorialSprite=this.add.sprite(0,0,'WP');
		this.TutorialSprite.tint=0x000000;

		textStyle.align='center';
		this.TutorialTextSprite=this.M.S.genTextM(this.world.centerX,this.world.centerY,this.TutorialText,textStyle);

		this.input.onDown.addOnce(function(){
			this.TutorialSprite.visible=!1;
			this.TutorialTextSprite.visible=!1;
			this.start();
		},this);
	}else{
		this.start();
	}
};
BasicGame.Play.prototype.onInput=function(p){
	// TODO 
	// this.Hinata
	//=p.x

	this.M.SE.play('Shot'+this.rnd.integerInRange(1,3),{volume:1});

};
BasicGame.Play.prototype.launchClay=function(){};
BasicGame.Play.prototype.launchClayBase=function(moveToX){
	var clay=this.Clays.getFirstDead();
	if(clay){
		var w=this.LevelInfo.respawnWidth;
		var launcherX=this.world.centerX+this.rnd.between(-w,w);

		clay.scale.setTo(1.5);
		clay.reset(launcherX,this.world.height+clay.height);

		var delay=this.rnd.between(0,1000);
		var duration=4000-this.rnd.between(0,this.LevelInfo.durationMinusRange);
	
		var h=this.LevelInfo.moveRangeY;
		var moveToY=180+this.rnd.between(-h,h);
		var tweenA=this.M.T.moveA(clay,{xy:{x:moveToX,y:moveToY},duration:duration,delay:delay}).start();
		tweenA.onComplete.add(this.nextClay,this);
		var tweenB=this.add.tween(clay.scale).to({x:.05,y:.05},duration,Phaser.Easing.Cubic.Out,!0,delay);
		tweenB.onComplete.add(function(){this.kill();},clay);
	}
};
BasicGame.Play.prototype.launchClayTrap=function(){
	var to=this.launcherOrderTrap[this.curLaunchCountTrap];
	var moveToX=this.moveToXTrap[to]+this.rnd.between(-50,50);

	this.launchClayBase(moveToX);

	this.curLaunchCountTrap++;
};
BasicGame.Play.prototype.launchClayScore=function(){
	// TODO launch cycle...
	var r=this.rnd.integerInRange(1,3);
	for(var i=0;i<r;i++){
		var moveToX=this.world.centerX+this.rnd.between(-280,280);
		this.launchClayBase(moveToX);
	}
};
BasicGame.Play.prototype.launchClaySD=function(){
	// TODO
};
BasicGame.Play.prototype.breakClay=function(btn){
	console.log('break');
	btn.destroy();

	this.M.SE.play('Break',{volume:2});

	this.BrokenClay.x=btn.x;
	this.BrokenClay.y=btn.y;
	this.BrokenClay.setScale(btn.scale.x,btn.scale.x,btn.scale.y,btn.scale.y);
	this.BrokenClay.explode(500,5);


	var newClay=this.Clays.create(0,0,'Clay',0,!1);
	newClay.anchor.setTo(.5);
	newClay.tint=this.LevelInfo.tint;

	this.addScore();

	this.nextClay();
};
BasicGame.Play.prototype.addScore=function(){};
BasicGame.Play.prototype.addScoreTrap=function(){

	this.leftClay--;
	this.TargetTextSprite.changeText('残り: '+this.leftClay);

	this.score++;
	this.ScoreTextSprite.changeText('現在: '+this.score);
};
BasicGame.Play.prototype.nextClay=function(){
	if(this.LevelInfo.isTrap&&(this.leftClay==0)){
		this.end();
	}
	this.launcherTimer=this.rnd.between(this.LevelInfo.launcherTimer,this.LevelInfo.launcherTimer+200);
	this.time.events.add(300,function(){this.launcherTurn=!0;},this);
};

