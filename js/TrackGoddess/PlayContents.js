BasicGame.Play.prototype.PhysicsController=function(){
	this.physics.startSystem(Phaser.Physics.P2JS);
	this.physics.p2.setImpactEvents(!0);
	this.physics.p2.restitution=.1;
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
		e.scale.setTo(.5);
		e.body.setCollisionGroup(this.EnemyCollisionGroup);
		e.body.collides([this.EnemyCollisionGroup,this.PlayerCollisionGroup]);
		e.body.collideWorldBounds=!1;
	},this);
};
BasicGame.Play.prototype.PlayerContainer=function(){
	this.Player=this.add.sprite(this.world.centerX,this.playerStartY,'Truck');//TODO left right
	// this.Player.scale.setTo(.5);
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
		// TODO effect
	}
};
BasicGame.Play.prototype.HUDContainer=function(){
	this.HandleSprite=this.add.sprite(this.world.centerX,this.world.height*.95,'Handle');
	this.HandleSprite.anchor.setTo(.5);
	this.HandleSprite.scale.setTo(.3);
};
