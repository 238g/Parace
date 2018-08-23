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
		this.BY=this.world.height*.9;
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
		switch(this.curStg){
			case 4:this.RF();break;
			case 3:break;//TODO
			case 2:this.QF();break;
			default:this.AF();break;
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
				this.end();
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
			if(this.M.H.getQuery('f')){this.AGroup.pendingDestroy=!0;this[this.M.H.getQuery('f')]();}
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		var arr=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U'];
		for(var k in arr)this[arr[k]+'Group']=this.add.group();
		this.genHUD();
	},
	genHUD:function(){
		this.HUD=this.add.group();
		var y=this.world.height*.05;
		this.HUD.add(this.M.S.genVolBtn(this.world.width*.05,y));
		this.HUD.add(this.M.S.genFlScBtn(this.world.width*.95,y));
	},
	AF:function(){
		this.AGroup.add(this.add.sprite(0,0,'Dora_2'));
		this.AGroup.add(this.M.S.genTxt(this.CX,this.CY,this.curWords.AreUHost));
		this.AGroup.add(this.M.S.genLbl(this.LX,this.BY,function(){this.BF('N')},'NO'));
		this.AGroup.add(this.M.S.genLbl(this.RX,this.BY,function(){this.BF('Y')},'YES'));
	},
	BF:function(yn){
		this.AGroup.pendingDestroy=!0;
		this.BGroup.add(this.add.sprite(0,0,'Dora_2'));
		this.BGroup.add(this.M.S.genTxt(this.CX,this.CY,yn=='Y'?this.curWords.HostHowTo:this.curWords.NotHostHowTo));
		this.BGroup.add(this.M.S.genLbl(this.CX,this.BY,this.CF,this.curWords.SoonPlay));
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
		var sA=this.add.sprite(0,this.world.height,'Dora_1');
		sA.anchor.setTo(.2,.65);
		sA.angle=25;
		var sB=this.add.sprite(this.world.width,this.world.height,'Dora_1');
		sB.anchor.setTo(.8,.65);
		sB.angle=-25;
		this.CGroup.add(sA);
		this.CGroup.add(sB);
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
				var sA=this.add.sprite(0,this.world.height,'Dora_1');
				sA.anchor.setTo(.2,.65);
				sA.angle=25;
				var sB=this.add.sprite(this.world.width,this.world.height,'Dora_1');
				sB.anchor.setTo(.8,.65);
				sB.angle=-25;
				this.DGroup.add(sA);
				this.DGroup.add(sB);
			}else{this.EF(4)}
		}
	},
	EF:function(ynw){
		this.DGroup.pendingDestroy=!0;

		if(ynw===2)this.ignoranceAnswer++;
		if(ynw===3)this.silenceAnswer++;
		if(ynw===false)this.selectMiss=!0;

		this.stage.backgroundColor='#5e0e07';

		var s=this.add.sprite(this.world.width,this.world.height,'Dora_3');
		s.anchor.setTo(1);
		this.EGroup.add(s);

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
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;

		if(ynw===2)this.ignoranceAnswer++;
		if(ynw===3)this.silenceAnswer++;
		if(ynw===false||(ynw===1&&(this.game.device.chrome||this.game.device.safari||this.game.device.edge||this.game.device.ie||this.game.device.opera||this.game.device.firefox))){
			this.selectMiss=!0;
		}

		var txt;
		var bg;
		if(this.ignoranceAnswer>=2){
			bg=2;
			txt=this.curWords.IgnoranceAnswerRes;
		}else if(this.silenceAnswer>=2||(this.silenceAnswer==1&&this.ignoranceAnswer==1)){
			bg=2;
			txt=this.curWords.SilenceAnswerRes;
		}else if(!this.selectMiss){
			if(this.ignoranceAnswer>0||this.silenceAnswer>0){
				bg=1;
				txt=this.curWords.RightRoughlyAnswerRes;
			}else{
				bg=2;
				txt=this.curWords.RightAllAnswerRes;
			}
		}else{
			bg=1;
			txt=this.curWords.WrongAnswerRes;
		}
		this.FGroup.add(this.add.sprite(0,0,'Bg_'+bg));
		this.FGroup.add(this.M.S.genTxt(this.CX,this.CY,txt));
		this.FGroup.add(this.M.S.genLbl(this.CX,this.BY,this.GF,this.curWords.Next));
	},
	GF:function(){
		this.FGroup.pendingDestroy=!0;
		this.GGroup.add(this.add.sprite(0,0,'Bg_1'));
		this.GGroup.add(this.M.S.genTxt(this.CX,this.CY,this.curWords.G_Text));
		this.GGroup.add(this.M.S.genLbl(this.LX,this.BY,this.back,this.curWords.Back));
		this.GGroup.add(this.M.S.genLbl(this.RX,this.BY,this.HF,this.curWords.Next));
	},
	HF:function(){
		this.GGroup.pendingDestroy=!0;
		this.stage.backgroundColor='#000000';
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
		this.HUD.visible=!1;
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.inputEnabled=!0;

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
			this.time.events.add(300,function(){
				this.GaugeTS.changeText(this.curWords.GaugeDownloaded);
			},this);
			this.time.events.add(2000,this.JF,this);
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
		this.HUD.visible=!0;

		var s=this.add.sprite(this.CX,this.world.height*.65,'DoraJumpRope');
		s.anchor.setTo(.5);
		s.scale.setTo(.5);
		s.animations.add('jumping');
		s.animations.play('jumping',12,!0);
		this.JGroup.add(s);

		this.JGroup.add(this.M.S.genTxt(this.CX,this.world.height*.3,this.curWords.J_Text));
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
		this.time.events.removeAll();
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
		var s=this.add.sprite(this.world.width,0,'Bg_1');
		s.scale.setTo(-1,1);
		this.KGroup.add(s);
		this.KGroup.add(this.M.S.genTxt(this.CX,this.CY,this.curWords.K_Text));
		this.KGroup.add(this.M.S.genLbl(this.LX,this.BY,this.back,this.curWords.Back));
		this.KGroup.add(this.M.S.genLbl(this.RX,this.BY,this.LF,this.curWords.Next));
	},
	LF:function(){
		this.KGroup.pendingDestroy=!0;
		this.stage.backgroundColor='#000000';
		this.LTS=this.M.S.genTxt(this.CX,this.CY,this.curWords.L_Text_0);
		this.LGroup.add(this.LTS);
		this.LGroup.add(this.M.S.genLbl(this.LX,this.BY,this.cancel_L,'NO'));
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
	cancel_L:function(){
		this.LGroup.pendingDestroy=!0;
		this.M.S.genTxt(this.CX,this.CY,this.curWords.Unfortunately_JRes);
		this.M.S.genLbl(this.CX,this.BY,this.back,this.curWords.Back);
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
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.sGlb('isClear',!0);
		this.inputEnabled=!0;

		this.OGroup.add(this.add.sprite(0,0,'Bg_3'));

		var sA=this.add.sprite(this.world.width*.95,this.world.height*.6,'MiniDora_'+this.rnd.integerInRange(1,4));
		sA.anchor.setTo(1,.5);
		this.OGroup.add(sA);

		this.OGroup.add(this.M.S.genTxt(this.CX,this.world.height*.2,this.curWords.O_Text));

		var sB=this.add.sprite(this.CX,this.world.height*.6,'DoraJumpRope');
		sB.anchor.setTo(.5);
		sB.scale.setTo(.5);
		sB.animations.add('jumping');
		sB.animations.play('jumping',12,!0);
		this.OGroup.add(sB);

		this.OGroup.add(this.M.S.genLbl(this.world.width*.18,this.BY,this.back,this.curWords.Back));
		this.OGroup.add(this.M.S.genLbl(this.world.centerX,this.BY,this.PF,this.curWords.Campaign));
		this.OGroup.add(this.M.S.genLbl(this.world.width*.82,this.BY,this.tweet,this.curWords.Tweet));
	},
	tweet:function(){
		// this.M.SE.play('OnBtn',{volume:1});
		var e1='🐉🐉🐉🐉🐉🐉';
		var e2='🌋🌋🌋🌋🌋🌋';
		var res=this.curWords.TweetMsg+'\n';
		var txt=e1+'\n'+this.curWords.TweetTtl+'\n'+res+e2+'\n';
		this.M.H.tweet(txt,this.curWords.TweetHT,location.href);
		myGa('tweet','Play','playCount_'+this.M.gGlb('playCount'),this.M.gGlb('playCount'));
	},
	////////////////////////////////////// PlayContents3
	PF:function(){
		this.OGroup.pendingDestroy=!0;
		this.HUD.visible=!1;
		this.stage.backgroundColor='#000000';
		this.scale.startFullScreen(!1);

		var sA=this.add.sprite(0,0,'Bg_horror');
		this.PGroup.add(sA);
		var twA=this.M.T.fadeOutA(sA,{delay:2E3});
		twA.onComplete.add(function(){
			var sB=this.add.sprite(this.world.randomX,this.world.height,'Chaika_1');
			sB.anchor.setTo(.5,1);
			sB.alpha=0;
			this.PGroup.add(sB);
			var twB=this.add.tween(sB).to({alpha:.5},500,Phaser.Easing.Exponential.In,!0,1E3);
			this.add.tween(sB.scale).to({x:5,y:5},500,Phaser.Easing.Cubic.InOut,!0,1E3);
			twB.onComplete.add(function(){
				this.time.events.add(3E3,this.QF,this);
			},this);
		},this);
		twA.start();
	},
	QF:function(){
		this.PGroup.pendingDestroy=!0;
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		if(!this.curFullScreen)this.scale.stopFullScreen(!1);
		this.HUD.visible=!0;

		// TODO chaika_2
		var s=this.add.sprite(this.CX,this.world.height,'Chaika_1');
		s.anchor.setTo(.5,1);
		s.scale.setTo(5);
		this.QGroup.add(s);

		this.QGroup.add(this.M.S.genTxt(this.CX,this.world.height*.1,this.curWords.Q_Text));

		this.QGroup.add(this.M.S.genLbl(this.world.width*.18,this.BY,this.back,this.curWords.Back));
		this.QGroup.add(this.M.S.genLbl(this.world.width*.82,this.BY,this.tweet,this.curWords.Tweet));

		this.input.onDown.add(function(p){
			console.log(p.x,p.y);
			// TODO cast fire / max 10
			// tween . start reset randomY, left right which,
			// tween . end px,py, shake,and fire add
			// cast count, -> on tweet / cast count text
			// Global fireCount++
			// Tweet add fireCount
		},this);
	},
	////////////////////////////////////// PlayContents4
	RF:function(){
		var s=this.add.sprite(this.CX,this.CY,'DoraJumpRope');
		s.anchor.setTo(.5);
		s.scale.setTo(1.5);
		s.animations.add('jumping');
		s.animations.play('jumping',12,!0);
		this.M.sGlb('isClear',!0);
		this.M.S.genLbl(this.world.width*.18,this.BY,this.back,this.curWords.Back);
		this.M.S.genTxt(this.world.width*.85,this.BY-20,this.curWords.WatchDora);
	},
	////////////////////////////////////// PlayContents5
	SF:function(){
		this.M.S.genTxt(this.CX,this.world.height*.1,this.curWords.SelectChest,this.M.S.txtstyl(30));
		var bA=this.add.button(this.LX,this.world.height*.35,'TreasureChest_1',this.openChest,this);
		bA.anchor.setTo(.5);
		bA.num=1;
		var bB=this.add.button(this.RX,this.world.height*.35,'TreasureChest_1',this.openChest,this);
		bB.anchor.setTo(.5);
		bB.num=2;
		var bC=this.add.button(this.LX,this.world.height*.75,'TreasureChest_1',this.openChest,this);
		bC.anchor.setTo(.5);
		bC.num=3;
		var bD=this.add.button(this.RX,this.world.height*.75,'TreasureChest_1',this.openChest,this);
		bD.anchor.setTo(.5);
		bD.num=4;

		if(this.M.gGlb('treasureNum')>0){
			this.isPlaying=!1;
			// TODO chest open
			this.treasureRes(this.M.gGlb('treasureNum'),!0);
		}
	},
	openChest:function(btn){
		if(this.isPlaying){
			this.isPlaying=!1;
			btn.loadTexture('TreasureChest_2');

			var d=new Date();
			var a=String(d.getFullYear()).split('');
			var b=String(d.getMonth()+1).split('');
			var c=String(d.getDate()).split('');
			var sumF=0;
			var sumA=Number(btn.num);
			for(var k in a)sumA+=Number(a[k]);
			for(var k in b)sumA+=Number(b[k]);
			for(var k in c)sumA+=Number(c[k]);
			if(sumA>=10){
				var sumB=0;
				var e=String(sumA).split('');
				for(var k in e)sumB+=Number(e[k]);
				if(sumB>=10){
					var sumC=0;
					var f=String(sumB).split('');
					for(var k in f)sumC+=Number(f[k]);
					sumF=sumC;
				}else{
					sumF=sumB;
				}
			}else{
				sumF=sumA;
			}

			this.M.sGlb('treasureNum',sumF);

			this.treasureRes(sumF,!1);
		}
	},
	treasureRes:function(num,already){
		var curTreasureInfo=this.M.gGlb('TreasureInfo')[num];

		if(already){
			var sA=this.add.sprite(0,0,'TWP');
		}else{
			var sA=this.add.sprite(this.world.width,0,'TWP');
			this.M.T.moveD(sA,{xy:{x:0}}).start();
		}
		sA.tint=0x000000;

		// TODO
		var ts=this.M.S.genTxt(this.CX,this.CY,curTreasureInfo.name+'\n'+888888888888,this.M.S.txtstyl(40));
		sA.addChild(ts);

		var sC=this.M.S.genLbl(this.RX,this.BY,function(){
			// TODO window open url
		},this.curWords.GetGift);
		sA.addChild(sC);

		var sB=this.M.S.genLbl(this.LX,this.BY,this.back,this.curWords.Back);
		sA.addChild(sB);
	},

/*
自撮り
https://twitter.com/___Dola/status/1010111543327928321

スマホ壁紙
https://twitter.com/___Dola/status/1015117421235982336
https://twitter.com/___Dola/status/1015126691126042624
*/
};