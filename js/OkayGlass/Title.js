BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#555555';
		// this.M.SE.playBGM('TitleBGM',{volume:1});
	},
	start:function(){
		this.M.NextScene('Play');
	},
};
