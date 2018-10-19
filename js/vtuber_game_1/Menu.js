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
		// this.M.SE.playBGM('TitleBGM',{volume:1});//TODO
		
		var title=this.add.sprite(this.world.centerX,this.world.height*.92,'Title');
		title.anchor.setTo(.5);

		this.M.S.genLbl(this.world.width*.25,this.world.height*.8,this.start,this.curWords.Start,this.M.S.txtstyl(25));
		
		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
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
				this.Tween.onComplete.add(function(){this.M.NextScene('SelectChar')},this);
				this.Tween.start();
			}
		} else {
			// this.M.SE.playBGM('TitleBGM',{volume:1});//TODO
			this.inputEnabled=!0;
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0x000000;
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};
////////////////////////////////////////////////////////////////////////////////////////////////////////
BasicGame.SelectChar=function(){};
BasicGame.SelectChar.prototype={
	init:function(){
		this.CharInfo=this.M.gGlb('CharInfo');
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		//Val
		this.curChar=1;
		this.curCharInfo=null;
		this.charInfoLen=Object.keys(this.CharInfo).length;
		this.maxPage=Math.ceil(this.charInfoLen/12);
		this.curPage=1;
		this.setCharList={1:null,2:null,3:null,4:null};
		this.curPanel=-1;
		//Obj
		this.StartL=this.TileS=this.LeftB=this.RightB=
		this.WPS=this.CharS=this.CharNameTS=this.SetLbl=this.AbilityTS=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});//TODO
		this.M.sGlb('curCharList',this.setCharList);//TODO reset ??? or first set...

		this.TileS=this.add.tileSprite(0,0,this.world.width*this.maxPage,this.world.height,'WP');
		this.TileS.tint=0x00ff00;

		var txtstyl=this.M.S.txtstyl(40);//TODO color
		this.M.S.genTxt(this.world.centerX,this.world.height*.065,this.curWords.Select,txtstyl);

		this.genFrames();
		this.genPanels();
		this.genArrowBtn();

		this.StartL=this.M.S.genLbl(this.world.centerX,this.world.height*.85,this.play,this.curWords.Start);
		this.StartL.visible=!1;
		this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.Back);

		this.genHUD();
		this.genDialog();
	},
	genFrames:function(){
		this.FrameCharGroup=this.add.group();
		var y=this.world.height*.2;
		for(var i=0;i<4;i++){
			var x=i*100+50;
			var f=this.M.S.genBmpSqrSp(x,y,90,90,'#fff');//TODO
			f.anchor.setTo(.5);
			f.tint=Phaser.Color.getRandomColor();//TODO del
			var b=this.add.button(x,y,'',this.unsetChar,this);//TODO
			b.anchor.setTo(.5);
			b.visible=!1;
			this.FrameCharGroup.add(b);
		}
		this.world.bringToTop(this.FrameCharGroup);
	},
	genPanels:function(){
		var arr=[];
		for(var i=1;i<=this.charInfoLen;i++)arr.push(i);
		Phaser.ArrayUtils.shuffle(arr);

		//// special
		var posArr=[];
		for(var i=0;i<this.charInfoLen;i++){
			if(arr[i]==2||arr[i]==3||arr[i]==4){
				posArr.push(i);
			}
		}
		var specialPos=[
			this.rnd.between(0,3),
			this.rnd.between(4,7),
			this.rnd.between(8,11)
		];
		Phaser.ArrayUtils.shuffle(specialPos);
		for(var k in posArr){
			var tmp=arr[specialPos[k]];
			arr[specialPos[k]]=arr[posArr[k]];
			arr[posArr[k]]=tmp;
		}
		//// special

		var sX=10;
		var sY=this.world.height*.3;
		var mXY=this.world.width/4;
		var col=0;
		var rest;
		var count=0;
		for(var k in arr){
			rest=count%4;
			var b=this.add.button(mXY*rest+sX,mXY*col+sY,'todo_1',this.openDialog,this);//TODO
			b.tint=Phaser.Color.getRandomColor();//TODO del
			b.charNum=arr[k];
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
		this.LeftB.tint=0x000000;
		this.LeftB.anchor.setTo(.5);
		this.LeftB.fn='left';
		this.LeftB.visible=!1;
		this.RightB=this.add.button(this.world.width*.9,this.world.height*.85,'GameIconsWhite',this.page,this,'arrowRight','arrowRight','arrowRight','arrowRight');
		this.RightB.tint=0x000000;
		this.RightB.anchor.setTo(.5);
		this.RightB.fn='right';
	},
	page:function(b){
		if(!this.Tween.isRunning){
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
		}
	},
	openDialog:function(b){
		if(!this.WPS.visible){
			this.curChar=b.charNum;
			this.curCharInfo=this.CharInfo[b.charNum];

			this.curPanel=b.panelNum;
			var panel=this.TileS.children[b.panelNum];
			panel.tint=0x000000;
			panel.inputEnabled=!1;

			this.CharS.loadTexture('todo_1');//TODO img
			this.CharNameTS.changeText(this.curCharInfo.cName);
			this.AbilityTS.changeText(
				'HP: '+this.curCharInfo.hp+'\n'+
				this.curWords.Speed+': '+this.curCharInfo.vel+'\n'+
				this.curWords.Difficulty+': '+this.curCharInfo.hdr);
			this.WPS.visible=!0;
		}
	},
	genDialog:function(){
		this.WPS=this.add.sprite(0,0,'TWP');
		this.WPS.visible=!1;
		this.WPS.tint=0x000000;

		// TODO adjust pos
		this.CharS=this.add.sprite(this.world.centerX,this.world.height*.4,'');
		this.CharS.anchor.setTo(.5);
		this.WPS.addChild(this.CharS);

		// TODO adjust pos and fontsize
		this.CharNameTS=this.M.S.genTxt(this.world.centerX,this.world.height*.2,'',this.M.S.txtstyl(40));
		this.WPS.addChild(this.CharNameTS);

		// TODO adjust pos and fontsize
		var txtstyl=this.M.S.txtstyl(25);
		txtstyl.align='left';
		this.AbilityTS=this.M.S.genTxt(this.world.width*.3,this.world.height*.6,'',txtstyl);
		this.WPS.addChild(this.AbilityTS);

		// TODO ENHANCE caption per char

		this.WPS.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.8,this.closeDialog,this.curWords.Close));
		this.SetLbl=this.M.S.genLbl(this.world.width*.75,this.world.height*.8,this.setChar,this.curWords.Set);
		this.WPS.addChild(this.SetLbl);
		this.WPS.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.9,this.tw,'Twitter'));
		this.WPS.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.9,this.yt,'YouTube'));
	},
	closeDialog:function(){
		if(this.curPanel>-1){
			var panel=this.TileS.children[this.curPanel];
			panel.tint=0xffffff;
			panel.inputEnabled=!0;
		}
		this.WPS.visible=!1;
	},
	setChar:function(){
		for(var k in this.setCharList){
			if(this.setCharList[k]==null){
				this.setCharList[k]=this.curChar;

				var frameChar=this.FrameCharGroup.children[(k-1)];
				frameChar.loadTexture('todo_1');//TODO
				frameChar.visible=!0;
				frameChar.listNum=k;
				frameChar.panelNum=this.curPanel;

				this.curPanel=-1;
				break;
			}
		}
		var setCount=0;
		for(var k in this.setCharList){
			if(this.setCharList[k]!=null)setCount++;
		}
		if(setCount==4){
			this.SetLbl.visible=!1;
			this.StartL.visible=!0;
		}
		this.closeDialog();
	},
	unsetChar:function(b){
		b.visible=!1;
		this.setCharList[b.listNum]=null;

		var panel=this.TileS.children[b.panelNum];
		panel.tint=0xffffff;
		panel.inputEnabled=!0;

		if(this.SetLbl.visible==!1)this.SetLbl.visible=!0;
		if(this.StartL.visible==!0)this.StartL.visible=!1;
	},
	play:function(b){
		if (!this.Tween.isRunning) {
			this.M.sGlb('curFirstChar',this.setCharList[1]);
			this.M.sGlb('curCharList',this.setCharList);
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('play','SelectChar','FirstChar_'+this.setCharList[1],this.M.gGlb('playCount'));
			// this.M.SE.play('OnStart',{volume:1});//TODO
		}
	},
	back:function(){
		if(!this.Tween.isRunning&&!this.WPS.visible){
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Title')},this);
			this.Tween.start();
			// this.M.SE.play('OnBtn',{volume:1});//TODO
		}
	},
	yt:function(){
		// this.M.SE.play('OnBtn',{volume:1});//TODO
		var url=this.curCharInfo.yt;
		this.game.device.desktop?window.open(url,"_blank"):location.href=url;
		myGa('youtube','SelectChar','Char_'+this.curChar,this.M.gGlb('playCount'));
	},
	tw:function(){
		// this.M.SE.play('OnBtn',{volume:1});//TODO
		var url=this.curCharInfo.tw;
		this.game.device.desktop?window.open(url,"_blank"):location.href=url;
		myGa('twitter','SelectChar','Char_'+this.curChar,this.M.gGlb('playCount'));
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0x000000;
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};