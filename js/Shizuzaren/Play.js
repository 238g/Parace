BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=!1;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#000000';
		this.M.SE.playBGM('PlayBGM',{volume:1});

		this.M.getGlobal('endTut')?this.start():this.tut();
		this.tes();
	},
	tut:function(){
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
};
