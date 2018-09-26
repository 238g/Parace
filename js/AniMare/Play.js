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
		this.worldGravity=1000;
		this.jumpX=200;
		this.jumpY=-500;

		// Obj
		this.Player=this.LeftWall=this.RightWall=
		this.PlayerCollisionGroup=this.WallCollisionGroup=this.ThornCollisionGroup=
		this.HUD=this.HitEff=
		null;
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000';
		// this.M.SE.playBGM('PlayBGM',{volume:1});
		this.genContents();
		this.start();//TODO
		// this.M.gGlb('endTut')?this.genStart():this.genTut();
		this.tes();
	},
	updateT:function(){
		if(this.isPlaying){
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	tes:function(){
		if(__ENV!='prod'){
			this.Player.body.debug=!0;
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.gameOver,this);
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.setPhysics();
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
		this.physics.p2.updateBoundsCollisionGroup();
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
		// this.Player.body.static=!0; // TODO first start when on / after click off and jump / this.Player.body.static=!1;

		this.input.onDown.add(this.jump,this);
	},
	hitWall:function(p,w){
		console.log(this.jumpX);
		if(p.x<this.world.centerX){
			//left
			// TODO appear thorn
			this.HitEff.setXSpeed(0,200);
		}else{
			//right
			this.HitEff.setXSpeed(-200,0);
		}
		this.LeftWall.tint=this.RightWall.tint=this.TopWall.tint=this.BottomWall.tint=Math.random()*0xffffff;
		this.jumpX*=-1;

		this.HitEff.x=w.x;
		this.HitEff.y=p.y-this.Player.height*.5;
		this.HitEff.explode(500,10);
	},
	hitThorn:function(){
		console.log(this.time.time);
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
		// TODO per char color
		this.HitEff.forEach(function(c){c.tint=this[0]},[0x00ff00]);
	},
	genHUD:function(){
		this.HUD=this.add.group();

		this.HUD.visible=!1;
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