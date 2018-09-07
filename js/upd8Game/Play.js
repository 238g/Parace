BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];

		// this.curChar=this.M.gGlb('curChar');
		this.CharInfo=this.M.gGlb('CharInfo');
		// this.curCharInfo=this.CharInfo[this.curChar];

		// Val
		this.oneSelected=!1;
		this.panelsY=50;
		this.gotCardsCount=0;
		this.falseCount=0;
		this.clearTimer=0;
		this.clearTime=0;
		this.firstGotCardId=0;
		// Obj
		this.FirstSelecter=this.SecoundSelecter=
		this.FirstSelectedTS=this.SecoundSelectedTS=
		this.FalseCardsTS=this.FrameS=
		null;
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		// this.M.SE.playBGM('PlayBGM',{volume:1});
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000';
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
		this.start();
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.end,this);
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
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
		var panels=this.add.group();
		var size=60;
		for(var i=0;i<5;i++){
			for(var j=0;j<6;j++){
				var card=cards[cardCount];
				var panel=this.add.button(0,0,'Card0',this.selectPanel,this);
				panel.cId=card.cId;
				panels.add(panel);
				cardCount++;
			}
		}
		panels.align(5,6,size+10,size+20);
		panels.alignIn(this.world.bounds,Phaser.CENTER,0,-this.panelsY);
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
		}
	},
	checkCards:function(){
		this.inputEnabled=!1;

		if(true){ // TODO del
		// if(this.FirstSelecter.cId==this.SecoundSelecter.cId){
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
			},this);

			this.gotCardsCount++;

			if(!this.firstGotCardId)this.firstGotCardId=this.SecoundSelecter.cId;
		}else{
			this.time.events.add(200,function(){
				this.FalseCardsTS.visible=!0;
				this.time.events.add(600,this.nextTurn,this);
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

	/////////////
	genEnd:function(){
		this.end();
		return; // TODO
		var ts=this.M.S.genTxt(this.world.width*1.5,this.world.centerY,txt,this.M.S.txtstyl(50));
		var tw=this.M.T.moveA(ts,{xy:{x:this.world.centerX},delay:500});
		tw.onComplete.add(this.genRes,this);
		tw.start();
		this.endTxt=txt;
		this.HUD.add(ts);
	},
	genRes:function(){
		// TODO
		this.time.events.add(500,function(){
			this.HUD.destroy();
			var s=this.add.sprite(-this.world.width,0,'TWP');
			s.tint=0x000000;
			var tw=this.M.T.moveA(s,{xy:{x:0}});
			tw.onComplete.add(function(){
				this.inputEnabled=!0;
				if((this.curStg==1||this.curStg==2||this.curStg==3)&&this.clearFlag){
					this.M.S.genLbl(this.world.width*.25,this.world.height*.6,this.nextStg,this.curWords.NextStg);
				}else{
					this.M.S.genLbl(this.world.width*.25,this.world.height*.6,this.again,this.curWords.Again);
				}
				this.M.S.genLbl(this.world.width*.75,this.world.height*.6,this.tweet,this.curWords.Tweet);
				this.M.S.genLbl(this.world.width*.25,this.world.height*.72,this.othergames,this.curWords.OtherGames);
				this.M.S.genLbl(this.world.width*.75,this.world.height*.72,this.back,this.curWords.Back);
				this.add.button(this.world.centerX,this.world.height*.9,'YouTube',this.yt,this).anchor.setTo(.5);
			},this);
			tw.start();

			var osamu=this.add.sprite(this.world.width*.05,this.world.centerY,'Osamu_1');
			osamu.anchor.setTo(0,.5);
			s.addChild(osamu);

			var hiroshi=this.add.sprite(this.world.width*.95,this.world.centerY,'Hiroshi_1');
			hiroshi.anchor.setTo(1,.5);
			s.addChild(hiroshi);

			var txtstyl=this.M.S.txtstyl(35);
			txtstyl.fill=txtstyl.mStroke='#FF0040';
			s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.15,this.curWords.Result,txtstyl));
			if(this.curStageInfo.mode==1){
				txtstyl.fontSize=50;
				s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.35,this.endTxt,txtstyl));
			}else if(this.curStageInfo.mode==2){
				s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.35,this.curWords.CurScore+this.M.H.formatComma(this.score),txtstyl));
			}else{
				s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.35,this.curWords.CurScore+this.M.H.formatComma(this.score),txtstyl));
			}

			this.M.SE.play('ResOpen',{volume:1.5});
		},this);
	},
	again:function(){
		// TODO
		if(!this.Tween.isRunning){
			this.inputEnabled=!1;

			if(this.curChar==3){
				this.M.SE.play('DecoBeam',{volume:1.5});
			}else{
				this.M.SE.play('Banana_1',{volume:1.5});
			}

			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			myGa('restart','Play','playCount_'+this.M.gGlb('playCount'),this.M.gGlb('playCount'));
		}
	},
	back:function(){
		// TODO
		if(!this.Tween.isRunning){
			this.inputEnabled=!1;
			this.M.SE.play('OnBtn',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectStage')},this);
			this.Tween.start();
		}
	},
	yt:function(){
		// this.M.SE.play('OnBtn',{volume:1});
		var url=this.CharInfo[this.firstGotCardId].yt;
		this.game.device.desktop?window.open(url,"_blank"):location.href=url;
		myGa('youtube','Play','char_'+this.firstGotCardId,this.M.gGlb('playCount'));
	},
	tweet:function(){
		// this.M.SE.play('OnBtn',{volume:1});

		var e='🙌🙌🙌🙌🙌🙌';
		var res=this.curWords.TweetFirstGotCard+this.CharInfo[this.firstGotCardId].cName+'\n'+
				this.curWords.TweetFalseCount+this.falseCount+'\n'+
				this.curWords.TweetClearTime+this.clearTime+'\n';
		var txt=e+'\n'+this.curWords.TweetTtl+'\n'+res+te+'\n';
		this.M.H.tweet(txt,this.curWords.TweetHT,location.href);
		myGa('tweet','Play','char_'+this.firstGotCardId,this.M.gGlb('playCount'));
	},
	othergames:function(){
		// this.M.SE.play('OnBtn',{volume:1});
		this.game.device.desktop?window.open(__VTUBER_GAMES,"_blank"):location.href=__VTUBER_GAMES;
		myGa('othergames','Play','char_'+this.firstGotCardId,this.M.gGlb('playCount'));
	},
	genTut:function(){
		// TODO
		this.HowToS=this.add.sprite(0,0,'TWP');
		this.HowToS.tint=0x000000;
		var tsA=this.M.S.genTxt(this.world.centerX,this.world.height*.35,this.curWords['HowTo_'+this.curStageInfo.mode]+this.curWords.HowTo_A);
		this.HowToS.addChild(tsA);
		this.time.events.add(500,function(){
			this.input.onDown.addOnce(function(){
				this.HowToS.destroy();
				this.genStart();
			},this);
		},this);

		var tsB=this.M.S.genTxt(this.world.width*.3,tsA.bottom,this.curWords.GoodItem);
		this.HowToS.addChild(tsB);
		var lg=this.add.group();
		lg.x=this.world.width*.1;
		lg.y=tsB.bottom;
		this.HowToS.addChild(lg);

		var arrA=this.StageInfo[8].noteKeys;
		for(var k in arrA){
			var img=arrA[k];
			var s=this.add.sprite(0,0,img);
			lg.add(s);
		}
		lg.align(3,3,50,60);

		var tsC=this.M.S.genTxt(this.world.width*.7,tsA.bottom,this.curWords.BadItem);
		this.HowToS.addChild(tsC);
		var rg=this.add.group();
		rg.x=this.world.width*.5;
		rg.y=tsC.bottom;
		this.HowToS.addChild(rg);

		var arrB=this.StageInfo[8].obstacleKeys;
		for(var k in arrB){
			var img=arrB[k];
			var s=this.add.sprite(0,0,img);
			rg.add(s);
		}
		rg.align(3,3,50,60);
	},
	genStart:function(){
		// TODO
		this.StartTS=this.M.S.genTxt(this.world.centerX,this.world.centerY,this.curWords.Start,this.M.S.txtstyl(50));
		this.StartTS.scale.setTo(0);
		var tw=this.M.T.popUpB(this.StartTS);
		tw.start();
		tw.onComplete.add(function(){
			this.time.events.add(300,function(){
				this.StartTS.destroy();
				this.start();
			},this);
		},this);
	},
};