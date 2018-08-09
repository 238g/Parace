BasicGame.SelectStage=function(){};
BasicGame.SelectStage.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.curStage=this.M.getGlobal('curStage');
		this.StageInfo=this.M.getConf('StageInfo');
		this.curStageInfo=this.StageInfo[this.curStage];
		this.BaseTextStyle=this.M.S.BaseTextStyleS(30);

		// this.StageInfo[5].openSecret=!0;
		// this.StageInfo[6].openSecret=!0;

		this.Words=this.M.getConf('Words')['jp'];

		this.Tween=this.CurBgSprite=this.DynamicBgSprite=this.CurBgNameTxtSprite=null;
	},
	create:function(){
		this.time.events.removeAll();
		this.M.SE.playBGM('TitleBGM',{volume:1});

		this.CurBgSprite=this.add.sprite(0,0,'Bg_'+this.curStage);
		this.DynamicBgSprite=this.add.sprite(this.world.width,0,'Bg_'+this.curStage);
		this.CurBgNameTxtSprite=this.M.S.genTextM(this.world.width*.2,this.world.height*.93,this.curStageInfo.jp_name,this.BaseTextStyle);
		this.Tween={};

		var gaugeX=this.world.width*.2;
		var gs=this.add.sprite(gaugeX,this.world.centerY,'DifficultyGauge');
		gs.anchor.setTo(.5);
		this.M.S.genTextM(gaugeX,gs.top,'EASY',this.BaseTextStyle);
		this.M.S.genTextM(gaugeX,gs.bottom,'HARD',this.BaseTextStyle);

		var count=0;
		var btns=this.add.group();
		for(var k in this.StageInfo){
			var info=this.StageInfo[k];
			if(info.isSecret&&!info.openSecret)continue;
			var btn=this.genStageBtn(info.jp_name,k,200*count+200);
			btns.addChild(btn);
			count++;
		}
		btns.align(1,-1,btn.width,btn.height*1.2);
		btns.alignTo(this.world.bounds,Phaser.RIGHT_CENTER,0,0);

		this.M.S.genTextM(this.world.width*.7,this.world.height*.15,this.Words.SS_Ttl,this.BaseTextStyle);

		this.time.events.add(200*count+800,function(){
			this.M.S.BasicGrayLabelM(this.world.width*.7,this.world.height*.92,this.start,this.Words.Start,this.BaseTextStyle,{tint:BasicGame.MAIN_TINT});
		},this);

		this.genHUD();
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},
	genStageBtn:function(txt,k,delay){
		var s=this.M.S.BasicGrayLabelM(0,0,this.select,txt,this.BaseTextStyle,{tint:BasicGame.MAIN_TINT});
		s.stageNum=k;
		this.M.T.moveA(s,{xy:{x:-this.world.width*.3},duration:800,delay:delay}).start();
		return s;
	},
	select:function(b){
		var curStage=b.stageNum;
		if(curStage==this.curStage)return;
		if(this.Tween&&this.Tween.isRunning)return;
		this.M.SE.play('SelectStg',{volume:1});
		this.curStage=curStage;
		this.curStageInfo=this.StageInfo[curStage];
		this.DynamicBgSprite.loadTexture('Bg_'+this.curStage);
		this.CurBgNameTxtSprite.changeText(this.curStageInfo.jp_name);
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
	start:function(b){
		if (this.inputEnabled&&!this.Tween.isRunning) {
			this.inputEnabled=!1;
			this.M.SE.play('Start',{volume:1});
			this.M.setGlobal('curStage',this.curStage);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			var tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			tween.onComplete.add(function(){
				this.M.NextScene('Play');
			},this);
			tween.start();
			myGa('play','SelectStage','Stage_'+this.curStage,this.M.getGlobal('playCount'));
		}
	},
	genHUD:function(){
		var y=this.world.height*.05;
		this.M.S.BasicVolSprite(this.world.width*.1,y);
		this.M.S.BasicFullScreenBtn(this.world.width*.9,y);
	},
};
