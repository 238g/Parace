BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.Tween={};
		this.BgS=null;
		this.startColor=0;
		this.endColor=0;
		this.colorBlend={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});

		this.BgS=this.add.sprite(0,0,'Bg_1');
		this.tweenTintLoop();
		this.add.sprite(0,this.world.height*.3,'Bg_3');

		this.M.S.genTxt(this.world.centerX,this.world.height*.2,BasicGame.GAME_TITLE,this.M.S.txtstyl(50));

		this.M.S.genLbl(this.world.centerX,this.world.height*.8,this.start,this.curWords.Start,this.M.S.txtstyl(30));
		this.M.S.genLbl(this.world.centerX,this.world.height*.9,this.gotoUpd8,'Upd8',this.M.S.txtstyl(30));

		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	tweenTintLoop:function(){
		this.colorBlend={step:0};
		var tw=this.add.tween(this.colorBlend).to({step:100},5000,Phaser.Easing.Linear.None,!0,0);
		this.startColor=this.startColor||Math.random()*0xffffff;
		this.endColor=Math.random()*0xffffff;
		this.BgS.tint=this.startColor;
		tw.onUpdateCallback(function(){
			this.BgS.tint=Phaser.Color.interpolateColor(this.startColor,this.endColor,100,this.colorBlend.step);
		},this);
		tw.onComplete.add(function(){
			this.startColor=this.endColor;
			this.tweenTintLoop();
		},this);
	},
	gotoUpd8:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url='https://upd8.jp/';
		this.game.device.desktop?window.open(url,"_blank"):location.href=url;
		myGa('external_link','Title','playCount_'+this.M.gGlb('playCount'),this.M.gGlb('playCount'));
	},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				this.M.SE.play('OnStart',{volume:1});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
				this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
				this.Tween.start();
				this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
				myGa('play','Title','playCount_'+this.M.gGlb('playCount'),this.M.gGlb('playCount'));
			}
		} else {
			this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	genHUD:function(){
		var y=this.world.height*.05;
		this.M.S.genVolBtn(this.world.width*.1,y);
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};
