BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.curChar=this.M.gGlb('curChar');
		this.CharInfo=this.M.gGlb('CharInfo');
		this.curCharInfo=this.CharInfo[this.curChar];
		// Val
		this.tickTimer=1E3;
		this.waveTime=
		this.waveInterval=30;//TODO per char
		

		this.jumpLineY=this.world.centerY;
		this.score=0;

		// Obj
		this.Chars=this.Thorn=this.LineS=
		this.HUD=this.ScoreTS=this.WaveTimeTS=this.HowToS=this.EndTS=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000';
		// this.M.SE.playBGM('PlayBGM_'+this.rnd.between(1,2),{volume:1});//TODO

		this.genContents();
		// this.M.gGlb('endTut')?this.genStart():this.genTut();
		this.genStart();//TODO del
		this.test();
	},
	update:function(){
		if(this.isPlaying){
			this.tickTimer-=this.time.elapsed;
			if(this.tickTimer<0){
				this.tickTimer=1E3;

				this.waveTime--;
				this.WaveTimeTS.changeText(this.curWords.WaveTime+this.waveTime);
				if(this.waveTime==0)this.wave();
			}

			this.physics.arcade.overlap(this.Thorn,this.Chars,this.collideThorn,null,this);
			this.physics.arcade.overlap(this.LineS,this.Chars,this.crossLine,null,this);
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
		}
	},
	render:function(){
		this.Chars.forEachAlive(function(c){this.game.debug.body(c)},this);
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.setPhysics();

		this.genLine();
		this.genThorn();
		this.genChars();

		this.genHUD();
	},
	setPhysics:function(){
		this.physics.startSystem(Phaser.Physics.ARCADE);
		// this.world.enableBody=!0;
	},
	genLine:function(){
		this.LineS=this.M.S.genBmpSqrSp(0,this.jumpLineY,this.world.width,10,'#ff0000');
		this.physics.enable(this.LineS,Phaser.Physics.ARCADE);
	},
	genThorn:function(){
		// TODO
		this.Thorn=this.M.S.genBmpSqrSp(0,this.world.height,this.world.width,50,'#00ff00');
		this.Thorn.anchor.setTo(0,1);
		this.physics.enable(this.Thorn,Phaser.Physics.ARCADE);
	},
	genChars:function(){
		this.Chars=this.add.group();
		this.Chars.enableBody=!0;
		this.Chars.physicsBodyType=Phaser.Physics.ARCADE;
		this.Chars.createMultiple(1,'todo_1');
		this.Chars.forEach(function(c){
			c.anchor.setTo(.5);
			c.smoothed=!1;
			c.inputEnabled=!0;
			c.events.onInputDown.add(this.jump,this);
			c.body.collideWorldBounds=!0;
			c.body.bounce.set(.8);//TODO
			c.body.gravity.set(0,180);//TODO
			// TODO circle body
		},this);

		//TODO
		var s=this.rnd.pick(this.Chars.children.filter(function(c){return!c.alive}));
		s.reset(this.world.centerX,this.world.height*.2);
	},
	jump:function(b,p){
		if(b.y>this.jumpLineY){
			b.inputEnabled=!1;//TODO check double click
			console.log(b);
			b.body.velocity.x=(b.x-p.x)*10;
			b.body.velocity.y=-300;

			this.score++;//TODO per char
			this.ScoreTS.changeText(this.curWords.Score+this.M.H.formatComma(this.score));
		}
	},
	collideThorn:function(thorn,char){
		char.kill();
		this.gameOver();
	},
	crossLine:function(line,char){
		if(!char.inputEnabled){
			char.inputEnabled=!0;//TODO check double click
		}
	},
	wave:function(){
		// TODO respawn
		this.waveTime=this.waveInterval;
	},
	genHUD:function(){
		this.HUD=this.add.group();

		var txtstyl=this.M.S.txtstyl(20);
		txtstyl.fill=txtstyl.mStroke='#008000';
		this.ScoreTS=this.M.S.genTxt(0,this.world.height*.01,this.curWords.Score+0,txtstyl);
		this.ScoreTS.anchor.setTo(0);
		this.ScoreTS.children[0].anchor.setTo(0);
		this.HUD.add(this.ScoreTS);

		txtstyl.fill=txtstyl.mStroke='#2E2EFE';
		this.WaveTimeTS=this.M.S.genTxt(0,this.world.height*.06,this.curWords.WaveTime+this.waveTime,txtstyl);
		this.WaveTimeTS.anchor.setTo(0);
		this.WaveTimeTS.children[0].anchor.setTo(0);
		this.HUD.add(this.WaveTimeTS);
		// this.HUD.visible=!1;//TODO OK
	},
	////////////////////////////////////////////////////////////////////////////////////
	gameOver:function(){
		if(this.isPlaying){
			this.end();
			this.genEnd();
		}
	},
	genTut:function(){
		this.HowToS=this.add.sprite(0,0,'TWP');
		this.HowToS.tint=0x000000;
		var ts=this.M.S.genTxt(this.world.centerX,this.world.centerY,this.curWords.HowTo,this.M.S.txtstyl(30));
		this.HowToS.addChild(ts);
		this.time.events.add(300,function(){
			this.input.onDown.addOnce(function(){
				this.M.sGlb('endTut',!0);
				this.HowToS.destroy();
				this.genStart();
			},this);
		},this);
	},
	genStart:function(){
		var txtstyl=this.M.S.txtstyl(50);
		txtstyl.fill=txtstyl.mStroke='#0080FF';
		var s=this.M.S.genTxt(this.world.centerX,-this.world.centerY,this.curWords.Start,txtstyl);
		var twA=this.M.T.moveA(s,{xy:{y:this.world.centerY}});
		var twB=this.M.T.moveA(s,{xy:{x:-this.world.centerX},delay:200});
		twA.chain(twB);
		twA.start();
		twA.onComplete.add(function(){this.inputEnabled=!0},this);
		twA.onComplete.add(function(){this.destroy},s);
		// this.M.SE.play('GenStart',{volume:1});//TODO
		this.HUD.visible=!0;
		this.start();
	},
	genEnd:function(){
		var txtstyl=this.M.S.txtstyl(45);
		txtstyl.fill=txtstyl.mStroke='#ff0000';//TODO color
		this.EndTS=this.M.S.genTxt(this.world.centerX,this.world.height*2,'TODO',txtstyl);
		var tw=this.M.T.moveA(this.EndTS,{xy:{y:this.world.centerY}});
		tw.onComplete.add(this.genRes,this);
		tw.start();
		// this.M.SE.play('GenEnd',{volume:1});//TODO
	},
	////////////////////////////////////////////////////////////////////////////////////
	genRes:function(){
		var s=this.add.sprite(0,-this.world.height,'TWP');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600});
		tw.onComplete.add(function(){this.inputEnabled=!0},this);
		tw.onComplete.add(function(){this.visible=!1},this.EndTS);
		// tw.onStart.add(function(){this.M.SE.play('Res',{volume:1})},this);//TODO
		tw.start();
		this.HUD.visible=!1;

		var lbl;
		var txtstyl=this.M.S.txtstyl(40);

		txtstyl.fill=txtstyl.mStroke='#3cb371';
		lbl=this.M.S.genTxt(this.world.centerX,this.world.height*.08,this.curWords.Result,txtstyl);
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#dc143c';
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.22,this.curWords.ResScore+this.M.H.formatComma(this.score),txtstyl));

		/*
		var charS=this.add.sprite(this.world.centerX,this.world.height*.42,'panel_'+this.curChar);
		charS.anchor.setTo(.5);
		s.addChild(charS);
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.6,this.curCharInfo.cName));
		*/

		var lX=this.world.width*.25,rX=this.world.width*.75;
		txtstyl.fontSize=25;

		//TODO color????
		s.addChild(this.M.S.genLbl(lX,this.world.height*.7,this.again,this.curWords.Again));

		txtstyl.fill=txtstyl.mStroke='#00a2f8';
		lbl=this.M.S.genLbl(rX,this.world.height*.7,this.tweet,this.curWords.TwBtn,txtstyl);
		lbl.tint=0x00a2f8;
		s.addChild(lbl);

		//TODO color????
		s.addChild(this.M.S.genLbl(lX,this.world.height*.8,this.back,this.curWords.Back));

		txtstyl.fill=txtstyl.mStroke='#ffa500';
		lbl=this.M.S.genLbl(rX,this.world.height*.8,this.othergames,this.curWords.OtherGames,txtstyl);
		lbl.tint=0xffa500;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#00a2f8';
		lbl=this.M.S.genLbl(lX,this.world.height*.9,this.tw,'Twitter',txtstyl);
		lbl.tint=0x00a2f8;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#ff0000';
		lbl=this.M.S.genLbl(rX,this.world.height*.9,this.yt,'YouTube',txtstyl);
		lbl.tint=0xff0000;
		s.addChild(lbl);
	},
	yt:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});//TODO
			var url=this.curCharInfo.yt;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('youtube','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	tw:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});//TODO
			var url=this.curCharInfo.tw;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('twitter','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	again:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			// this.M.SE.play('OnStart',{volume:1});//TODO
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('again','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	othergames:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});//TODO
			var url=__VTUBER_GAMES;
			if(this.curLang=='en')url+='?lang=en';
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('othergames','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});//TODO
			var e=333333;//TODO
			var res=333333;//TODO
			//this.M.H.formatComma(this.score)
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			this.M.H.tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			// this.M.SE.play('Back',{volume:1});//TODO
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectLevel')},this);
			this.Tween.start();
		}
	},
};