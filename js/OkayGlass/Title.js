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

		var charSprie=this.add.button(0,0,'Asahi_1',function(){
			if(!this.curTween.isRunning){
				if(this.BrokenGlasses.frame==3){
					if(this.TtlTxtSprite.changed==!1){
						this.TtlTxtSprite.changed=!0;
						this.TtlTxtSprite.changeText('クソメガネいじり');
					}
					return;
				}
				this.M.SE.play('BreakGlasses_1',{volume:1});
				this.BrokenGlasses.frame+=1;
				this.curTween.start();
			}
		},this);
		this.curTween=this.add.tween(charSprie);
		this.curTween.to({x:'+2'},50,null,!1,0,3,!0);
		this.BrokenGlasses=this.add.sprite(0,0,'BrokenGlasses',0);
		charSprie.addChild(this.BrokenGlasses);
		this.TtlTxtSprite=this.M.S.genTextM(this.world.centerX,this.world.height*.6,'あさひさんいじり',this.M.S.BaseTextStyleS(45));
		this.TtlTxtSprite.anchor.setTo(.5);
		this.TtlTxtSprite.changed=!1;
		this.genLabel(this.world.width*.25,this.world.height*.85,'フリーモード','FREE');
		this.genLabel(this.world.width*.75,this.world.height*.85,'スコアモード','SCORE');
		this.genHUD();
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},
	genLabel:function(x,y,text,tag){
		this.M.S.BasicGrayLabelM(x,y,this.start,text,this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT}).tag=tag;
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
