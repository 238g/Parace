BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.isPlaying=!0;
		this.Words=this.M.getConf('Words')['jp'];
		this.BgSprite=null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#000000';
		this.M.SE.playBGM('TitleBGM',{volume:1});
		this.BgSprite=this.add.sprite(0,0,'TopBg');
		this.time.events.loop(3000,function(){this.camera.shake(.01,200,!0,Phaser.Camera.SHAKE_BOTH);},this);
		var s=this.add.sprite(this.world.centerX,this.world.height*.7,'TitleWord');
		s.anchor.setTo(.5);
		this.M.T.moveC(s,{xy:{x:'+5'},duration:100}).start();
		this.M.T.moveC(s,{xy:{y:'+10'},duration:200}).start();
		this.M.S.genTextM(this.world.centerX,this.world.height*.2,BasicGame.GAME_TITLE,this.M.S.BaseTextStyleS(60));
		this.M.S.BasicGrayLabelM(this.world.centerX,this.world.height*.93,this.start,this.Words.Start,this.M.S.BaseTextStyleS(30),{tint:BasicGame.MAIN_TINT});
		this.genHUD();
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},
	start:function(b){
		if (this.inputEnabled&&this.isPlaying) {
			this.isPlaying=!1;
			this.M.SE.play('Start',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			var tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			tween.onComplete.add(function(){
				this.M.NextScene('SelectStage');
			},this);
			tween.start();
		} else {
			this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	genHUD:function(){
		var y=this.world.height*.05;
		this.M.S.BasicVolSprite(this.world.width*.1,y);
		this.M.S.BasicFullScreenBtn(this.world.width*.9,y);
	},
};
