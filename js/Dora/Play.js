BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		// Val
		this.CX=this.world.centerX;
		this.CY=this.world.centerY;
		this.LX=this.world.width*.3;
		this.RX=this.world.width*.7;
		this.BY=this.world.height*.8;
		this.selectMiss=!1;
		this.ignoranceAnswer=0;
		this.silenceAnswer=0;
		this.HCount=0;
		// Obj
		this.Tween={};
		this.AGroup=this.BGroup=this.CGroup=this.DGroup=this.EGroup=this.FGroup=this.GGroup=
		this.HGroup=this.IGroup=this.JGroup=this.KGroup=this.LGroup=this.MGroup=this.NGroup=
		this.HUD=
		this.HTS=
		null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.genContents();
		this.A();
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
				this.isPlaying=this.inputEnabled=!1;
				// this.M.SE.play('OnStart',{volume:1});
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
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.end,this);

			this.AGroup.pendingDestroy=!0;
			this.I();
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		var arr=['A','B','C','D','E','F','G','H','I','J','K','L','M','N',];
		for(var k in arr)this[arr[k]+'Group']=this.add.group();
		this.genHUD();
	},
	A:function(){
		this.AGroup.add(this.M.S.genTxt(this.CX,this.CY,this.curWords.AreUHost));
		this.AGroup.add(this.M.S.genLbl(this.LX,this.BY,function(){this.B('Y')},'YES'));
		this.AGroup.add(this.M.S.genLbl(this.RX,this.BY,function(){this.B('N')},'NO'));
	},
	B:function(yn){
		this.AGroup.pendingDestroy=!0;
		this.BGroup.add(this.M.S.genTxt(this.CX,this.CY,yn=='Y'?this.curWords.HostHowTo:this.curWords.NotHostHowTo));
		this.BGroup.add(this.M.S.genLbl(this.CX,this.BY,this.C,this.curWords.Next));
	},
	C:function(){
		this.BGroup.pendingDestroy=!0;
		this.CGroup.add(this.M.S.genTxt(this.CX,this.world.height*.1,this.curWords.WhichUse));
		this.CGroup.add(this.M.S.genLbl(this.LX,this.world.height*.3,function(){this.D(this.game.device.iOS)},'iOS'));
		this.CGroup.add(this.M.S.genLbl(this.RX,this.world.height*.3,function(){this.D(this.game.device.android)},'Android'));
		this.CGroup.add(this.M.S.genLbl(this.LX,this.world.height*.45,function(){this.D(this.game.device.desktop)},'PC'));
		this.CGroup.add(this.M.S.genLbl(this.RX,this.world.height*.45,function(){this.D(1)},this.curWords.OtherDevice));
		this.CGroup.add(this.M.S.genLbl(this.LX,this.world.height*.6,function(){this.D(2)},this.curWords.DontKnowDevice));
		this.CGroup.add(this.M.S.genLbl(this.RX,this.world.height*.6,function(){this.D(3)},this.curWords.NotSayDevice));
	},
	D:function(ynw){
		this.CGroup.pendingDestroy=!0;

		if(ynw===2)this.ignoranceAnswer++;
		if(ynw===3)this.silenceAnswer++;

		if(ynw===false||(ynw===1&&(this.game.device.iOS||this.game.device.android||this.game.device.desktop))){
			this.selectMiss=!0;
			this.E(4);
		}else{
			if(ynw===true){
				if(this.game.device.iOS){
					this.DGroup.add(this.M.S.genTxt(this.CX,this.world.height*.1,this.curWords.WhichUse));
					this.DGroup.add(this.M.S.genLbl(this.LX,this.world.height*.3,function(){this.E(this.game.device.iPhone)},'iPhone'));
					this.DGroup.add(this.M.S.genLbl(this.RX,this.world.height*.3,function(){this.E(this.game.device.iPad)},'iPad'));
				}
				if(this.game.device.desktop){
					this.DGroup.add(this.M.S.genTxt(this.CX,this.world.height*.1,this.curWords.WhichUse));
					this.DGroup.add(this.M.S.genLbl(this.LX,this.world.height*.3,function(){this.E(this.game.device.windows)},'Windows'));
					this.DGroup.add(this.M.S.genLbl(this.RX,this.world.height*.3,function(){this.E(this.game.device.macOS)},'Mac'));
					this.DGroup.add(this.M.S.genLbl(this.LX,this.world.height*.45,function(){this.E(this.game.device.linux)},'Linux'));
				}
				this.DGroup.add(this.M.S.genLbl(this.RX,this.world.height*.45,function(){this.E(1)},this.curWords.OtherDevice));
				this.DGroup.add(this.M.S.genLbl(this.LX,this.world.height*.6,function(){this.E(2)},this.curWords.DontKnowDevice));
				this.DGroup.add(this.M.S.genLbl(this.RX,this.world.height*.6,function(){this.E(3)},this.curWords.NotSayDevice));
			}else{this.E(4)}
		}
	},
	E:function(ynw){
		this.DGroup.pendingDestroy=!0;

		if(ynw===2)this.ignoranceAnswer++;
		if(ynw===3)this.silenceAnswer++;
		if(ynw===false)this.selectMiss=!0;

		this.EGroup.add(this.M.S.genTxt(this.CX,this.world.height*.1,this.curWords.WhichUse));
		this.EGroup.add(this.M.S.genLbl(this.LX,this.world.height*.3,function(){this.F(this.game.device.chrome)},'Chrome'));
		this.EGroup.add(this.M.S.genLbl(this.RX,this.world.height*.3,function(){this.F(this.game.device.safari)},'Safari'));
		this.EGroup.add(this.M.S.genLbl(this.LX,this.world.height*.45,function(){this.F(this.game.device.edge)},'Edge'));
		this.EGroup.add(this.M.S.genLbl(this.RX,this.world.height*.45,function(){this.F(this.game.device.ie)},'IE'));
		this.EGroup.add(this.M.S.genLbl(this.LX,this.world.height*.6,function(){this.F(this.game.device.opera)},'Opera'));
		this.EGroup.add(this.M.S.genLbl(this.RX,this.world.height*.6,function(){this.F(this.game.device.firefox)},'Firefox'));
		this.EGroup.add(this.M.S.genLbl(this.LX,this.world.height*.75,function(){this.F(1)},this.curWords.OtherDevice));
		this.EGroup.add(this.M.S.genLbl(this.RX,this.world.height*.75,function(){this.F(2)},this.curWords.DontKnowDevice));
		this.EGroup.add(this.M.S.genLbl(this.LX,this.world.height*.9,function(){this.F(3)},this.curWords.NotSayDevice));
	},
	F:function(ynw){
		this.EGroup.pendingDestroy=!0;

		if(ynw===2)this.ignoranceAnswer++;
		if(ynw===3)this.silenceAnswer++;
		if(ynw===false||(ynw===1&&(this.game.device.chrome||this.game.device.safari||this.game.device.edge||this.game.device.ie||this.game.device.opera||this.game.device.firefox))){
			this.selectMiss=!0;
		}

		var txt;
		if(!this.selectMiss){
			txt=(this.ignoranceAnswer>0||this.silenceAnswer>0)?this.curWords.RightRoughlyAnswerRes:this.curWords.RightAllAnswerRes;
		}else if(this.ignoranceAnswer>=2){
			txt=this.curWords.IgnoranceAnswerRes;
		}else if(this.silenceAnswer>=2){
			txt=this.curWords.SilenceAnswerRes;
		}else{
			txt=this.curWords.WrongAnswerRes;
		}
		this.FGroup.add(this.M.S.genTxt(this.CX,this.CY,txt));
		this.FGroup.add(this.M.S.genLbl(this.LX,this.BY,this.back,this.curWords.Back));
		this.FGroup.add(this.M.S.genLbl(this.RX,this.BY,this.G,this.curWords.Next));
	},
	G:function(){
		this.FGroup.pendingDestroy=!0;
		this.GGroup.add(this.M.S.genTxt(this.CX,this.CY,this.curWords.G_Text));
		this.GGroup.add(this.M.S.genLbl(this.CX,this.BY,this.H,'押す'));
	},
	H:function(){
		this.GGroup.pendingDestroy=!0;
		this.HTS=this.M.S.genTxt(this.CX,this.CY,this.curWords.H_Text_0);
		this.HGroup.add(this.HTS);
		this.HGroup.add(this.M.S.genLbl(this.LX,this.BY,function(){
			if(this.inputEnabled){
				this.inputEnabled=!1;
				this.HCount++;
				if(this.HCount==7)return this.I('Y');
				this.HTS.changeText(this.curWords['H_Text_'+this.HCount]);
				this.time.events.add(600,function(){this.inputEnabled=!0},this);
			}
		},'YES'));
		this.HGroup.add(this.M.S.genLbl(this.RX,this.BY,this.unfortunately_H,'NO'));
	},
	I:function(yn){
		this.HGroup.pendingDestroy=!0;

		// Loading...

		// this.LoadingTween
		var gauge=this.genGauge(this.world.width*.1,this.world.height*.3,this.world.width*.8,this.world.height*.15,this.IGroup);
		var maxWidth=gauge.width;
		gauge.width*=0;

		var twA=this.add.tween(gauge).to({width:maxWidth},3000);
		twA.start();

		this.IGroup.add(this.M.S.genLbl(this.CX,this.BY,this.cancel_I,this.curWords.Cancel));
	},
	unfortunately_H:function(){
		this.HGroup.pendingDestroy=!0;
		this.M.S.genTxt(this.CX,this.CY,this.curWords.Unfortunately_HRes);
		this.M.S.genLbl(this.CX,this.BY,this.back,this.curWords.Back);
	},
	cancel_I:function(){
		this.IGroup.pendingDestroy=!0;
	},
	genGauge:function(x,y,w,h,g){
		g.add(this.M.S.genBmpSqrSp(x,y,w,h,'#333333'));
		g.add(this.M.S.genBmpSqrSp(x+2,y+2,w-4,h-4,'#ffffff'));
		g.add(this.M.S.genBmpSqrSp(x+4,y+4,w-8,h-8,'#d4d4d4'));
		g.add(this.M.S.genBmpSqrSp(x+6,y+6,w-12,h-12,'#ffffff'));
		g.add(this.M.S.genBmpSqrSp(x+8,y+8,w-16,h-16,'#cfcfcf'));
		var a=this.M.S.genBmpSqrSp(x+8,y+8,w-16,h-16,'#5be968');
		g.add(a);
		return a;
	},
	genHUD:function(){
		this.HUD=this.add.group();
		var y=this.world.height*.05;
		this.HUD.add(this.M.S.genVolBtn(this.world.width*.05,y));
		this.HUD.add(this.M.S.genFlScBtn(this.world.width*.95,y));
	},
};


// omake -> dark hand
// omake -> black circle blood