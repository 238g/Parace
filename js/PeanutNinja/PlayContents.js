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
		var emitter = this.add.emitter(0,0,100);
		emitter.makeParticles(info.name+'_Cut');
		emitter.lifespan = 2000;
		this.Emitters[info.name] = emitter;
	}
	this.Targets = this.genGroup(targetKeys,10);
	this.Obstarcles = this.genGroup(obstarcleKeys,3);
};

BasicGame.Play.prototype.genTarget = function () {
	this.TargetPool = this.Targets.getFirstDead();
	if (this.TargetPool) {
		var rndX = this.rnd.integerInRange(0,1);
		var rndY = this.rnd.integerInRange(0,2);
		this.TargetPool.reset(rndX*this.world.width,this.world.height-rndY*100);
		this.TargetPool.anchor.setTo(.5);
		var velocityX = this.rnd.between(5,10);
		var velocityY = this.rnd.between(15,40);
		this.TargetPool.body.velocity.x = (-2*rndX+1) * velocityX * this.time.physicsElapsedMS;
		this.TargetPool.body.velocity.y = -velocityY * this.time.physicsElapsedMS;
	}
};

BasicGame.Play.prototype.genObstarcle = function () {
	this.ObstarclePool = this.Obstarcles.getFirstDead();
	if (this.ObstarclePool) {
		var x = this.rnd.between(100,this.world.width-100);
		this.ObstarclePool.reset(x,0);
		this.ObstarclePool.anchor.setTo(.5);
	}
};

BasicGame.Play.prototype.genGroup = function (keys,createCount) {
	var group = this.add.group();
	group.enableBody = true;
	group.physicsBodyType = Phaser.Physics.ARCADE;
	group.createMultiple(createCount,keys);
	group.setAll('checkWorldBounds', true);
	group.setAll('outOfBoundsKill', true);
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
	// TODO score
	this.ScoreTextSprite = this.M.S.genText(this.world.centerX,60,this.spawnCount,this.M.S.BaseTextStyleS(40));
};
