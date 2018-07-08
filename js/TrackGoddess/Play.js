BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		this.isPlaying=!1;

		this.onDownRot=0;

		this.playerStartY=this.world.height*.6;

		this.secTimer=1E3;

		this.Vehicle=this.M.getConf('Vehicle');

		this.Player=
		this.Enemies=
		this.HandleSprite=

		this.PlayerCollisionGroup=
		this.EnemyCollisionGroup=
		null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('PlayBGM',{volume:1}); // TODO

		this.PhysicsController();
		this.EnemyContainer();
		this.PlayerContainer();
		this.HUDContainer();

		this.start();
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			if(this.input.activePointer.isDown){
				this.HandleSprite.rotation=this.physics.arcade.angleBetween(this.HandleSprite,this.input.activePointer)-this.onDownRot;
				this.Player.body.rotation=this.HandleSprite.rotation;
			}
			this.Player.body.x+=this.HandleSprite.angle*.03;
			if(Math.abs(this.Player.angle)<90){
				if(this.Player.body.y>this.playerStartY)this.Player.body.y-=.1*this.time.physicsElapsedMS;
			}else{
				this.Player.body.y+=.01*this.time.physicsElapsedMS;
			}
			this.secTimer-=this.time.elapsed;
			if(this.secTimer<0){
				this.secTimer=1E3;
				this.respawnEnemy();
				// this.respawnEnemy();
				this.Enemies.forEachAlive(function(e){
					if(e.y>this.world.height)e.kill();
					if(e.y<0)e.kill();
				},this);
			}
		}
	},
	start:function(){
		this.isPlaying=!0;
	},
	end:function(){
		this.isPlaying=!1;
	},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.end,this);
			// this.M.H.getQuery('time')&&(this.leftTime=this.M.H.getQuery('time'));
			this.Player.body.debug=!0;
			this.Enemies.forEach(function(e){e.body.debug=!0;},this);
		}
	},
};
