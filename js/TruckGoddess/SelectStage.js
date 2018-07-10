BasicGame.SelectStage=function(){};
BasicGame.SelectStage.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.curStage=this.M.getGlobal('curStage');
		this.StageInfo=this.M.getConf('StageInfo');
		this.BaseTextStyle=this.M.S.BaseTextStyleS(30);

		this.Words=this.M.getConf('Words')['jp'];
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#555555';
		// this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1}); // TODO

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
			this.M.S.BasicGrayLabelM(this.world.width*.7,this.world.height*.9,this.start,this.Words.Start,this.BaseTextStyle,{tint:BasicGame.MAIN_TINT});
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
		this.curStage=b.stageNum;
	},
	start:function(b){
		if (this.inputEnabled) {
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			this.M.setGlobal('curStage',this.curStage);
			this.M.NextScene('Play');
		}
	},
	genHUD:function(){
		var y=this.world.height*.05;
		this.M.S.BasicVolSprite(this.world.width*.1,y);
		this.M.S.BasicFullScreenBtn(this.world.width*.9,y);
	},
};
