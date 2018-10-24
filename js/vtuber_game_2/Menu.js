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
		// this.M.SE.playBGM('TitleBGM',{volume:1});

		this.setInitUserInfo();
		
		//TODO
		// var title=this.add.sprite(this.world.centerX,this.world.height*.2,'Title');
		// title.anchor.setTo(.5);

		var txtstyl=this.M.S.txtstyl(25);
		this.M.S.genLbl(this.world.width*.25,this.world.height*.85,this.start,this.curWords.Start,txtstyl).tint=0x00ff00;
		this.M.S.genLbl(this.world.width*.75,this.world.height*.85,this.credit,'Credit',txtstyl).tint=0xffd700;
		
		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	setInitUserInfo:function(){
		var UserInfo=this.M.gGlb('UserInfo');
		if(!UserInfo.setInit){
			UserInfo.setInit=!0;
			var GachaInfo=this.M.gGlb('GachaInfo');
			for(var k in GachaInfo)UserInfo.play[k]=0;
		}
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
				this.Tween.onComplete.add(function(){this.M.NextScene('SelectGacha')},this);
				this.Tween.start();
			}
		} else {
			// this.M.SE.playBGM('TitleBGM',{volume:1});//TODO
			this.inputEnabled=!0;
		}
	},
	credit:function(){
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
BasicGame.SelectGacha=function(){};
BasicGame.SelectGacha.prototype={
	init:function(){
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.GachaInfo=this.M.gGlb('GachaInfo');
		//Val

		//Obj
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});//TODO
		this.genGacha();

		this.M.S.genLbl(this.world.centerX,this.world.height*.85,this.showCollection,this.curWords.Collection);

		this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.Back);
		this.genHUD();
	},
	genGacha:function(){
		var mY=this.world.height*.1,
			sY=this.world.height*.3;
		for(var k in this.GachaInfo){
			var lbl=this.M.S.genLbl(this.world.centerX,mY*k+sY,this.play,k);
			lbl.gacha=k;
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
			// this.M.SE.play('OnPlay',{volume:1});//TODO
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
			// this.M.SE.play('OnCancel',{volume:1});//TODO
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
			// this.M.SE.play('OnCancel',{volume:1});//TODO
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
		//Val
		this.charInfoLen=Object.keys(this.CharInfo).length;
		this.maxPage=Math.ceil(this.charInfoLen/12);//TODO
		this.curPage=1;
		this.baseFrameSize=this.world.width/4-20;

		//Obj
		this.TileS=this.LeftB=this.RightB=
		this.WPS=this.CharS=this.CharNameTS=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});

		this.TileS=this.add.tileSprite(0,0,this.world.width*this.maxPage,this.world.height,'WP');
		this.TileS.tint=0xeeeeee;

		this.genPanels();
		this.genArrowBtn();

		this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.Back);
		this.genHUD();
		this.genDialog();
	},
	genPanels:function(){
		var arr=[];
		for(var i=1;i<=this.charInfoLen;i++)arr.push(i);
		Phaser.ArrayUtils.shuffle(arr);

		var sX=10;
		var sY=this.world.height*.3;
		var mXY=this.world.width/4;
		var col=0;
		var rest;
		var count=0;
		for(var k in arr){
			var charNum=arr[k];
			rest=count%4;
			var b=this.add.button(mXY*rest+sX,mXY*col+sY,'todo_3',this.openDialog,this);
			b.width=this.baseFrameSize;
			b.height=this.baseFrameSize;
			b.charNum=charNum;
			b.panelNum=k;
			this.TileS.addChild(b);
			if(rest==3)col++;
			if(col==3){
				col=0;
				sX+=this.world.width;
			}
			count++;
		}
	},
	genArrowBtn:function(){
		this.LeftB=this.add.button(this.world.width*.1,this.world.height*.85,'GameIconsWhite',this.page,this,'arrowLeft','arrowLeft','arrowLeft','arrowLeft');
		this.LeftB.tint=0x0000cd;
		this.LeftB.anchor.setTo(.5);
		this.LeftB.fn='left';
		this.LeftB.visible=!1;
		this.RightB=this.add.button(this.world.width*.9,this.world.height*.85,'GameIconsWhite',this.page,this,'arrowRight','arrowRight','arrowRight','arrowRight');
		this.RightB.tint=0x0000cd;
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
			// this.M.SE.play('OnBtn',{volume:1});//TODO
		}
	},
	genDialog:function(){
		this.WPS=this.add.sprite(0,0,'70TWP');
		this.WPS.visible=!1;
		this.WPS.tint=0x000000;

		this.CharS=this.add.sprite(this.world.centerX,this.world.height*.4,'');
		this.CharS.anchor.setTo(.5);
		this.WPS.addChild(this.CharS);

		this.CharNameTS=this.M.S.genTxt(this.world.centerX,this.world.height*.18,'AAAAAA',this.M.S.txtstyl(40));
		this.WPS.addChild(this.CharNameTS);

		// var txtstyl=this.M.S.txtstyl(25);
		// txtstyl.align='left';

		this.WPS.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.8,this.closeDialog,this.curWords.Close));
		this.WPS.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.9,this.tw,'Twitter'));
		this.WPS.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.9,this.yt,'YouTube'));
	},
	openDialog:function(b){
		if(!this.WPS.visible){
			var charNum=b.charNum;
			this.curChar=charNum;
			this.curCharInfo=this.CharInfo[charNum];

			this.curPanel=b.panelNum;
			var panel=this.TileS.children[b.panelNum];
			panel.tint=0x555555;
			panel.inputEnabled=!1;
			
			this.CharS.loadTexture(b.key);
			// this.CharNameTS.changeText(this.curCharInfo.cName);

			this.WPS.visible=!0;
			// this.M.SE.play('OnPanel',{volume:1});//TODO
		}
	},
	closeDialog:function(){
		if(this.curPanel>-1){
			var panel=this.TileS.children[this.curPanel];
			panel.tint=0xffffff;
			panel.inputEnabled=!0;
			// this.M.SE.play('OnCancel',{volume:1});//TODO
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
			// this.M.SE.play('OnCancel',{volume:1});//TODO
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0x000000;
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};