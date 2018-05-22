BasicGame.Play.prototype.TargetContainer = function () {
	var targetKeys = [];
	var obstarcleKeys = [];
	for (var k in this.TargetInfo) {
		var info = this.TargetInfo[k];
		if (info.isTarget) {
			targetKeys.push(info.name);
		} else {
			obstarcleKeys.push(info.name);
		}
		info.score = info.scoreRate * this.LevelInfo.leveScore * (info.isTarget?1:-1);
		var emitter = this.add.emitter(0,0,100);
		emitter.makeParticles(info.name+'_Cut');
		this.Emitters[info.name] = emitter;
	}
	this.Targets = this.genGroup(targetKeys,10);
	this.Obstarcles = this.genGroup(obstarcleKeys,3);
};

BasicGame.Play.prototype.genTarget = function () {
	this.TargetPool = this.rnd.pick(this.Targets.children.filter(function(e){return !e.alive;}));
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
};

BasicGame.Play.prototype.genObstarcle = function () {
	this.ObstarclePool = this.rnd.pick(this.Obstarcles.children.filter(function(e){return !e.alive;}));
	if (this.ObstarclePool) {
		if (this.rnd.between(0,100)<this.LevelInfo.spawnPointSwitchRate) {
			var rndX = this.rnd.integerInRange(0,1);
			this.ObstarclePool.reset(rndX*this.world.width,this.world.height-this.rnd.integerInRange(0,2)*100);
			this.ObstarclePool.body.velocity.x = (-2*rndX+1) * this.rnd.between(5,this.LevelInfo.maxSpeedX) * this.time.physicsElapsedMS;
			this.ObstarclePool.body.velocity.y = this.rnd.between(-15,-this.LevelInfo.maxSpeedY) * this.time.physicsElapsedMS;
		} else {
			this.ObstarclePool.reset(this.rnd.between(100,this.world.width-100),0);
			this.ObstarclePool.body.velocity.y = this.rnd.between(1,this.LevelInfo.maxSpeedY*.8) * this.time.physicsElapsedMS;
		}
	}
};

BasicGame.Play.prototype.genGroup = function (keys,createCount) {
	var group = this.add.group();
	group.enableBody = true;
	group.physicsBodyType = Phaser.Physics.ARCADE;
	group.createMultiple(createCount,keys);
	group.children.forEach(function (child) {
		child.checkWorldBounds = true;
		child.outOfBoundsKill = true;
		child.anchor.setTo(.5);
		child.score = this.TargetInfo[child.key].score;
		child.scoreRate = this.TargetInfo[child.key].scoreRate;
		child.isTarget = this.TargetInfo[child.key].isTarget;
	},this);
	return group;
};

BasicGame.Play.prototype.BladeGenerator = function () {
	this.bladePoints.push({x: this.input.x, y: this.input.y});
	this.bladePoints = this.bladePoints.splice(this.bladePoints.length-10, this.bladePoints.length);
	if (this.bladePoints.length<1 || this.bladePoints[0].x==0) return;
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
	// TODO show hide switch
	this.GoalScoreTextSprite = this.M.S.genText(10,10,'目標:'+this.goalScore,this.M.S.BaseTextStyleS(25));
	this.GoalScoreTextSprite.setAnchor(0,0);
	this.CurScoreTextSprite = this.M.S.genText(10,40,'スコア:'+this.curScore,this.M.S.BaseTextStyleS(25));
	this.CurScoreTextSprite.setAnchor(0,0);
	this.LeftScoreTextSprite = this.M.S.genText(10,70,'残り:'+this.leftScore,this.M.S.BaseTextStyleS(25));
	this.LeftScoreTextSprite.setAnchor(0,0);
};

BasicGame.Play.prototype.setScores = function () {
	this.GoalScoreTextSprite.changeText('目標:'+this.goalScore);
	this.CurScoreTextSprite.changeText('スコア:'+this.curScore);
	this.LeftScoreTextSprite.changeText('残り:'+this.leftScore);
};
