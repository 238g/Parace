BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		this.isPlaying=!1;
	},

	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.firstPlay();
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
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(function(){this.end();},this);
		}
	},
	////////////////////////////////////// PlayContents
	firstPlay:function(){

	},
	secondPlay:function(){

	},
};
