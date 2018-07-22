BasicGame.SelectChar=function(){};
BasicGame.SelectChar.prototype={
	init:function(){
		this.curChar=this.M.gGlb('curChar');
		this.CharInfo=this.M.gGlb('CharInfo');
		this.curCharInfo=this.CharInfo[this.curChar];
		this.curWords=this.M.gGlb('Words')[this.M.gGlb('curLang')];
		this.CharNameTextStyle=this.M.S.txtstyl(40);
		this.CharFrame=this.CharName=null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.setBackgroundColor(0xfbf6d5);
		this.M.SE.playBGM('TitleBGM',{volume:1});
		this.genCharFrame();
		this.genCharPanels();
		this.M.S.genLbl(this.world.width*.24,this.world.height*.0365,this.back,this.curWords.Back,this.M.S.txtstyl(20),{tint:0x00FF80}).scale.setTo(1.1);
		this.M.S.genLbl(this.CharFrame.right-20,this.CharFrame.bottom,this.play,this.curWords.Select,this.M.S.txtstyl(20),{tint:0x00FF80}).scale.setTo(1.1);
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
		this.CharName=this.M.S.genTxt(this.world.centerX,this.world.height*.17,this.curCharInfo.charName,this.CharNameTextStyle);
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
		this.M.sGlb('curChar',this.curChar);
		this.M.NextScene('Play');
	},
	back:function(){
		this.M.SE.play('CancelSE',{volume:1});
		this.M.NextScene('Title');
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y);
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};
