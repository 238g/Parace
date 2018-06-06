BasicGame.Play.prototype.BladeContainer=function(){
	this.BladeGroup=this.add.group();

	// this.Blade=this.add.sprite(1,1,'');
	this.Blade=this.M.S.genBmpSprite(this.world.centerX,this.bladeStartPosY,10,100,'#00ff00');
	this.Blade.anchor.setTo(.5);
};

BasicGame.Play.prototype.TargetContainer=function(){
	// this.Target=this.add.sprite();
	this.Target=this.M.S.genBmpCircleSprite(this.world.centerX,this.world.height*.8,100,'#ff0000');
	this.Target.anchor.setTo(.5);
	this.Target.addChild(this.M.S.genBmpSprite(30,0,10,10,'#0000ff')); // TODO del
	this.Target.addChild(this.M.S.genBmpSprite(-30,0,10,10,'#00ff00')); // TODO del
	var stuckBlades=this.LevelInfo.StuckBlades;
	for(var k in stuckBlades)this.firstStuckBlade(this.world.centerX,this.bladeGoToPosY,stuckBlades[k]);
};

BasicGame.Play.prototype.HUDContainer=function(){
	this.M.S.genTextM(80,30,'レベル: '+this.curLevel);
	this.LimitTimeTextSprite=this.M.S.genTextM(this.world.width-100,30,'制限時間: '+100); // TODO change text
};

BasicGame.Play.prototype.firstStuckBlade=function(x,y,angle){
	var blade=this.genStuckBlade(x,y,angle);
	blade.angle-=angle;
	var radians = Phaser.Math.degToRad(blade.angle-90);
	blade.x=this.Target.x+(this.Target.width*.5)*Math.cos(radians);
	blade.y=this.Target.y+(this.Target.width*.5)*Math.sin(radians);
};

BasicGame.Play.prototype.genStuckBlade=function(x,y,angle){
	// TODO when first gen... this or other function
	var blade=this.M.S.genBmpSprite(x,y,10,100,'#00ff00');
	// var blade=this.add.sprite(x,y,'');
	blade.anchor.setTo(.5);
	blade.impactAngle=angle;
	this.BladeGroup.add(blade);
	return blade;
};