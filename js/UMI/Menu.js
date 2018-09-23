BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		// Obj
		this.StartTS=this.LangTS=this.CharTwTS=this.CreditTS=null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});
		
		this.add.sprite(0,0,this.M.gGlb('endTut')?'Bg_D':'Bg_C');
		this.genRainSp();
		
		var title=this.add.sprite(this.world.width*.4,this.world.height*.6,this.M.gGlb('endTut')?'TitleB':'TitleA');
		title.anchor.setTo(.5);
		this.M.T.beatA(title,{duration:182}).start();

		this.StartTS=this.M.S.genLbl(this.world.width*.25,this.world.height*.8,this.start,this.curWords.Start,this.M.S.txtstyl(25));
		this.CharTwTS=this.M.S.genLbl(this.world.width*.75,this.world.height*.8,this.charTw,this.curWords.CharTw,this.M.S.txtstyl(25));
		////// this.LangTS=this.M.S.genLbl(this.world.centerX,this.world.height*.9,this.chgLang,this.curWords.Lang,this.M.S.txtstyl(25));
		this.CreditTS=this.M.S.genLbl(this.world.centerX,this.world.height*.9,this.gotoCredit,'Credit',this.M.S.txtstyl(25));
		
		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	genRainSp:function(){
		var arr=['Umiyasha'];
		var si=this.M.gGlb('StageInfo');
		for(var kA in si){
			var info=si[kA];
			arr.push(info.img);
			var bullets=info.bullets;
			for(var kB in bullets)arr.push(bullets[kB]);
		}

		var e=this.add.emitter(this.world.centerX,this.world.height,100);
		e.width=this.world.width*.8;
		e.makeParticles(arr);
		e.minParticleScale=.5;
		e.maxParticleScale=2;
		e.setYSpeed(-800,-1200);
		e.setXSpeed(-300,300);
		e.gravity.y=1E3;
		e.start(!1,2E3,this.time.physicsElapsedMS*10,0);
	},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				this.M.SE.play('OnStart',{volume:1});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
				this.Tween.onComplete.add(function(){this.M.NextScene('SelectStage')},this);
				this.Tween.start();
			}
		} else {
			this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	charTw:function(){
		this.M.SE.play('OnBtn',{volume:1.5});
		var url='https://twitter.com/god_yaksa23';
		this.game.device.desktop?window.open(url,"_blank"):location.href=url;
		myGa('external_link','Title','海夜叉神 Twitter',this.M.gGlb('playCount'));
	},
	chgLang:function(){
		if(this.curLang=='en'){
			this.curLang='jp';
			this.M.sGlb('curLang',this.curLang);
			this.curWords=this.Words[this.curLang];
		}else{
			this.curLang='en';
			this.M.sGlb('curLang',this.curLang);
			this.curWords=this.Words[this.curLang];
		}
		//////// this.StartTS.changeText(this.curWords.Start);
		//////// this.CharTwTS.changeText(this.curWords.CharTw);
		//////// this.LangTS.changeText(this.curWords.Lang);
		//////// this.M.SE.play('OnBtn',{volume:1});
	},
	gotoCredit:function(){
		this.M.SE.play('OnBtn',{volume:1.5});
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
BasicGame.SelectStage=function(){};
BasicGame.SelectStage.prototype={
	init:function(){
		this.StageInfo=this.M.gGlb('StageInfo');
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.M.SE.playBGM('TitleBGM',{volume:1});
		this.add.sprite(0,0,this.M.gGlb('endTut')?'Bg_B':'Bg_A');

		var y=this.world.height*.4;
		for(var k in this.StageInfo){
			var info=this.StageInfo[k];
			if(info.open)this.M.S.genLbl(this.world.width*.75,y,this.select,info.name).stg=k;
			y+=this.world.height*.1;
		}

		this.M.S.genTxt(this.world.centerX,this.world.height*.1,this.curWords.SelectStg,this.M.S.txtstyl(35));
		this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.Back);

		this.genHUD();
	},
	select:function(b){
		if (!this.Tween.isRunning) {
			this.M.sGlb('curStg',b.stg);
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('play','SelectStage','Stage_'+b.stg,this.M.gGlb('playCount'));
			this.M.SE.play('OnStart',{volume:1});
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
			this.M.SE.play('OnBtn',{volume:1.5});
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0xfffb63;
		this.M.S.genFlScBtn(this.world.width*.9,y).tint=0xfffb63;
	},
};