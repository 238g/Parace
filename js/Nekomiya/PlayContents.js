BasicGame.Play.prototype.genContents=function(){
	var bgSprite=this.add.sprite(0,0,'PlayBg');
	bgSprite.tint=this.LevelInfo.tint;
	this.genBrokenClay();
	this.genClays();
	this.Hinata=this.add.sprite(50,this.world.height-100,'PlayHinata');
	this.Hinata.anchor.setTo(.3,.3);
	this.genHUD();
};
BasicGame.Play.prototype.genBrokenClay=function(p){
	this.BrokenClay=this.add.emitter(0,0,100);
	this.BrokenClay.makeParticles('BrokenClay', [0,1,2,3,4,5]);
	this.BrokenClay.gravity=300;
	this.BrokenClay.forEach(function(c){c.tint=this.LevelInfo.tint},this);
};
BasicGame.Play.prototype.genClays=function(p){
	this.Clays=this.add.group();
	this.Clays.inputEnableChildren=!0;
	this.Clays.createMultiple(50,'Clay');
	this.Clays.children.forEach(function(c){
		c.anchor.setTo(.5);
		c.tint=this.LevelInfo.tint;
	},this);
	this.Clays.onChildInputDown.add(this.breakClay,this);
};
BasicGame.Play.prototype.genHUD=function(p){
	var textStyle=this.M.S.BaseTextStyleS(25);
	if(this.LevelInfo.isTrap){
		this.TargetTextSprite=this.M.S.genTextM(this.world.centerX,this.world.height*.05,'残り: '+this.leftClay,textStyle);
	}
	if(this.LevelInfo.isScore){
		this.TimeTextSprite=this.M.S.genTextM(this.world.centerX,this.world.height*.05,'制限時間: '+this.leftTime,textStyle);
	}
	this.ScoreTextSprite=this.M.S.genTextM(this.world.centerX,this.world.height*.95,this.scoreBaseText+0,textStyle);
};
BasicGame.Play.prototype.genTutorial=function(p){
	this.TutorialSprite=this.add.sprite(0,0,'WP');
	this.TutorialSprite.tint=0x000000;
	var textStyle=this.M.S.BaseTextStyleSS(25);
	textStyle.align='center';
	this.TutorialTextSprite=this.M.S.genTextM(this.world.centerX,this.world.centerY,this.TutorialText,textStyle);
	this.time.events.add(500,function(){
		this.input.onDown.addOnce(function(){
			this.M.SE.play('OnBtn',{volume:1});
			this.TutorialSprite.visible=!1;
			this.TutorialTextSprite.visible=!1;
			this.start();
		},this);
	},this);
};
BasicGame.Play.prototype.onInput=function(p){
	if(this.isPlaying)this.M.SE.play('Shot'+this.rnd.integerInRange(1,3),{volume:1});
};
BasicGame.Play.prototype.onInputScore=function(p){
	if(this.isPlaying){
		this.M.SE.play('Shot'+this.rnd.integerInRange(1,3),{volume:1});
		if(this.score>=5000){
			this.score-=5000;
			this.changeScore();
		}
	}
};
BasicGame.Play.prototype.launchClay=function(){};
BasicGame.Play.prototype.launchClayBase=function(moveToX){
	var clay=this.Clays.getFirstDead();
	if(clay){
		var w=this.LevelInfo.respawnWidth;
		var launcherX=this.world.centerX+this.rnd.between(-w,w);
		clay.scale.setTo(1.5);
		clay.reset(launcherX,this.world.height+clay.height);
		var delay=this.rnd.between(0,this.LevelInfo.delayMax);
		var duration=4000-this.rnd.between(0,this.LevelInfo.durationMinusRange);
		var h=this.LevelInfo.moveRangeY;
		var moveToY=180+this.rnd.between(-h,h);
		var tweenA=this.M.T.moveA(clay,{xy:{x:moveToX,y:moveToY},duration:duration,delay:delay}).start();
		tweenA.onComplete.add(this.nextClay,this);
		var tweenB=this.add.tween(clay.scale).to({x:.05,y:.05},duration,Phaser.Easing.Cubic.Out,!0,delay);
		tweenB.onComplete.add(function(){this.kill();},clay);
		clay.events.onKilled.add(this.missClay,this);
		clay.speed=duration;
	}
};
BasicGame.Play.prototype.missClay=function(){};
BasicGame.Play.prototype.missClaySD=function(s){
	this.end();
};
BasicGame.Play.prototype.launchClayTrap=function(){
	var to=this.launcherOrderTrap[this.curLaunchCountTrap];
	var moveToX=this.moveToXTrap[to]+this.rnd.between(-50,50);
	this.launchClayBase(moveToX);
	this.leftClay--;
	this.TargetTextSprite.changeText('残り: '+this.leftClay);
	this.curLaunchCountTrap++;
};
BasicGame.Play.prototype.launchClayScore=function(){
	var r=this.rnd.integerInRange(2,4);
	for(var i=0;i<r;i++){
		var moveToX=this.world.centerX+this.rnd.between(-280,280);
		this.launchClayBase(moveToX);
	}
};
BasicGame.Play.prototype.launchClaySD=function(){
	var moveToX=this.world.centerX+this.rnd.between(-280,280);
	this.launchClayBase(moveToX);
};
BasicGame.Play.prototype.breakClay=function(btn){
	if(this.isPlaying){
		this.M.SE.play('Break',{volume:2});
		//emit
		this.BrokenClay.x=btn.x;
		this.BrokenClay.y=btn.y;
		this.BrokenClay.setScale(btn.scale.x,btn.scale.x,btn.scale.y,btn.scale.y);
		this.BrokenClay.explode(500,5);
		//newClay
		var newClay=this.Clays.create(0,0,'Clay',0,!1);
		newClay.anchor.setTo(.5);
		newClay.tint=this.LevelInfo.tint;
		this.addScore(btn);
		btn.destroy();
		this.nextClay();
	}
};
BasicGame.Play.prototype.addScore=function(){};
BasicGame.Play.prototype.addScoreTrap=function(){
	this.score++;
	this.changeScore();
};
BasicGame.Play.prototype.addScoreScore=function(btn){
	var s=4000-btn.speed;
	this.score+=(10000+parseInt(s*s*s*.00003));
	this.changeScore();
};
BasicGame.Play.prototype.changeScore=function(){
	this.ScoreTextSprite.changeText(this.scoreBaseText+this.M.H.formatComma(this.score));
};
BasicGame.Play.prototype.nextClay=function(){
	if(this.LevelInfo.isTrap&&(this.leftClay==0))this.end();
	this.launcherTimer=this.rnd.between(this.LevelInfo.launcherTimer,this.LevelInfo.launcherTimer+200);
	this.time.events.add(300,function(){this.launcherTurn=!0;},this);
};
BasicGame.Play.prototype.genResult=function(){
	var bgSprite=this.add.sprite(this.world.centerX,this.world.centerY,'WP');
	bgSprite.anchor.setTo(.5);
	bgSprite.tint=0x000000;
	bgSprite.alpha=0;
	var tween=this.M.T.fadeInA(bgSprite,{delay:500,duration:800,alpha:1});
	this.M.T.onComplete(tween,this.genResultContents);
	tween.start();
};
BasicGame.Play.prototype.genResultContents = function () {
	var textStyle=this.M.S.BaseTextStyleSS(30);
	var upperY=this.world.height*.45;
	var middleY=this.world.height*.65;
	var bottomY=this.world.height*.85;
	var leftX=this.world.width*.3;
	this.genResultTextSprite(this.world.centerX,this.world.height*.25,'結果',this.M.S.BaseTextStyleS(40),0);
	this.genResultTextSprite(leftX,upperY,'挑戦: '+this.LevelInfo.btnName,textStyle,200);
	this.genResultTextSprite(leftX,middleY,this.resultBaseText+this.M.H.formatComma(this.score),textStyle,400);
	if(this.LevelInfo.isTrap&&this.score==this.launcherOrderTrap.length){
		this.genResultTextSprite(leftX,bottomY,'パーフェクト！',textStyle,600);
	}
	var rightX=this.world.width*.75;
	textStyle=this.M.S.BaseTextStyleSS(25);
	this.genResultBtnSprite(rightX,upperY,function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.M.NextScene('Play');
	},'もう一度',textStyle,200);
	this.genResultBtnSprite(rightX,middleY,this.tweet,'結果をツイート',textStyle,400);
	this.genResultBtnSprite(rightX,bottomY,function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.M.NextScene('Title');
	},'タイトルに戻る',textStyle,600);
};
BasicGame.Play.prototype.genResultTextSprite=function(x,y,text,textStyle,delay){
	var textSprite=this.M.S.genTextM(x,y,text,textStyle);
	textSprite.scale.setTo(0);
	this.M.T.popUpB(textSprite,{duration:800,delay:delay}).start();
};
BasicGame.Play.prototype.genResultBtnSprite=function(x,y,func,text,textStyle,delay){
	var btnSprite=this.M.S.BasicGrayLabelS(x,y,func,text,textStyle,{tint:BasicGame.MAIN_TINT});
	btnSprite.scale.setTo(0);
	this.M.T.popUpB(btnSprite,{duration:800,delay:delay}).start();
};
BasicGame.Play.prototype.tweet=function(){
	this.M.SE.play('OnBtn',{volume:1});
	var levelText='挑戦: '+this.LevelInfo.btnName;
	var resultText=this.resultBaseText+this.M.H.formatComma(this.score);
	var emojis=['🐱','🐈','😺','😸','😹','😻','😼','😽','🙀','😿','😾','🔫'];
	var emoji='';
	for(var i=0;i<6;i++)emoji+=this.rnd.pick(emojis);
	var text='『'+BasicGame.GAME_TITLE+'』で遊んだよ！\n'
				+emoji+'\n'
				+levelText+'\n'
				+resultText+'\n'
				+emoji+'\n';
	var hashtags = 'ひなたゲーム';
	this.M.H.tweet(text,hashtags,location.href);
};