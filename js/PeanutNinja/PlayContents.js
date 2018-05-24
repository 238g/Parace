BasicGame.Play.prototype.TargetContainer = function () {
	var targetKeys = [];
	var obstarcleKeys = [];
	this.Emitters={};
	for (var k in this.TargetInfo) {
		var info = this.TargetInfo[k];
		info.isTarget?targetKeys.push(info.name):obstarcleKeys.push(info.name);
		info.score = info.scoreRate * this.LevelInfo.leveScore * (info.isTarget?1:-1);
		var emitter = this.add.emitter(0,0,100);
		emitter.makeParticles(info.name+'_Cut');
		emitter.setScale(.5,.5,.5,.5);
		this.Emitters[info.name]=emitter;
		emitter=null;
	}
	this.Targets = this.genGroup(targetKeys,10);
	this.Obstarcles = this.genGroup(obstarcleKeys,3);
};

BasicGame.Play.prototype.genTarget = function (g) {
	this.TargetPool=this.rnd.pick(this[g].children.filter(function(e){return!e.alive;}));
	if (this.TargetPool) {
		if (this.rnd.between(0,100)>this.LevelInfo.spawnPointSwitchRate) {
			var rndX = this.rnd.integerInRange(0,1);
			this.TargetPool.reset(rndX*this.world.width,this.world.height-this.rnd.integerInRange(0,2)*100);
			this.TargetPool.body.velocity.x = (-2*rndX+1) * this.rnd.between(5,this.LevelInfo.maxSpeedX) * this.time.physicsElapsedMS;
			this.TargetPool.body.velocity.y = this.rnd.between(-15,-this.LevelInfo.maxSpeedY) * this.time.physicsElapsedMS;
		} else {
			this.TargetPool.reset(this.rnd.between(100,this.world.width-100),0);
			this.TargetPool.body.velocity.y = this.rnd.between(1,this.LevelInfo.maxSpeedY*.8) * this.time.physicsElapsedMS;
		}
	}
	this.TargetPool=null;
};

BasicGame.Play.prototype.genGroup = function (keys,createCount) {
	var g = this.add.group();
	g.enableBody=!0;
	g.physicsBodyType = Phaser.Physics.ARCADE;
	g.createMultiple(createCount,keys);
	g.children.forEach(function (c) {
		c.checkWorldBounds=!0;
		c.outOfBoundsKill=!0;
		c.anchor.setTo(.5);
		c.score = this.TargetInfo[c.key].score;
		c.scoreRate = this.TargetInfo[c.key].scoreRate;
		c.isTarget = this.TargetInfo[c.key].isTarget;
		c.scale.setTo(.5);
	},this);
	return g;
};

BasicGame.Play.prototype.BladeGenerator = function () {
	this.bladePoints.push({x:this.input.x,y:this.input.y});
	this.bladePoints = this.bladePoints.splice(this.bladePoints.length-10, this.bladePoints.length);
	if (this.bladePoints.length<1||this.bladePoints[0].x==0) return;
	this.BladePaint.clear();
	this.BladePaint.beginFill(0xFF0000);
	this.BladePaint.alpha = .5;
	this.BladePaint.moveTo(this.bladePoints[0].x, this.bladePoints[0].y);
	for (var i=1;i<this.bladePoints.length;i++) 
		this.BladePaint.lineTo(this.bladePoints[i].x, this.bladePoints[i].y);
	this.BladePaint.endFill();
	for (var i=1;i<this.bladePoints.length;i++) 
		this.BladeLine = new Phaser.Line(this.bladePoints[i].x, this.bladePoints[i].y, this.bladePoints[i-1].x, this.bladePoints[i-1].y);
};

BasicGame.Play.prototype.HUDContainer = function () {
	var textStyle = this.M.S.BaseTextStyleS(20);
	if (this.LevelInfo.TA) {
		this.TimerTextSprite = this.M.S.genText(10,10,'残り時間:'+this.countdown,textStyle);
		this.TimerTextSprite.setAnchor(0,0);
		this.CurScoreTextSprite = this.M.S.genText(10,40,'スコア:'+this.curScore,textStyle);
		this.CurScoreTextSprite.setAnchor(0,0);
	} else {
		this.GoalScoreTextSprite = this.M.S.genText(10,10,'',textStyle);
		this.GoalScoreTextSprite.setAnchor(0,0);
		this.CurScoreTextSprite = this.M.S.genText(10,40,'',textStyle);
		this.CurScoreTextSprite.setAnchor(0,0);
		this.LeftScoreTextSprite = this.M.S.genText(10,70,'',textStyle);
		this.LeftScoreTextSprite.setAnchor(0,0);
		this.setScores();
		this.genLifeSprite();
	}
	this.M.S.genText(this.world.width-10,10,(this.LevelInfo.TA?this.curLevel+'秒アタック':'レベル'+this.curLevel),textStyle).setAnchor(1,0);
};

