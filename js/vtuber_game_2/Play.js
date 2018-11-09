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
		this.twCount=0;
		this.gachaCount=1;
		this.overallRate=0;
		this.overallRateOneCard=0;

		// Obj
		this.PlayB=this.PlayTenB=this.SkipB=this.LargeCardS=this.ResS=
		this.WPS=this.MoveCardS=this.ResPanel=
		null;
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!1;
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000';
		this.genContents();
		this.start();//TODO
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
		this.initGacha();
		//TODO
		this.add.sprite(0,0,'TWP').tint=0xf0f0f0;//TODO del

		// TODO
		this.MoveCardS=this.add.sprite(this.world.centerX,this.world.height,'todo_1');
		this.MoveCardS.width=80;
		this.MoveCardS.height=80;
		this.MoveCardS.anchor.setTo(.5)//TODO del

		this.PlayB=this.M.S.genLbl(this.world.width*.25,this.world.centerY,this.playGacha,'PlayGacha1');
		this.PlayB.gachaCount=1;
		this.PlayTenB=this.M.S.genLbl(this.world.width*.75,this.world.centerY,this.playGacha,'PlayGacha10');
		this.PlayTenB.gachaCount=10;

		this.SkipB=this.M.S.genLbl(this.world.width*.75,this.world.height*.8,this.skip,'Skip');
		this.SkipB.visible=!1;

		this.genRes();

		this.LargeCardS=this.add.sprite(this.world.centerX,this.world.centerY,'todo_1');
		this.LargeCardS.anchor.setTo(.5);
		this.LargeCardS.visible=!1;

		this.WPS=this.add.sprite(this.world.width,0,'WP');

		this.genResPanel();


		// TODO res btn gen / visible!1

		//TODO skip btn on off
	},
	initGacha:function(){
		for(var k in this.curGachaInfo.rate)this.overallRate+=this.curGachaInfo.rate[k];
		// for(var k in this.GachaInfo[3].oneCard)this.overallRateOneCard+=this.GachaInfo[3].oneCard[k];return;//TODO del -------
		if(this.curGachaInfo.oneCard)for(var k in this.curGachaInfo.oneCard)this.overallRateOneCard+=this.curGachaInfo.oneCard[k];
	},
	genResPanel:function(){
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
	},
	playGacha:function(b){
		// for(i=0;i<500;i++)console.log('UR'==this.gachaSystem(this.curGachaInfo.rate,this.overallRate));return;/// TODO del -------------	
		// for(i=0;i<500;i++)console.log(this.gachaSystem(this.GachaInfo[3].oneCard,this.overallRateOneCard));return;/// TODO del -------------	
		this.PlayB.visible=!1;
		this.PlayTenB.visible=!1;
		this.SkipB.visible=!0;
		this.gachaCount=b.gachaCount;

		this.gachaSystem(this.curGachaInfo.rate);
		// this.ResPanel.forEach(function(s){
			//TODO change image
		// },this);

		this.twCount=0;
		this.repeatCard();
	},
	gachaSystem:function(items,overallRate){
		var target=this.rnd.between(1,overallRate);
		for(var k in items){
			var checkRate=items[k];
			if(target<=checkRate){
				return k;
			}else{
				target-=checkRate;
			}
		}
		return 'N';
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
			this.LargeCardS.visible=!0;
		
			twD.onComplete.add(this.showRare,this);
		}else{
			this.ResPanel.visible=!0;
		}
	},
	showRare:function(){
		var s=this.add.sprite(this.world.width,300,'todo_2');
		var tw=this.M.T.moveA(s,{xy:{x:this.world.centerX},delay:200});//TODO tw chng
		tw.start();
		tw.onComplete.add(function(){
			//TODO SE
			console.log('BOMB');
			//TODO next play OK
			this.ResS.visible=!0;
		},this);
	},
	gameOver:function(){
		this.end();
		this.genEnd();
	},
	zoomCard:function(b){
		// console.log(b.panelNum);
		var card=this.ResPanel.children[b.panelNum];
		this.LargeCardS.loadTexture(card.key);
		this.LargeCardS.visible=!0;
		
		this.ResS.visible=!0;
	},
	////////////////////////////////////////////////////////////////////////////////////
	genRes:function(){
		var s=this.add.sprite(0,0,'TWP');
		s.tint=0x000000;

		var lbl,txtstyl=this.M.S.txtstyl(40);

		txtstyl=this.M.S.txtstyl(25);

		if(1){//TODO if 10
			txtstyl.fill=txtstyl.mStroke='#ffa500';
			lbl=this.M.S.genLbl(this.world.width*.75,this.world.height*.15,this.closeDialog,this.curWords.Close);
			lbl.tint=0xffa500;
			s.addChild(lbl);
		}

		txtstyl.fill=txtstyl.mStroke='#00fa9a';
		lbl=this.M.S.genLbl(this.world.width*.25,this.world.height*.75,this.again,this.curWords.Again,txtstyl);
		lbl.tint=0x00fa9a;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#00a2f8';
		lbl=this.M.S.genLbl(this.world.width*.75,this.world.height*.75,this.tweet,this.curWords.TwBtn,txtstyl);
		lbl.tint=0x00a2f8;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#8a2be2';
		lbl=this.M.S.genLbl(this.world.width*.25,this.world.height*.85,this.back,this.curWords.Back,txtstyl);
		lbl.tint=0x8a2be2;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#ffa500';
		lbl=this.M.S.genLbl(this.world.width*.75,this.world.height*.85,this.gotoCollection,this.curWords.Collection,txtstyl);
		lbl.tint=0xffa500;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#00a2f8';
		lbl=this.M.S.genLbl(this.world.width*.25,this.world.height*.95,this.tw,'Twitter',txtstyl);
		lbl.tint=0x00a2f8;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#ff0000';
		lbl=this.M.S.genLbl(this.world.width*.75,this.world.height*.95,this.yt,'YouTube',txtstyl);
		lbl.tint=0xff0000;
		s.addChild(lbl);

		s.visible=!1;
		this.ResS=s;
	},
	closeDialog:function(){
		//TODO
		this.LargeCardS.visible=!1;
		this.ResS.visible=!1;
	},
	gotoCollection:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			// this.M.SE.play('OnBtn',{volume:1});//TODO
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('CollectionPage')},this);
			this.Tween.start();
		}
	},
	yt:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});//TODO
			var url=this.curFirstCharInfo.yt;
			window.open(url,"_blank");
			myGa('youtube','Play','Gacha_'+this.curGacha,this.M.gGlb('playCount'));
		}
	},
	tw:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});//TODO
			var url=this.curFirstCharInfo.tw;
			window.open(url,"_blank");
			myGa('twitter','Play','Gacha_'+this.curGacha,this.M.gGlb('playCount'));
		}
	},
	again:function(){
		//TODO goto play or again function
		if(this.inputEnabled&&!this.Tween.isRunning){
			// this.M.SE.play('OnPlay',{volume:1});//TODO
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
	tweet:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});//TODO
			var e='***********';//TODO
			var res='********:';//TODO
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			this.M.H.tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','Gacha_'+this.curGacha,this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			// this.M.SE.play('OnBtn',{volume:1});//TODO
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectGacha')},this);
			this.Tween.start();
		}
	},
};