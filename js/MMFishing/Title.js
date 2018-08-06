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
		this.M.SE.playBGM('BGM',{volume:1});

		this.add.sprite(0,0,'Bg_1');

		this.add.button(this.world.randomX,this.world.height*.75,'Fish_1',function(b){
			this.Emitter.setXSpeed(-500,500);
			this.Emitter.setYSpeed(-500,500);
			b.destroy();
		},this).scale.setTo(.2);
		
		this.genEmitter();

		this.M.S.genTxt(this.world.centerX,this.world.height*.2,BasicGame.GAME_TITLE,this.M.S.txtstyl(40));
		this.M.S.genLbl(this.world.centerX,this.world.height*.9,this.start,this.curWords.Start,this.M.S.txtstyl(25));

		this.genHUD();
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},
	genEmitter:function(){
		this.Emitter=this.add.emitter(0,0,300);
		this.Emitter.makeParticles('Fish_1',0,300,!0,!0);
		this.Emitter.gravity=200;
		this.input.onDown.add(function(p){
			this.M.SE.play('Hit',{volume:1});
			this.Emitter.x=p.x;
			this.Emitter.y=p.y;
			this.Emitter.explode(3E3,10);
		},this);
	},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				this.M.SE.play('OnStart',{volume:1});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:1000,alpha:1});
				this.Tween.onComplete.add(function(){
					this.M.NextScene('Play');
				},this);
				this.Tween.start();
				myGa('start','Title','toPlay',this.M.gGlb('playCount'));
			}
		} else {
			this.M.SE.playBGM('BGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	genHUD:function(){
		var y=this.world.height*.93;
		this.M.S.genVolBtn(this.world.width*.05,y);
		this.M.S.genFlScBtn(this.world.width*.95,y);
	},
};
