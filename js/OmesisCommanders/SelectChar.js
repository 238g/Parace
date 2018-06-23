BasicGame.SelectChar=function(){};
BasicGame.SelectChar.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.isPlaying=!0;
		this.CharInfo=this.M.getConf('CharInfo');
		this.curChar=this.M.getGlobal('curChar');
		this.curCharInfo=this.CharInfo[this.curChar];
		this.CharIntroGrp=this.CharIntroSprite=this.CharNameTxtSprite=null;
	},
	create:function(){
		this.time.events.removeAll();
		// this.M.SE.playBGM('TitleBGM',{volume:1});
		this.genContents();
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},

	genContents:function(){
		this.add.sprite(0,0,'Bg_2');
		this.CharIntroGrp=this.add.group();
		this.CharIntroSprite=this.add.sprite(100,30,this.curCharInfo.idle);
		this.CharIntroGrp.add(this.CharIntroSprite);
		this.CharNameTxtSprite=this.M.S.genTextM(this.world.width*.25,this.world.height*.65,this.curCharInfo.charName,this.M.S.BaseTextStyleSS(40));
		this.CharIntroGrp.add(this.CharNameTxtSprite);
		this.genSquares();
		this.add.button(this.world.width-10,this.world.height-10,'OkBtn',this.ok,this).anchor.setTo(1);
		this.add.button(10,this.world.height-10,'BackBtn',this.back,this).anchor.setTo(0,1);
		this.genHUD();
		this.selectedChar(this.curChar);
	},
	genSquares:function(){
		var w=this.world.centerX;
		var h=this.world.height*.07;
		var arrX=[w,w+65,w+130,w+195];
		var arrY=[h,h+65,h+130,h+195];
		var orderX=0;
		var orderY=0;
		var l=arrX.length;
		for(var k in this.CharInfo){
			var i=this.CharInfo[k];
			var x=arrX[orderX];
			var y=arrY[orderY];
			var btn=this.add.button(x,y,i.charSquare,this.selectChar,this);
			btn.charNum=k;
			orderX++;
			if(orderX==l){
				orderX=0;
				orderY++;
			}
		}
	},
	selectChar:function(btn){
		// this.M.SE.play('OnBtn',{volume:1}); // TODO
		var curChar=btn.charNum;
		if(curChar==this.curChar) return;
		this.selectedChar(curChar);
	},
	selectedChar:function(curChar){
		this.curChar=curChar;
		this.M.setGlobal('curChar',curChar);
		this.curCharInfo=this.CharInfo[curChar];
		this.CharIntroGrp.x=-this.world.centerX;
		var tween=this.M.T.moveA(this.CharIntroGrp,{xy:{x:0}});
		tween.onStart.add(function(){
			this.CharIntroSprite.loadTexture(this.curCharInfo.idle);
			this.CharNameTxtSprite.changeText(this.curCharInfo.charName);
		},this);
		tween.start();
	},
	ok:function(){
		if(this.inputEnabled&&this.isPlaying){
			this.isPlaying=!1;
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			var tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			tween.onComplete.add(function(){
				this.M.NextScene('SelectStage');
			},this);
			tween.start();
		}
	},
	back:function(){
		// this.M.SE.play('OnBtn',{volume:1}); // TODO
		this.M.NextScene('Title');
	},
	genHUD:function(){
		var y=this.world.height*.06;
		this.M.S.BasicVolSprite(this.world.width*.05,y);
		this.M.S.BasicFullScreenBtn(this.world.width*.95,y);
	},
};