BasicGame.Play.prototype.setScores = function () {
	this.GoalScoreTextSprite.changeText('目標:'+this.M.H.formatComma(this.goalScore));
	this.CurScoreTextSprite.changeText('スコア:'+this.M.H.formatComma(this.curScore));
	this.LeftScoreTextSprite.changeText('残り:'+this.M.H.formatComma(this.leftScore));
};

BasicGame.Play.prototype.genLifeSprite = function () {
	this.LifeGroup = this.add.group();
	for (var i=0;i<this.LevelInfo.life;i++) var lifeSprite = this.add.sprite(0,0,'Life',0,this.LifeGroup);
	this.LifeGroup.align(-1,1,lifeSprite.width,lifeSprite.height);
	this.LifeGroup.alignIn(this.world.bounds,Phaser.BOTTOM_CENTER,0,-20);
};

BasicGame.Play.prototype.makeResult = function () {
	var bgSprite = this.add.sprite(this.world.centerX,this.world.centerY,'WhitePaper');
	bgSprite.anchor.setTo(.5);
	bgSprite.tint = 0x000000;
	bgSprite.alpha = 0;
	var tween = this.M.T.fadeInA(bgSprite,{delay:500,duration:800,alpha:.5});
	this.M.T.onComplete(tween,this.genResultBtns);
	tween.start();
};

BasicGame.Play.prototype.genResultBtns = function () {
	var textStyle = this.M.S.BaseTextStyleS(25);
	if (this.LevelInfo.TA) {
		this.M.S.genText(this.world.centerX,200,'終了！',this.M.S.BaseTextStyleS(50));
		this.genResultBtnSprite(this.world.centerX,300,function(){this.M.NextScene('Play');},'もう一度',textStyle,200);
	} else {
		if (this.clear) {
			this.M.S.genText(this.world.centerX,200,'クリア！',this.M.S.BaseTextStyleS(50));
			if (this.curLevel<6) {
				this.genResultBtnSprite(this.world.centerX,300,function(){
					this.M.setGlobal('curLevel',++this.curLevel);
					this.M.NextScene('Play');
				},'次のレベル',textStyle,200);
			} else {
				this.genResultBtnSprite(this.world.centerX,300,function(){this.M.NextScene('Play');},'もう一度',textStyle,200);
			}
		} else {
			this.M.S.genText(this.world.centerX,200,'ゲームオーバー！',this.M.S.BaseTextStyleS(40));
			this.genResultBtnSprite(this.world.centerX,300,function(){this.M.NextScene('Play');},'もう一度',textStyle,200);
		}
	}
	this.genResultBtnSprite(this.world.centerX,380,this.tweet,'結果をツイート',textStyle,400);
	this.genResultBtnSprite(this.world.centerX,460,function(){this.M.NextScene('SelectLevel');},'レベル選択に戻る',textStyle,600);
	this.genResultBtnSprite(this.world.centerX,540,function(){this.M.NextScene('Title');},'タイトルに戻る',textStyle,800);
};

BasicGame.Play.prototype.genResultBtnSprite = function (x,y,func,text,textStyle,delay) {
	var btnSprite = this.M.S.BasicGrayLabelS(x,y,func,text,textStyle,{tint:BasicGame.MAIN_TINT});
	btnSprite.scale.setTo(0);
	this.M.T.popUpB(btnSprite,{duration:800,delay:delay}).start();
};

BasicGame.Play.prototype.tweet = function () {
	// this.M.SE.play('OnBtn',{volume:1}); // TODO
	var levelText = '挑戦レベル: '+this.curLevel+(this.LevelInfo.TA?'秒アタック':'レベル');
	var resultText = this.LevelInfo.TA?'スコア: '+this.M.H.formatComma(this.curScore):'結果: '+(this.clear?'クリア！':'残念！');
	var emoji = '🍃🍃🍃🍃🍃🍃';
	var text =  '『'+BasicGame.GAME_TITLE+'』で遊んだよ！\n'
				+emoji+'\n'
				+levelText+'\n'
				+resultText+'\n'
				+emoji+'\n';
	var hashtags = 'ぽんぽこゲーム,ピーナッツくんゲーム';
	this.M.H.tweet(text,hashtags,location.href);
};


