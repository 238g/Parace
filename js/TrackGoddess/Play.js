BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		this.inputEnabled=this.isPlaying=!1;

		this.onDownRot=0;

		this.HandleSprite=
		this.Player=
		null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('PlayBGM',{volume:1}); // TODO


		this.HandleSprite=this.add.sprite(this.world.centerX,this.world.height*.95,'Handle');
		this.HandleSprite.anchor.setTo(.5);
		this.HandleSprite.scale.setTo(.3);

		this.Player=this.M.S.genBmpSprite(this.world.centerX,this.world.centerY,30,80,'#00ff00');
		this.Player.anchor.setTo(.5,.1);

		this.input.onDown.add(function(){
			this.onDownRot=this.physics.arcade.angleBetween(this.HandleSprite,this.input.activePointer);
		},this);

		this.tes();
	},
	update:function(){
		if(this.input.activePointer.isDown){
			this.HandleSprite.rotation=this.physics.arcade.angleBetween(this.HandleSprite,this.input.activePointer)-this.onDownRot;
			this.Player.rotation=this.HandleSprite.rotation; // !?!?
		}
		this.Player.x+=this.HandleSprite.angle*.03;
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
		}
	},
};
