BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.M.gGlb('curLang')];
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.setBackgroundColor(0xfbf6d5);
		this.M.SE.playBGM('TitleBGM',{volume:1});
		this.M.S.genTxt(this.world.centerX,this.world.height*.25,BasicGame.GAME_TITLE,this.M.S.txtstyl(50));
		var sb=this.M.S.genLbl(this.world.centerX,this.world.height*.58,this.start,this.curWords.Start,this.M.S.txtstyl(25),{tint:0xffff00});
		sb.scale.setTo(1.5);
		var lb=this.M.S.genLbl(this.world.centerX,this.world.height*.7,this.changeLang,this.curWords.Lang,this.M.S.txtstyl(25),{tint:0xffff00});
		lb.scale.setTo(1.5);	
		var ob=this.M.S.genLbl(this.world.centerX,this.world.height*.82,this.otherGames,this.curWords.OtherGames,this.M.S.txtstyl(20),{tint:0xffff00});
		ob.scale.setTo(1.5);
		this.genHUD();
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},
	start:function(){
		if (this.inputEnabled) {
			this.M.SE.play('SelectSE',{volume:1});
			this.M.NextScene('SelectChar');
		} else {
			this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	changeLang:function(){
		// TODO
	},
	otherGames:function(){
		// TODO
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y);
		this.M.S.gebFlScBtn(this.world.width*.9,y);
	},
};
