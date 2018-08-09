BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.Tween={};

		this.Emitter=null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.setBackgroundColor(BasicGame.WHITE_COLOR);
		// this.M.SE.playBGM('BGM',{volume:1});

		// this.add.sprite(0,0,'Bg_1');

		this.M.S.genTxt(this.world.centerX,this.world.height*.2,BasicGame.GAME_TITLE,this.M.S.txtstyl(40));
		this.M.S.genLbl(this.world.centerX,this.world.height*.9,this.start,this.curWords.Start,this.M.S.txtstyl(25));

		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				// this.M.SE.play('OnStart',{volume:1});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:1E3,alpha:1});
				this.Tween.onComplete.add(function(){
					this.M.NextScene('Play');
				},this);
				this.Tween.start();
				myGa('start','Title','toPlay',this.M.gGlb('playCount'));
			}
		} else {
			// this.M.SE.playBGM('BGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	genHUD:function(){
		var y=this.world.height*.93;
		this.M.S.genVolBtn(this.world.width*.05,y);
		this.M.S.genFlScBtn(this.world.width*.95,y);
	},
};
