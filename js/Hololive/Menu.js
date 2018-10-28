BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		//Val
		this.tickTimer=0;
		//Obj
		this.Eff=null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});

		this.add.sprite(0,0,'Bg_1');

		this.genEff();
		
		var title=this.add.sprite(this.world.centerX,this.world.height*.4,'Title');
		title.anchor.setTo(.5);
		this.M.T.stressA(title,{durations:[300,200],delay:2E3}).start();

		this.M.S.genLbl(this.world.width*.25,this.world.height*.8,this.start,this.curWords.Start,this.M.S.txtstyl(25));
		this.M.S.genLbl(this.world.width*.75,this.world.height*.8,this.gotoCredit,'Credit',this.M.S.txtstyl(25));
		
		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	genEff:function(){
		this.Eff=this.add.group();
		var arr=[];
		for(i=1;i<=15;i++)arr.push('circle_'+i);
		this.Eff.createMultiple(3,arr);
		this.Eff.forEach(function(s){
			s.smoothed=!1;
			s.anchor.setTo(.5);
		},this);
	},
	update:function(){
		this.tickTimer-=this.time.elapsed;
		if(this.tickTimer<0){
			this.tickTimer=500;
			var s=this.rnd.pick(this.Eff.children.filter(function(e){return!e.alive}));
			if(s){
				s.reset(this.world.randomX*.9+this.world.width*.05,this.world.randomY*.6+this.world.height*.05);
				var tw=this.add.tween(s.scale).to({x:2,y:2},1500,
					this.rnd.pick([
						Phaser.Easing.Elastic.Out,
						Phaser.Easing.Bounce.Out,
						Phaser.Easing.Back.Out,
						Phaser.Easing.Circular.InOut,
					]),!0,0,0,!0);
				tw.onComplete.add(function(){
					this.kill();
				},s);
			}
		}
	},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				this.M.SE.play('OnBtn',{volume:1});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
				this.Tween.onComplete.add(function(){this.M.NextScene('SelectChar')},this);
				this.Tween.start();
			}
		} else {
			this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	gotoCredit:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url='https://238g.github.io/Parace/238Games2.html?page=credit';
		this.game.device.desktop?window.open(url,"_blank"):location.href=url;
		myGa('external_link','Title','Credit',this.M.gGlb('playCount'));
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0x000000;
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};
////////////////////////////////////////////////////////////////////////////////////////////////////////
BasicGame.SelectChar=function(){};
BasicGame.SelectChar.prototype={
	init:function(){
		this.CharInfo=this.M.gGlb('CharInfo');
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.curGroup=0;
		this.TileS=this.BackSlideL=null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});
		
		this.genCharPanel();

		this.M.S.genTxt(this.world.centerX,this.world.height*.065,this.curWords.SelectChar,this.M.S.txtstyl(30));

		this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.ToTitle);
		this.BackSlideL=this.M.S.genLbl(this.world.centerX,this.world.height*.85,this.backSlide,this.curWords.Back);
		this.BackSlideL.visible=!1;

		this.genHUD();
	},
	genCharPanel:function(){
		this.TileS=this.add.tileSprite(0,0,this.world.width*2,this.world.height,'Bg_2');

		var mY=this.world.height*.2,sY=this.world.height*.3;
		for(var i=0;i<3;i++){
			var lbl=this.M.S.genLbl(this.world.centerX,mY*i+sY,this.slide,i+'期生');
			lbl.group=i;
			lbl.tint=0x49c8f0;
			this.TileS.addChild(lbl);
		}
		var pos=[
			[this.world.width*1.5,this.world.height*.22],
			[this.world.width*1.2,this.world.height*.38],
			[this.world.width*1.8,this.world.height*.38],
			[this.world.width*1.3,this.world.height*.64],
			[this.world.width*1.7,this.world.height*.64],
		];
		var txtstyl=this.M.S.txtstyl(20);
		for(var i=0;i<5;i++){
			var b=this.add.button(pos[i][0],pos[i][1],'',this.select,this);
			b.anchor.setTo(.5);
			b.listNum=i;
			this.TileS.addChild(b);
			if(i==0){
				b.addChild(this.M.S.genTxt(15,75,'',txtstyl));
			}else{
				b.addChild(this.M.S.genTxt(25,75,'',txtstyl));
			}
		}
	},
	slide:function(b){
		if(!this.Tween.isRunning){
			var group=b.group;
			this.curGroup=group;
			for(var i=1;i<=5;i++){
				var k=i+group*5;
				var info=this.CharInfo[k];
				var b=this.TileS.children[i+2];
				if(info.open){
					b.visible=!0;
					b.loadTexture('panel_'+k);
					b.children[0].changeText(info.cName);
				}else{
					b.visible=!1;
				}
			}

			this.Tween=this.M.T.moveB(this.TileS,{xy:{x:-this.world.width},duration:500});
			this.Tween.onComplete.add(function(){
				this.BackSlideL.visible=!0;
			},this);
			this.Tween.start();
			this.M.SE.play('OnBtn',{volume:1});
		}
	},
	backSlide:function(){
		if(!this.Tween.isRunning){
			this.Tween=this.M.T.moveB(this.TileS,{xy:{x:0},duration:500});
			this.Tween.onComplete.add(function(){
				this.BackSlideL.visible=!1;
			},this);
			this.Tween.start();
			this.M.SE.play('Back',{volume:1});
		}
	},
	select:function(b){
		if(!this.Tween.isRunning){
			var char=b.listNum+1+this.curGroup*5;
			this.M.sGlb('curChar',char);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectLevel')},this);
			this.Tween.start();
			this.M.SE.play('OnBtn',{volume:1});
		}
	},
	back:function(){
		if(!this.Tween.isRunning){
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Title')},this);
			this.Tween.start();
			this.M.SE.play('Back',{volume:1});
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0x000000;
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};
////////////////////////////////////////////////////////////////////////////////////////////////////////
BasicGame.SelectLevel=function(){};
BasicGame.SelectLevel.prototype={
	init:function(){
		this.curChar=this.M.gGlb('curChar');
		this.CharInfo=this.M.gGlb('CharInfo');
		this.curCharInfo=this.CharInfo[this.curChar];
		this.LevelInfo=this.M.gGlb('LevelInfo');
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});
		this.add.sprite(0,0,'Bg_3');

		this.M.S.genTxt(this.world.centerX,this.world.height*.065,this.curWords.SelectLevel,this.M.S.txtstyl(30));

		this.genChar();
		this.genLevel();

		this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.Back);

		this.genHUD();
	},
	genChar:function(){
		var charS=this.add.sprite(this.world.width*.25,this.world.height*.3,'panel_'+this.curChar);
		charS.anchor.setTo(.5);
		this.M.S.genTxt(this.world.width*.7,this.world.height*.2,this.curCharInfo.cName,this.M.S.txtstylS(20));
		
		var s=this.add.sprite(this.world.width*.7,this.world.height*.41,'circle_'+this.curChar);
		s.anchor.setTo(.5,.8);
		var twA=this.add.tween(s).to({y:'-'+this.world.height*.1},800,Phaser.Easing.Circular.Out,!0,800);
		var twB=this.add.tween(s).to({y:'+'+this.world.height*.1},1E3,Phaser.Easing.Back.Out,!1,0);
		var twC=this.add.tween(s).to({angle:30},500,Phaser.Easing.Back.InOut,!1,800,0,!0);
		var twD=this.add.tween(s).to({angle:-30},500,Phaser.Easing.Exponential.Out,!1,0,0,!0);
		twA.chain(twB);
		twB.chain(twC);
		twC.chain(twD);
		twD.onComplete.add(function(){
			this.start();
		},twA);
	},
	genLevel:function(){
		var lbl,text,row=0,
			txtstyl=this.M.S.txtstylS(20),
			lx=this.world.width*.25,
			rx=this.world.width*.75,
			mY=this.world.height*.1,
			sY=this.world.centerY;

		for(var k in this.LevelInfo){
			var info=this.LevelInfo[k];
			text=info.timeAttack?this.curWords.TimeAttack+info.leftTime:'Level '+k;

			if(k%2==0){
				lbl=this.M.S.genLbl(rx,mY*row+sY,this.select,text,txtstyl);
				row++;
			}else{
				lbl=this.M.S.genLbl(lx,mY*row+sY,this.select,text,txtstyl);
			}
			lbl.level=k;
		}
	},
	select:function(b){
		if (!this.Tween.isRunning) {
			this.M.sGlb('curLevel',b.level);
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('play','SelectLevel','Char_'+this.curChar+':Level_'+b.level,this.M.gGlb('playCount'));
			this.M.SE.play('OnStart',{volume:1});
		}
	},
	back:function(){
		if(!this.Tween.isRunning){
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectChar')},this);
			this.Tween.start();
			this.M.SE.play('Back',{volume:1});
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0x000000;
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};