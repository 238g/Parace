BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		// Obj
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});
		
		//TODO
		// var title=this.add.sprite(this.world.centerX,this.world.height*.22,'Title');
		// title.anchor.setTo(.5);

		// this.genEff();

		var txtstyl=this.M.S.txtstyl(25);
		this.M.S.genLbl(this.world.centerX,this.world.height*.8,this.start,this.curWords.Start,txtstyl).tint=0x00ff00;
		this.M.S.genLbl(this.world.width*.25,this.world.height*.95,this.credit,'Credit',txtstyl).tint=0xffd700;
		this.M.S.genLbl(this.world.width*.75,this.world.height*.95,this.othergames,this.curWords.OtherGames,txtstyl).tint=0xffd700;
		
		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	genEff:function(){
		var s=this.add.sprite(this.world.centerX,this.world.height*.52,'gacha_3');
		s.anchor.setTo(.5);
		s.scale.setTo(1.2);
		this.M.T.stressA(s,{durations:[400,200],delay:500}).start();
	},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				this.M.SE.play('OnBtn',{volume:1});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
				this.Tween.onComplete.add(function(){this.M.NextScene('SelectGacha')},this);
				this.Tween.start();
			}
		} else {
			this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	credit:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url='https://238g.github.io/Parace/238Games2.html?page=credit';
		window.open(url,"_blank");
		myGa('external_link','Title','Credit',this.M.gGlb('playCount'));
	},
	othergames:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url=__VTUBER_GAMES;
		if(this.curLang=='en')url+='?lang=en';
		window.open(url,"_blank");
		myGa('othergames','Title','OtherGames',this.M.gGlb('playCount'));
	},
	genHUD:function(){
		var y=this.world.height*.05;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0x000000;
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};
////////////////////////////////////////////////////////////////////////////////////////////////////////
