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
		this.CharIntroGrp=this.add.group();
		this.CharIntroSprite=this.add.sprite(0,0,this.curCharInfo.charIntro);
		this.CharIntroGrp.add(this.CharIntroSprite);
		this.CharNameTxtSprite=this.M.S.genTextM(this.CharIntroSprite.right,this.CharIntroSprite.bottom,this.curCharInfo.charName,this.M.S.BaseTextStyleSS(25));
		this.CharIntroGrp.add(this.CharNameTxtSprite);
		this.genSquares();
		this.add.button(this.world.width,this.world.height,'OkBtn',this.ok,this).anchor.setTo(1);
		this.add.button(0,this.world.height,'BackBtn',this.back,this).anchor.setTo(0,1);
		this.genHUD();
		this.selectedChar(this.curChar);
	},
	genSquares:function(){
		// TODO adjust pos
		var w=this.world.width;
		var h=this.world.height;
		var arrX=[w*.6,w*.7,w*.8,w*.9];
		var arrY=[h*.2,h*.3,h*.4];
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

		// TODO adjust tween and pos
		this.CharIntroGrp.x=-300;

		var tween=this.M.T.moveA(this.CharIntroGrp,{xy:{x:0}});
		tween.onStart.add(function(){
			this.CharIntroSprite.loadTexture(this.curCharInfo.charIntro);
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
		var y=this.world.height*.1;
		this.M.S.BasicVolSprite(this.world.width*.1,y);
		this.M.S.BasicFullScreenBtn(this.world.width*.9,y);
	},
};
