BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.CharInfo=this.M.gGlb('CharInfo');
		// Val
		this.oneSelected=!1;
		this.panelsY=50;
		this.gotCardsCount=0;
		this.falseCount=0;
		this.clearTimer=0;
		this.clearTime=0;
		this.firstGotCharInfo=null;
		// Obj
		this.Panels=
		this.FirstSelecter=this.SecoundSelecter=
		this.FirstSelectedTS=this.SecoundSelectedTS=
		this.FalseCardsTS=this.FrameS=
		this.EndTS=
		null;
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});
		this.genContents();
		this.tut();
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			if(this.clearTimer<0){
				this.clearTimer=1E3;
				this.clearTime++;
			}
			this.clearTimer-=this.time.elapsed
		}
	},
	tut:function(){
		if(this.M.gGlb('endTut')){
			this.genStart();
		}else{
			this.M.sGlb('endTut',!0);
			this.genTut();
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.genEnd,this);
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.add.sprite(0,0,'Bg_2');
		this.genPanels();
		this.genHUD();

		this.FrameS=this.add.sprite(this.world.centerX,this.world.centerY,'Frame0');
		this.FrameS.visible=!1;
		this.FrameS.anchor.setTo(.5);
		this.FalseCardsTS=this.M.S.genTxt(this.world.centerX,this.world.centerY,this.curWords.FalseCards,this.M.S.txtstyl(50));
		this.FalseCardsTS.visible=!1;
	},
	genPanels:function(){
		var tmp=[],cards=[];
		for(var k in this.CharInfo)tmp.push(this.CharInfo[k]);
		Phaser.ArrayUtils.shuffle(tmp);
		for(var k in tmp){
			cards.push(tmp[k]);
			cards.push(tmp[k]);
			if(k==14)break;
		}
		Phaser.ArrayUtils.shuffle(cards);
		var cardCount=0;
		this.Panels=this.add.group();
		var size=60;
		for(var i=0;i<5;i++){
			for(var j=0;j<6;j++){
				var card=cards[cardCount];
				var panel=this.add.button(0,0,'Card0',this.selectPanel,this);
				panel.cId=card.cId;
				this.Panels.add(panel);
				cardCount++;
			}
		}
		this.Panels.align(5,6,size+10,size+20);
		this.Panels.alignIn(this.world.bounds,Phaser.CENTER,0,-this.panelsY);
		this.Panels.visible=!1;
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
	selectPanel:function(b){
		if(this.inputEnabled){
			b.inputEnabled=!1;
			var info=this.CharInfo[b.cId];

			var txtstyl=this.M.S.txtstyl(30);
			txtstyl.stroke='#333333';
			txtstyl.fill=info.color;
			txtstyl.mStroke='#fff';

			if(this.oneSelected){
				this.SecoundSelecter=b;
				this.SecoundSelectedTS.visible=!0;
				this.SecoundSelectedTS.changeText(info.cName);
				this.SecoundSelectedTS.changeStyle(txtstyl);
				this.FrameS.loadTexture('Frame'+b.cId);
				this.checkCards();
			}else{
				this.oneSelected=!0;
				this.FirstSelecter=b;
				this.FirstSelectedTS.visible=!0;
				this.FirstSelectedTS.changeText(info.cName);
				this.FirstSelectedTS.changeStyle(txtstyl);
			}

			b.loadTexture('Card'+b.cId);

			this.M.SE.play('CardSlide',{volume:4});
		}
	},
	checkCards:function(){
		this.inputEnabled=!1;

		// if(true){
		if(this.FirstSelecter.cId==this.SecoundSelecter.cId){
			this.FirstSelecter.bringToTop();
			this.SecoundSelecter.bringToTop();
			var x=this.world.centerX-this.FirstSelecter.width;
			var y=this.world.centerY-this.FirstSelecter.height-this.panelsY;
			var twA=this.M.T.moveX(this.FirstSelecter,{xy:{x:x,y:y},duration:500,easing:Phaser.Easing.Cubic.In});
			twA.start();
			var twB=this.M.T.moveX(this.SecoundSelecter,{xy:{x:x,y:y},duration:500,easing:Phaser.Easing.Cubic.In});
			twB.start();
			twB.onComplete.add(function(){
				this.FirstSelecter.visible=this.SecoundSelecter.visible=!1;
				this.FrameS.visible=!0;
				this.FrameS.x=this.world.centerX;
				this.FrameS.y=this.world.centerY;
				this.FrameS.scale.setTo(.24);
				var twC=this.M.T.popUpB(this.FrameS);
				twC.onComplete.add(function(){
					var twD=this.M.T.moveX(this.FrameS,{xy:{x:this.GotCardsCountTS.x,y:this.GotCardsCountTS.y},delay:300,easing:Phaser.Easing.Cubic.InOut});
					twD.onComplete.add(function(){
						this.GotCardsCountTS.changeText(15-this.gotCardsCount);
						this.nextTurn();
					},this);
					twD.start();
					this.M.T.popUpA(this.FrameS,{scale:{x:.01,y:.01},delay:300}).start();
				},this);
				twC.start();
				this.M.SE.play('MatchCard',{volume:1});
			},this);

			this.gotCardsCount++;

			if(!this.firstGotCharInfo)this.firstGotCharInfo=this.CharInfo[this.SecoundSelecter.cId];
		}else{
			this.time.events.add(200,function(){
				this.FalseCardsTS.visible=!0;
				this.time.events.add(600,this.nextTurn,this);
				this.M.SE.play('NoneMatchCard',{volume:1});
			},this);
			this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_HORIZONTAL);
			this.falseCount++;
		}
	},
	nextTurn:function(){
		this.FirstSelectedTS.visible=this.SecoundSelectedTS.visible=
		this.FrameS.visible=this.FalseCardsTS.visible=
		this.oneSelected=!1;

		if(this.gotCardsCount==15)return this.genEnd();

		this.inputEnabled=!0;

		if(this.FirstSelecter.visible&&this.SecoundSelecter.visible){
			this.FirstSelecter.loadTexture('Card0');
			this.SecoundSelecter.loadTexture('Card0');
			this.FirstSelecter.inputEnabled=this.SecoundSelecter.inputEnabled=!0;
		}
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