BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];

		this.curStg=this.M.gGlb('curStg');
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
		this.gaugeMaxWidth=0;
		this.LCount=0;
		this.curFullScreen=this.scale.isFullScreen;
		// Obj
		this.Tween={};
		this.AGroup=this.BGroup=this.CGroup=this.DGroup=this.EGroup=this.FGroup=this.GGroup=
		this.HGroup=this.IGroup=this.JGroup=this.KGroup=this.LGroup=this.MGroup=this.NGroup=
		this.OGroup=this.PGroup=this.QGroup=this.RGroup=this.SGroup=this.TGroup=this.UGroup=
		this.HUD=
		this.HTS=this.Gauge=this.GaugeTS=this.I_CancelBtn=
		null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.genContents();
		if(this.curStg==3){
			// TODO
		}else if(this.curStg==2){
			// TODO
		}else{
			this.AF();
		}
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

			this.AGroup.pendingDestroy=!0;this.OF();

			/*
			var d=new Date();
			var a=d.getFullYear();
			var b=d.getMonth()+1;
			var c=d.getDate();

			console.log(a,b,c);
			*/
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		var arr=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U'];
		for(var k in arr)this[arr[k]+'Group']=this.add.group();
		this.genHUD();
	},
	AF:function(){
		this.AGroup.add(this.M.S.genTxt(this.CX,this.CY,this.curWords.AreUHost));
		this.AGroup.add(this.M.S.genLbl(this.LX,this.BY,function(){this.BF('N')},'NO'));
		this.AGroup.add(this.M.S.genLbl(this.RX,this.BY,function(){this.BF('Y')},'YES'));
	},
	BF:function(yn){
		this.AGroup.pendingDestroy=!0;
		this.BGroup.add(this.M.S.genTxt(this.CX,this.CY,yn=='Y'?this.curWords.HostHowTo:this.curWords.NotHostHowTo));
		this.BGroup.add(this.M.S.genLbl(this.CX,this.BY,this.CF,this.curWords.Next));
	},
	CF:function(){
		this.BGroup.pendingDestroy=!0;
		this.CGroup.add(this.M.S.genTxt(this.CX,this.world.height*.1,this.curWords.WhichUse));
		this.CGroup.add(this.M.S.genLbl(this.LX,this.world.height*.3,function(){this.DF(this.game.device.iOS)},'iOS'));
		this.CGroup.add(this.M.S.genLbl(this.RX,this.world.height*.3,function(){this.DF(this.game.device.android)},'Android'));
		this.CGroup.add(this.M.S.genLbl(this.LX,this.world.height*.45,function(){this.DF(this.game.device.desktop)},'PC'));
		this.CGroup.add(this.M.S.genLbl(this.RX,this.world.height*.45,function(){this.DF(1)},this.curWords.OtherDevice));
		this.CGroup.add(this.M.S.genLbl(this.LX,this.world.height*.6,function(){this.DF(2)},this.curWords.DontKnowDevice));
		this.CGroup.add(this.M.S.genLbl(this.RX,this.world.height*.6,function(){this.DF(3)},this.curWords.NotSayDevice));
	},
	DF:function(ynw){
		this.CGroup.pendingDestroy=!0;

		if(ynw===2)this.ignoranceAnswer++;
		if(ynw===3)this.silenceAnswer++;

		if(ynw===false||(ynw===1&&(this.game.device.iOS||this.game.device.android||this.game.device.desktop))){
			this.selectMiss=!0;
			this.EF(4);
		}else{
			if(ynw===true){
				if(this.game.device.iOS){
					this.DGroup.add(this.M.S.genTxt(this.CX,this.world.height*.1,this.curWords.WhichUse));
					this.DGroup.add(this.M.S.genLbl(this.LX,this.world.height*.3,function(){this.EF(this.game.device.iPhone)},'iPhone'));
					this.DGroup.add(this.M.S.genLbl(this.RX,this.world.height*.3,function(){this.EF(this.game.device.iPad)},'iPad'));
				}
				if(this.game.device.desktop){
					this.DGroup.add(this.M.S.genTxt(this.CX,this.world.height*.1,this.curWords.WhichUse));
					this.DGroup.add(this.M.S.genLbl(this.LX,this.world.height*.3,function(){this.EF(this.game.device.windows)},'Windows'));
					this.DGroup.add(this.M.S.genLbl(this.RX,this.world.height*.3,function(){this.EF(this.game.device.macOS)},'Mac'));
					this.DGroup.add(this.M.S.genLbl(this.LX,this.world.height*.45,function(){this.EF(this.game.device.linux)},'Linux'));
				}
				this.DGroup.add(this.M.S.genLbl(this.RX,this.world.height*.45,function(){this.EF(1)},this.curWords.OtherDevice));
				this.DGroup.add(this.M.S.genLbl(this.LX,this.world.height*.6,function(){this.EF(2)},this.curWords.DontKnowDevice));
				this.DGroup.add(this.M.S.genLbl(this.RX,this.world.height*.6,function(){this.EF(3)},this.curWords.NotSayDevice));
			}else{this.EF(4)}
		}
	},
	EF:function(ynw){
		this.DGroup.pendingDestroy=!0;

		if(ynw===2)this.ignoranceAnswer++;
		if(ynw===3)this.silenceAnswer++;
		if(ynw===false)this.selectMiss=!0;

		this.EGroup.add(this.M.S.genTxt(this.CX,this.world.height*.1,this.curWords.WhichUse));
		this.EGroup.add(this.M.S.genLbl(this.LX,this.world.height*.3,function(){this.FF(this.game.device.chrome)},'Chrome'));
		this.EGroup.add(this.M.S.genLbl(this.RX,this.world.height*.3,function(){this.FF(this.game.device.safari)},'Safari'));
		this.EGroup.add(this.M.S.genLbl(this.LX,this.world.height*.45,function(){this.FF(this.game.device.edge)},'Edge'));
		this.EGroup.add(this.M.S.genLbl(this.RX,this.world.height*.45,function(){this.FF(this.game.device.ie)},'IE'));
		this.EGroup.add(this.M.S.genLbl(this.LX,this.world.height*.6,function(){this.FF(this.game.device.opera)},'Opera'));
		this.EGroup.add(this.M.S.genLbl(this.RX,this.world.height*.6,function(){this.FF(this.game.device.firefox)},'Firefox'));
		this.EGroup.add(this.M.S.genLbl(this.LX,this.world.height*.75,function(){this.FF(1)},this.curWords.OtherDevice));
		this.EGroup.add(this.M.S.genLbl(this.RX,this.world.height*.75,function(){this.FF(2)},this.curWords.DontKnowDevice));
		this.EGroup.add(this.M.S.genLbl(this.LX,this.world.height*.9,function(){this.FF(3)},this.curWords.NotSayDevice));
	},
	FF:function(ynw){
		this.EGroup.pendingDestroy=!0;

		if(ynw===2)this.ignoranceAnswer++;
		if(ynw===3)this.silenceAnswer++;
		if(ynw===false||(ynw===1&&(this.game.device.chrome||this.game.device.safari||this.game.device.edge||this.game.device.ie||this.game.device.opera||this.game.device.firefox))){
			this.selectMiss=!0;
		}

		var txt;
		if(this.ignoranceAnswer>=2){
			txt=this.curWords.IgnoranceAnswerRes;
		}else if(this.silenceAnswer>=2||(this.silenceAnswer==1&&this.ignoranceAnswer==1)){
			txt=this.curWords.SilenceAnswerRes;
		}else if(!this.selectMiss){
			txt=(this.ignoranceAnswer>0||this.silenceAnswer>0)?this.curWords.RightRoughlyAnswerRes:this.curWords.RightAllAnswerRes;
		}else{
			txt=this.curWords.WrongAnswerRes;
		}
		this.FGroup.add(this.M.S.genTxt(this.CX,this.CY,txt));
		this.FGroup.add(this.M.S.genLbl(this.LX,this.BY,this.back,this.curWords.Back));
		this.FGroup.add(this.M.S.genLbl(this.RX,this.BY,this.GF,this.curWords.Next));
	},
	GF:function(){
		this.FGroup.pendingDestroy=!0;
		this.GGroup.add(this.M.S.genTxt(this.CX,this.CY,this.curWords.G_Text));
		this.GGroup.add(this.M.S.genLbl(this.CX,this.BY,this.HF,this.curWords.Push));
	},
	HF:function(){
		this.GGroup.pendingDestroy=!0;
		this.HTS=this.M.S.genTxt(this.CX,this.CY,this.curWords.H_Text_0);
		this.HGroup.add(this.HTS);
		this.HGroup.add(this.M.S.genLbl(this.LX,this.BY,this.unfortunately_H,'NO'));
		this.HGroup.add(this.M.S.genLbl(this.RX,this.BY,function(){
			if(this.inputEnabled){
				this.inputEnabled=!1;
				this.HCount++;
				if(this.HCount==7)return this.IF();
				this.HTS.changeText(this.curWords['H_Text_'+this.HCount]);
				this.time.events.add(600,function(){this.inputEnabled=!0},this);
			}
		},'YES'));
	},
	IF:function(){
		this.HGroup.pendingDestroy=!0;

		this.Gauge=this.genGauge(this.world.width*.1,this.world.height*.28,this.world.width*.8,this.world.height*.15,this.IGroup);
		this.gaugeMaxWidth=this.Gauge.width;
		this.Gauge.width*=0;

		this.GaugeTS=this.M.S.genTxt(this.CX,this.CY,this.curWords.GaugeDownload+Math.floor(this.Gauge.width/this.gaugeMaxWidth*100)+'%',this.M.S.txtstyl(25));
		this.IGroup.add(this.GaugeTS);

		var twA=this.add.tween(this.Gauge).to({width:this.gaugeMaxWidth*.2},1E3,null,!0,500);
		var twB=this.add.tween(this.Gauge).to({width:this.gaugeMaxWidth*.6},3E3,null,!1,300);
		var twC=this.add.tween(this.Gauge).to({width:this.gaugeMaxWidth*.9},1500,null,!1,400);
		var twD=this.add.tween(this.Gauge).to({width:this.gaugeMaxWidth},1E3,null,!1,300);
		twA.onComplete.add(function(){this.start()},twB);
		twB.onComplete.add(function(){this.start()},twC);
		twC.onComplete.add(function(){this.start()},twD);
		twD.onComplete.add(function(){
			this.I_CancelBtn.pendingDestroy=!0;
			this.GaugeTS.changeText(this.curWords.GaugeDownload+'100%');
			this.time.events.add(1500,this.JF,this);
		},this);

		twA.onUpdateCallback(this.changeGauge,this);
		twB.onUpdateCallback(this.changeGauge,this);
		twC.onUpdateCallback(this.changeGauge,this);
		twD.onUpdateCallback(this.changeGauge,this);

		this.I_CancelBtn=this.M.S.genLbl(this.LX,this.BY,this.cancel_I,this.curWords.Cancel);
		this.IGroup.add(this.I_CancelBtn);
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
	changeGauge:function(){
		this.GaugeTS.changeText(this.curWords.GaugeDownload+Math.floor(this.Gauge.width/this.gaugeMaxWidth*100)+'%');
	},
	JF:function(){
		this.IGroup.pendingDestroy=!0;

		this.JGroup.add(this.M.S.genTxt(this.CX,this.CY,this.curWords.J_Text));
		this.JGroup.add(this.M.S.genLbl(this.LX,this.BY,this.cancel_J,this.curWords.Cancel));
		this.JGroup.add(this.M.S.genLbl(this.RX,this.BY,this.KF,this.curWords.MoveOn));
	},
	unfortunately_H:function(){
		this.HGroup.pendingDestroy=!0;
		this.M.S.genTxt(this.CX,this.CY,this.curWords.Unfortunately_HRes);
		this.M.S.genLbl(this.CX,this.BY,this.back,this.curWords.Back);
	},
	cancel_I:function(){
		this.IGroup.pendingDestroy=!0;
		this.M.S.genTxt(this.CX,this.CY,this.curWords.Unfortunately_HRes);
		this.M.S.genLbl(this.CX,this.BY,this.back,this.curWords.Back);
	},
	cancel_J:function(){
		this.JGroup.pendingDestroy=!0;
		this.M.S.genTxt(this.CX,this.CY,this.curWords.Unfortunately_JRes);
		this.M.S.genLbl(this.CX,this.BY,this.back,this.curWords.Back);
	},
	////////////////////////////////////// PlayContents2
	KF:function(){
		this.JGroup.pendingDestroy=!0;
		this.KGroup.add(this.M.S.genTxt(this.CX,this.CY,this.curWords.K_Text));
		this.KGroup.add(this.M.S.genLbl(this.CX,this.BY,this.LF,this.curWords.Push));
	},
	LF:function(){
		this.KGroup.pendingDestroy=!0;
		this.LTS=this.M.S.genTxt(this.CX,this.CY,this.curWords.L_Text_0);
		this.LGroup.add(this.LTS);
		this.LGroup.add(this.M.S.genLbl(this.LX,this.BY,this.cancel_J,'NO'));
		this.LGroup.add(this.M.S.genLbl(this.RX,this.BY,function(){
			if(this.inputEnabled){
				this.inputEnabled=!1;
				this.LCount++;
				if(this.LCount==3)return this.MF();
				this.LTS.changeText(this.curWords['L_Text_'+this.LCount]);
				this.time.events.add(600,function(){this.inputEnabled=!0},this);
			}
		},'YES'));
	},
	MF:function(){
		this.LGroup.pendingDestroy=!0;
		this.MGroup.add(this.M.S.genTxt(this.CX,this.CY,this.curWords.M_Text));
		this.MGroup.add(this.M.S.genLbl(this.CX,this.BY,this.NF,this.curWords.Agree));
	},
	NF:function(){
		this.MGroup.pendingDestroy=!0;
		this.stage.backgroundColor='#000000';
		this.HUD.visible=!1;
		this.curFullScreen=this.scale.isFullScreen;

		var ts=this.add.text(0,this.world.height,__Program,{fontSize:18,fill:'#82FA58',wordWrapWidth:this.world.width});
		this.NGroup.add(ts);
		var tw=this.add.tween(ts).to({y:-(ts.height-this.world.centerY)},6E3,null,!0);
		tw.onComplete.add(function(){
			this.time.events.add(1500,function(){
				this.HUD.visible=!0;
				this.OF();
			},this);
		},this);
		this.scale.startFullScreen(!1);
	},
	OF:function(){
		this.NGroup.pendingDestroy=!0;
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		if(!this.curFullScreen)this.scale.stopFullScreen(!1);

		this.OGroup.add(this.M.S.genTxt(this.CX,this.CY,this.curWords.O_Text));

		// TODO btns
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