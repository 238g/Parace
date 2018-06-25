BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.TtlTxtSprite=this.curTween=null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});
		this.TtlTxtSprite=this.add.sprite(this.world.centerX,this.world.height*.2,'Ttl');
		this.TtlTxtSprite.anchor.setTo(.5);
		
		var charSprie=this.add.button(100,100,'Asahi',function(){
			!this.curTween.isRunning&&this.curTween.start();
		},this); // TODO adjust pos
		this.curTween=this.add.tween(charSprie);
		this.curTween.to({x:'+10'},50,null,!1,0,3,!0); // TODO adjust x

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
