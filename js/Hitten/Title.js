BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.setBackgroundColor(0xfbf6d5);
		this.M.SE.playBGM('TitleBGM',{volume:1});
		this.M.S.genTextM(this.world.centerX,this.world.height*.25,'秒当てゲーム',this.M.S.BaseTextStyleS(50));
		var sb=this.M.S.BasicGrayLabelM(this.world.centerX,this.world.height*.6,this.start,'START',this.M.S.BaseTextStyleS(25),{tint:0xffff00});
		sb.scale.setTo(1.5);
		var ob=this.M.S.BasicGrayLabelM(this.world.centerX,this.world.height*.8,this.start,'OTHER GAME',this.M.S.BaseTextStyleS(20),{tint:0xffff00});
		ob.scale.setTo(1.5);
		this.genHUD();
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},
	start:function(){
		if (this.inputEnabled) {
			this.M.SE.play('SelectSE',{volume:1});
			this.M.NextScene('SelectChar');
		} else {
			this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.BasicVolSprite(this.world.width*.1,y);
		this.M.S.BasicFullScreenBtn(this.world.width*.9,y);
	},
};
