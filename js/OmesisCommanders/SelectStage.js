BasicGame.SelectStage=function(){};
BasicGame.SelectStage.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.isPlaying=!0;
		this.StageInfo=this.M.getConf('StageInfo');
		this.curStage=this.M.getGlobal('curStage');
		this.curStageInfo=this.StageInfo[this.curStage];
		this.CurBgSprite=this.DynamicBgSprite=this.Tween=this.CurBgNameTextSprite=null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});
		this.genContents();
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},

	genContents:function(){
		this.CurBgSprite=this.add.sprite(0,0,this.curStageInfo.stgBg);
		this.DynamicBgSprite=this.add.sprite(this.world.width,0,this.curStageInfo.stgBg);
		this.genSelector();
		this.add.button(this.world.width-10,this.world.height-10,'OkBtn',this.ok,this).anchor.setTo(1);
		this.add.button(10,this.world.height-10,'BackBtn',this.back,this).anchor.setTo(0,1);
		this.CurBgNameTextSprite=this.M.S.genTextM(this.world.centerX,this.world.height*.9,this.curStageInfo.selectorName,this.M.S.BaseTextStyleS(50));
		this.genHUD();
	},
	genSelector:function(){
		var w=this.world.width;
		var h=this.world.height;
		var arrX=[w*.2,w*.6];
		var arrY=[h*.05,h*.3,h*.55];
		var orderX=0;
		var orderY=0;
		var l=arrX.length;
		for(var k in this.StageInfo){
			var info=this.StageInfo[k];
			var x=arrX[orderX];
			var y=arrY[orderY];
			var btn=this.add.button(x,y,info.selector,this.selectStage,this);
			btn.stageNum=k;
			this.M.S.genTextM(btn.left+10,btn.top+15,info.selectorName,this.M.S.BaseTextStyleSS(20));
			this.M.S.genTextM(btn.right-10,btn.bottom-15,info.selectorSubName,this.M.S.BaseTextStyleSS(20));
			orderX++;
			if(orderX==l){
				orderX=0;
				orderY++;
			}
		}
	},
	selectStage:function(btn){
		// this.M.SE.play('OnBtn',{volume:1}); // TODO
		var curStage=btn.stageNum;
		if(curStage==this.curStage)return;
		if(this.Tween&&this.Tween.isRunning)return;
		this.curStage=curStage;
		this.M.setGlobal('curStage',curStage);
		this.curStageInfo=this.StageInfo[curStage];
		this.DynamicBgSprite.loadTexture(this.curStageInfo.stgBg);
		this.CurBgNameTextSprite.changeText(this.curStageInfo.selectorName);
		this.M.T.moveX(this.CurBgSprite,{xy:{x:-this.CurBgSprite.width},easing:Phaser.Easing.Cubic.Out}).start();
		this.Tween=this.M.T.moveX(this.DynamicBgSprite,{xy:{x:0},easing:Phaser.Easing.Cubic.Out});
		this.Tween.start();
		this.Tween.onComplete.add(function(){
			this.CurBgSprite.x=this.world.width;
			var tmp=this.DynamicBgSprite;
			this.DynamicBgSprite=this.CurBgSprite;
			this.CurBgSprite=tmp;
			tmp=null;
		},this);
	},
	ok:function(){
		if(this.inputEnabled&&this.isPlaying){
			this.isPlaying=!1;
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			var tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			tween.onComplete.add(this.genVS,this);
			tween.start();
		}
	},
	back:function(){
		// this.M.SE.play('OnBtn',{volume:1}); // TODO
		this.M.NextScene('SelectChar');
	},
	genHUD:function(){
		var y=this.world.height*.06;
		this.M.S.BasicVolSprite(this.world.width*.05,y);
		this.M.S.BasicFullScreenBtn(this.world.width*.95,y);
	},
	genVS:function(){
		// TODO VS animation
		// TODO oncomp -> to play
		this.M.NextScene('Play');
	},
};
