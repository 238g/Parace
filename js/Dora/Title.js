BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#ffffff';
		// this.M.SE.playBGM('TitleBGM',{volume:1});

		this.M.S.genTxt(this.world.centerX,this.world.height*.15,BasicGame.GAME_TITLE,this.M.S.txtstyl(40));
		this.M.S.genTxt(this.world.width*.3,this.world.centerY,this.curWords.TitleDescription,this.M.S.txtstyl(20));
		var s=this.add.sprite(this.world.width*.95,this.world.centerY,'DoraJumpRope');
		s.anchor.setTo(1,.5);
		s.animations.add('jumping');
		s.animations.play('jumping',12,!0);
		// this.add.sprite(this.world.width*.95,this.world.centerY,'MiniDora_'+this.rnd.integerInRange(1,4)).anchor.setTo(1,.5);

		this.M.S.genLbl(this.world.width*.18,this.world.height*.9,this.start,this.curWords.Enter).num=1;
		this.M.S.genLbl(this.world.centerX,this.world.height*.9,this.start,this.curWords.Bonus).num=2;
		this.M.S.genLbl(this.world.width*.82,this.world.height*.9,this.start,this.curWords.FortuneTelling).num=3;

		this.time.events.add(500,function(){this.inputEnabled=!0},this);
		this.genHUD();
	},
	start:function(b){
		if(this.inputEnabled){
			if (!this.Tween.isRunning) {
				this.M.sGlb('curStg',b.num);
				this.inputEnabled=!1;
				// this.M.SE.play('SelectSE',{volume:1});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
				this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
				this.Tween.start();
			}
		}else{
			// this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	genHUD:function(){
		var y=this.world.height*.05;
		this.M.S.genVolBtn(this.world.width*.05,y);
		this.M.S.genFlScBtn(this.world.width*.95,y);
	},
};
