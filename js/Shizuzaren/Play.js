BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
	},
	create:function(){
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000000';
		// this.M.SE.playBGM('PlayBGM',{volume:1});

		this.tes();
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
		}
	},
	////////////////////////////////////// PlayContents
};
