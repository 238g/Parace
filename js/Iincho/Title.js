BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#555555';
		// this.M.SE.playBGM('TitleBGM',{volume:1});
		this.genHUD();
	},
	start:function(){
		if (this.inputEnabled) {
			// this.M.SE.play('SelectSE',{volume:1});
			this.M.NextScene('Play');
		} else {
			this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y);
		this.M.S.gebFlScBtn(this.world.width*.9,y);
	},
};
