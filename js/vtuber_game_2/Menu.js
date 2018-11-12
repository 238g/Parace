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
		this.M.SE.playBGM('TitleBGM',{volume:1});
		
		var title=this.add.sprite(this.world.centerX,this.world.height*.22,'Title');
		title.anchor.setTo(.5);

		this.genEff();

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
BasicGame.SelectGacha=function(){};
BasicGame.SelectGacha.prototype={
	init:function(){
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.GachaInfo=this.M.gGlb('GachaInfo');
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});
		this.add.sprite(0,0,'bg_1');
		this.genGacha();

		this.M.S.genTxt(this.world.centerX,this.world.height*.07,this.curWords.SelectGacha,this.M.S.txtstyl(35));

		this.M.S.genLbl(this.world.centerX,this.world.height*.85,this.showCollection,this.curWords.Collection).tint=0xffd700;

		this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.Back).tint=0xffd700;
		this.genHUD();
	},
	genGacha:function(){
		var lX=this.world.width*.25,
			rX=this.world.width*.75,
			sY=this.world.height*.28,
			mY=this.world.height*.33,
			row=0,
			txtstyl=this.M.S.txtstyl(25);
		var colors=['#ffa500','#008000','#ff1493','#9400d3'];
		for(var k in this.GachaInfo){
			var info=this.GachaInfo[k];
			var even=k%2;
			var b=this.add.button(even==0?rX:lX,sY+mY*row,'gacha_'+k,this.play,this);
			b.anchor.setTo(.5);
			b.gacha=k;
			txtstyl.fill=txtstyl.mStroke=colors[k-1];
			this.M.S.genTxt(b.x,b.bottom,info.gName,txtstyl);
			if(even==0)row++;
		}
	},
	play:function(b){
		if (!this.Tween.isRunning) {
			this.M.sGlb('curGacha',b.gacha);
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('play','SelectGacha','Gacha_'+b.gacha,this.M.gGlb('playCount'));
			this.M.SE.play('OnStart',{volume:1});
		}
	},
	showCollection:function(){
		if(!this.Tween.isRunning){
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('CollectionPage')},this);
			this.Tween.start();
			this.M.SE.play('OnBtn',{volume:1});
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
			this.M.SE.play('OnBack',{volume:1});
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0x000000;
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};
////////////////////////////////////////////////////////////////////////////////////////////////////////
BasicGame.CollectionPage=function(){};
BasicGame.CollectionPage.prototype={
	init:function(){
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.UserInfo=this.M.gGlb('UserInfo');
		this.CharInfo=this.M.gGlb('CharInfo');
		this.GachaInfo=this.M.gGlb('GachaInfo');
		//Val
		this.charInfoLen=Object.keys(this.CharInfo).length;
		this.colMax=3;
		this.rowMax=4;
		this.maxPage=Math.ceil(this.UserInfo.allCards/(this.colMax*this.rowMax));
		this.curPage=1;
		this.baseFrameSize=this.world.width/3-20;
		this.curRare=null;
		//Obj
		this.TileS=this.LeftB=this.RightB=
		this.WPS=this.CharS=this.CharNameTS=
		this.PageTS=this.RareS=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});

		this.TileS=this.add.tileSprite(0,0,this.world.width*this.maxPage,this.world.height,'bg_1');
		this.TileS.tint=0xeeeeee;

		this.genPanels();
		this.genArrowBtn();

		this.PageTS=this.M.S.genTxt(this.world.centerX,this.world.height*.82,this.genPageText(),this.M.S.txtstylS(20));
		this.M.S.genTxt(this.world.centerX,this.world.height*.88,this.curWords.Card+':'+this.UserInfo.haveKindCards+'/'+this.UserInfo.allCards,this.M.S.txtstylS(20));

		this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.Back).tint=0xffd700;
		this.genHUD();
		this.genDialog();
	},
	genPanels:function(){
		var arr=[];
		for(var i=1;i<=this.charInfoLen;i++)arr.push(i);
		Phaser.ArrayUtils.shuffle(arr);

		var rest,charNum,b,
			sX=10,
			sY=this.world.height*.05,
			mX=this.world.width/3,
			mY=this.world.width*.3,
			row=0,
			count=0;
		for(var k in arr){
			charNum=arr[k];
			for(var l in this.CharInfo[charNum].rare){
				rest=count%this.colMax;
				var rare=this.CharInfo[charNum].rare[l];
				if(this.UserInfo.collection[charNum][rare]>0){
					b=this.add.button(mX*rest+sX,mY*row+sY,charNum+'_'+rare,this.openDialog,this);
				}else{
					b=this.add.button(mX*rest+sX,mY*row+sY,'hide_card',this.openDialog,this);
					b.inputEnabled=!1;
				}
				b.width=this.baseFrameSize;
				b.height=this.baseFrameSize;
				b.charNum=charNum;
				b.panelNum=(count+1);
				b.rare=rare;
				this.TileS.addChild(b);
				if(rest==this.colMax-1)row++;
				if(row==this.rowMax){
					row=0;
					sX+=this.world.width;
				}
				count++;
			}
		}
	},
	genArrowBtn:function(){
		this.LeftB=this.add.button(this.world.width*.1,this.world.height*.85,'GameIconsWhite',this.page,this,'arrowLeft','arrowLeft','arrowLeft','arrowLeft');
		this.LeftB.tint=0x228b22;
		this.LeftB.anchor.setTo(.5);
		this.LeftB.fn='left';
		this.LeftB.visible=!1;
		this.RightB=this.add.button(this.world.width*.9,this.world.height*.85,'GameIconsWhite',this.page,this,'arrowRight','arrowRight','arrowRight','arrowRight');
		this.RightB.tint=0x228b22;
		this.RightB.anchor.setTo(.5);
		this.RightB.fn='right';
	},
	page:function(b){
		if(!this.Tween.isRunning&&!this.WPS.visible){
			if(b.fn=='right'){
				if(this.curPage!=this.maxPage){
					this.Tween=this.M.T.moveB(this.TileS,{xy:{x:'-'+this.world.width},duration:500});
					this.Tween.start();
					this.curPage++;
					if(!this.LeftB.visible)this.LeftB.visible=!0;
					if(this.curPage==this.maxPage)this.RightB.visible=!1;
				}
			}else{
				if(this.curPage!=1){
					this.Tween=this.M.T.moveB(this.TileS,{xy:{x:'+'+this.world.width},duration:500});
					this.Tween.start();
					this.curPage--;
					if(!this.RightB.visible)this.RightB.visible=!0;
					if(this.curPage==1)this.LeftB.visible=!1;
				}
			}
			this.M.SE.play('Slide',{volume:1});
			this.PageTS.changeText(this.genPageText());
		}
	},
	genPageText:function(){
		return this.curWords.Page+':'+this.curPage+'/'+this.maxPage;
	},
	genDialog:function(){
		this.WPS=this.add.sprite(0,0,'70TWP');
		this.WPS.visible=!1;
		this.WPS.tint=0x000000;

		this.CharS=this.add.sprite(this.world.centerX,this.world.height*.4,'1_N');
		this.CharS.anchor.setTo(.5);
		this.WPS.addChild(this.CharS);

		this.CharNameTS=this.M.S.genTxt(this.world.centerX,this.CharS.bottom,'',this.M.S.txtstyl(35));
		this.WPS.addChild(this.CharNameTS);

		this.RareS=this.add.sprite(this.CharS.left,this.CharS.top,'');
		this.WPS.addChild(this.RareS);

		var lbl,txtstyl=this.M.S.txtstyl(25);

		txtstyl.fill=txtstyl.mStroke='#ffa500';
		lbl=this.M.S.genLbl(this.world.width*.75,this.world.height*.05,this.closeDialog,this.curWords.Close,txtstyl);
		lbl.tint=0xffa500;
		this.WPS.addChild(lbl);
		
		txtstyl.fill=txtstyl.mStroke='#008000';
		lbl=this.M.S.genLbl(this.world.width*.25,this.world.height*.8,this.download,this.curWords.Download,txtstyl);
		lbl.tint=0x008000;
		this.WPS.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#00a2f8';
		lbl=this.M.S.genLbl(this.world.width*.75,this.world.height*.8,this.tweet,this.curWords.TwBtnB,txtstyl);
		lbl.tint=0x00a2f8;
		this.WPS.addChild(lbl);

		lbl=this.M.S.genLbl(this.world.width*.25,this.world.height*.9,this.tw,'Twitter',txtstyl);
		lbl.tint=0x00a2f8;
		this.WPS.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#ff0000';
		lbl=this.M.S.genLbl(this.world.width*.75,this.world.height*.9,this.yt,'YouTube',txtstyl);
		lbl.tint=0xff0000;
		this.WPS.addChild(lbl);
	},
	openDialog:function(b){
		if(!this.WPS.visible){
			var charNum=b.charNum;
			this.curRare=b.rare;
			this.curChar=charNum;
			this.curCharInfo=this.CharInfo[charNum];

			this.curPanel=b.panelNum;
			//// var panel=this.TileS.children[b.panelNum-1];
			
			this.CharS.loadTexture(b.key);
			this.CharNameTS.changeText(this.curCharInfo.cName);
			this.RareS.loadTexture('rare_'+this.curRare);

			this.WPS.visible=!0;
			this.M.SE.play('OnCollection',{volume:1});
		}
	},
	closeDialog:function(){
		if(this.curPanel>-1){
			//// var panel=this.TileS.children[this.curPanel];
			this.M.SE.play('OnBack',{volume:1});
		}
		this.WPS.visible=!1;
	},
	back:function(){
		if(!this.Tween.isRunning&&!this.WPS.visible){
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectGacha')},this);
			this.Tween.start();
			this.M.SE.play('OnBack',{volume:1});
		}
	},
	download:function(){
		var img=this.curChar+'_'+this.curRare;
		var a=document.createElement('a');
		a.href='images/vtuber_game_2/chars/'+img+'.jpg';
		a.target='_blank';
		a.download=this.curCharInfo.cName+this.curRare+'.jpg';
		a.click();
		this.M.SE.play('OnBtn',{volume:1});
		myGa('download','Collection','Char_'+this.curChar,this.M.gGlb('playCount'));
	},
	tweet:function(){
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
		myGa('tweet','Collection','Char_'+this.curChar,this.M.gGlb('playCount'));
	},
	yt:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url=this.curCharInfo.yt;
		window.open(url,"_blank");
		myGa('youtube','Collection','Char_'+this.curChar,this.M.gGlb('playCount'));
	},
	tw:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url=this.curCharInfo.tw;
		window.open(url,"_blank");
		myGa('twitter','Collection','Char_'+this.curChar,this.M.gGlb('playCount'));
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0x000000;
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};