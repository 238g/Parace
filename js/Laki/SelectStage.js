BasicGame.SelectStage=function(){};
BasicGame.SelectStage.prototype={
	init:function(){
		this.inputEnabled=!1;

		this.curStage=this.M.gGlb('curStage');
		this.StageInfo=this.M.gGlb('StageInfo');
		this.curStageInfo=this.StageInfo[this.curStage];

		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];

		// this.Tween=this.CurBgSprite=this.DynamicBgSprite=this.CurBgNameTxtSprite=null;
	},
	create:function(){
		this.time.events.removeAll();
		// this.M.SE.playBGM('TitleBGM',{volume:1});

		var c=0;
		var r=0;
		for(var k in this.StageInfo){
			var x=c*this.world.width*.4+this.world.width*.3;
			var y=r*this.world.height*.2+this.world.height*.2;
			this.M.S.genLbl(x,y,this.start,this.StageInfo[k].name,this.M.S.txtstyl(20)).stgNum=k;
			c++;
			if(c==2){r++;c=0;};
		}

		this.genHUD();
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},
	start:function(b){
		if (this.inputEnabled) {
			this.M.sGlb('curStage',b.stgNum);
			this.M.NextScene('Play');
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y);
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};
