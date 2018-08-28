BasicGame.SelectStage=function(){};
BasicGame.SelectStage.prototype={
	init:function(){
		this.curStg=this.M.gGlb('curStg');
		this.StageInfo=this.M.gGlb('StageInfo');
		// this.curStageInfo=this.StageInfo[this.curStg];

		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];

		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		// this.M.SE.playBGM('TitleBGM',{volume:2});
		// this.add.sprite(0,0,'Bg_1');

		var x=0;
		var y=this.world.height*.55;
		var txtstyl=this.M.S.txtstyl(20);
		for(var k in this.StageInfo){
			var info=this.StageInfo[k];
			if(info.closed)return;
			var even=k%2;
			x=this.world.width*.75-(this.world.centerX*(even));
			var lbl=this.M.S.genLbl(x,y,this.select,info.name,txtstyl);
			lbl.stg=k;
			if(even==0)y+=this.world.height*.1;
		}

		this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.Back);

		this.genHUD();
	},
	select:function(b){
		this.curStg=b.stg;
		this.M.sGlb('curStg',this.curStg);
		this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
		myGa('play','SelectStage','Stage_'+this.curStg,this.M.gGlb('playCount'));
		this.start();
	},
	start:function(){
		if (!this.Tween.isRunning) {
			// this.M.SE.play('OnBtn',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			this.Tween.onComplete.add(function(){
				this.M.NextScene('Play');
			},this);
			this.Tween.start();
		}
	},
	back:function(){
		if(!this.Tween.isRunning){
			// this.M.SE.play('Enter',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Title')},this);
			this.Tween.start();
		}
	},
	genHUD:function(){
		var y=this.world.height*.05;
		this.M.S.genVolBtn(this.world.width*.1,y);
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};
