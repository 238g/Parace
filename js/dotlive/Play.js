BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.curChar=this.M.gGlb('curChar');
		this.CharInfo=this.M.gGlb('CharInfo');
		this.curCharInfo=this.CharInfo[this.curChar];
		// Val

		// Obj
		// this.Player=this.Enemies=this.Items=this.BgS=this.FlashS=
		// this.PlayerCollisionGroup=this.EnemyCollisionGroup=this.ItemCollisionGroup=
		// this.HUD=this.ScoreTS=this.LeftTimeTS=this.HowToS=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#000';
		// this.M.SE.playBGM('PlayBGM_'+this.rnd.between(1,2),{volume:1});//TODO

		this.genContents();
		// this.M.gGlb('endTut')?this.genStart():this.genTut();
		this.start();//TODO del
		this.test();
	},
	//TODO
	updateT:function(){
		if(this.isPlaying){
			this.respawnTimer-=this.time.elapsed;
			if(this.respawnTimer<0){
				this.respawnTimer=this.respawnInterval;
				for(var i=0;i<this.respawnCount;i++)this.respawnEnemy();
			}
			this.appearItemTimer-=this.time.elapsed;
			if(this.appearItemTimer<0){
				this.appearItemTimer=this.appearItemInterval;
				this.appearItem();
			}
			this.tickTimer-=this.time.elapsed;
			if(this.tickTimer<0){
				this.tickTimer=1E3;
				this.leftTime--;
				this.LeftTimeTS.changeText(this.curWords.LeftTime+this.leftTime);
				if(this.leftTime==0)this.gameOver();
			}
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(this.clear,this);
			// this.Player.body.debug=!0;
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		// this.genHUD();
		//this.M.H.formatComma(this.score);
	},
	genHUD:function(){
		this.HUD=this.add.group();

		//TODO Score / next time

		var txtstyl=this.M.S.txtstyl(30);
		txtstyl.fill=txtstyl.mStroke='#008000';
		this.ScoreTS=this.M.S.genTxt(this.world.centerX,this.world.height*.97,this.curWords.Score+this.score,txtstyl);
		this.HUD.add(this.ScoreTS);
		if(this.targetScore){
			this.HUD.add(this.M.S.genTxt(this.world.centerX,this.world.height*.9,this.curWords.TargetScore+this.M.H.formatComma(this.targetScore),txtstyl));
		}

		txtstyl.fill=txtstyl.mStroke='#2E2EFE';
		this.LeftTimeTS=this.M.S.genTxt(this.world.centerX,this.world.height*.05,this.curWords.LeftTime+this.leftTime,txtstyl);
		this.HUD.add(this.LeftTimeTS);
		this.HUD.visible=!1;
	},
	////////////////////////////////////////////////////////////////////////////////////
	gameOver:function(){
		if(this.isPlaying){
			this.isClear=!1;
			this.end();
			if(this.isTimeAttack){
				this.genEnd(this.curWords.TimeUp,'#DF0101');
			}else{
				this.genEnd(this.curWords.GameOver,'#DF0101');
			}
		}
	},
	clear:function(){
		if(this.isPlaying){
			this.isClear=!0;
			this.end();
			this.genEnd(this.curWords.Clear,'#FACC2E');	
		}
	},
	genTut:function(){
		this.HowToS=this.add.sprite(0,0,'TWP');
		this.HowToS.tint=0x000000;
		var ts=this.M.S.genTxt(this.world.centerX,this.world.centerY,this.curWords.HowTo,this.M.S.txtstyl(30));
		this.HowToS.addChild(ts);
		this.time.events.add(300,function(){
			this.input.onDown.addOnce(function(){
				this.M.sGlb('endTut',!0);
				this.HowToS.destroy();
				this.genStart();
			},this);
		},this);
	},
	genStart:function(){
		var txtstyl=this.M.S.txtstyl(50);
		txtstyl.fill=txtstyl.mStroke='#0080FF';
		var s=this.M.S.genTxt(this.world.width*1.5,this.world.centerY,this.curWords.Start,txtstyl);
		var twA=this.M.T.moveA(s,{xy:{x:this.world.centerX}});
		var twB=this.M.T.moveA(s,{xy:{x:-this.world.centerX},delay:300});
		twA.chain(twB);
		twA.start();
		twA.onComplete.add(function(){this.inputEnabled=!0},this);
		twA.onComplete.add(function(){this.destroy},s);
		this.M.SE.play('GenStart',{volume:1});
		this.HUD.visible=!0;
		this.start();
	},
	genEnd:function(text,color){
		var txtstyl=this.M.S.txtstyl(45);
		txtstyl.fill=txtstyl.mStroke=color;
		this.EndTS=this.M.S.genTxt(this.world.centerX,this.world.height*2,text,txtstyl);
		var tw=this.M.T.moveA(this.EndTS,{xy:{y:this.world.centerY}});
		tw.onComplete.add(this.genRes,this);
		tw.start();
		this.M.SE.play('GenEnd',{volume:1});
	},
	////////////////////////////////////////////////////////////////////////////////////
	genRes:function(){
		var s=this.add.sprite(0,-this.world.height,'TWP');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600});
		tw.onComplete.add(function(){this.inputEnabled=!0},this);
		tw.onComplete.add(function(){this.visible=!1},this.EndTS);
		tw.onStart.add(function(){this.M.SE.play('Res',{volume:1})},this);
		tw.start();
		this.HUD.visible=!1;

		var lbl;
		var txtstyl=this.M.S.txtstyl(40);

		txtstyl.fill=txtstyl.mStroke='#3cb371';
		lbl=this.M.S.genTxt(this.world.centerX,this.world.height*.08,this.curWords.Result,txtstyl);
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#dc143c';
		if(this.isTimeAttack){
			s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.22,this.curWords.ResScore+this.formatScore(),txtstyl));
		}else{
			s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.22,
				this.isClear?this.curWords.Clear:this.curWords.NotClear,txtstyl));
		}

		var charS=this.add.sprite(this.world.centerX,this.world.height*.42,'panel_'+this.curChar);
		charS.anchor.setTo(.5);
		s.addChild(charS);
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.6,this.curCharInfo.cName));

		var lX=this.world.width*.25,rX=this.world.width*.75;
		if(this.isClear&&this.curLevel<6){
			s.addChild(this.M.S.genLbl(lX,this.world.height*.7,this.nextLevel,this.curWords.NextLevel));
		}else{
			s.addChild(this.M.S.genLbl(lX,this.world.height*.7,this.again,this.curWords.Again));
		}

		txtstyl.fontSize=25;
		s.addChild(this.M.S.genLbl(rX,this.world.height*.7,this.tweet,this.curWords.TwBtn));
		s.addChild(this.M.S.genLbl(lX,this.world.height*.8,this.back,this.curWords.Back));

		txtstyl.fill=txtstyl.mStroke='#ffa500';
		lbl=this.M.S.genLbl(rX,this.world.height*.8,this.othergames,this.curWords.OtherGames,txtstyl);
		lbl.tint=0xffa500;
		s.addChild(lbl);

		if(this.curCharInfo.tw){
			txtstyl.fill=txtstyl.mStroke='#49c8f0';
			lbl=this.M.S.genLbl(lX,this.world.height*.9,this.tw,'Twitter',txtstyl);
			s.addChild(lbl);
		}

		if(this.curCharInfo.yt){
			txtstyl.fill=txtstyl.mStroke='#ff0000';
			lbl=this.M.S.genLbl(rX,this.world.height*.9,this.yt,'YouTube',txtstyl);
			lbl.tint=0xff0000;
			s.addChild(lbl);
		}

		if(this.itemCount>9){
			this.CharInfo[5].open=!0;
		}
	},
	yt:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curCharInfo.yt;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('youtube','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	tw:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curCharInfo.tw;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('twitter','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	again:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnStart',{volume:1});
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('again','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	nextLevel:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnStart',{volume:1});
			this.M.sGlb('curLevel',Number(this.curLevel)+1);
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('nextLevel','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	othergames:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=__VTUBER_GAMES;
			if(this.curLang=='en')url+='?lang=en';
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('othergames','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var e=this.curCharInfo.emoji;
			if(this.curLevel<7){
				var res=
					this.curWords.TwSelectChar+this.curCharInfo.cName+'\n'+
					this.curWords.TwLevel+this.curLevel+'\n'+
					this.curWords.TwRes+(this.isClear?this.curWords.Clear:this.curWords.NotClear)+'\n';
			}else{
				var res=
					this.curWords.TwSelectChar+this.curCharInfo.cName+'\n'+
					this.curWords.TwLevel+this.curWords.TimeAttack+this.curLevelInfo.leftTime+'\n'+
					this.curWords.Score+this.formatScore()+'\n';
			}
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			this.M.H.tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('Back',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectLevel')},this);
			this.Tween.start();
		}
	},
};