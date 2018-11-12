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
		this.curChar=null;
		this.curCharInfo=null;
		this.UserInfo=this.M.gGlb('UserInfo');
		// Val
		this.onSkip=this.M.gGlb('onSkip');
		this.twCount=0;
		this.gachaCount=1;
		this.overallRate=0;
		this.overallRateOneCard=0;
		this.cards=[];
		this.charsArr=[];
		this.repeatCardCount=0;
		this.rareColor={N:0xa9a9a9,R:0xe9967a,SR:0x0000ff,SSR:0xadff2f,UR:0xff00ff};
		this.curRare=null;
		// Obj
		this.BgS=this.SkipOnOffB=this.CardEff=
		this.FirstHUD=this.CharNameTS=
		this.SkipB=this.LargeCardS=this.ResS=
		this.SlideWPS=this.MoveCardS=this.ResPanel=this.CloseB=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#000';
		this.M.SE.playBGM('TitleBGM',{volume:1});
		this.genContents();
		this.start();
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.initGacha();
		this.genBg();

		this.MoveCardS=this.add.sprite(this.world.centerX,this.world.height*1.5,'hide_card');
		this.MoveCardS.anchor.setTo(.5);

		this.genHUD();
		this.genResPanel();
		this.genRes();
		this.genZoomCard();
		this.genEff();

		this.SlideWPS=this.add.sprite(this.world.width*1.5,0,'SlideWP');
		this.SlideWPS.height=this.world.height;
	},
	initGacha:function(){
		for(var k in this.curGachaInfo.rate)this.overallRate+=this.curGachaInfo.rate[k];
		if(this.curGachaInfo.oneCard)for(var k in this.curGachaInfo.oneCard)this.overallRateOneCard+=this.curGachaInfo.oneCard[k];
		for(var k in this.CharInfo)this.charsArr.push(k);
	},
	genBg:function(){
		this.BgS=this.add.sprite(0,0,'bg_2');
		this.BgS2=this.add.sprite(0,0,'bg_4');
		this.BgS2.alpha=0;
	},
	genHUD:function(){
		this.FirstHUD=this.add.group();

		var colors=['#ffa500','#008000','#ff1493','#9400d3'];
		var ts,txtstyl=this.M.S.txtstyl(40);
		txtstyl.fill=txtstyl.mStroke=colors[this.curGacha-1];
		ts=this.M.S.genTxt(this.world.centerX,this.world.height*.4,this.curGachaInfo.gName,txtstyl);
		this.FirstHUD.add(ts);

		ts=this.M.S.genTxt(this.world.centerX,this.world.height*.5,this.UserInfo.playCount[this.curGacha]+this.curWords.Count,txtstyl);
		this.FirstHUD.add(ts);

		this.genPlayBtns();
		this.genOnOffBtn();
		this.genRareText();

		txtstyl.fontSize=25;
		txtstyl.fill=txtstyl.mStroke='#3cb371';
		this.SkipB=this.M.S.genLbl(this.world.width*.75,this.world.height*.8,this.skip,this.curWords.Skip,txtstyl);
		this.SkipB.visible=!1;
		this.SkipB.tint=0x3cb371;

		var lbl=this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.Back);
		lbl.tint=0xffd700;
		this.FirstHUD.add(lbl);
	},
	genPlayBtns:function(){
		var b,txtstyl=this.M.S.txtstyl(25);
		if(this.overallRateOneCard==0){
			txtstyl.fill=txtstyl.mStroke='#dc143c';
			b=this.M.S.genLbl(this.world.centerX,this.world.height*.7,this.playGacha,this.curWords.PlayGacha1,txtstyl);
			b.tint=0xdc143c;
			b.gachaCount=1;
			this.FirstHUD.add(b);
		}

		txtstyl.fill=txtstyl.mStroke='#dc143c';
		b=this.M.S.genLbl(this.world.centerX,this.world.height*.8,this.playGacha,this.curWords.PlayGacha10,txtstyl);
		b.tint=0xdc143c;
		b.gachaCount=10;
		this.FirstHUD.add(b);
	},
	genOnOffBtn:function(){
		var ts=this.M.S.genTxt(this.world.width*.05,this.world.height*.05,this.curWords.Skip);
		ts.anchor.setTo(.1,.1);
		ts.children[0].anchor.setTo(.1,.1);
		this.FirstHUD.add(ts);

		this.SkipOnOffB=this.add.button(ts.x,ts.bottom,this.onSkip?'skip_on':'skip_off',this.skipSwitch,this);
		this.SkipOnOffB.scale.setTo(.6);
		this.FirstHUD.add(this.SkipOnOffB);
	},
	skipSwitch:function(){
		if(this.onSkip){
			this.onSkip=!1;
			this.SkipOnOffB.loadTexture('skip_off');
		}else{
			this.onSkip=!0;
			this.SkipOnOffB.loadTexture('skip_on');
		}
		this.M.sGlb('onSkip',this.onSkip);
		this.M.SE.play('OnBtn',{volume:1});
	},
	genRareText:function(){
		var s,ts,rares=['N','R','SR','SSR','UR'],
			size=this.world.width*.09,
			mXY=this.world.width*.1;

		for(var i=0;i<5;i++){
			s=this.add.sprite(this.world.width*.6,10+i*mXY,'rare_'+rares[i]);
			s.width=s.height=size;
			this.FirstHUD.add(s);

			ts=this.M.S.genTxt(this.world.width*.6+mXY,10+i*mXY,this.M.H.formatComma(this.UserInfo.haveRare[rares[i]]));
			ts.anchor.setTo(0);
			ts.children[0].anchor.setTo(0);
			this.FirstHUD.add(ts);
		}
	},
	genZoomCard:function(){
		this.LargeCardS=this.add.sprite(this.world.centerX,this.world.height*.4,'1_N');
		this.LargeCardS.anchor.setTo(.5);
		this.LargeCardS.visible=!1;

		this.CardRareS=this.add.sprite(this.LargeCardS.left,this.LargeCardS.top,'');
		this.CardRareS.visible=!1;

		this.CharNameTS=this.M.S.genTxt(this.world.centerX,this.LargeCardS.bottom,'');
		this.CharNameTS.visible=!1;
	},
	genEff:function(){
		this.CardEff=this.add.emitter(0,0,100);
		this.CardEff.makeParticles('CircleBlock');
		this.CardEff.setXSpeed(-500,500);
		this.CardEff.setYSpeed(-500,500);
		this.CardEff.setScale(3,.3,3,.3,800);
		this.CardEff.setAlpha(1,0,800);
		this.CardEff.lifespan=800;
		this.CardEff.x=this.world.centerX;
		this.CardEff.y=this.world.centerY;
	},
	genResPanel:function(){
		this.ResPanel=this.add.group();
		var s,col=0,
			sX=this.world.width*.17,
			mX=this.world.width*.22,
			smX=this.world.width*.07,
			sY=this.world.height*.25,
			mY=this.world.height*.2;
		for(var i=0;i<10;i++){
			if(i<3){
				s=this.add.button(sX+mX*col,sY,'',this.zoomCard,this);
			}else if(i<7){
				if(i==3)col=0;
				s=this.add.button(smX+mX*col,sY+mY,'',this.zoomCard,this);
			}else{
				if(i==7)col=0;
				s=this.add.button(sX+mX*col,sY+mY+mY,'',this.zoomCard,this);
			}
			s.panelNum=i;
			this.ResPanel.add(s);
			s.addChild(this.add.sprite(0,0,''));
			col++;
		}
		this.ResPanel.visible=!1;
		this.ResPanel.y=this.world.height;
	},
	playGacha:function(b){
		if(!this.Tween.isRunning){
			this.FirstHUD.visible=!1;
			this.gachaCount=b.gachaCount;
		
			if(this.gachaCount==1){
				this.cards.push(this.gachaChar(this.curGachaInfo.rate,this.overallRate));
			}else{
				var rnd=this.rnd.between(0,9);
				for(var i=0;i<10;i++){
					if(this.overallRateOneCard>0&&rnd==i){
						var info=this.gachaChar(this.curGachaInfo.oneCard,this.overallRateOneCard);
					}else{
						var info=this.gachaChar(this.curGachaInfo.rate,this.overallRate);
					}
					this.cards.push(info);
					this.ResPanel.children[i].loadTexture(info.cNum+'_'+info.rare);
					this.ResPanel.children[i].width=80;
					this.ResPanel.children[i].height=80;
					this.ResPanel.children[i].children[0].loadTexture('rare_'+info.rare);
					this.ResPanel.children[i].rare=info.rare;
				}
			}

			this.setUserInfo();

			if(this.onSkip)return this.lastShow();	

			this.SkipB.visible=!0;
			this.twCount=0;
			this.repeatCard();
		}
	},
	gachaChar:function(items,overallRate){
		var rare=this.gachaSystem(items,overallRate);
		var cInfos=this.rndChar(rare);
		return {rare:rare,cInfo:cInfos.cInfo,cNum:cInfos.cNum};
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
	rndChar:function(rare){
		var cNum=this.rnd.pick(this.charsArr);
		var cInfo=this.CharInfo[cNum];
		for(var k in cInfo.rare){
			if(cInfo.rare[k]==rare){
				return {cInfo:cInfo,cNum:cNum};
			}
		}
		return this.rndChar(rare);
	},
	setUserInfo:function(){
		for(var k in this.cards){
			var card=this.cards[k];
			if(this.UserInfo.collection[card.cNum][card.rare]==0){
				this.UserInfo.haveKindCards++;
			}
			this.UserInfo.collection[card.cNum][card.rare]++;
			this.UserInfo.haveAllCards++;
			this.UserInfo.haveRare[card.rare]++;
		}
		this.UserInfo.playCount[this.curGacha]+=this.gachaCount;
	},
	repeatCard:function(){
		this.MoveCardS.y=this.world.height;
		var twA=this.M.T.moveB(this.MoveCardS,{xy:{y:this.world.centerY},duration:300});
		var twB=this.M.T.moveB(this.MoveCardS,{xy:{y:-this.MoveCardS.height},duration:300});
		twA.chain(twB);
		twA.start();
		this.Tween=twA;
		twB.onStart.add(function(s,tw){
			this.Tween=tw;
			
			var curRare=this.cards[this.repeatCardCount].rare;
			var tints={tint:this.rareColor[curRare]};
			this.CardEff.forEach(function(e){
				e.tint=this.tint;
			},tints);
			this.CardEff.explode(800,Math.floor(320/this.time.physicsElapsedMS));

			if(curRare=='UR'){
				this.M.SE.play('GetUR',{volume:1});
				this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
			}
		},this);
		twB.onComplete.add(function(){
			this.twCount++;
			if(this.twCount<this.gachaCount){
				this.repeatCardCount++;
				this.repeatCard();
			}else{
				this.slideInWP();
			}
		},this);
		this.M.SE.play('MoveCard',{volume:1});
	},
	slideInWP:function(){
		var twC=this.M.T.moveB(this.SlideWPS,{xy:{x:-this.world.width*.5},duration:800});
		twC.start();
		this.Tween=twC;
		twC.onComplete.add(function(){
			this.lastShow();
		},this);
	},
	skip:function(){
		if(this.Tween.isRunning){
			this.Tween.stop();
			this.lastShow();
		}
	},
	lastShow:function(){
		this.SkipB.visible=!1;
		this.MoveCardS.visible=!1;
		this.BgS.loadTexture('bg_3');

		this.add.tween(this.BgS2).to({alpha:1},1E3,null,!0,500,-1,!0);

		this.world.bringToTop(this.SlideWPS);
		this.SlideWPS.x=-this.world.width*.5;
		var twD=this.M.T.moveA(this.SlideWPS,{xy:{x:-this.world.width*2},delay:300});
		twD.start();
		this.Tween=twD;

		if(this.gachaCount==1){
			var info=this.cards[0];
			this.CloseB.visible=!1;
			this.LargeCardS.visible=!0;
			this.LargeCardS.loadTexture(info.cNum+'_'+info.rare);
			this.CharNameTS.visible=!0;
			this.CharNameTS.changeText(info.cInfo.cName);

			this.curChar=info.cNum;
			this.curCharInfo=info.cInfo;
			this.curRare=info.rare;

			twD.onComplete.add(this.showRare,this);
		}else{
			this.ResPanel.visible=!0;
			var tw=this.M.T.moveA(this.ResPanel,{xy:{y:0}});
			tw.start();
			tw.onComplete.add(function(){
				this.M.SE.play('StopRare',{volume:1});
				this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
			},this);
		}
		this.M.SE.play('LastShow',{volume:1});
	},
	showRare:function(){
		this.CardRareS.x=this.world.width;
		this.CardRareS.loadTexture('rare_'+this.cards[0].rare);
		this.CardRareS.visible=!0;
		var tw=this.M.T.moveA(this.CardRareS,{xy:{x:this.LargeCardS.left},delay:200});
		tw.start();
		tw.onComplete.add(function(){
			this.M.SE.play('StopRare',{volume:1});
			this.ResS.visible=!0;
			this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
		},this);
	},
	zoomCard:function(b){
		var card=this.ResPanel.children[b.panelNum];
		var cInfo=this.cards[b.panelNum].cInfo;

		this.LargeCardS.loadTexture(card.key);
		this.LargeCardS.visible=!0;
		
		this.CardRareS.loadTexture(card.children[0].key);
		this.CardRareS.visible=!0;

		this.CharNameTS.changeText(cInfo.cName);
		this.CharNameTS.visible=!0;

		this.curChar=this.cards[b.panelNum].cNum;
		this.curCharInfo=cInfo;
		this.curRare=card.rare;
		
		this.ResS.visible=!0;
		this.M.SE.play('OnCollection',{volume:1});
	},
	genRes:function(){
		var s=this.add.sprite(0,0,'TWP');

		var lbl,txtstyl=this.M.S.txtstyl(25);

		txtstyl.fill=txtstyl.mStroke='#ffa500';
		this.CloseB=this.M.S.genLbl(this.world.width*.75,this.world.height*.05,this.closeDialog,this.curWords.Close);
		this.CloseB.tint=0xffa500;
		s.addChild(this.CloseB);

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
		this.LargeCardS.visible=!1;
		this.ResS.visible=!1;
		this.CardRareS.visible=!1;
		this.CharNameTS.visible=!1;
		this.M.SE.play('OnBack',{volume:1});
	},
	gotoCollection:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnBtn',{volume:1});
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
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curCharInfo.yt;
			window.open(url,"_blank");
			myGa('youtube','Play','Gacha_'+this.curGacha+':Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	tw:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curCharInfo.tw;
			window.open(url,"_blank");
			myGa('twitter','Play','Gacha_'+this.curGacha+':Char_'+this.curChar,this.M.gGlb('playCount'));
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
			myGa('again','Play','Gacha_'+this.curGacha,this.M.gGlb('playCount'));
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var e='💸💸💸💸💸💸';
			var res=this.curWords.TwSelectChar+this.curRare+' '+this.curCharInfo.cName+'\n';

			for(var k in this.UserInfo.playCount){
				var playCount=this.UserInfo.playCount[k];
				if(playCount>0){
					res+=this.GachaInfo[k].gName+': '+playCount+this.curWords.Count+'\n';
				}
			}

			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			this.M.H.tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','Gacha_'+this.curGacha+':Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnBtn',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectGacha')},this);
			this.Tween.start();
		}
	},
};