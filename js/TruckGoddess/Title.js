BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.isPlaying=!0;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1}); // TODO
		var s=this.add.sprite(this.world.centerX,this.world.centerY,'TitleChar');
		s.anchor.setTo(.5);
		this.M.T.moveC(s,{xy:{x:'+5'},duration:100}).start();
		this.M.T.moveC(s,{xy:{y:'+10'},duration:200}).start();

		this.M.S.BasicGrayLabelM(this.world.centerX,this.world.height*.8,this.start,'START',this.M.S.BaseTextStyleS(30),{tint:BasicGame.MAIN_TINT});
		this.genHUD();
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},
	start:function(b){
		if (this.inputEnabled&&this.isPlaying) {
			this.isPlaying=!1;
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			var tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			tween.onComplete.add(function(){
				this.M.NextScene('SelectStage');
			},this);
			tween.start();
		} else {
			// this.M.SE.playBGM('TitleBGM',{volume:1}); // TODO
			this.inputEnabled=!0;
		}
	},
	genHUD:function(){
		var y=this.world.height*.05;
		this.M.S.BasicVolSprite(this.world.width*.1,y);
		this.M.S.BasicFullScreenBtn(this.world.width*.9,y);
	},
};
