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
		this.charInfoLen=Object.keys(this.CharInfo).length;
		// Val
		this.tickTimer=1E3;
		this.tickTime=0;
		this.waveTime=
		this.waveInterval=this.curCharInfo.waveInterval;
		this.itemTime=0;
		this.itemInterval=this.curCharInfo.itemInterval;
		this.isWaving=!0;
		this.waveCount=0;

		this.jumpLineY=this.world.height*.4;
		this.score=0;
		this.scoreRate=1;
		this.deviceScoreRate=this.game.device.touch?1:1.2;

		// Obj
		this.Chars=this.Thorn=this.LineS=
		this.HUD=this.ScoreTS=this.WaveTimeTS=this.HowToS=this.EndTS=
		this.BackSnow=this.MidSnow=this.FrontSnow=this.JumpEff=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#000';
		this.playBgm();

		this.genContents();
		this.M.gGlb('endTut')?this.genStart():this.genTut();
		this.test();
	},
	update:function(){
		if(this.isPlaying){
			this.tickTimer-=this.time.elapsed;
			if(this.tickTimer<0){
				this.tickTimer=1E3;

				this.tickTime++;
				if(this.tickTime==20){
			    	this.changeWindDirection();
			    	this.tickTime=0;
				}

				this.itemTime++;
				if(this.itemTime==this.itemInterval){
					this.appearItem();
					this.itemTime=0;
				}

				if(this.isWaving){
					this.waveTime--;
					this.WaveTimeTS.changeText(this.curWords.WaveTime+this.waveTime);
					if(this.waveTime==0)this.wave();	
				}
			}

			this.physics.arcade.overlap(this.Thorn,this.Chars,this.collideThorn,null,this);
			////// this.physics.arcade.overlap(this.LineS,this.Chars,this.crossLine,null,this);
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
			this.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(function(){this.waveTime=1},this);
			this.input.keyboard.addKey(Phaser.Keyboard.I).onDown.add(this.appearItem,this);
		}
	},
	renderT:function(){
		this.game.debug.body(this.Thorn);
		this.Chars.forEachAlive(function(c){this.game.debug.body(c)},this);
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.genBg();
		this.genEff();
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.genLine();
		this.genThorn();
		this.genChars();
		this.genHUD();
	},
	genBg:function(){
		this.add.sprite(0,0,'SkyBg');
		
		this.BackSnow=this.add.emitter(this.world.centerX,-50,600);
		this.BackSnow.makeParticles('snowflakes',[0,1,2,3,4]);
		this.BackSnow.maxParticleScale=.3;
		this.BackSnow.minParticleScale=.1;
		this.BackSnow.setYSpeed(20,100);
		this.BackSnow.gravity=0;
		this.BackSnow.width=this.world.width*1.5;
		this.BackSnow.minRotation=0;
		this.BackSnow.maxRotation=40;

    	this.MidSnow=this.add.emitter(this.world.centerX,-50,250);
		this.MidSnow.makeParticles('snowflakes',[0,1,2,3,4]);
    	this.MidSnow.maxParticleScale=.3;
    	this.MidSnow.minParticleScale=.24;
    	this.MidSnow.setYSpeed(50,150);
    	this.MidSnow.gravity=0;
    	this.MidSnow.width=this.world.width*1.5;
    	this.MidSnow.minRotation=0;
    	this.MidSnow.maxRotation=40;

    	this.FrontSnow=this.add.emitter(this.world.centerX,-50,50);
		this.FrontSnow.makeParticles('snowflakes',[0,1,2,3,4]);
    	this.FrontSnow.maxParticleScale=.5;
    	this.FrontSnow.minParticleScale=.25;
    	this.FrontSnow.setYSpeed(100,200);
    	this.FrontSnow.gravity=0;
    	this.FrontSnow.width=this.world.width*1.5;
    	this.FrontSnow.minRotation=0;
    	this.FrontSnow.maxRotation=40;

    	this.changeWindDirection();

    	this.BackSnow.start(!1,14E3,this.time.physicsElapsedMS*5);
    	this.MidSnow.start(!1,12E3,this.time.physicsElapsedMS*10);
    	this.FrontSnow.start(!1,6E3,this.time.physicsElapsedMS*100);
	},
	changeWindDirection:function(){
		if(this.rnd.between(0,100)<50){
			var min=0,max=this.rnd.between(0,150);
		}else{
			var min=this.rnd.between(-150,0),max=0;
		}
		this.BackSnow.setXSpeed(min,max);
		this.MidSnow.setXSpeed(min,max);
		this.FrontSnow.setXSpeed(min,max);
	},
	genEff:function(){
		this.JumpEff=this.add.emitter(0,0,200);
		this.JumpEff.makeParticles('CircleBlock');
		this.JumpEff.setYSpeed(500,50);
		this.JumpEff.setScale(3,.3,3,.3,800);
		this.JumpEff.setAlpha(1,0,800);
		this.JumpEff.lifespan=800;
	},
	genLine:function(){
		this.LineS=this.M.S.genBmpSqrSp(0,this.jumpLineY,this.world.width,10,'#ff0000');
		////// this.physics.enable(this.LineS,Phaser.Physics.ARCADE);
	},
	appearItem:function(){
		var itemW=150;
		var r=this.rnd.between(1,4);
		if(this.rnd.between(0,100)<50){
			var fromX=-itemW,toX=this.world.width+itemW,scaleX=-1;
		}else{
			var fromX=this.world.width+itemW,toX=-itemW,scaleX=1;
		}
		var itemB=this.add.button(fromX,this.rnd.between(this.world.height*.1,this.jumpLineY),'Item_'+r,this.getItem,this);
		itemB.anchor.setTo(.5,1);
		itemB.scale.setTo(scaleX,1);
		itemB.num=r;
		var tw=this.M.T.moveB(itemB,{xy:{x:toX},duration:this.curCharInfo.itemSpeed});
		tw.onComplete.add(function(b){b.destroy()});
		tw.start();
		this.M.SE.play('AppearItem',{volume:1});
	},
	getItem:function(b){
		b.destroy();
		var txtstyl=this.M.S.txtstyl(30);

		if(b.num==1||b.num==2){
			this.scoreRate=this.scoreRate+.2;
			var txt=this.curWords.ScoreTripleFront+this.scoreRate.toFixed(1)+this.curWords.ScoreUpBack;
			txtstyl.fill=txtstyl.mStroke='#1e90ff';
		}else{
			this.scoreRate=this.scoreRate+.1;
			var txt=this.curWords.ScoreDoubleFront+this.scoreRate.toFixed(1)+this.curWords.ScoreUpBack;
			txtstyl.fill=txtstyl.mStroke='#800000';
		}

		var ts=this.M.S.genTxt(this.world.centerX,this.world.height,txt,txtstyl);
		var tw=this.M.T.moveA(ts,{xy:{y:this.world.height*.8}});
		tw.onComplete.add(function(s){
			this.time.events.add(500,function(){
				this.destroy();
			},s);
		},this);
		tw.start();
		this.M.SE.play('GetItem',{volume:1});
	},
	genThorn:function(){
		this.Thorn=this.add.sprite(0,this.world.height,'Thorn');
		this.Thorn.anchor.setTo(0,1);
		this.physics.enable(this.Thorn,Phaser.Physics.ARCADE);
		this.Thorn.body.setSize(this.world.width,this.Thorn.height,0,this.Thorn.height*.5);
	},
	genChars:function(){
		this.Chars=this.add.group();
		this.Chars.enableBody=!0;
		this.Chars.physicsBodyType=Phaser.Physics.ARCADE;
		var arr=[];
		for(var i=1;i<=this.charInfoLen;i++){
			var s=this.add.sprite(0,0,'Char_'+i);
			this.Chars.add(s);
			s.anchor.setTo(.5);
			s.smoothed=!1;
			s.inputEnabled=!0;
			s.events.onInputDown.add(this.jump,this);
			s.body.collideWorldBounds=!0;
			s.body.bounce.set(.8);
			s.body.gravity.set(0,180);
			s.width=s.height=100;
			s.kill();
		}
	},
	jump:function(b,p){
		if(b.y>this.jumpLineY){
			////// b.inputEnabled=!1;
			b.body.velocity.x=(b.x-p.x)*this.time.physicsElapsedMS*.5;
			b.body.velocity.y=-this.curCharInfo.jumpPower*this.time.physicsElapsedMS;

			this.M.SE.play('Jump_'+this.rnd.between(1,3),{volume:1});
			this.JumpEff.x=b.x;
			this.JumpEff.y=b.y;
			this.JumpEff.explode(800,Math.floor(320/this.time.physicsElapsedMS));

			if(this.isPlaying){
				this.score+=Math.floor((this.waveCount+1)*this.curCharInfo.scoreRate*b.y*b.y*.01*this.scoreRate*this.deviceScoreRate);
				this.ScoreTS.changeText(this.curWords.Score+this.M.H.formatComma(this.score));
			}
		}
	},
	collideThorn:function(thorn,char){
		char.kill();
		this.gameOver();
	},
	crossLine:function(line,char){
		if(!char.inputEnabled)char.inputEnabled=!0;
	},
	wave:function(){
		this.waveCount++;
		this.respawn();
		var waveInterval=this.waveInterval+5;
		this.waveTime=waveInterval>30?30:waveInterval;
	},
	respawn:function(charNum){
		if(charNum){
			var s=this.Chars.children[charNum-1];
		}else{
			var s=this.rnd.pick(this.Chars.children.filter(function(c){return!c.alive}));
		}
		if(s){
			s.reset(this.world.randomX*.5+this.world.width*.25,this.world.height*.2);
			if(this.waveCount<6){
				s.width=s.height=100-this.waveCount*this.curCharInfo.miniHard;
			}else{
				s.width=s.height=100-5*this.curCharInfo.miniHard;
			}
		}else{
			this.isWaving=!1;
			this.WaveTimeTS.changeText(this.curWords.Endless);
		}
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
		this.HUD.visible=!1;
	},
	playBgm:function(){
		if(!this.M.SE.isPlaying('currentBGM')||this.M.SE.isPlaying('TitleBGM')){
			this.M.SE.stop('currentBGM');
			var bgm=this.M.SE.play('PlayBGM_'+this.rnd.between(1,2),{volume:1,isBGM:!0});
			bgm.onStop.add(this.loopBgm,this);
		}
	},
	loopBgm:function(){
		if(this.M.currentScene=='Play'){
			this.M.sGlb('curBgmNum',this.M.gGlb('curBgmNum')+1);
			if(this.M.gGlb('curBgmNum')==3)this.M.sGlb('curBgmNum',1);
			var bgm=this.M.SE.play('PlayBGM_'+this.M.gGlb('curBgmNum'),{volume:1,isBGM:!0});
			bgm.onStop.add(this.loopBgm,this);
		}
	},
	////////////////////////////////////////////////////////////////////////////////////
	gameOver:function(){
		if(this.isPlaying){
			this.end();
			this.camera.shake(.03,500,!0,Phaser.Camera.SHAKE_BOTH);
			this.M.SE.play('End',{volume:1});
			this.time.events.add(500,this.genEnd,this);
			/////// this.Chars.killAll();
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
		this.M.SE.play('GenStart',{volume:1});
		this.HUD.visible=!0;
		this.start();
		this.respawn(this.curChar);
	},
	genEnd:function(){
		var txtstyl=this.M.S.txtstyl(45);
		txtstyl.fill=txtstyl.mStroke='#ff0000';
		this.EndTS=this.M.S.genTxt(this.world.centerX,this.world.height*2,this.curWords.End,txtstyl);
		var tw=this.M.T.moveA(this.EndTS,{xy:{y:this.world.centerY}});
		tw.onComplete.add(this.genRes,this);
		tw.start();
	},
	////////////////////////////////////////////////////////////////////////////////////
	genRes:function(){
		var s=this.add.sprite(0,-this.world.height,'TWP');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600});
		tw.onComplete.add(function(){this.inputEnabled=!0},this);
		tw.onComplete.add(function(){this.visible=!1},this.EndTS);
		tw.onStart.add(function(){this.M.SE.play('Res',{volume:1})},this);
		tw.start();
		this.HUD.visible=!1;

		var lbl;
		var txtstyl=this.M.S.txtstyl(40);

		txtstyl.fill=txtstyl.mStroke='#3cb371';
		lbl=this.M.S.genTxt(this.world.centerX,this.world.height*.08,this.curWords.Result,txtstyl);
		s.addChild(lbl);

		txtstyl.fontSize=35;
		txtstyl.fill=txtstyl.mStroke='#dc143c';
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.22,this.curWords.ResScore+this.M.H.formatComma(this.score),txtstyl));

		var charS=this.add.sprite(this.world.centerX,this.world.height*.46,'Char_'+this.curChar);
		charS.anchor.setTo(.5);
		charS.width=charS.height=charS.width*.8;
		s.addChild(charS);
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.65,this.curCharInfo.cName));

		var lX=this.world.width*.25,rX=this.world.width*.75;
		txtstyl.fontSize=25;

		txtstyl.fill=txtstyl.mStroke='#00fa9a';
		lbl=this.M.S.genLbl(lX,this.world.height*.72,this.again,this.curWords.Again,txtstyl);
		lbl.tint=0x00fa9a;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#00a2f8';
		lbl=this.M.S.genLbl(rX,this.world.height*.72,this.tweet,this.curWords.TwBtn,txtstyl);
		lbl.tint=0x00a2f8;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#8a2be2';
		lbl=this.M.S.genLbl(lX,this.world.height*.82,this.back,this.curWords.Back,txtstyl);
		lbl.tint=0x8a2be2;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#ffa500';
		lbl=this.M.S.genLbl(rX,this.world.height*.82,this.othergames,this.curWords.OtherGames,txtstyl);
		lbl.tint=0xffa500;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#00a2f8';
		lbl=this.M.S.genLbl(lX,this.world.height*.92,this.tw,'Twitter',txtstyl);
		lbl.tint=0x00a2f8;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#ff0000';
		lbl=this.M.S.genLbl(rX,this.world.height*.92,this.yt,'YouTube',txtstyl);
		lbl.tint=0xff0000;
		s.addChild(lbl);
	},
	yt:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curCharInfo.yt;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('youtube','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	tw:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curCharInfo.tw;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('twitter','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	again:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnStart',{volume:1});
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
			this.M.SE.play('OnBtn',{volume:1});
			var url=__VTUBER_GAMES;
			if(this.curLang=='en')url+='?lang=en';
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('othergames','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var e=this.curCharInfo.emoji;
			var res=
				this.curWords.TwSelectChar+this.curCharInfo.cName+'\n'+
				this.curWords.Score+this.M.H.formatComma(this.score)+'\n';
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			this.M.H.tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('Back',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectChar')},this);
			this.Tween.start();
		}
	},
};