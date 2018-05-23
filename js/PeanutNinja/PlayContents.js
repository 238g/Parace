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
	var textStyle = this.M.S.BaseTextStyleS(25);
	if (this.LevelInfo.TA) {
		this.TimerTextSprite = this.M.S.genText(10,10,'残り時間:'+this.countdown,textStyle);
		this.TimerTextSprite.setAnchor(0,0);
		this.CurScoreTextSprite = this.M.S.genText(10,40,'スコア:'+this.curScore,textStyle);
		this.CurScoreTextSprite.setAnchor(0,0);
	} else {
		this.GoalScoreTextSprite = this.M.S.genText(10,10,'目標:'+this.goalScore,textStyle);
		this.GoalScoreTextSprite.setAnchor(0,0);
		this.CurScoreTextSprite = this.M.S.genText(10,40,'スコア:'+this.curScore,textStyle);
		this.CurScoreTextSprite.setAnchor(0,0);
		this.LeftScoreTextSprite = this.M.S.genText(10,70,'残り:'+this.leftScore,textStyle);
		this.LeftScoreTextSprite.setAnchor(0,0);
		this.genLifeSprite();
	}
};

BasicGame.Play.prototype.genLifeSprite = function () {
	this.LifeGroup = this.add.group();
	for (var i=0;i<this.LevelInfo.life;i++) var lifeSprite = this.add.sprite(0,0,'Life',0,this.LifeGroup);
	this.LifeGroup.align(-1,1,lifeSprite.width,lifeSprite.height);
	this.LifeGroup.alignIn(this.world.bounds,Phaser.BOTTOM_CENTER,0,-20);
};

BasicGame.Play.prototype.setScores = function () {
	this.GoalScoreTextSprite.changeText('目標:'+this.goalScore);
	this.CurScoreTextSprite.changeText('スコア:'+this.curScore);
	this.LeftScoreTextSprite.changeText('残り:'+this.leftScore);
};
