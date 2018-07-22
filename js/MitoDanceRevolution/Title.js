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
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:2});
		this.add.sprite(0,0,'Bg_1');

		var mitoSprite=this.add.sprite(this.world.centerX,this.world.height*.1,'MitoShadow');
		mitoSprite.visible=!1;
		var titleTextSprite=this.add.sprite(this.world.width*2,this.world.height*.3,'Title');
		titleTextSprite.anchor.setTo(.5);
		var startBtnSprite=this.add.button(this.world.width*2,this.world.height*.8,'Start',this.start,this);
		startBtnSprite.anchor.setTo(.5);

		var tw=this.M.T.moveA(titleTextSprite,{xy:{x:this.world.centerX},delay:500});
		tw.onStart.add(function(){
			this.M.SE.play('Title',{volume:1});
		},this);
		tw.onComplete.add(function(){
			this.visible=!0;
		},mitoSprite);
		tw.start();
		this.M.T.moveA(startBtnSprite,{xy:{x:this.world.centerX},delay:800}).start();

		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
		this.genHUD();
	},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				this.M.SE.play('OnBtn',{volume:1});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
				this.Tween.onComplete.add(function(){
					this.M.NextScene('SelectStage');
				},this);
				this.Tween.start();
			}
		} else {
			this.M.SE.playBGM('TitleBGM',{volume:2});
			this.inputEnabled=!0;
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y);
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};
