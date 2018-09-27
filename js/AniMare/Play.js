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
		this.hp=100;
		this.worldGravity=1000;
		this.jumpX=200;
		this.jumpY=-500;
		this.score=0;

		// Obj
		this.Player=this.LeftWall=this.RightWall=this.Thorns=
		this.PlayerCollisionGroup=this.WallCollisionGroup=this.ThornCollisionGroup=this.ObstacleCollisionGroup=
		this.HUD=this.HPTS=this.ScoreTS=this.PlayLbl=
		this.HitEff=
		null;
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000';
		// this.M.SE.playBGM('PlayBGM',{volume:1});
		this.genContents();
		// this.start();//TODO
		// this.M.gGlb('endTut')?this.genStart():this.genTut();
		this.tes();
	},
	//TODO
	updateT:function(){
		if(this.isPlaying){
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	tes:function(){
		if(__ENV!='prod'){
			this.Player.body.debug=!0;
			this.Thorns.forEach(function(c){c.body.debug=!0});
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.gameOver,this);
			this.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(function(){this.score=this.curLevelInfo.nextLevel-1},this);
			
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.BgS=this.M.S.genBmpSqrSp(0,0,this.world.width,this.world.height,'#ffffff');
		this.setPhysics();
		this.genThorn();
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
		// this.physics.p2.restitution=.8;
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
		this.Thorns.createMultiple(20,'WB');
		this.Thorns.forEach(function(s){
			s.smoothed=!1;
			// s.outOfBoundsKill=!0;
			// s.checkWorldBounds=!0;
			s.body.static=!0;
			s.body.collides(this.PlayerCollisionGroup);
			// s.body.collideWorldBounds=!1;
			s.scale.setTo(10);
			s.body.setRectangle(s.width,s.height);
			s.body.angle=45;
			// s.angle=45;
			s.body.setCollisionGroup(this.ThornCollisionGroup);
		},this);

		// TODO del
		for(var i=0;i<10;i++){
			if(i==5)continue;
			// var s=this.M.S.genBmpSqrSp(this.world.width,i*64,50,50,'#ff00ff');
			var s=this.rnd.pick(this.Thorns.children.filter(function(c){return!c.alive}));
			s.reset(this.world.width,i*64+32,50);
			// s.angle=45;
		}
	},
	genPlayer:function(){
		this.Player=this.add.sprite(this.world.centerX,this.world.centerY,'todo1');
		this.Player.smoothed=!1;
		this.physics.p2.enable(this.Player,!1);
		this.Player.body.setCircle(20);
		////// TODO Level Up
		/*
		this.time.events.add(3000,function(){
			this.Player.body.setRectangle(this.Player.width*.5,this.Player.height*.5);
			this.Player.body.setCollisionGroup(this.PlayerCollisionGroup);
		},this);
		*/
		////// TODO Level Up
		/*
		this.time.events.add(1000,function(){
			var s=this.M.S.genBmpSqrSp(this.world.centerX,this.world.centerY,50,50,'#ffffff');
			s.smoothed=!1;
			this.physics.p2.enable(s,!1);
			s.body.static=!0;
			s.body.setCollisionGroup(this.ObstacleCollisionGroup);
			// s.body.setCollisionGroup(this.WallCollisionGroup);
			s.body.collides(this.PlayerCollisionGroup);
			// s.body.rotation=1;
			// s.body.angle=1;
			// s.body.rotateLeft(45);
			s.body.angularVelocity=5;
			// s.body.angularVelocity=10;
		},this);
		*/
		this.Player.body.collideWorldBounds=!0;
		this.Player.body.setCollisionGroup(this.PlayerCollisionGroup);
		this.Player.body.collides(this.WallCollisionGroup,this.hitWall,this);
		this.Player.body.collides(this.ThornCollisionGroup,this.hitThorn,this);
		this.Player.body.collides(this.ObstacleCollisionGroup);
		this.Player.body.static=!0;

		this.input.onDown.add(this.jump,this);
	},
	hitWall:function(p,w){
		console.log(this.jumpX);
		if(p.sprite.x<this.world.centerX){
			//left
			// TODO appear thorn
			this.HitEff.setXSpeed(0,200);
		}else{
			//right
			this.HitEff.setXSpeed(-200,0);
		}
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

		// TODO tiuntiun animation

		console.log('DMG!!!!!'+this.time.time);
		this.hp--;
		this.HPTS.changeText('HP: '+this.hp);
		if(this.hp==0)return this.end();

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

		// this.HUD.visible=!1;
	},
	checkLevelUp:function(){
		if(this.score==this.curLevelInfo.nextLevel){
			this.curLevel++;
			this.curLevelInfo=this.LevelInfo[this.curLevel];

			// TODO each change / color and so on

			this.BgS.colorBlend={step:0};
			var tw=this.add.tween(this.BgS.colorBlend).to({step:100},1000,Phaser.Easing.Linear.None,!0,0);
			this.BgS.startColor=this.BgS.tint;
			this.BgS.endColor=Math.random()*0xffffff;//TODO level info color
			tw.onUpdateCallback(function(){
				this.tint=Phaser.Color.interpolateColor(this.startColor,this.endColor,100,this.colorBlend.step);
			},this.BgS);
		}
	},

	////////////////////////////////////////////////////////////////////////////////////
	gameOver:function(){
		this.end();
		this.genEnd();
	},
	genEnd:function(){
		var txtstyl=this.M.S.txtstyl(50);
		txtstyl.fill=txtstyl.mStroke='#0080FF';
		this.EndTS=this.M.S.genTxt(this.world.centerX,this.world.height*2,this.curWords.GameOver,txtstyl);
		var tw=this.M.T.moveA(this.EndTS,{xy:{y:this.world.centerY}});
		tw.onComplete.add(this.genRes,this);
		tw.start();
		this.M.SE.play('End',{volume:1});
	},
	genRes:function(){
		var s=this.add.sprite(0,-this.world.height,'TWP');
		s.tint=0x000000;
		var tw=this.M.T.moveA(s,{xy:{y:0},delay:600});
		tw.onComplete.add(function(){this.inputEnabled=!0},this);
		tw.onComplete.add(function(){this.visible=!1},this.EndTS);
		tw.onComplete.add(this.openNewStg,this);
		tw.onStart.add(function(){this.M.SE.play(this.playerHP>0?'Res':'ResT',{volume:1.5})},this);
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
	openNewStg:function(){
		if(this.playerHP>29||this.playerHP<-500){
			if(this.StageInfo[5].open==!1){
				this.StageInfo[5].open=!0;
				var ts=this.M.S.genTxt(this.world.width*.7,this.world.centerY,this.curWords.OpenNewStg,this.M.S.txtstyl(40));
				ts.angle=15;
				ts.scale.setTo(3);
				var tw=this.add.tween(ts.scale).to({x:1,y:1},1000,null,!0);
				tw.onComplete.add(function(){
					this.M.SE.play('OnStart',{volume:1});
					this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
				},this);
			}
		}
	},
	yt:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1.5});
			var url=BasicGame.YOUTUBE_URL;
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('youtube','Play','Stage_'+this.curStg,this.M.gGlb('playCount'));
		}
	},
	othergames:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1.5});
			var url=__VTUBER_GAMES;
			if(this.curLang=='en')url+='?lang=en';
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('othergames','Play','Stage_'+this.curStg,this.M.gGlb('playCount'));
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1.5});
			var e='⛩⛩⛩⛩⛩⛩';
			var res='難易度: '+this.curStageInfo.name+'('+this.curStageInfo.enemyName+')'+'\n'
					+this.curWords.TwHPFront+this.playerHP+'\n'
					+(this.playerHP>0?this.curWords.TwWin:this.curWords.TwLose)+'\n';
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			this.M.H.tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','Stage_'+this.curStg,this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnBtn',{volume:1.5});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectStage')},this);
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
		var s=this.M.S.genTxt(this.world.width*1.5,this.world.centerY,this.curStageInfo.enemyName+this.curWords.GenStart,txtstyl);
		var twA=this.M.T.moveA(s,{xy:{x:this.world.centerX}});
		var twB=this.M.T.moveA(s,{xy:{x:-this.world.centerX},delay:300});
		twA.chain(twB);
		twA.start();
		twA.onComplete.add(this.start,this);
		this.M.SE.play('GenStart',{volume:1});
		this.HUD.visible=!0;
	},
};