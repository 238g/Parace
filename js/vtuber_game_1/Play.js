BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.curCharList=this.M.gGlb('curCharList');//{1:*,2:*,3:*,4:*};
		this.curFirstChar=this.M.gGlb('curFirstChar');
		this.CharInfo=this.M.gGlb('CharInfo');
		this.curFirstCharInfo=this.CharInfo[this.curFirstChar];
		this.curLevel=1;
		this.LevelInfo=this.M.gGlb('LevelInfo');
		this.curLevelInfo=this.LevelInfo[this.curLevel];
		// Val
		this.respawnTimer=1E3;
		this.respawnInterval=this.curLevelInfo.respawnInterval;
		this.hp=0;
		this.vel=0;
		this.hdr=0;
		this.charVelocity=0;
		this.charHarder=0;
		this.charKeysArr=[];
		this.appearCharList={1:[],2:[],3:[],4:[]};
		this.score=0;
		this.scoreRate=10;
		this.nextLevel=this.curLevelInfo.nextLevel*this.scoreRate*this.curLevel;
		this.baseFrameSize=this.world.width/4-20;

		// Obj
		this.BgS=this.BgS2=this.Btns=
		this.DmgEff=this.Parachute=
		this.ParachuteCollisionGroup=this.FloorCollisionGroup=
		this.HUD=this.HPTS=this.EndTS=this.ScoreTS=this.HowToS=
		null;
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		this.stage.backgroundColor='#000';
		this.playBgm();
		this.genContents();
		this.M.gGlb('endTut')?this.genStart():this.genTut();
		this.test();
	},
	update:function(){
		if(this.isPlaying){
			this.respawnTimer-=this.time.elapsed;
			if(this.respawnTimer<0){
				this.respawnTimer=this.respawnInterval;
				this.respawnParachute();
			}
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.gameOver,this);
			this.curLevel=this.M.H.getQuery('level')||1;this.curLevelInfo=this.LevelInfo[this.curLevel];
			return;
			if(!this.curCharList[1]){
				this.curCharList={1:9,2:3,3:25,4:1};
				this.genContents();
			}
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.genBg();
		this.setCharInfo();
		this.setPhysics();
		this.genDmgEff();
		this.genFloor();
		this.genParachute();
		this.genBtns();
		this.genHUD();
	},
	genBg:function(){
		this.BgS=this.add.sprite(0,0,'PlayBg_'+this.M.gGlb('curBgmNum'));
		this.BgS2=this.add.sprite(0,0,'');
		this.BgS2.alpha=0;
	},
	setCharInfo:function(){
		for(var k in this.curCharList){
			var charNum=this.curCharList[k];
			var info=this.CharInfo[charNum];
			if(k==1){
				this.hp+=(info.hp*2);
				this.vel+=Math.floor(info.vel/2);
				this.hdr+=Math.floor(info.hdr/2);
			}else{
				this.hp+=info.hp;
				this.vel+=info.vel;
				this.hdr+=info.hdr;
			}

			//// special
			if((charNum==2||charNum==3)&&this.rnd.between(0,100)<50){
				this.charKeysArr.push('intro_'+charNum+'_2');
			}else{
				this.charKeysArr.push('intro_'+charNum);
			}
			//// special
		}
		this.charVelocity=(40-this.vel)*5;
		this.charHarder=(40-this.hdr);
		this.nextLevel*=this.charHarder;
	},
	setPhysics:function(){
		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.setImpactEvents(!0);
		this.physics.p2.restitution=.8;
		this.ParachuteCollisionGroup=this.physics.p2.createCollisionGroup();
		this.FloorCollisionGroup=this.physics.p2.createCollisionGroup();
		this.physics.p2.updateBoundsCollisionGroup();
	},
	genDmgEff:function(){
		this.DmgEff=this.add.emitter(0,0,200);
		this.DmgEff.makeParticles('WB');
		this.DmgEff.setScale(3,.3,3,.3,800);
		this.DmgEff.setAlpha(1,0,800);
		this.DmgEff.setXSpeed(-100,100);
		this.DmgEff.setYSpeed(-100,100);
		this.DmgEff.gravity.x=0;
		this.DmgEff.gravity.y=1E3;
	},
	genFloor:function(){
		var f=this.add.sprite(this.world.centerX,this.world.height,'Floor');
		f.anchor.setTo(.5);
		this.physics.p2.enable(f);
		f.body.static=!0;
		f.body.setCollisionGroup(this.FloorCollisionGroup);
		f.body.collides(this.ParachuteCollisionGroup,this.hitFloor,this);
		////// f.body.debug=!0;
	},
	hitFloor:function(f,p){
		if(p.sprite.alive&&this.isPlaying){
			p.sprite.kill();
			this.damaged();
			this.M.SE.play('HitFloor',{volume:1});
			this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
			var list=this.appearCharList[p.sprite.charListNum];
			list.shift();
		}
	},
	damaged:function(){
		if(this.isPlaying){
			this.hp--;
			this.HPTS.changeText('HP:'+this.hp);
			if(this.hp<=0)this.gameOver();
		}
	},
	genParachute:function(){
		this.Parachute=this.add.group();
		this.Parachute.physicsBodyType=Phaser.Physics.P2JS;
		this.Parachute.enableBody=!0;
		this.Parachute.createMultiple(20,this.charKeysArr);
		this.Parachute.forEach(function(s){
			s.width=this.baseFrameSize;
			s.height=this.baseFrameSize;
			s.smoothed=!1;
			s.outOfBoundsKill=!0;
			s.checkWorldBounds=!0;
			s.body.setCircle(s.width*.5);
			s.body.setCollisionGroup(this.ParachuteCollisionGroup);
			s.body.collides(this.FloorCollisionGroup);
			s.body.collideWorldBounds=!0;
			for(var k in this.charKeysArr)if(s.key==this.charKeysArr[k])s.charListNum=Number(k)+1;
			var parachute=this.add.sprite(0,-s.height,'Parachute');
			parachute.anchor.setTo(.5,1);
			s.addChild(parachute);
		},this);
	},
	respawnParachute:function(){
		var s=this.rnd.pick(this.Parachute.children.filter(function(e){return!e.alive}));
		if(s){
			s.reset(this.world.randomX*.9+this.world.width*.05,s.height);
			var vel=this.curLevelInfo.vel+this.charVelocity;
			if(vel>1E3)vel=1E3;
			s.body.velocity.y=vel;
			///// s.body.debug=!0;

			var rnd=this.rnd.between(5,10);
			s.width=this.baseFrameSize*rnd*.1;
			s.height=this.baseFrameSize*rnd*.1;
			s.body.setCircle(s.width*.5);
			s.body.setCollisionGroup(this.ParachuteCollisionGroup);

			this.appearCharList[s.charListNum].push(s);
		}
	},
	genBtns:function(){
		this.Btns=[];
		var y=this.world.height*.9;
		for(var i=0;i<4;i++){
			var x=i*100+50;
			var b=this.add.button(x,y,this.charKeysArr[i],this.shoot,this);
			b.alpha=.5;
			b.anchor.setTo(.5);
			b.width=this.baseFrameSize;
			b.height=this.baseFrameSize;
			b.charNum=this.curCharList[i+1];
			b.charListNum=i+1;
			b.onInputDown.add(function(c){c.alpha=1});
			this.Btns.push(b);
		}
		if(this.game.device.desktop){
			this.input.keyboard.addKey(Phaser.Keyboard.D).onUp.add(function(){this.shoot(this.Btns[0])},this);
			this.input.keyboard.addKey(Phaser.Keyboard.F).onUp.add(function(){this.shoot(this.Btns[1])},this);
			this.input.keyboard.addKey(Phaser.Keyboard.J).onUp.add(function(){this.shoot(this.Btns[2])},this);
			this.input.keyboard.addKey(Phaser.Keyboard.K).onUp.add(function(){this.shoot(this.Btns[3])},this);
			this.input.keyboard.addKey(Phaser.Keyboard.D).onDown.add(function(){this.Btns[0].alpha=1},this);
			this.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(function(){this.Btns[1].alpha=1},this);
			this.input.keyboard.addKey(Phaser.Keyboard.J).onDown.add(function(){this.Btns[2].alpha=1},this);
			this.input.keyboard.addKey(Phaser.Keyboard.K).onDown.add(function(){this.Btns[3].alpha=1},this);	
		}
	},
	shoot:function(b){
		if(this.isPlaying){
			var list=this.appearCharList[b.charListNum];
			var s=list[0];
			if(s){
				s.kill();
				this.DmgEff.x=s.x;
				this.DmgEff.y=s.y;
				this.DmgEff.explode(800,Math.floor(400/this.time.physicsElapsedMS));
				this.score+=Math.floor(this.scoreRate*this.curLevel*25);
				this.ScoreTS.changeText(this.curWords.Score+this.formatScore());
				list.shift();
				this.M.SE.play('Shoot',{volume:1});
				this.levelUp();
			}else{
				this.damaged();
				this.genMissTS();
			}
			b.alpha=.5;
		}
	},
	levelUp:function(){
		if(this.nextLevel<this.score&&this.curLevel<21){
			this.curLevel++;
			this.curLevelInfo=this.LevelInfo[this.curLevel];
			this.nextLevel=this.curLevelInfo.nextLevel*this.scoreRate*this.curLevel*this.charHarder;
			this.respawnInterval=this.curLevelInfo.respawnInterval;
			if(this.curLevel==21){
				this.LevelTS.changeText('Level: MAX');
			}else{
				this.LevelTS.changeText('Level: '+this.curLevel);
			}
			this.M.SE.play('OnPlay',{volume:1});
			this.genLevelUp();
		}
	},
	genLevelUp:function(){
		var txtstyl=this.M.S.txtstyl(50);
		txtstyl.fill=txtstyl.mStroke='#0080FF';
		var s=this.M.S.genTxt(this.world.centerX,-this.world.centerY,'LEVEL UP',txtstyl);
		var twA=this.M.T.moveA(s,{xy:{y:this.world.centerY},duration:500});
		var twB=this.add.tween(s).to({y:this.world.height*1.5},500,Phaser.Easing.Back.In,!1,300);
		twA.chain(twB);
		twA.start();
		twA.onComplete.add(function(){this.destroy},s);
	},
	genMissTS:function(){
		var x=this.world.randomX*.5+this.world.width*.25;
		var y=this.world.randomY*.5+this.world.height*.25;
		//ENHANCE MakeImage
		var s=this.M.S.genTxt(x,y,'MISS');
		s.scale.setTo(2);
		var tw=this.add.tween(s.scale).to({x:1,y:1},500,Phaser.Easing.Exponential.In,!0);
		tw.onComplete.add(function(){this.destroy()},s);
		s.angle=this.rnd.between(-45,45);
		this.M.SE.play('Miss',{volume:1});
	},
	genHUD:function(){
		this.HUD=this.add.group();

		var txtstyl=this.M.S.txtstyl(25);

		txtstyl.fill=txtstyl.mStroke='#01DF3A';
		this.ScoreTS=this.M.S.genTxt(this.world.width-10,10,this.curWords.Score+this.formatScore(),txtstyl);
		this.ScoreTS.anchor.setTo(1,0);
		this.ScoreTS.children[0].anchor.setTo(1,0);		
		this.HUD.add(this.ScoreTS);

		txtstyl.fill=txtstyl.mStroke='#DF0101';
		this.HPTS=this.M.S.genTxt(10,10,'HP: '+this.hp,txtstyl);
		this.HPTS.anchor.setTo(0);
		this.HPTS.children[0].anchor.setTo(0);
		this.HUD.add(this.HPTS);

		txtstyl.fill=txtstyl.mStroke='#0080FF';
		this.LevelTS=this.M.S.genTxt(10,10+this.HPTS.height,'Level: '+this.curLevel,txtstyl);
		this.LevelTS.anchor.setTo(0);
		this.LevelTS.children[0].anchor.setTo(0);
		this.HUD.add(this.LevelTS);

		this.HUD.visible=!1;
	},
	gameOver:function(){
		this.Parachute.killAll();
		this.end();
		this.genEnd();
	},
	playBgm:function(){
		if(!this.M.SE.isPlaying('currentBGM')||this.M.SE.isPlaying('TitleBGM')){
			this.M.SE.stop('currentBGM');
			var bgm=this.M.SE.play('PlayBGM_'+this.M.gGlb('curBgmNum'),{volume:1,isBGM:!0});
			bgm.onStop.add(this.loopBgm,this);
		}
	},
	loopBgm:function(){
		if(this.M.currentScene=='Play'){
			this.M.sGlb('curBgmNum',this.M.gGlb('curBgmNum')+1);
			if(this.M.gGlb('curBgmNum')==4)this.M.sGlb('curBgmNum',1);;
			var bgm=this.M.SE.play('PlayBGM_'+this.M.gGlb('curBgmNum'),{volume:1,isBGM:!0});
			bgm.onStop.add(this.loopBgm,this);

			this.changeBg();
		}
	},
	changeBg:function(){
		this.BgS2.loadTexture('PlayBg_'+this.M.gGlb('curBgmNum'));
		var tw=this.M.T.fadeInA(this.BgS2,{duration:600,alpha:1});
		tw.onComplete.add(function(){
			this.BgS.loadTexture('PlayBg_'+this.M.gGlb('curBgmNum'));
			this.BgS2.alpha=0;
		},this);
		tw.start();
	},
	formatScore:function(){
		return this.M.H.formatComma(this.score);
	},
	////////////////////////////////////////////////////////////////////////////////////
	genEnd:function(){
		var txtstyl=this.M.S.txtstyl(45);
		txtstyl.fill=txtstyl.mStroke='#DF0101';
		this.EndTS=this.M.S.genTxt(this.world.centerX,this.world.height*2,this.curWords.GameOver,txtstyl);
		var tw=this.M.T.moveA(this.EndTS,{xy:{y:this.world.centerY}});
		tw.onComplete.add(this.genRes,this);
		tw.start();
		this.M.SE.play('End',{volume:1});
	},
	genRes:function(){
		var s=this.add.sprite(0,-this.world.height,'TWP');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600});
		tw.onComplete.add(function(){this.inputEnabled=!0},this);
		tw.onComplete.add(function(){this.visible=!1},this.EndTS);
		tw.onStart.add(function(){this.M.SE.play('Res',{volume:2})},this);
		tw.start();
		this.HUD.visible=!1;

		var txtstyl=this.M.S.txtstyl(40);

		txtstyl.fill=txtstyl.mStroke='#01DF3A';
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.05,this.curWords.Result,txtstyl));

		txtstyl.fill=txtstyl.mStroke='#01DF3A';
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.2,this.curWords.ResScore+this.formatScore(),txtstyl));

		var charFrame=this.add.sprite(this.world.centerX,this.world.height*.45,'intro_'+this.curFirstChar);
		charFrame.anchor.setTo(.5);
		s.addChild(charFrame);
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.65,this.CharInfo[this.curFirstChar].cName));

		s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.75,this.again,this.curWords.Again));
		s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.75,this.tweet,this.curWords.TwBtn));
		s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.85,this.back,this.curWords.Back));
		s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.85,this.othergames,this.curWords.OtherGames));
		s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.95,this.tw,'Twitter'));
		s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.95,this.yt,'YouTube'));
	},
	yt:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curFirstCharInfo.yt;
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('youtube','Play','FirstChar_'+this.curFirstChar,this.M.gGlb('playCount'));
		}
	},
	tw:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curFirstCharInfo.tw;
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('twitter','Play','FirstChar_'+this.curFirstChar,this.M.gGlb('playCount'));
		}
	},
	again:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnPlay',{volume:1});
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('again','Play','FirstChar_'+this.curFirstChar,this.M.gGlb('playCount'));
		}
	},
	othergames:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=__VTUBER_GAMES;
			if(this.curLang=='en')url+='?lang=en';
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('othergames','Play','FirstChar_'+this.curFirstChar,this.M.gGlb('playCount'));
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var e='🎮🍲🎈🍲🎈🍲🎮';
			var res=
				this.curWords.SelectTw+this.curFirstCharInfo.cName+'\n'+
				'Level: '+(this.curLevel==21?'MAX':this.curLevel)+'\n'+
				this.curWords.Score+this.formatScore()+'\n';
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			this.M.H.tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','FirstChar_'+this.curFirstChar,this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnBtn',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectChar')},this);
			this.Tween.start();
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
		var twA=this.M.T.moveA(s,{xy:{y:this.world.centerY},duration:800});
		var twB=this.add.tween(s).to({y:this.world.height*1.5},600,Phaser.Easing.Back.In,!1,300);
		twA.chain(twB);
		twA.start();
		twA.onComplete.add(function(){this.inputEnabled=!0},this);
		twA.onComplete.add(function(){this.destroy},s);
		this.M.SE.play('GenStart',{volume:1});
		this.HUD.visible=!0;
		this.start();
	},
};