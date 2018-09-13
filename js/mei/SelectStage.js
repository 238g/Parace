BasicGame.SelectStage=function(){};
BasicGame.SelectStage.prototype={
	init:function(){
		this.curStg=this.M.gGlb('curStg');
		this.StageInfo=this.M.gGlb('StageInfo');

		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];

		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		// this.M.SE.playBGM('TitleBGM',{volume:1});
		// this.add.sprite(0,0,'Bg_1');

		this.M.S.genTxt(this.world.centerX,this.world.height*.1,this.curWords.SelectStg,this.M.S.txtstyl(35));
		this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.Back);

		// TODO stage lbl b.stg

		this.genHUD();
	},
	select:function(b){
		if (!this.Tween.isRunning) {
			this.curStg=b.stg;
			this.M.sGlb('curStg',this.curStg);
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);

			// this.M.SE.play('DecoBeam',{volume:1.5});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('play','SelectStage','Stage_'+this.curStg,this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(!this.Tween.isRunning){
			// this.M.SE.play('OnBtn',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Title')},this);
			this.Tween.start();
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y);
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};
