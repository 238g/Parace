BasicGame.SelectStage=function(){};
BasicGame.SelectStage.prototype={
	init:function(){
		this.StageInfo=this.M.getConf('StageInfo');
		this.curStage=this.M.getGlobal('curStage');
		this.curStageInfo=this.StageInfo[this.curStage];

		this.CurBgSprite=null;
		this.DynamicBgSprite=null;
		this.Tween=null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});
		this.genContents();
	},

	genContents:function(){
		this.CurBgSprite=this.add.sprite(0,0,this.curStageInfo.stageBgImg);
		this.DynamicBgSprite=this.add.sprite(this.world.width,0,this.curStageInfo.stageBgImg);

		this.genSelector();

		this.add.button(this.world.width,this.world.height,'OkBtn',this.ok,this).anchor.setTo(1);
		this.add.button(0,this.world.height,'BackBtn',this.back,this).anchor.setTo(0,1);

		this.genHUD();
	},
	genSelector:function(){
		// TODO adjust pos
		var w=this.world.width;
		var h=this.world.height;
		var arrX=[w*.3,w*.7];
		var arrY=[h*.3,h*.5,h*.7];
		var orderX=0;
		var orderY=0;
		var l=arrX.length;
		for(var k in this.StageInfo){
			var i=this.StageInfo[k];
			var x=arrX[orderX];
			var y=arrY[orderY];
			var btn=this.add.button(x,y,i.selectorImg,this.selectStage,this);
			btn.stageNum=k;
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

		if(curStage==this.curStage){
			return;
		}

		if(this.Tween&&this.Tween.isRunning){
			return;
		}

		this.curStage=curStage;

		this.M.setGlobal('curStage',curStage);

		this.curStageInfo=this.StageInfo[curStage];

		this.DynamicBgSprite.loadTexture(this.curStageInfo.stageBgImg);

		// TODO adjust tween duration
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
		// this.M.SE.play('OnBtn',{volume:1}); // TODO
		this.M.NextScene('Play');
	},
	back:function(){
		// this.M.SE.play('OnBtn',{volume:1}); // TODO
		this.M.NextScene('SelectChar');
	},
	genHUD:function(){
		var y=this.world.height*.1;
		this.M.S.BasicVolSprite(this.world.width*.1,y);
		this.M.S.BasicFullScreenBtn(this.world.width*.9,y);
	},
};
