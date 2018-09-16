BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		// Obj
		this.StartTS=this.LangTS=null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});

		var g=this.add.group();
		for(var i=1;i<=14;i++){
			var s=this.add.sprite(0,0,'Album_'+i);
			s.alpha=0;
			g.add(s);
		}
		g.shuffle();
		this.M.T.slideshow(g,{duration:1500,delay:1500});

		this.add.sprite(this.world.width*.95,this.world.height*.7,'Title').anchor.setTo(1,.5);
		// this.M.S.genTxt(this.world.width*.6,this.world.height*.7,BasicGame.GAME_TITLE,this.M.S.txtstyl(50));

		this.StartTS=this.M.S.genLbl(this.world.width*.25,this.world.height*.8,this.start,this.curWords.Start,this.M.S.txtstyl(25));
		this.CharTwTS=this.M.S.genLbl(this.world.width*.75,this.world.height*.8,this.meiTw,this.curWords.CharTw,this.M.S.txtstyl(25));
		this.LangTS=this.M.S.genLbl(this.world.centerX,this.world.height*.9,this.chgLang,this.curWords.Lang,this.M.S.txtstyl(25));

		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				this.M.SE.play('OnStart',{volume:1});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
				this.Tween.onComplete.add(function(){this.M.NextScene('SelectStage')},this);
				this.Tween.start();
			}
		} else {
			this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	meiTw:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url='https://twitter.com/osanai_mei';
		this.game.device.desktop?window.open(url,"_blank"):location.href=url;
		myGa('external_link','Title','Mei Twitter',this.M.gGlb('playCount'));
	},
	chgLang:function(){
		if(this.curLang=='en'){
			this.curLang='jp';
			this.M.sGlb('curLang',this.curLang);
			this.curWords=this.Words[this.curLang];
		}else{
			this.curLang='en';
			this.M.sGlb('curLang',this.curLang);
			this.curWords=this.Words[this.curLang];
		}
		this.StartTS.changeText(this.curWords.Start);
		this.CharTwTS.changeText(this.curWords.CharTw);
		this.LangTS.changeText(this.curWords.Lang);
		this.M.SE.play('OnBtn',{volume:1});
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0xFF0080;
		this.M.S.genFlScBtn(this.world.width*.9,y).tint=0xFF0080;
	},
};
