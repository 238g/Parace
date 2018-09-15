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
		this.StageInfo=this.M.gGlb('StageInfo');
		this.curStageInfo=this.StageInfo[this.curStg];
		// Val
		this.secTimer=1E3;
		this.secTime=0;
		this.rndTimerA=this.rnd.between(1E3,this.curStageInfo.rndTmrMx);
		this.rndTimerB=this.rnd.between(1E3,this.curStageInfo.rndTmrMx);
		this.chgWindTime=10;

		this.windGravityRate=this.rnd.integerInRange(-this.curStageInfo.grvtyR,this.curStageInfo.grvtyR);
		this.windGravity=this.windGravityRate*100;
		this.targetCount=this.curStageInfo.trgtC;
		this.scoreCount=0;

		this.flowMinY=this.world.height*.55;
		this.flowMaxY=this.world.height*.9;

		this.earthHealth=this.curStageInfo.earthHP;
		this.earthDanger=Math.floor(this.earthHealth/3);
		this.earthWarning=this.earthDanger*2;

		this.isClear=!1;

		this.TofuOnFireFrame={x:0,y:0};
		this.playerBackFrame=-1;

		this.countDown=this.curStageInfo.cntDwn;

		// Obj
		this.Player=this.WindArrow=
		this.ScoreCountTS=
		this.Tofu=this.Fire=this.TofuOnFire=this.Satellite=this.BurnedSatellite=
		this.EndTS=this.HowToS=this.EarthS=
		null;
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		this.stage.backgroundColor='#000000';
		this.M.SE.playBGM('PlayBGM',{volume:1});
		this.genContents();
		this.M.gGlb('endTut')?this.genStart():this.genTut();
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			this.Player.x=this.input.activePointer.x;

			if(this.secTimer<0){
				this.secTimer=1E3;
				this.secTime++;

				if(this.secTime==this.playerBackFrame)this.Player.loadTexture('Mei_1');
				
				this.chgWind();

				(this.rnd.between(1,100)<this.curStageInfo.obRA)?this.flowSatellite():this.flowTofu();
				if(this.rnd.between(1,100)<this.curStageInfo.plsTfR)this.flowTofu();

				this.countDown--;
				if(this.countDown==0)this.gameOver();
				this.TimeCountTS.changeText(this.countDown);
			}
			this.secTimer-=this.time.elapsed;

			if(this.rndTimerA<0){
				this.rndTimerA=this.rnd.between(1E3,this.curStageInfo.rndTmrMx);
				(this.rnd.between(1,100)<this.curStageInfo.obRB)?this.flowSatellite():this.flowTofu();
			}
			this.rndTimerA-=this.time.elapsed;

			if(this.rndTimerB<0){
				this.rndTimerB=this.rnd.between(1E3,this.curStageInfo.rndTmrMx);
				(this.rnd.between(1,100)<this.curStageInfo.obRB)?this.flowSatellite():this.flowTofu();
			}
			this.rndTimerB-=this.time.elapsed;

			this.physics.arcade.overlap(this.Fire,this.Tofu,this.burnTofu,null,this);
			this.physics.arcade.overlap(this.Fire,this.Satellite,this.hitSatellite,null,this);
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(this.clear,this);
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
			this.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(function(){this.chgWindTime=this.secTime+1},this);
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.physics.startSystem(Phaser.Physics.ARCADE);

		this.add.sprite(0,0,'Bg_'+this.rnd.integerInRange(1,4));
		this.EarthS=this.add.sprite(this.world.centerX,this.world.height,'Earth_1');
		this.EarthS.anchor.setTo(.5,1);

		this.Player=this.add.sprite(this.world.centerX,this.world.height*.25,'Mei_1');
		this.Player.anchor.setTo(.5);

		this.genPhysicsObj();
		this.genHUD();

		this.game.device.touch?this.input.onUp.add(this.castFire,this):this.input.onDown.add(this.castFire,this);
	},
	genPhysicsObj:function(){
		var img=this.cache.getImage('Fire');
		var bounds={r:img.width*.3,w:img.width*.2,h:img.height*.5};
		this.Fire=this.add.group();
		this.Fire.enableBody=!0;
		this.Fire.physicsBodyType=Phaser.Physics.ARCADE;
		this.Fire.createMultiple(15,'Fire');
		this.Fire.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
			c.smoothed=!1;
			c.body.setCircle(this.r,this.w,this.h);
		},bounds);
		this.Fire.children.forEach(function(c){c.events.onOutOfBounds.add(this.fireOutOfBounds,this)},this);

		this.Tofu=this.add.group();
		this.Tofu.enableBody=!0;
		this.Tofu.physicsBodyType=Phaser.Physics.ARCADE;
		this.Tofu.createMultiple(5,'Tofu_1');
		this.Tofu.createMultiple(50,'Tofu_2');
		this.Tofu.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
			c.smoothed=!1;
		});

		this.Satellite=this.add.group();
		this.Satellite.enableBody=!0;
		this.Satellite.physicsBodyType=Phaser.Physics.ARCADE;
		this.Satellite.createMultiple(15,'Satellite');
		this.Satellite.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
			c.smoothed=!1;
		});
	},
	genHUD:function(){
		this.WindArrow=this.add.sprite(this.world.width*.9,this.world.height*.1,'GameIconsWhite','arrowDown');
		this.WindArrow.tint=0xBE81F7;
		this.WindArrow.anchor.setTo(.5);
		this.WindArrow.angle=(-this.windGravityRate*10);

		var txtstyl=this.M.S.txtstyl(25);

		txtstyl.fill=txtstyl.mStroke='#7401DF';
		this.WindPowerTS=this.M.S.genTxt(this.world.width*.9,this.world.height*.05,this.windGravityRate,txtstyl);

		txtstyl.fill=txtstyl.mStroke='#01DF01';
		this.ScoreCountTS=this.M.S.genTxt(this.world.width*.15,this.world.height*.13,this.genScoreCountTxt(),txtstyl);

		txtstyl.fill=txtstyl.mStroke='#01DFA5';
		this.TimeCountTS=this.M.S.genTxt(this.world.centerX,this.world.height*.1,this.countDown,txtstyl);
		
		txtstyl.fill=txtstyl.mStroke='#2E9AFE';
		this.M.S.genTxt(this.world.centerX,this.world.height*.05,'Level '+this.curStg,txtstyl);

		var img=this.cache.getImage('TofuOnFire');
		this.TofuOnFireFrame.x=img.width*1.2;
		this.TofuOnFireFrame.y=img.height*.7;
		this.add.sprite(this.TofuOnFireFrame.x,this.TofuOnFireFrame.y,'TofuOnFire').anchor.setTo(.5);
		this.TofuOnFire=this.add.group();
		this.TofuOnFire.createMultiple(15,'TofuOnFire');
		this.TofuOnFire.children.forEach(function(c){
			c.anchor.setTo(.5);
			c.smoothed=!1;
		});

		this.BurnedSatellite=this.add.group();
		this.BurnedSatellite.createMultiple(15,'BurnedSatellite');
		this.BurnedSatellite.children.forEach(function(c){
			c.anchor.setTo(.5);
			c.smoothed=!1;
		});
	},
	renderT:function(){
		// this.Fire.forEachAlive(function(c){this.game.debug.body(c)},this);
		// this.Tofu.forEachAlive(function(c){this.game.debug.body(c)},this);
		// this.Satellite.forEachAlive(function(c){this.game.debug.body(c)},this);
	},
	castFire:function(p){
		if(this.isPlaying){
			var fire=this.Fire.getFirstDead();
			if(fire){
				fire.reset(p.x,this.world.height*.2);
				fire.body.velocity.y=500;
				fire.body.gravity.x=this.windGravity;
				this.Player.loadTexture('Mei_2');
				this.playerBackFrame=this.secTime+1;
				this.M.SE.play('CastFire',{volume:1});
			}
		}
	},
	burnTofu:function(fire,tofu){
		fire.kill();
		tofu.kill();

		this.M.sGlb('totalToFCount',this.M.gGlb('totalToFCount')+1);
		this.M.SE.play('Hit',{volume:1});

		if(this.isPlaying){
			this.scoreCount++;
			if(this.scoreCount==this.targetCount)this.end();
			if(this.scoreCount>this.targetCount)return this.end();

			var tofuOnFire=this.TofuOnFire.getFirstDead();
			if(tofuOnFire){
				tofuOnFire.reset(fire.x,fire.y);
				var duration=1E3;
				var tw=this.M.T.moveB(tofuOnFire,{xy:{y:this.TofuOnFireFrame.y},duration:duration});
				tw.start();
				tw.onComplete.add(function(){
					this.ScoreCountTS.changeText(this.genScoreCountTxt());
					if(this.scoreCount==this.targetCount&&this.isClear==!1)this.clear();
					this.M.SE.play('Get',{volume:1});
				},this);
				tw.onComplete.add(function(){this.kill()},tofuOnFire);
				this.add.tween(tofuOnFire).to({x:this.TofuOnFireFrame.x},duration,Phaser.Easing.Cubic.Out,!0);
			}
		}
	},
	hitSatellite:function(fire,satellite){
		fire.kill();
		satellite.kill();
		this.M.SE.play('Miss',{volume:1});

		this.fallSatellite(fire.x,fire.y);
	},
	chgWind:function(){
		if(this.secTime==this.chgWindTime){
			this.M.SE.play('ChgGravity',{volume:1});
			this.chgWindTime+=this.rnd.integerInRange(6,this.curStageInfo.grvtyRTMX);
			var rnd=this.rnd.integerInRange(-this.curStageInfo.grvtyR,this.curStageInfo.grvtyR);
			if(this.windGravityRate==rnd){
				if(this.windGravityRate==0){
					this.windGravityRate=this.rnd.integerInRange(-this.curStageInfo.grvtyR,this.curStageInfo.grvtyR);
				}else{
					this.windGravityRate=(-1*this.windGravityRate);
				}
			}else{
				this.windGravityRate=rnd;
			}
			var angle=360-(this.WindArrow.angle-(-this.windGravityRate*10));
			var twA=this.add.tween(this.WindArrow).to({angle:'+'+angle},1E3,Phaser.Easing.Linear.None,!0);
			twA.onComplete.add(function(){
				this.windGravity=this.windGravityRate*100;
				this.WindPowerTS.changeText(this.windGravityRate);
			},this);
		}
	},
	genScoreCountTxt:function(){return this.scoreCount+'/'+this.targetCount},
	flowTofu:function(){
		var tofu=this.rnd.pick(this.Tofu.children.filter(function(c){return!c.alive}));
		if(tofu){
			if(this.rnd.between(1,100)<50){
				tofu.reset(this.world.width,this.rnd.between(this.flowMinY,this.flowMaxY));
				tofu.body.velocity.x=-this.curStageInfo.trgtVlcty;
			}else{
				tofu.reset(0,this.rnd.between(this.flowMinY,this.flowMaxY));
				tofu.body.velocity.x=+this.curStageInfo.trgtVlcty;
			}
		}
	},
	flowSatellite:function(){
		var satellite=this.Satellite.getFirstDead();
		if(satellite){
			if(this.rnd.between(1,100)<50){
				satellite.reset(this.world.width,this.rnd.between(this.flowMinY,this.flowMaxY));
				satellite.body.velocity.x=-this.curStageInfo.trgtVlcty;
			}else{
				satellite.reset(0,this.rnd.between(this.flowMinY,this.flowMaxY));
				satellite.body.velocity.x=+this.curStageInfo.trgtVlcty;
			}
		}
	},
	fireOutOfBounds:function(s){
		if(s.y>=this.world.height){
			this.damageEarth();
		} else if(s.x<0){
			this.M.SE.play('Miss',{volume:1});
			this.fallSatellite(0,s.y);
		} else if(s.x>this.world.width){
			this.M.SE.play('Miss',{volume:1});
			this.fallSatellite(this.world.width,s.y);
		}
	},
	fallSatellite:function(x,y){
		var burnedSatellite=this.BurnedSatellite.getFirstDead();
		if(burnedSatellite){
			burnedSatellite.reset(x,y);
			var tw=this.M.T.moveB(burnedSatellite,{xy:{x:this.world.centerX,y:this.world.height}});
			tw.start();
			tw.onComplete.add(function(){this.kill()},burnedSatellite);
			tw.onComplete.add(this.damageEarth,this);
		}
	},
	damageEarth:function(){
		if(this.isPlaying){
			this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);

			this.earthHealth--;
			if(this.earthHealth==0){
				this.EarthS.loadTexture('Earth_4');
				this.gameOver();
			}else if(this.earthHealth==this.earthWarning){
				this.EarthS.loadTexture('Earth_2');
			}else if(this.earthHealth==this.earthDanger){
				this.EarthS.loadTexture('Earth_3');
			}
			this.M.SE.play('Damage',{volume:1});
		}
	},
	clear:function(){
		this.isClear=!0;
		this.genEnd();
	},
	gameOver:function(){
		this.isClear=!1;
		this.genEnd();
	},
	genEnd:function(){
		this.end();
		var txtstyl=this.M.S.txtstyl(50);
		txtstyl.fill=txtstyl.mStroke='#0080FF';
		this.EndTS=this.M.S.genTxt(this.world.centerX,this.world.height*2,this.isClear?'CLEAR':'GAME OVER',txtstyl);
		var tw=this.M.T.moveA(this.EndTS,{xy:{y:this.world.centerY}});
		tw.onComplete.add(this.genRes,this);
		tw.start();
		this.M.SE.play('End',{volume:1});
	},
	genRes:function(){
		var s=this.add.sprite(0,-this.world.height,'TWP');
		s.tint=0x000000;
		var tw=this.M.T.moveA(s,{xy:{y:0},delay:600});
		tw.start();
		tw.onStart.add(function(){this.visible=!1},this.EndTS);
		tw.onStart.add(function(){this.isClear?this.M.SE.play('Clear',{volume:1}):this.M.SE.play('GameOver',{volume:1.5})},this);
		tw.onComplete.add(function(){this.inputEnabled=!0},this);

		var txtstyl=this.M.S.txtstyl(50);

		txtstyl.fill=txtstyl.mStroke='#01DF3A';
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.2,this.curWords.Result,txtstyl));

		txtstyl.fill=txtstyl.mStroke='#0080FF';
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.centerY,this.isClear?'CLEAR\nLevel '+this.curStg:'GAME OVER',txtstyl));

		s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.72,this.yt,'YouTube'));
		if(!this.isClear){
			s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.72,this.again,this.curWords.Again));
		}else if(this.curStg<10){
			s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.72,this.nextStg,this.curWords.NextStg));
		}else{
			s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.72,this.allclear,this.curWords.AllClear));
		}

		s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.82,this.othergames,this.curWords.OtherGames));
		s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.82,this.tweet,this.curWords.Tweet));

		s.addChild(this.M.S.genLbl(this.world.centerX,this.world.height*.92,this.back,this.curWords.Back));
	},
	yt:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=BasicGame.YOUTUBE_URL;
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('youtube','Play','Stage_'+this.curStg,this.M.gGlb('playCount'));
		}
	},
	again:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnStart',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			myGa('again','Play','Stage_'+this.curStg,this.M.gGlb('playCount'));
		}
	},
	nextStg:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnStart',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			myGa('next_stage','Play','Stage_'+this.curStg,this.M.gGlb('playCount'));
			this.M.sGlb('curStg',Number(this.curStg)+1);
		}
	},
	othergames:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=__VTUBER_GAMES;
			if(this.curLang=='en')url+='?lang=en';
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('othergames','Play','Stage_'+this.curStg,this.M.gGlb('playCount'));
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var e='📛📛📛📛📛📛';
			var res=this.isClear?
				this.curWords.TwClearLevel+this.curStg+'\n'+this.curWords.TwToFCount+this.M.gGlb('totalToFCount')+'\n'
				:'GAME OVER\n'+this.curWords.TwChallengeLevel+this.curStg+'\n';
			var txt=e+'\n'+this.curWords.TweetTtl+'\n'+res+e+'\n';
			this.M.H.tweet(txt,this.curWords.TweetHT,location.href);
			myGa('tweet','Play','Stage_'+this.curStg,this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnBtn',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectStage')},this);
			this.Tween.start();
		}
	},
	allclear:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url='https://www.youtube.com/watch?v=1iGZpZxGDto';
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('external_link','Play','TOFU ON FIRE',this.M.gGlb('playCount'));
		}
	},
	genTut:function(){
		this.HowToS=this.add.sprite(0,0,'TWP');
		this.HowToS.tint=0x000000;
		var ts=this.M.S.genTxt(this.world.centerX,this.world.centerY,this.curWords.HowTo);
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
		var s=this.M.S.genTxt(this.world.width*1.5,this.world.centerY,this.curWords.Start,txtstyl);
		var twA=this.M.T.moveA(s,{xy:{x:this.world.centerX}});
		var twB=this.M.T.moveA(s,{xy:{x:-this.world.centerX},delay:300});
		twA.chain(twB);
		twA.start();
		twA.onComplete.add(this.start,this);
		this.M.SE.play('Start',{volume:1});
	},
};