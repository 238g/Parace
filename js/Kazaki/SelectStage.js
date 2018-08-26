BasicGame.SelectStage=function(){};
BasicGame.SelectStage.prototype={
	init:function(){
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
		// this.M.SE.playBGM('TitleBGM',{volume:2});
		// this.add.sprite(0,0,'Bg_1');

		this.genHUD();
	},
	select:function(b){
		this.curStage=b.stage;
		this.M.sGlb('curStage',this.curStage);
		myGa('play','SelectStage','Stage_'+this.curStage,this.M.gGlb('playCount'));
		this.start();
	},
	start:function(){
		if (!this.Tween.isRunning) {
			this.M.SE.play('OnBtn',{volume:1});
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
	othergames:function(){
		this.M.SE.play('OnBtn',{volume:1});
		if (this.game.device.desktop) {
			window.open(BasicGame.MY_GAMES_URL,'_blank');
		} else {
			location.href=BasicGame.MY_GAMES_URL;
		}
		myGa('othergames','SelectStage','',this.M.gGlb('playCount'));
	},
	back:function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.M.NextScene('Title');
		myGa('back','SelectStage','toTitle',this.M.gGlb('playCount'));
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y);
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};
