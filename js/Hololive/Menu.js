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
		// this.M.SE.playBGM('TitleBGM',{volume:1});//TODO
		
		//TODO
		// var title=this.add.sprite(this.world.centerX,this.world.height*.92,'Title');
		// title.anchor.setTo(.5);

		this.M.S.genLbl(this.world.width*.25,this.world.height*.8,this.start,this.curWords.Start,this.M.S.txtstyl(25));
		this.M.S.genLbl(this.world.width*.75,this.world.height*.8,this.gotoCredit,'Credit',this.M.S.txtstyl(25));
		
		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				// this.M.SE.play('OnStart',{volume:1});//TODO
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
				this.Tween.onComplete.add(function(){this.M.NextScene('SelectChar')},this);
				this.Tween.start();
			}
		} else {
			// this.M.SE.playBGM('TitleBGM',{volume:1});//TODO
			this.inputEnabled=!0;
		}
	},
	gotoCredit:function(){
		// this.M.SE.play('OnBtn',{volume:1});//TODO
		var url='https://238g.github.io/Parace/238Games2.html?page=credit';
		this.game.device.desktop?window.open(url,"_blank"):location.href=url;
		myGa('external_link','Title','Credit',this.M.gGlb('playCount'));
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0x000000;
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};
////////////////////////////////////////////////////////////////////////////////////////////////////////
BasicGame.SelectChar=function(){};
BasicGame.SelectChar.prototype={
	init:function(){
		this.CharInfo=this.M.gGlb('CharInfo');
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});//TODO

		//TODO
		this.M.S.genTxt(this.world.centerX,this.world.height*.065,'Select');

		this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.Back);

		this.genHUD();
	},
	select:function(b){
		if (!this.Tween.isRunning) {
			this.M.sGlb('curChar',b.char);
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('play','SelectChar','Char_'+b.char,this.M.gGlb('playCount'));
			// this.M.SE.play('OnStart',{volume:1});//TODO
		}
	},
	back:function(){
		if(!this.Tween.isRunning){
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Title')},this);
			this.Tween.start();
			// this.M.SE.play('OnBtn',{volume:1});//TODO
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0x000000;
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};