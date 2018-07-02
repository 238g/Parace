BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		this.inputEnabled=this.isPlaying=!1;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('PlayBGM',{volume:1}); // TODO
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
			// this.M.H.getQuery('time')&&(this.leftTime=this.M.H.getQuery('time'));
		}
	},
};
