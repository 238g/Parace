BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.StartLbl=
		// this.LangLbl=
		this.OtherGamesLbl=null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.setBackgroundColor(0xfbf6d5);
		// this.M.SE.playBGM('TitleBGM',{volume:1});

		this.M.S.genTxt(this.world.centerX,this.world.height*.25,BasicGame.GAME_TITLE,this.M.S.txtstyl(40));
		this.StartLbl=this.M.S.genLbl(this.world.centerX,this.world.height*.6,this.start,this.curWords.Start,this.M.S.txtstyl(25));
		this.OtherGamesLbl=this.M.S.genLbl(this.world.centerX,this.world.height*.7,this.otherGames,this.curWords.OtherGames,this.M.S.txtstyl(20));
		// this.LangLbl=this.M.S.genLbl(this.world.centerX,this.world.height*.8,this.changeLang,this.curWords.Lang,this.M.S.txtstyl(25),{tint:0xffff00});
		
		this.genHUD();
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},
	start:function(){
		if (this.inputEnabled) {
			// this.M.SE.play('OnBtn',{volume:1});
			this.M.NextScene('SelectStage');
		} else {
			// this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	/*
	changeLang:function(){
		// this.M.SE.play('OnBtn',{volume:1});
		if(this.curLang=='en'){
			this.curLang='jp';
			this.M.sGlb('curLang','jp');
			this.curWords=this.Words[this.curLang];
			this.StartLbl.changeText(this.curWords.Start);
			this.LangLbl.changeText(this.curWords.Lang);
			this.OtherGamesLbl.changeText(this.curWords.OtherGames);
		}else{
			this.curLang='en';
			this.M.sGlb('curLang','en');
			this.curWords=this.Words[this.curLang];
			this.StartLbl.changeText(this.curWords.Start);
			this.LangLbl.changeText(this.curWords.Lang);
			this.OtherGamesLbl.changeText(this.curWords.OtherGames);
		}
	},
	*/
	otherGames:function(){
		// this.M.SE.play('OnBtn',{volume:1});
		if (this.game.device.desktop) {
			window.open(BasicGame.MY_GAMES_URL,'_blank');
		} else {
			location.href=BasicGame.MY_GAMES_URL;
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y);
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};
