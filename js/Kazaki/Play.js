BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];

		this.curStg=this.M.gGlb('curStg');
		this.StageInfo=this.M.gGlb('StageInfo');
		this.curStageInfo=this.StageInfo[this.curStg];
		// Val

		// Obj
		this.Tween={};
		this.Player=
		null;
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.genContents();
		this.start();
		this.tes();
	},
	start:function(){
		this.isPlaying=this.inputEnabled=!0;
	},
	end:function(){
		this.isPlaying=this.inputEnabled=!1;
	},
	back:function(){
		if(this.inputEnabled){
			if(!this.Tween.isRunning){
				this.end();
				// this.M.SE.play('Enter',{volume:1});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
				this.Tween.onComplete.add(function(){this.M.NextScene('Title')},this);
				this.Tween.start();
			}
		}
	},
	tes:function(){
		if(__ENV!='prod'){
			// this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.end,this);
			// if(this.M.H.getQuery('f')){this.AGroup.pendingDestroy=!0;this[this.M.H.getQuery('f')]();}
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.add.sprite(0,0,'Bg_1');
		this.Player=this.add.sprite(0,this.world.height,'Kazaki_1');
		this.Player.anchor.setTo(.5,1);

		// TODO input controller
	},
};