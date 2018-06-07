BasicGame.Play.prototype.BgContainer=function(){
	this.GoalCountTextSprite=this.M.S.genTextM(this.world.centerX,this.world.centerY-30,this.leftCount,this.M.S.BaseTextStyle(80));
};

BasicGame.Play.prototype.BladeContainer=function(){
	this.BladeGroup=this.add.group();
	this.Blade=this.add.sprite(this.world.centerX,this.bladeStartPosY,'Blade');
	this.Blade.anchor.setTo(.5);
};

BasicGame.Play.prototype.TargetContainer=function(){
	this.Target=this.add.sprite(this.world.centerX,this.world.height*.8,'NobuhimeCircle_1');
	this.Target.anchor.setTo(.5);
	this.Target.face=1;
	var stuckBlades=this.LevelInfo.StuckBlades;
	for(var k in stuckBlades)this.firstStuckBlade(this.world.centerX,this.bladeGoToPosY,stuckBlades[k]);
};

BasicGame.Play.prototype.HUDContainer=function(){
	this.M.S.genTextM(70,30,'レベル: '+this.curLevel);
};

BasicGame.Play.prototype.firstStuckBlade=function(x,y,angle){
	var blade=this.genStuckBlade(x,y,angle);
	blade.angle-=angle;
	var radians = Phaser.Math.degToRad(blade.angle-90);
	blade.x=this.Target.x+(this.Target.width*.5)*Math.cos(radians);
	blade.y=this.Target.y+(this.Target.width*.5)*Math.sin(radians);
};

BasicGame.Play.prototype.genStuckBlade=function(x,y,angle){
	var blade=this.add.sprite(x,y,'Blade');
	blade.anchor.setTo(.5);
	blade.impactAngle=angle;
	this.BladeGroup.add(blade);
	return blade;
};