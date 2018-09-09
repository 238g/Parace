BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		// this.CharInfo=this.M.gGlb('CharInfo');
		// Val
		// Obj
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});
		this.genContents();
		return;
		this.M.gGlb('endTut')?this.genStart():this.genTut();
		this.tes();
	},
	updateT:function(){
		if(this.isPlaying){
			if(this.clearTimer<0){
				this.clearTimer=1E3;
				this.clearTime++;
			}
			this.clearTimer-=this.time.elapsed
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	tes:function(){
		if(__ENV!='prod'){
			// this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.genEnd,this);
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		return;
		this.add.sprite(0,0,'Bg_2');
		this.genHUD();
	},
	genHUD:function(){
		var txtstyl=this.M.S.txtstyl(30);
		this.FirstSelectedTS=this.M.S.genTxt(this.world.width*.05,this.world.height*.87,'',txtstyl);
		this.FirstSelectedTS.visible=!1;
		this.FirstSelectedTS.anchor.setTo(.01,.5);
		this.FirstSelectedTS.children[0].anchor.setTo(0,.5);
		this.SecoundSelectedTS=this.M.S.genTxt(this.world.width*.95,this.world.height*.95,'',txtstyl);
		this.SecoundSelectedTS.visible=!1;
		this.SecoundSelectedTS.anchor.setTo(.99,.5);
		this.SecoundSelectedTS.children[0].anchor.setTo(1,.5);

		this.GotCardsCountTS=this.M.S.genTxt(this.world.width*.8,this.world.height*.85,15-this.gotCardsCount,txtstyl);
	},
	genEnd:function(){
		this.end();
		this.EndTS=this.M.S.genTxt(this.world.width*1.5,this.world.centerY,this.curWords.End,this.M.S.txtstyl(50));
		var tw=this.M.T.moveA(this.EndTS,{xy:{x:this.world.centerX}});
		tw.onComplete.add(this.genRes,this);
		tw.start();
		this.M.SE.play('Res',{volume:1});
	},
	genRes:function(){
		this.time.events.add(600,function(){
			this.EndTS.visible=!1;
			var s=this.add.sprite(-this.world.width,0,'TWP');
			s.tint=0x000000;
			this.M.T.moveA(s,{xy:{x:0}}).start();
			var txtstyl=this.M.S.txtstyl(35);
			txtstyl.fill=txtstyl.mStroke='#FF0040';
			s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.05,this.curWords.Result,txtstyl));

			txtstyl.fontSize=30;
			txtstyl.fill=txtstyl.mStroke=BasicGame.MAIN_TEXT_COLOR;
			s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.2,this.curWords.FirstGotCard+'\n'+this.firstGotCharInfo.cName,txtstyl));

			var char=this.add.sprite(this.world.centerX,this.world.height*.48,'Frame'+this.firstGotCharInfo.cId);
			char.anchor.setTo(.5);
			s.addChild(char);

			s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.72,this.yt,'YouTube'));
			s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.72,this.again,this.curWords.Again));

			s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.82,this.gotoUpd8,'Upd8'));
			s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.82,this.tweet,this.curWords.Tweet));

			s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.92,this.back,this.curWords.Back));
			s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.92,this.othergames,this.curWords.OtherGames));
		},this);
	},
	again:function(){
		if(!this.Tween.isRunning){
			this.M.SE.play('OnStart',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('again','Play','char_'+this.firstGotCharInfo.cId,this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(!this.Tween.isRunning){
			this.M.SE.play('OnBtn',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Title')},this);
			this.Tween.start();
		}
	},
	yt:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url=this.firstGotCharInfo.yt;
		this.game.device.desktop?window.open(url,"_blank"):location.href=url;
		myGa('youtube','Play','char_'+this.firstGotCharInfo.cId,this.M.gGlb('playCount'));
	},
	tweet:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var e='🐝🐝🐝🐝🐝🐝';
		var res=this.curWords.TweetFirstGotCard+(this.firstGotCharInfo.firstName?this.firstGotCharInfo.firstName:'')+this.firstGotCharInfo.cName+'\n'+
				this.curWords.TweetFalseCount+this.falseCount+'\n'+
				this.curWords.TweetClearTimeFront+this.clearTime+this.curWords.TweetClearTimeBack+'\n';
		var txt=e+'\n'+this.curWords.TweetTtl+'\n'+res+e+'\n';
		this.M.H.tweet(txt,this.curWords.TweetHT,location.href);
		myGa('tweet','Play','char_'+this.firstGotCharInfo.cId,this.M.gGlb('playCount'));
	},
	gotoUpd8:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url='https://upd8.jp/';
		this.game.device.desktop?window.open(url,"_blank"):location.href=url;
		myGa('external_link','Play','char_'+this.firstGotCharInfo.cId,this.M.gGlb('playCount'));
	},
	othergames:function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.game.device.desktop?window.open(__VTUBER_GAMES,"_blank"):location.href=__VTUBER_GAMES;
		myGa('othergames','Play','char_'+this.firstGotCharInfo.cId,this.M.gGlb('playCount'));
	},
	genTut:function(){
		this.M.sGlb('endTut',!0);
		this.HowToS=this.add.sprite(0,0,'TWP');
		this.HowToS.tint=0x000000;
		var ts=this.M.S.genTxt(this.world.centerX,this.world.centerY,this.curWords.HowTo);
		this.HowToS.addChild(ts);
		this.time.events.add(500,function(){
			this.input.onDown.addOnce(function(){
				this.HowToS.destroy();
				this.genStart();
			},this);
		},this);
	},
	genStart:function(){
		this.Panels.visible=!0;
		var s=this.M.S.genTxt(this.world.width*1.5,this.world.centerY,this.curWords.Start,this.M.S.txtstyl(50));
		var twA=this.M.T.moveA(s,{xy:{x:this.world.centerX}});
		var twB=this.M.T.moveA(s,{xy:{x:-this.world.centerX}});
		twA.chain(twB);
		twA.start();
		twB.onComplete.add(this.start,this);
		this.M.SE.play('Res',{volume:1});
	},
};