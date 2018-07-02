BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1}); // TODO
		this.genHUD();
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},
	start:function(b){
		if (this.inputEnabled) {
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			this.M.NextScene('Play');
		} else {
			// this.M.SE.playBGM('TitleBGM',{volume:1}); // TODO
			this.inputEnabled=!0;
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.BasicVolSprite(this.world.width*.1,y);
		this.M.S.BasicFullScreenBtn(this.world.width*.9,y);
	},
};
