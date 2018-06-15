BasicGame.SelectLevel=function(){};
BasicGame.SelectLevel.prototype={
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;

		var LI=this.M.getConf('LevelInfo');

		// TODO bg

		for(var k in LI){var i=LI[k];this.genLabel(i.btnPosX,i.btnPosY,i.btnName,this.play,i.btnDelay,k);}
		this.M.S.BasicGrayLabelM(this.world.width*.8,50,function(){this.M.NextScene('Title');},'もどる',this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT});
	},
	genLabel:function(x,y,text,func,delay,level){
		var startY=this.world.height*1.5;
		var sprite=this.M.S.BasicGrayLabelM(x,startY,func,text,this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT});
		this.M.T.moveA(sprite,{xy:{y:y},delay:delay}).start();
		sprite.level=level;
	},
	play:function(b){
		this.M.setGlobal('curLevel',b.level);
		this.M.NextScene('Play');
	},
};
