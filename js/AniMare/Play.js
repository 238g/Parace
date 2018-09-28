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
		this.curLevel=1;
		this.LevelInfo=this.M.gGlb('LevelInfo');
		this.curLevelInfo=this.LevelInfo[this.curLevel];
		// Val
		this.hp=this.curCharInfo.hp;
		this.worldGravity=this.curCharInfo.worldGravity;
		this.jumpX=this.curCharInfo.jumpX;
		this.jumpY=this.curCharInfo.jumpY;

		this.score=0;

		this.nextLevel=this.curLevelInfo.nextLevel+this.curCharInfo.levelUpAdd;
		this.thornCount=this.curLevelInfo.thornCount;
		this.obstacleCount=this.curLevelInfo.obCount;

		this.thornPosXArr=[];
		for(var i=0;i<10;i++)this.thornPosXArr.push(i*64+32);

		this.curLeftThorns=[];
		this.curRightThorns=[];

		this.obBounds={l:this.world.width*.3,r:this.world.width*.7,t:this.world.height*.1,b:this.world.height*.9};

		// Obj
		this.Player=this.LeftWall=this.RightWall=this.Thorns=this.Obstacles=
		this.PlayerCollisionGroup=this.WallCollisionGroup=this.ThornCollisionGroup=this.ObstacleCollisionGroup=
		this.HUD=this.HPTS=this.ScoreTS=this.PlayLbl=
		this.HitEff=this.EndTS=this.HowToS=
		null;
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000';
		// this.M.SE.playBGM('PlayBGM',{volume:1});
		this.genContents();
		this.M.gGlb('endTut')?this.genStart():this.genTut();
		this.tes();
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	tes:function(){
		if(__ENV!='prod'){
			this.Player.body.debug=!0;
			this.Thorns.forEach(function(c){c.body.debug=!0});
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.gameOver,this);
			this.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(function(){this.score=this.curLevelInfo.nextLevel-1;this.nextLevel=this.curLevelInfo.nextLevel;},this);
			this.curLevel=this.M.H.getQuery('level')||1;this.curLevelInfo=this.LevelInfo[this.curLevel];
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.BgS=this.M.S.genBmpSqrSp(0,0,this.world.width,this.world.height,'#ffffff');
		this.setPhysics();
		this.genThorn();
		this.genObstacle();
		this.genPlayer();
		this.genWall();
		this.genEffect();
		this.genHUD();
	},
	setPhysics:function(){
		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.setImpactEvents(!0);
		this.physics.p2.gravity.y=this.worldGravity;
		this.physics.p2.restitution=1;
		this.PlayerCollisionGroup=this.physics.p2.createCollisionGroup();
		this.WallCollisionGroup=this.physics.p2.createCollisionGroup();
		this.ThornCollisionGroup=this.physics.p2.createCollisionGroup();
		this.ObstacleCollisionGroup=this.physics.p2.createCollisionGroup();
		this.physics.p2.updateBoundsCollisionGroup();
	},
	genThorn:function(){
		this.Thorns=this.add.group();
		this.Thorns.physicsBodyType=Phaser.Physics.P2JS;
		this.Thorns.enableBody=!0;
		this.Thorns.createMultiple(30,'WB');
		this.Thorns.forEach(function(s){
			s.smoothed=!1;
			s.body.static=!0;
			s.body.collides(this.PlayerCollisionGroup);
			s.scale.setTo(10);//TODO
			s.body.setRectangle(s.width,s.height);//TODO
			s.tint=0x000000;//TODO
			s.body.angle=45;
			s.body.setCollisionGroup(this.ThornCollisionGroup);
		},this);
	},
	genObstacle:function(){
		this.Obstacles=this.add.group();
		this.Obstacles.physicsBodyType=Phaser.Physics.P2JS;
		this.Obstacles.enableBody=!0;
		this.Obstacles.createMultiple(4,'WB');
		this.Obstacles.forEach(function(s){
			s.smoothed=!1;
			s.body.static=!0;
			s.body.collides(this.PlayerCollisionGroup);
			s.scale.setTo(5);//TODO
			s.body.setRectangle(s.width,s.height);//TODO
			s.tint=0x000000;//TODO
			s.body.setCollisionGroup(this.ObstacleCollisionGroup);
		},this);
	},
	genPlayer:function(){
		this.Player=this.add.sprite(this.world.centerX,this.world.centerY,'todo1');
		this.Player.smoothed=!1;
		this.physics.p2.enable(this.Player,!1);
		this.Player.body.setCircle(20);
		this.Player.body.collideWorldBounds=!0;
		this.Player.body.setCollisionGroup(this.PlayerCollisionGroup);
		this.Player.body.collides(this.WallCollisionGroup,this.hitWall,this);
		this.Player.body.collides(this.ThornCollisionGroup,this.hitThorn,this);
		this.Player.body.collides(this.ObstacleCollisionGroup);
		this.Player.body.static=!0;

		this.input.onDown.add(this.jump,this);
	},
	hitWall:function(p,w){
		Phaser.ArrayUtils.shuffle(this.thornPosXArr);

		if(p.sprite.x<this.world.centerX){
			//hit left
			this.HitEff.setXSpeed(0,200);
			for(var k in this.curRightThorns)this.curRightThorns[k].kill();
			this.curRightThorns=[];
			for(var i=0;i<this.thornCount;i++){
				var s=this.Thorns.getFirstDead();
				s.reset(this.world.width,this.thornPosXArr[i],50);
				this.curRightThorns.push(s);
			}
		}else{
			//hit right
			this.HitEff.setXSpeed(-200,0);
			for(var k in this.curLeftThorns)this.curLeftThorns[k].kill();
			this.curLeftThorns=[];
			for(var i=0;i<this.thornCount;i++){
				var s=this.Thorns.getFirstDead();
				s.reset(0,this.thornPosXArr[i],50);
				this.curLeftThorns.push(s);
			}
		}

		// TODO color
		this.LeftWall.tint=this.RightWall.tint=this.TopWall.tint=this.BottomWall.tint=Math.random()*0xffffff;
		this.jumpX*=-1;

		this.HitEff.x=w.sprite.x;
		this.HitEff.y=p.sprite.y-this.Player.height*.5;
		this.HitEff.explode(500,10);

		this.score++;
		this.ScoreTS.changeText(this.curWords.Score+this.score);

		this.checkLevelUp();
	},
	hitThorn:function(p,t){
		p.sprite.kill();
		this.isPlaying=!1;
		this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);

		console.log('DMG!!!!!'+this.time.time);
		this.hp--;
		this.HPTS.changeText('HP: '+this.hp);
		if(this.hp==0)return this.gameOver();

		// TODO tiuntiun animation
		// TODO tween
		this.time.events.add(1000,function(){
			this.Player.reset(this.world.centerX,this.world.centerY);
			this.Player.body.static=!0;
			this.PlayLbl.visible=!0;
		},this);
	},
	jump:function(){
		if(this.isPlaying&&this.inputEnabled){
			this.Player.body.velocity.x=this.jumpX;
			this.Player.body.velocity.y=this.jumpY;
		}
	},
	genWall:function(){
		// var color=Math.random()*0xffffff; // TODO need???
		var color='#ffffff';
		this.LeftWall=this.M.S.genBmpSqrSp(5,this.world.centerY,10,this.world.height,color);
		this.physics.p2.enable(this.LeftWall,!1);
		this.LeftWall.body.static=!0;
		this.LeftWall.body.setCollisionGroup(this.WallCollisionGroup);
		this.LeftWall.body.collides(this.PlayerCollisionGroup);

		this.RightWall=this.M.S.genBmpSqrSp(this.world.width-5,this.world.centerY,10,this.world.height,color);
		this.physics.p2.enable(this.RightWall,!1);
		this.RightWall.body.static=!0;
		this.RightWall.body.setCollisionGroup(this.WallCollisionGroup);
		this.RightWall.body.collides(this.PlayerCollisionGroup);

		this.TopWall=this.M.S.genBmpSqrSp(0,0,this.world.width,5,color);
		this.BottomWall=this.M.S.genBmpSqrSp(0,this.world.height-5,this.world.width,5,color);
	},
	genEffect:function(){
		this.HitEff=this.add.emitter(0,0,50);
		this.HitEff.makeParticles('WB');
		this.HitEff.minParticleScale=.5;
		this.HitEff.maxParticleScale=2;
		this.HitEff.setYSpeed(-300,100);
		this.HitEff.gravity.y=600;
		this.HitEff.lifespan=500;
		// TODO per char color
		this.HitEff.forEach(function(c){c.tint=this[0]},[0x00ff00]);
	},
	genHUD:function(){
		this.HUD=this.add.group();

		this.HPTS=this.M.S.genTxt(this.world.centerX,this.world.height*.05,'HP: '+this.hp,this.M.S.txtstyl(30));
		this.HUD.add(this.HPTS);

		this.ScoreTS=this.M.S.genTxt(this.world.centerX,this.world.height*.95,this.curWords.Score+this.score,this.M.S.txtstyl(30));
		this.HUD.add(this.ScoreTS);

		this.PlayLbl=this.M.S.genLbl(this.world.centerX,this.world.height*.75,function(b){
			b.visible=!1;
			this.Player.body.static=!1;
			this.start();
		},'GO!');
		this.HUD.add(this.PlayLbl);

		this.HUD.visible=!1;
	},
	checkLevelUp:function(){
		if(this.score==this.nextLevel){
			this.curLevel++;
			this.curLevelInfo=this.LevelInfo[this.curLevel];
			
			this.nextLevel=this.curLevelInfo.nextLevel+this.curCharInfo.levelUpAdd;
			this.thornCount=this.curLevelInfo.thornCount;
			this.obstacleCount=
				(this.curLevelInfo.obCount>1&&this.curCharInfo.reduceOb)
				?this.curLevelInfo.obCount-1
				:this.curLevelInfo.obCount;

			this.Obstacles.killAll();
			for(var i=0;i<this.obstacleCount;i++){
				var s=this.Obstacles.getFirstDead();
				s.body.angle=this.rnd.angle();
				s.reset(this.rnd.between(this.obBounds.l,this.obBounds.y),this.rnd.between(this.obBounds.t,this.obBounds.b));
				s.body.angularVelocity=this.curLevelInfo.obAnglV;
			}

			////// if(this.curLevel==this.curCharInfo.chRecLvl){
				////// this.Player.body.setRectangle(this.Player.width*.5,this.Player.height*.5);
				////// this.Player.body.setCollisionGroup(this.PlayerCollisionGroup);
			////// }

			this.BgS.colorBlend={step:0};
			var tw=this.add.tween(this.BgS.colorBlend).to({step:100},1000,Phaser.Easing.Linear.None,!0,0);
			this.BgS.startColor=this.BgS.tint;
			this.BgS.endColor=this.curLevelInfo.color;
			tw.onUpdateCallback(function(){
				this.tint=Phaser.Color.interpolateColor(this.startColor,this.endColor,100,this.colorBlend.step);
			},this.BgS);
		}
	},
	gameOver:function(){
		this.end();
		this.genEnd();
	},
	////////////////////////////////////////////////////////////////////////////////////
	genEnd:function(){
		var txtstyl=this.M.S.txtstyl(45);
		txtstyl.fill=txtstyl.mStroke='#DF0101';
		this.EndTS=this.M.S.genTxt(this.world.centerX,this.world.height*2,this.curWords.GameOver,txtstyl);
		var tw=this.M.T.moveA(this.EndTS,{xy:{y:this.world.centerY}});
		tw.onComplete.add(this.genRes,this);
		tw.start();
		// this.M.SE.play('End',{volume:1});
	},
	genRes:function(){
		var s=this.add.sprite(0,-this.world.height,'TWP');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600});
		tw.onComplete.add(function(){this.inputEnabled=!0},this);
		tw.onComplete.add(function(){this.visible=!1},this.EndTS);
		// tw.onStart.add(function(){this.M.SE.play('Res',{volume:1})},this);
		tw.start();

		var txtstyl=this.M.S.txtstyl(45);

		txtstyl.fill=txtstyl.mStroke='#01DF3A';
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.2,this.curWords.Result,txtstyl));

		txtstyl.fill=txtstyl.mStroke='#0080FF';
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.centerY,this.playerHP>0?this.curWords.Win:this.curWords.Lose,txtstyl));

		s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.72,this.yt,'YouTube'));
		s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.72,this.tweet,this.curWords.TwBtn));
		s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.82,this.back,this.curWords.Back));
		s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.82,this.othergames,this.curWords.OtherGames));
	},
	yt:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1.5});
			var url=this.curCharInfo.yt;
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('youtube','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	othergames:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1.5});
			var url=__VTUBER_GAMES;
			if(this.curLang=='en')url+='?lang=en';
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('othergames','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1.5});
			var e='4444444444444';
			var res=3333333333333;
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			this.M.H.tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			// this.M.SE.play('OnBtn',{volume:1.5});
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
		var s=this.M.S.genTxt(this.world.width*1.5,this.world.centerY,55555555555555555,txtstyl);
		var twA=this.M.T.moveA(s,{xy:{x:this.world.centerX}});
		var twB=this.M.T.moveA(s,{xy:{x:-this.world.centerX},delay:300});
		twA.chain(twB);
		twA.start();
		twA.onComplete.add(this.start,this);
		// this.M.SE.play('GenStart',{volume:1});
		this.HUD.visible=!0;
	},
};