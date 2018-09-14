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
		this.rndTimerA=this.rnd.between(1E3,1E4);// TODO
		this.rndTimerB=this.rnd.between(1E3,1E4);// TODO
		this.chgWindTime=10;

		this.windGravityRate=this.rnd.integerInRange(-this.curStageInfo.windGravityRate,this.curStageInfo.windGravityRate);
		this.windGravity=this.windGravityRate*100;
		this.targetCount=this.curStageInfo.targetCount;
		this.scoreCount=0;

		this.flowMinY=this.world.height*.55;
		this.flowMaxY=this.world.height*.9;

		this.earthHealth=this.curStageInfo.earthHealth;
		this.earthDanger=Math.floor(this.earthHealth/3);
		this.earthWarning=this.earthDanger*2;

		this.isClear=!1;

		// Obj
		this.Player=this.WindArrow=
		this.ScoreCountTS=
		this.Tofu=this.Fire=this.TofuOnFire=this.Satellite=this.BurnedSatellite=
		this.EndTS=this.HowToS=
		null;
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!1;
		// this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});
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
				
				this.chgWind();

				(this.rnd.between(1,100)<5)?this.flowSatellite():this.flowTofu();// TODO
			}
			this.secTimer-=this.time.elapsed;

			if(this.rndTimerA<0){
				this.rndTimerA=this.rnd.between(1E3,1E4);// TODO
				(this.rnd.between(1,100)<30)?this.flowSatellite():this.flowTofu();// TODO
			}
			this.rndTimerA-=this.time.elapsed;

			if(this.rndTimerB<0){
				this.rndTimerB=this.rnd.between(1E3,1E4);// TODO
				(this.rnd.between(1,100)<30)?this.flowSatellite():this.flowTofu();// TODO
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

		this.Player=this.add.sprite(this.world.centerX,this.world.height*.2,'todoP');
		this.Player.anchor.setTo(.5);

		this.genPhysicsObj();
		this.genHUD();

		this.game.device.touch?this.input.onUp.add(this.castFire,this):this.input.onDown.add(this.castFire,this);
	},
	genPhysicsObj:function(){
		var img,bounds;
		img=this.cache.getImage('Fire');
		bounds={r:img.width*.3,w:img.width*.2,h:img.height*.2};
		// bounds={r:img.width*.2,w:img.width*.3,h:img.height*.3};
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

		img=this.cache.getImage('Tofu');
		bounds={r:img.width*.4,w:img.width*.1,h:img.height*.1};
		// bounds={r:img.width*.2,w:img.width*.3,h:img.height*.3};
		this.Tofu=this.add.group();
		this.Tofu.enableBody=!0;
		this.Tofu.physicsBodyType=Phaser.Physics.ARCADE;
		this.Tofu.createMultiple(15,'Tofu');//TODO
		this.Tofu.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
			c.smoothed=!1;
			c.body.setCircle(this.r,this.w,this.h);
		},bounds);

		img=this.cache.getImage('Satellite');
		bounds={r:img.width*.4,w:img.width*.1,h:img.height*.1};
		// bounds={r:img.width*.2,w:img.width*.3,h:img.height*.3};
		this.Satellite=this.add.group();
		this.Satellite.enableBody=!0;
		this.Satellite.physicsBodyType=Phaser.Physics.ARCADE;
		this.Satellite.createMultiple(15,'Satellite');//TODO
		this.Satellite.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
			c.smoothed=!1;
			c.body.setCircle(this.r,this.w,this.h);
		},bounds);
	},
	genHUD:function(){
		this.WindArrow=this.add.sprite(this.world.width*.9,this.world.height*.1,'GameIconsWhite','arrowDown');
		this.WindArrow.tint=0xff0000;
		this.WindArrow.anchor.setTo(.5);
		this.WindArrow.angle=(-this.windGravityRate*10);

		this.WindPowerTS=this.M.S.genTxt(this.world.width*.9,this.world.height*.05,this.windGravityRate);

		this.ScoreCountTS=this.M.S.genTxt(this.world.width*.1,this.world.height*.15,this.genScoreCountTxt());

		this.add.sprite(50,50,'TofuOnFire').anchor.setTo(.5);
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
	render:function(){//TODO
		this.Fire.forEachAlive(function(c){this.game.debug.body(c)},this);
		this.Tofu.forEachAlive(function(c){this.game.debug.body(c)},this);
		this.Satellite.forEachAlive(function(c){this.game.debug.body(c)},this);
	},
	castFire:function(p){
		if(this.isPlaying){
			var fire=this.Fire.getFirstDead();
			if(fire){
				fire.reset(p.x,this.world.height*.2);
				fire.body.velocity.y=500;
				fire.body.gravity.x=this.windGravity;
			}
		}
	},
	burnTofu:function(fire,tofu){
		fire.kill();
		tofu.kill();

		if(this.isPlaying){
			this.scoreCount++;
			if(this.scoreCount==this.targetCount)this.end();
			if(this.scoreCount>this.targetCount)return this.end();

			var tofuOnFire=this.TofuOnFire.getFirstDead();
			if(tofuOnFire){
				tofuOnFire.reset(fire.x,fire.y);
				var duration=1E3;
				var tw=this.M.T.moveB(tofuOnFire,{xy:{y:50},duration:duration});
				tw.start();
				tw.onComplete.add(function(){
					this.ScoreCountTS.changeText(this.genScoreCountTxt());
					if(this.scoreCount==this.targetCount&&this.isClear==!1)this.clear();
				},this);
				tw.onComplete.add(function(){this.kill()},tofuOnFire);
				this.add.tween(tofuOnFire).to({x:50},duration,Phaser.Easing.Cubic.Out,!0);
			}
		}
	},
	hitSatellite:function(fire,satellite){
		fire.kill();
		satellite.kill();

		this.fallSatellite(fire.x,fire.y);
	},
	chgWind:function(){
		console.log('this.secTime:'+this.secTime,'this.chgWindTime:'+this.chgWindTime); // TODO del
		if(this.secTime==this.chgWindTime){
			this.chgWindTime+=this.rnd.integerInRange(5,15); // TOOD stg
			var rnd=this.rnd.integerInRange(-this.curStageInfo.windGravityRate,this.curStageInfo.windGravityRate);
			if(this.windGravityRate==rnd){
				if(this.windGravityRate==0){
					this.windGravityRate=this.rnd.integerInRange(-this.curStageInfo.windGravityRate,this.curStageInfo.windGravityRate);
				}else{
					this.windGravityRate=(-1*this.windGravityRate);
				}
			}else{
				this.windGravityRate=rnd;
			}
			this.windGravity=this.windGravityRate*100;
			this.WindArrow.angle=(-this.windGravityRate*10);
			this.WindPowerTS.changeText(this.windGravityRate);
		}
	},
	genScoreCountTxt:function(){return this.scoreCount+'/'+this.targetCount},
	flowTofu:function(){
		var tofu=this.Tofu.getFirstDead();
		if(tofu){
			if(this.rnd.between(1,100)<50){
				tofu.reset(this.world.width,this.rnd.between(this.flowMinY,this.flowMaxY));
				tofu.body.velocity.x=-this.curStageInfo.targetVelocity;
			}else{
				tofu.reset(0,this.rnd.between(this.flowMinY,this.flowMaxY));
				tofu.body.velocity.x=+this.curStageInfo.targetVelocity;
			}
		}
	},
	flowSatellite:function(){
		var satellite=this.Satellite.getFirstDead();
		if(satellite){
			if(this.rnd.between(1,100)<50){
				satellite.reset(this.world.width,this.rnd.between(this.flowMinY,this.flowMaxY));
				satellite.body.velocity.x=-this.curStageInfo.targetVelocity;
			}else{
				satellite.reset(0,this.rnd.between(this.flowMinY,this.flowMaxY));
				satellite.body.velocity.x=+this.curStageInfo.targetVelocity;
			}
		}
	},
	fireOutOfBounds:function(s){
		if(s.y>=this.world.height){
			this.damageEarth();
		} else if(s.x<0){
			this.fallSatellite(0,s.y);
		} else if(s.x>this.world.width){
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
				this.gameOver();
			}else if(this.earthHealth==this.earthWarning){
				// TODO change warning img
			}else if(this.earthHealth==this.earthDanger){
				// TODO change danger img
			}
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
		this.EndTS=this.M.S.genTxt(this.world.centerX,this.world.height*2,this.isClear?'CLEAR':'GAME OVER',this.M.S.txtstyl(50));
		var tw=this.M.T.moveA(this.EndTS,{xy:{y:this.world.centerY}});
		tw.onComplete.add(this.genRes,this);
		tw.start();
		// this.M.SE.play('Res',{volume:1});
	},
	genRes:function(){
		var s=this.add.sprite(0,-this.world.height,'TWP');
		s.tint=0x000000;
		var tw=this.M.T.moveA(s,{xy:{y:0},delay:600});
		tw.start();
		tw.onStart.add(function(){this.visible=!1},this.EndTS);
		tw.onComplete.add(function(){this.inputEnabled=!0},this);

		var txtstyl=this.M.S.txtstyl(35);
		txtstyl.fill=txtstyl.mStroke='#FF0040';
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.05,this.curWords.Result,txtstyl));

		txtstyl.fontSize=30;
		txtstyl.fill=txtstyl.mStroke=BasicGame.MAIN_TEXT_COLOR;
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.2,'RES1111111',txtstyl));


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
			// this.M.SE.play('OnBtn',{volume:1});
			var url=BasicGame.YOUTUBE_URL;
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('youtube','Play','Stage_'+this.curStg,this.M.gGlb('playCount'));
		}
	},
	again:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			// this.M.SE.play('OnStart',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('again','Play','Stage_'+this.curStg,this.M.gGlb('playCount'));
		}
	},
	nextStg:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			// this.M.SE.play('OnStart',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('next_stage','Play','Stage_'+this.curStg,this.M.gGlb('playCount'));
			this.M.sGlb('curStg',this.curStg+1);
		}
	},
	othergames:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});
			var url=__VTUBER_GAMES;
			if(this.curLang=='en')url+='?lang=en';
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('othergames','Play','Stage_'+this.curStg,this.M.gGlb('playCount'));
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});
			var e='📛📛📛📛📛📛';
			var res=333333333333333333333333; // TODO
			var txt=e+'\n'+this.curWords.TweetTtl+'\n'+res+e+'\n';
			this.M.H.tweet(txt,this.curWords.TweetHT,location.href);
			myGa('tweet','Play','Stage_'+this.curStg,this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			// this.M.SE.play('OnBtn',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectStage')},this);
			this.Tween.start();
		}
	},
	allclear:function(){
		//TODO show tofu on fire movie
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
		var s=this.M.S.genTxt(this.world.width*1.5,this.world.centerY,this.curWords.Start,this.M.S.txtstyl(50));
		var twA=this.M.T.moveA(s,{xy:{x:this.world.centerX}});
		var twB=this.M.T.moveA(s,{xy:{x:-this.world.centerX},delay:300});
		twA.chain(twB);
		twA.start();
		twA.onComplete.add(this.start,this);
		// this.M.SE.play('Res',{volume:1});
	},
};