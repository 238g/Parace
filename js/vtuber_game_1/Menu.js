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
		if(this.game.device.touch)this.input.maxPointers=2;
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});
		
		this.genEff();

		var title=this.add.sprite(this.world.centerX,this.world.height*.2,'Title');
		title.anchor.setTo(.5);

		var txtstyl=this.M.S.txtstyl(25);
		this.M.S.genLbl(this.world.width*.25,this.world.height*.85,this.start,this.curWords.Start,txtstyl).tint=0x00ff00;
		this.M.S.genLbl(this.world.width*.75,this.world.height*.85,this.credit,'Credit',txtstyl).tint=0xffd700;
		
		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	genEff:function(){
		var len=2;
		var arr=['intro_2_2','intro_3_2'];
		var CharInfo=this.M.gGlb('CharInfo');
		for(var k in CharInfo){
			arr.push('intro_'+k);
			len++;
		}

		var e=this.add.emitter(this.world.centerX,0,len*2);
		e.width=this.world.centerX;
		e.makeParticles(arr);
		e.minParticleScale=.3;
		e.maxParticleScale=.5;
		e.minRotation=0;
		e.maxRotation=0;
		e.setYSpeed(250,300);
		e.gravity.y=-100;
		e.forEach(function(s){
			var parachute=this.add.sprite(0,-s.height*.5,'Parachute');
			parachute.anchor.setTo(.5,1);
			s.addChild(parachute);
		},this);

		e.start(!1,3E3,this.time.physicsElapsedMS*30,0);
	},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				this.M.SE.play('OnStart',{volume:1});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
				this.Tween.onComplete.add(function(){this.M.NextScene('SelectChar')},this);
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
		this.baseFrameSize=this.world.width/4-20;
		this.special=!1;
		//Obj
		this.StartL=this.TileS=this.LeftB=this.RightB=
		this.WPS=this.CharS=this.CharNameTS=this.SetLbl=this.AbilityTS=this.YtLbl=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});
		
		//ENHANCE first set...
		this.M.sGlb('curCharList',this.setCharList);

		this.TileS=this.add.tileSprite(0,0,this.world.width*this.maxPage,this.world.height,'WP');
		this.TileS.tint=0xeeeeee;

		var txtstyl=this.M.S.txtstyl(40);
		txtstyl.fill=txtstyl.mStroke='#ff0000';
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
			if(i==0){
				var f=this.M.S.genBmpSqrSp(x,y,90,90,'#ff6347');
				
				var txtstyl=this.M.S.txtstyl(25);
				txtstyl.fill=txtstyl.mStroke='#dc143c';
				this.M.S.genTxt(x,y,'x2',txtstyl);
			}else{
				var f=this.M.S.genBmpSqrSp(x,y,90,90,'#cccccc');
			}
			f.anchor.setTo(.5);
			var b=this.add.button(x,y,'',this.unsetChar,this);
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
			var charNum=arr[k];
			rest=count%4;
			//// special
			if((charNum==2||charNum==3)&&this.rnd.between(0,100)<50){
				var b=this.add.button(mXY*rest+sX,mXY*col+sY,'intro_'+charNum+'_2',this.openDialog,this);
				b.special=!0;
			}else{
				var b=this.add.button(mXY*rest+sX,mXY*col+sY,'intro_'+charNum,this.openDialog,this);
				b.special=!1;
			}
			//// special
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
			this.M.SE.play('OnBtn',{volume:1});
		}
	},
	genDialog:function(){
		this.WPS=this.add.sprite(0,0,'70TWP');
		this.WPS.visible=!1;
		this.WPS.tint=0x000000;

		this.CharS=this.add.sprite(this.world.centerX,this.world.height*.4,'');
		this.CharS.anchor.setTo(.5);
		this.WPS.addChild(this.CharS);

		this.CharNameTS=this.M.S.genTxt(this.world.centerX,this.world.height*.18,'',this.M.S.txtstyl(40));
		this.WPS.addChild(this.CharNameTS);

		var txtstyl=this.M.S.txtstyl(25);
		txtstyl.align='left';
		this.AbilityTS=this.M.S.genTxt(this.world.width*.2,this.world.height*.6,'',txtstyl);
		this.WPS.addChild(this.AbilityTS);

		// ENHANCE caption per char

		this.WPS.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.8,this.closeDialog,this.curWords.Close));
		this.SetLbl=this.M.S.genLbl(this.world.width*.75,this.world.height*.8,this.setChar,this.curWords.Set);
		this.WPS.addChild(this.SetLbl);
		this.WPS.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.9,this.tw,'Twitter'));

		this.YtLbl=this.M.S.genLbl(this.world.width*.75,this.world.height*.9,this.yt,'YouTube');
		this.WPS.addChild(this.YtLbl);
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
			this.special=b.special;
			this.CharNameTS.changeText(this.curCharInfo.cName);
			this.AbilityTS.changeText(
				'HP: '+this.curCharInfo.hp+'\n'+
				this.curWords.Speed+': '+(10-this.curCharInfo.vel)+'\n'+
				this.curWords.Difficulty+': '+(10-this.curCharInfo.hdr));

			if(this.curCharInfo.yt){
				this.YtLbl.visible=!0;
			}else{
				this.YtLbl.visible=!1;
			}

			this.WPS.visible=!0;
			this.M.SE.play('OnPanel',{volume:1});
		}
	},
	closeDialog:function(){
		if(this.curPanel>-1){
			var panel=this.TileS.children[this.curPanel];
			panel.tint=0xffffff;
			panel.inputEnabled=!0;
			this.M.SE.play('OnCancel',{volume:1});
		}
		this.WPS.visible=!1;
	},
	setChar:function(){
		for(var k in this.setCharList){
			if(this.setCharList[k]==null){
				this.setCharList[k]=this.curChar;

				var frameChar=this.FrameCharGroup.children[(k-1)];
				if(this.special){
					frameChar.loadTexture('intro_'+this.curChar+'_2');
				}else{
					frameChar.loadTexture('intro_'+this.curChar);
				}
				frameChar.visible=!0;
				frameChar.listNum=k;
				frameChar.panelNum=this.curPanel;
				frameChar.width=this.baseFrameSize;
				frameChar.height=this.baseFrameSize;

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
		this.M.SE.play('OnSelect',{volume:1});
	},
	unsetChar:function(b){
		b.visible=!1;
		this.setCharList[b.listNum]=null;

		var panel=this.TileS.children[b.panelNum];
		panel.tint=0xffffff;
		panel.inputEnabled=!0;

		if(this.SetLbl.visible==!1)this.SetLbl.visible=!0;
		if(this.StartL.visible==!0)this.StartL.visible=!1;
		this.M.SE.play('OnCancel',{volume:1});
	},
	play:function(){
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
			this.M.SE.play('OnPlay',{volume:1});
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
			this.M.SE.play('OnCancel',{volume:1});
		}
	},
	yt:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url=this.curCharInfo.yt;
		this.game.device.desktop?window.open(url,"_blank"):location.href=url;
		myGa('youtube','SelectChar','Char_'+this.curChar,this.M.gGlb('playCount'));
	},
	tw:function(){
		this.M.SE.play('OnBtn',{volume:1});
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