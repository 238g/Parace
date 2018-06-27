BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.TtlTxtSprite=this.curTween=this.BrokenGlasses=null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});
		var charSprie=this.add.sprite(0,0,'Asahi_1');
		this.curTween=this.add.tween(charSprie);
		this.curTween.to({x:'+2'},50,null,!1,0,3,!0);
		this.BrokenGlasses=this.add.sprite(0,0,'BrokenGlasses',0);
		charSprie.addChild(this.BrokenGlasses);
		this.TtlTxtSprite=this.M.S.genTextM(this.world.centerX,this.world.height*.6,BasicGame.GAME_TITLE,this.M.S.BaseTextStyleS(45));
		this.TtlTxtSprite.anchor.setTo(.5);
		this.TtlTxtSprite.changed=!1;
		this.M.S.BasicGrayLabelM(this.world.width*.25,this.world.height*.85,this.start,'フリースタイル',this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT}).tag='FREE';
		this.M.S.BasicGrayLabelM(this.world.width*.75,this.world.height*.85,this.start,'MCバトル',this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT}).tag='SCORE';
		this.genHUD();
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
		var clickRange=this.add.button(this.world.centerX,this.world.height*.4,'',this.breakGlasses,this);
		clickRange.width=this.world.width*.6;
		clickRange.height=this.world.height*.7;
		clickRange.anchor.setTo(.5);
	},
	breakGlasses:function(){
		if(!this.curTween.isRunning){
			if(this.BrokenGlasses.frame==3){
				if(this.TtlTxtSprite.changed==!1){
					this.TtlTxtSprite.changed=!0;
					this.TtlTxtSprite.changeText('クソメガネいじり');
					this.M.SE.play('RepairGlasses',{volume:1});
				}
				return;
			}
			this.M.SE.play('BreakGlasses_1',{volume:1});
			this.BrokenGlasses.frame+=1;
			this.curTween.start();
		}
	},
	start:function(b){
		if (this.inputEnabled) {
			this.M.setGlobal('curMode',b.tag);
			// this.M.SE.play('OnBtn',{volume:1});
			this.M.NextScene('Play');
		} else {
			// this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.BasicVolSprite(this.world.width*.1,y);
		this.M.S.BasicFullScreenBtn(this.world.width*.9,y);
	},
};
