BasicGame.SelectLevel=function(){};
BasicGame.SelectLevel.prototype={
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		var LI=this.M.getConf('LevelInfo');
		this.add.sprite(0,0,'Bg_3');
		for(var k in LI){var i=LI[k];this.genLabel(i.btnPosX,i.btnPosY,i.btnName,this.play,i.btnDelay,k);}
		this.M.S.BasicGrayLabelM(this.world.width*.8,50,this.back,'もどる',this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT});
		var bottomY=this.world.height*.9;
		this.M.S.BasicVolSprite(this.world.width*.1,bottomY);
		this.M.S.BasicFullScreenBtn(this.world.width*.9,bottomY);
	},
	genLabel:function(x,y,text,func,delay,level){
		var startY=this.world.height*1.5;
		var sprite=this.M.S.BasicGrayLabelM(x,startY,func,text,this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT});
		var tween=this.M.T.moveA(sprite,{xy:{y:y},delay:delay});
		tween.onStart.add(function(){this.M.SE.play('Slide',{volume:1});},this);
		tween.start();
		sprite.level=level;
	},
	play:function(b){
		this.M.SE.play('Play',{volume:1});
		this.M.setGlobal('curLevel',b.level);
		this.M.NextScene('Play');
	},
	back:function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.M.NextScene('Title');
	},
};
