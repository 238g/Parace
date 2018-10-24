BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.curGacha=this.M.gGlb('curGacha');
		this.GachaInfo=this.M.gGlb('GachaInfo');
		this.curGachaInfo=this.GachaInfo[this.curGacha];
		this.CharInfo=this.M.gGlb('CharInfo');
		// Val
		// this.twCount=0;
		// this.gachaCount=1;

		// Obj
		// this.PlayB=this.BigCard=
		this.SkipB=
		//this.WPS=this.MoveCardS=this.ResPanel=
		null;
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000';
		this.genContents();
		// this.M.gGlb('endTut')?this.genStart():this.genTut();
		this.test();
	},
	updateT:function(){
		if(this.isPlaying){
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			// this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.gameOver,this);
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		//TODO
		this.add.sprite(0,0,'TWP').tint=0xf0f0f0;//TODO del

		// TODO
		var s=this.add.sprite(this.world.centerX,this.world.height,'todo_1');s.width=80;s.height=80;s.anchor.setTo(.5)//TODO del
		this.MoveCardS=s;

		this.PlayB=this.M.S.genLbl(this.world.width*.25,this.world.centerY,this.playGacha,'PlayGacha1');
		this.PlayB.gachaCount=1;
		this.PlayTenB=this.M.S.genLbl(this.world.width*.75,this.world.centerY,this.playGacha,'PlayGacha10');
		this.PlayTenB.gachaCount=10;

		this.SkipB=this.M.S.genLbl(this.world.width*.75,this.world.height*.8,this.skip,'Skip');
		this.SkipB.visible=!1;

		this.BigCard=this.add.sprite(this.world.centerX,this.world.centerY,'todo_1');
		this.BigCard.anchor.setTo(.5);
		this.BigCard.visible=!1;

		//TODO name WPS change???
		this.WPS=this.add.sprite(this.world.width,0,'WP');

		this.ResPanel=this.add.group();
		//TODO
		var s,col=0,
			sX=this.world.width*.2,
			mX=this.world.width*.2,
			smX=this.world.width*.1,
			sY=this.world.height*.3,
			mY=this.world.height*.2;
		for(var i=0;i<10;i++){
			if(i<3){
				// s=this.add.sprite(sX+mX*col,sY,'todo_1');
				s=this.add.button(sX+mX*col,sY,'todo_1',this.zoomCard,this);
			}else if(i<7){
				if(i==3)col=0;
				// s=this.add.sprite(smX+mX*col,sY+mY,'todo_1');
				s=this.add.button(smX+mX*col,sY+mY,'todo_1',this.zoomCard,this);
			}else{
				if(i==7)col=0;
				// s=this.add.sprite(sX+mX*col,sY+mY+mY,'todo_1');
				s=this.add.button(sX+mX*col,sY+mY+mY,'todo_1',this.zoomCard,this);
			}
			s.panelNum=i;
			s.width=80;
			s.height=80;
			this.ResPanel.add(s);
			col++;
		}
		this.ResPanel.visible=!1;


		// TODO res btn gen / visible!1
	},
	playGacha:function(b){
		this.PlayB.visible=!1;
		this.PlayTenB.visible=!1;
		this.SkipB.visible=!0;
		this.gachaCount=b.gachaCount;

		this.gachaSystem();

		this.twCount=0;
		this.repeatCard();
	},
	gachaSystem:function(){
		//TODO per mode


		this.ResPanel.forEach(function(s){
			//TODO change image
		},this);
	},
	repeatCard:function(){
		// console.log(this.time.time);
		this.MoveCardS.y=this.world.height;
		var twA=this.M.T.moveB(this.MoveCardS,{xy:{y:this.world.centerY},duration:300});
		var twB=this.M.T.moveB(this.MoveCardS,{xy:{y:0},duration:300});
		twA.chain(twB);
		twA.start();
		this.Tween=twA;
		twB.onStart.add(function(s,tw){
			this.Tween=tw;
		},this);
		twB.onComplete.add(function(){
			this.twCount++;
			if(this.twCount<this.gachaCount){
				this.repeatCard();
			}else{
				this.slideInWP();
			}
		},this);
	},
	slideInWP:function(){
		var twC=this.M.T.moveB(this.WPS,{xy:{x:0}});
		twC.start();
		this.Tween=twC;
		twC.onComplete.add(function(){
			this.lastShow();
		},this);
	},
	skip:function(){
		console.log('Skip');
		if(this.Tween.isRunning){
			this.Tween.stop();
			this.lastShow();
		}
	},
	lastShow:function(){
		this.SkipB.visible=!1;
		this.MoveCardS.visible=!1;

		this.world.bringToTop(this.WPS);
		this.WPS.x=0;
		var twD=this.M.T.moveA(this.WPS,{xy:{x:-this.world.width},delay:300});
		twD.start();
		this.Tween=twD;

		if(this.gachaCount==1){
			this.BigCard.visible=!0;
		
			twD.onComplete.add(this.showStar,this);
		}else{
			this.ResPanel.visible=!0;
		}
	},
	showStar:function(){
		var arr=[];
		//TODO 5->char info
		for(var i=0;i<5;i++){
			var s=this.add.sprite(this.world.width,300,'todo_2');
			arr.push(s);
		}

		var sX=this.world.centerX,
			mX=30,
			iMax=5;
		for(var i=0;i<iMax;i++){
			var tw=this.M.T.moveA(arr[i],{xy:{x:sX+mX*i},delay:i*200});//TODO tw chng
			tw.start();
			if(i==iMax-1){
				tw.onComplete.add(function(){
					//TODO SE
					console.log('BOMB');
					//TODO next play OK
					this.showRes();
				},this);
			}else{
				tw.onComplete.add(function(){
					//TODO SE
					console.log('BAN');
				},this);
			}
		}
	},
	zoomCard:function(b){
		// console.log(b.panelNum);
		var s=this.ResPanel.children[b.panelNum];
		this.BigCard.loadTexture(s.key);
		this.BigCard.visible=!0;
		this.showRes();
	},
	genHUD:function(){
		this.HUD=this.add.group();

		var txtstyl=this.M.S.txtstyl(25);

		txtstyl.fill=txtstyl.mStroke='#01DF3A';
		this.ScoreTS=this.M.S.genTxt(this.world.width-10,10,this.curWords.Score+this.formatScore(),txtstyl);
		this.ScoreTS.anchor.setTo(1,0);
		this.ScoreTS.children[0].anchor.setTo(1,0);		
		this.HUD.add(this.ScoreTS);

		txtstyl.fill=txtstyl.mStroke='#DF0101';
		this.HPTS=this.M.S.genTxt(10,10,'HP: '+this.hp,txtstyl);
		this.HPTS.anchor.setTo(0);
		this.HPTS.children[0].anchor.setTo(0);
		this.HUD.add(this.HPTS);

		txtstyl.fill=txtstyl.mStroke='#0080FF';
		this.LevelTS=this.M.S.genTxt(10,10+this.HPTS.height,'Level: '+this.curLevel,txtstyl);
		this.LevelTS.anchor.setTo(0);
		this.LevelTS.children[0].anchor.setTo(0);
		this.HUD.add(this.LevelTS);

		this.HUD.visible=!1;
	},
	gameOver:function(){
		this.end();
		this.genEnd();
	},

	////////////////////////////////////////////////////////////////////////////////////
	showRes:function(){
		//TODO show res
		// TODO if 10, close btn
	},
	genRes:function(){
		var s=this.add.sprite(0,-this.world.height,'TWP');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600});
		tw.onComplete.add(function(){this.inputEnabled=!0},this);
		tw.onComplete.add(function(){this.visible=!1},this.EndTS);
		tw.onStart.add(function(){this.M.SE.play('Res',{volume:2})},this);
		tw.start();
		this.HUD.visible=!1;

		var txtstyl=this.M.S.txtstyl(40);

		txtstyl.fill=txtstyl.mStroke='#01DF3A';
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.05,this.curWords.Result,txtstyl));

		txtstyl.fill=txtstyl.mStroke='#01DF3A';
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.2,this.curWords.ResScore+this.formatScore(),txtstyl));


		s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.75,this.again,this.curWords.Again));
		s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.75,this.tweet,this.curWords.TwBtn));
		s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.85,this.back,this.curWords.Back));
		s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.85,this.othergames,this.curWords.OtherGames));
		s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.95,this.tw,'Twitter'));
		s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.95,this.yt,'YouTube'));
	},
	yt:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curFirstCharInfo.yt;
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('youtube','Play','Gacha_'+this.curGacha,this.M.gGlb('playCount'));
		}
	},
	tw:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curFirstCharInfo.tw;
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('twitter','Play','Gacha_'+this.curGacha,this.M.gGlb('playCount'));
		}
	},
	again:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnPlay',{volume:1});
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('again','Play','Gacha_'+this.curGacha,this.M.gGlb('playCount'));
		}
	},
	othergames:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=__VTUBER_GAMES;
			if(this.curLang=='en')url+='?lang=en';
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('othergames','Play','Gacha_'+this.curGacha,this.M.gGlb('playCount'));
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var e='🎮🍲🎈🍲🎈🍲🎮';
			var res=
				this.curWords.SelectTw+this.curFirstCharInfo.cName+'\n'+
				'Level: '+(this.curLevel==21?'MAX':this.curLevel)+'\n'+
				this.curWords.Score+this.formatScore()+'\n';
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			this.M.H.tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','Gacha_'+this.curGacha,this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnBtn',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectChar')},this);
			this.Tween.start();
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
		var s=this.M.S.genTxt(this.world.centerX,-this.world.centerY,this.curWords.Start,txtstyl);
		var twA=this.M.T.moveA(s,{xy:{y:this.world.centerY},duration:800});
		var twB=this.add.tween(s).to({y:this.world.height*1.5},600,Phaser.Easing.Back.In,!1,300);
		twA.chain(twB);
		twA.start();
		twA.onComplete.add(function(){this.inputEnabled=!0},this);
		twA.onComplete.add(function(){this.destroy},s);
		this.M.SE.play('GenStart',{volume:1});
		this.HUD.visible=!0;
		this.start();
	},
};