BasicGame.SelectChar=function(){};
BasicGame.SelectChar.prototype={
	init:function(){
		this.curChar=this.M.getGlobal('curChar');
		this.CharInfo=this.M.getConf('CharInfo');
		this.curCharInfo=this.CharInfo[this.curChar];
		this.CharNameTextStyle=this.M.S.BaseTextStyleS(40);
		this.CharFrame=this.CharName=null;
		if(this.M.getGlobal('curLang')=='en'){
			this.BackTxt='BACK';
			this.SelectTxt='SELECT';
		}else{
			// TODO lang
			this.BackTxt='BACK';
			this.SelectTxt='SELECT';
		}
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.setBackgroundColor(0xfbf6d5);
		this.M.SE.playBGM('TitleBGM',{volume:1});
		this.genCharFrame();
		this.genCharPanels();
		this.M.S.BasicGrayLabelM(this.world.width*.24,this.world.height*.0365,this.back,this.BackTxt,this.M.S.BaseTextStyleS(20),{tint:0x00FF80}).scale.setTo(1.1);
		this.M.S.BasicGrayLabelM(this.CharFrame.right-20,this.CharFrame.bottom,this.play,this.SelectTxt,this.M.S.BaseTextStyleS(20),{tint:0x00FF80}).scale.setTo(1.1);
		this.genHUD();
	},
	genCharFrame:function(){
		this.CharFrame=this.add.sprite(this.world.centerX,this.world.height*.3,'greySheet','grey_panel');
		this.CharFrame.anchor.setTo(.5);
		this.CharFrame.scale.setTo(3);
		this.CharFrame.tint=this.curCharInfo.tint;
		this.CharSprite=this.add.sprite(this.world.centerX,this.world.height*.3,this.curCharInfo.smile);
		this.CharSprite.anchor.setTo(.5);
		this.CharNameTextStyle.fill=this.curCharInfo.txtColor;
		this.CharNameTextStyle.multipleStroke=this.curCharInfo.stroke;
		this.CharName=this.M.S.genTextM(this.world.centerX,this.world.height*.17,this.curCharInfo.charName,this.CharNameTextStyle);
	},
	genCharPanels:function(){
		var x=y=0;
		for(var k in this.CharInfo){
			var info=this.CharInfo[k];
			this.genPanel(x*110+60,this.world.height*.6+110*y,k,info);
			x++;
			4==x&&(x=0,y++);
		}
	},
	genPanel:function(x,y,panelNum,info){
		var b=this.add.button(x,y,'greySheet',this.selectedChar,this,'grey_panel','grey_panel');
		b.anchor.setTo(.5);
		b.onInputOver.add(function(){this.M.SE.play('PanelOverSE',{volume:1});},this);
		var t=this.add.tween(b);
		t.to({alpha:.2},300,'Linear',!1,0,-1,!0);
		b.onInputOver.add(function(){this.isPaused?this.resume():this.start();},t);
		b.onInputOut.add(function(){this.pause();},t);
		b.onInputOut.add(function(){this.alpha=1;},b);
		var s=this.add.sprite(0,0,info.icon);
		s.anchor.setTo(.5);
		s.scale.setTo(.8);
		b.addChild(s);
		b.panelNum=panelNum;
	},
	selectedChar:function(ev){
		var panelNum=ev.panelNum;
		this.curChar=panelNum;
		this.curCharInfo=this.CharInfo[panelNum];
		this.CharFrame.tint=this.curCharInfo.tint;
		this.CharSprite.loadTexture(this.curCharInfo.smile);
		this.CharNameTextStyle.fill=this.curCharInfo.txtColor;
		this.CharName.changeText(this.curCharInfo.charName);
		this.CharName.children[0].setStyle(this.CharNameTextStyle);
		this.M.SE.play('SelectSE',{volume:1});
	},
	play:function(){
		this.M.SE.play('SelectSE',{volume:1});
		this.M.setGlobal('curChar',this.curChar);
		this.M.NextScene('Play');
	},
	back:function(){
		this.M.SE.play('CancelSE',{volume:1});
		this.M.NextScene('Title');
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.BasicVolSprite(this.world.width*.1,y);
		this.M.S.BasicFullScreenBtn(this.world.width*.9,y);
	},
};
