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
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.M.SE.playBGM('TitleBGM',{volume:1.5});
		this.add.sprite(0,0,'Bg_1');
		var wp=this.add.sprite(0,0,'WP');
		wp.tint=0x000000;
		wp.alpha=.3;

		this.M.S.genTxt(this.world.centerX,this.world.height*.2,this.curWords.SelectStage,this.M.S.txtstyl(40));

		var c=0;
		var r=0;
		for(var k in this.StageInfo){
			var x=c*this.world.width*.5+this.world.width*.25;
			var y=r*this.world.height*.1+this.world.height*.45;
			this.M.S.genLbl(x,y,this.start,this.StageInfo[k].name,this.M.S.txtstyl(25)).stgNum=k;
			c++;
			if(c==2){r++;c=0;};
		}

		this.M.S.genLbl(this.world.width*.25,this.world.height*.05,this.back,this.curWords.Back,this.M.S.txtstyl(25));

		this.genHUD();
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},
	start:function(b){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				this.M.sGlb('curStage',b.stgNum);
				this.M.SE.play('OnStart',{volume:1});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
				this.Tween.onComplete.add(function(){
					this.M.NextScene('Play');
				},this);
				this.Tween.start();
			}
		}
	},
	back:function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.M.NextScene('Title');
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y);
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};
