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
		this.shotBullets=function(){};
		this.secTimer=1E3;
		this.leftTime=this.curStageInfo.leftTime;
		this.bulletTimer=160;
		this.drawLine=!1;

		this.bgSpeed=this.curStageInfo.bgSpeed;
		this.playerHP=this.curStageInfo.playerHP

		// Obj
		this.MouseSp=this.MouseBody=this.Line=this.Enemy=
		this.PlayerCollisionGroup=this.BulletCollisionGroup=
		this.BgSp=this.HPTS=this.HUD=
		null;
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		this.stage.backgroundColor='#000';
		this.M.SE.playBGM(this.curStageInfo.playBGM,{volume:1});
		this.genContents();
		this.M.gGlb('endTut')?this.genStart():this.genTut();
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			this.secTimer-=this.time.elapsed;
			if(this.secTimer<0){
				this.secTimer=1E3;
				this.leftTime--;
				this.TimeTS.changeText('Time: '+this.leftTime);
				if(this.leftTime==0)this.gameOver();
			}
			this.bulletTimer-=this.time.elapsed;
			if(this.bulletTimer<0){
				this.bulletTimer=this.curStageInfo.bulletTime;
				this.shotBullets();
			}
		}

		this.BgSp.tilePosition.y+=this.bgSpeed;
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	tes:function(){
		if(__ENV!='prod'){
			// this.Player.body.debug=!0;
			// this.Bullets.forEach(function(e){e.body.debug=!0},this);
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.gameOver,this);
			this.input.keyboard.addKey(Phaser.Keyboard.H).onDown.add(function(){this.playerHP=-99},this);
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		if(this.curStg==4){
			this.BgSp=this.add.tileSprite(0,0,this.world.width,this.world.height,'Bg_1');
			this.BgSp.tint=0x555555;
		}else{
			this.BgSp=this.add.tileSprite(0,0,this.world.width,this.world.height,'Bg_'+this.curStg);
		}
		this.setPhysics();
		this.genBullets();
		this.genEnemy();
		this.genPlayer();
		this.genMouseBody();
		this.Line=new Phaser.Line(this.Enemy.x,this.Enemy.y,this.MouseBody.x,this.MouseBody.y);
		this.genHUD();
		this.input.onDown.add(this.click,this);
		this.input.onUp.add(this.release,this);
		this.input.addMoveCallback(this.mouseMove,this);
	},
	setPhysics:function(){
		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.setImpactEvents(!0);
		this.physics.p2.restitution=.8;
		this.PlayerCollisionGroup=this.physics.p2.createCollisionGroup();
		this.EnemyCollisionGroup=this.physics.p2.createCollisionGroup();
		this.BulletCollisionGroup=this.physics.p2.createCollisionGroup();
		this.physics.p2.updateBoundsCollisionGroup();
	},
	genBullets:function(){
		this.Bullets=this.add.group();
		this.Bullets.physicsBodyType=Phaser.Physics.P2JS;
		this.Bullets.enableBody=!0;
		this.Bullets.createMultiple(20,this.curStageInfo.bullets);
		this.Bullets.forEach(function(s){
			s.smoothed=!1;
			s.outOfBoundsKill=!0;
			s.checkWorldBounds=!0;
			s.body.setCollisionGroup(this.BulletCollisionGroup);
			s.body.collides(this.PlayerCollisionGroup);
			s.body.collideWorldBounds=!1;
		},this);
		this.shotBullets=this[this.curStageInfo.shot];
	},
	genEnemy:function(){
		this.Enemy=this.add.sprite(this.world.centerX,this.world.height*.2,this.curStageInfo.img);
		this.Enemy.smoothed=!1;
		this.physics.p2.enable(this.Enemy,!1);
		this.Enemy.body.setCollisionGroup(this.EnemyCollisionGroup);
		this.Enemy.body.fixedRotation=!0;
	},
	genPlayer:function(){
		for(var i=0;i<3;i++){
			var player=this.add.sprite(this.world.width*.25*i+this.world.width*.25,this.world.height*.8,'Umiyasha');
			player.smoothed=!1;
			this.physics.p2.enable(player,!1);
			player.body.setRectangle(player.width*.7,player.height*.7);
			player.body.setCollisionGroup(this.PlayerCollisionGroup);
			player.body.collides(this.BulletCollisionGroup,this.hitBullet,this);
		}
	},
	genMouseBody:function(){
		this.MouseBody=this.M.S.genBmpCclSp(0,0,10,'#ffffff');
		this.MouseBody.smoothed=!1;
		this.physics.p2.enable(this.MouseBody,!1);
		this.MouseBody.body.static=!0;
		this.MouseBody.body.setCircle(10);
		this.MouseBody.body.data.shapes[0].sensor=!0;
	},
	genHUD:function(){
		this.HUD=this.add.group();

		var txtstyl=this.M.S.txtstyl(25);
		txtstyl.align='right';
		this.HPTS=this.M.S.genTxt(this.world.width-10,this.world.height-10,'HP: '+this.playerHP,txtstyl);
		this.HPTS.children[0].anchor.setTo(1);
		this.HPTS.anchor.setTo(.98);
		this.HUD.add(this.HPTS);

		this.TimeTS=this.M.S.genTxt(this.world.centerX,this.world.height*.05,'Time: '+this.leftTime,this.M.S.txtstyl(30));
		this.HUD.add(this.TimeTS);

		this.HUD.visible=!1;
	},
	click:function(p){
		var b=this.physics.p2.hitTest(p.position,[this.Enemy.body]);
		if (b.length){
			this.MouseSp=this.physics.p2.createSpring(this.MouseBody,b[0],0,30,1);
			this.MouseSp.smoothed=!1;
			this.Line.setTo(this.Enemy.x,this.Enemy.y,this.MouseBody.x,this.MouseBody.y);
			this.drawLine=!0;
		}		
	},
	release:function(){
		this.physics.p2.removeSpring(this.MouseSp);
		this.drawLine=!1;
	},
	mouseMove:function(p,x,y/*,isDown*/){
		this.MouseBody.body.x=x;
		this.MouseBody.body.y=y;
		this.Line.setTo(this.Enemy.x,this.Enemy.y,this.MouseBody.x,this.MouseBody.y);
	},
	shotBullets:function(){},
	shotBulletsA:function(){
		//Front
		this.shotBullet(this.Enemy.x,this.Enemy.y,0,150,0,0);
		this.shotBullet(this.Enemy.x,this.Enemy.y,100,150,5,0);
		this.shotBullet(this.Enemy.x,this.Enemy.y,-100,150,5,0);
		//Back
		var r=this.rnd.between(-200,0);
		this.shotBullet(this.Enemy.x,this.Enemy.y,0,-200,0,.5);
		this.shotBullet(this.Enemy.x,this.Enemy.y,200,r,5,0);
		this.shotBullet(this.Enemy.x,this.Enemy.y,-200,r,5,0);
	},
	shotBulletsB:function(){
		//Front
		this.shotBullet(this.Enemy.x,this.Enemy.y,0,200,1,0);
		this.shotBullet(this.Enemy.x,this.Enemy.y,100,200,45,0);
		this.shotBullet(this.Enemy.x,this.Enemy.y,-100,200,45,0);
		//Back
		var r=this.rnd.between(-200,0);
		this.shotBullet(this.Enemy.x,this.Enemy.y,0,-200,0,0);
		this.shotBullet(this.Enemy.x,this.Enemy.y,100,r,45,.5);
		this.shotBullet(this.Enemy.x,this.Enemy.y,-100,r,45,.5);
	},
	shotBulletsC:function(){
		//Front
		this.shotBullet(this.Enemy.x,this.Enemy.y,0,200,5,0);
		this.shotBullet(this.Enemy.x,this.Enemy.y,300,300,5,0);
		this.shotBullet(this.Enemy.x,this.Enemy.y,-300,300,5,0);
		//Back
		this.shotBullet(this.Enemy.x,this.Enemy.y,0,-200,45,.5);
		this.shotBullet(this.Enemy.x,this.Enemy.y,300,-200,0,.5);
		this.shotBullet(this.Enemy.x,this.Enemy.y,-300,-200,0,.5);
		//Side
		this.shotBullet(this.Enemy.x,this.Enemy.y,100,0,45,0);
		this.shotBullet(this.Enemy.x,this.Enemy.y,-100,0,45,0);
	},
	shotBulletsD:function(){
		var r=this.rnd.between(150,500);
		//Front
		this.shotBullet(this.Enemy.x,this.Enemy.y,0,r,0,0);
		this.shotBullet(this.Enemy.x,this.Enemy.y,150,r,0,0);
		this.shotBullet(this.Enemy.x,this.Enemy.y,-150,r,0,0);
		//Back
		this.shotBullet(this.Enemy.x,this.Enemy.y,0,-r,0,0);
		this.shotBullet(this.Enemy.x,this.Enemy.y,150,-r,0,0);
		this.shotBullet(this.Enemy.x,this.Enemy.y,-150,-r,0,0);
		//Side
		this.shotBullet(this.Enemy.x,this.Enemy.y,500,0,45,.95);
		this.shotBullet(this.Enemy.x,this.Enemy.y,-500,0,45,.95);
	},
	shotBulletsE:function(){
		var rD=this.rnd.between(0,5)*.1;
		var rD2=this.rnd.between(8,10)*.1;
		var rR=this.rnd.between(0,45);
		var rX=this.rnd.between(150,500);
		var rY=this.rnd.between(500,1E3);
		//Front
		this.shotBullet(this.Enemy.x,this.Enemy.y,0,rY,rR,rD);
		this.shotBullet(this.Enemy.x,this.Enemy.y,rX,rY,rR,rD);
		this.shotBullet(this.Enemy.x,this.Enemy.y,-rX,rY,rR,rD);
		//Back
		this.shotBullet(this.Enemy.x,this.Enemy.y,0,-rY,rR,rD);
		this.shotBullet(this.Enemy.x,this.Enemy.y,rX,-rY,rR,rD);
		this.shotBullet(this.Enemy.x,this.Enemy.y,-rX,-rY,rR,rD);
		//Side
		this.shotBullet(this.Enemy.x,this.Enemy.y,500,50,rR,rD2);
		this.shotBullet(this.Enemy.x,this.Enemy.y,-500,50,rR,rD2);
		this.shotBullet(this.Enemy.x,this.Enemy.y,500,-50,rR,rD2);
		this.shotBullet(this.Enemy.x,this.Enemy.y,-500,-50,rR,rD2);
	},
	shotBullet:function(x,y,velX,velY,rot,damping){
		var s=this.rnd.pick(this.Bullets.children.filter(function(e){return!e.alive}));
		if(!s)s=this.rnd.pick(this.Bullets.children);
		s.reset(x,y);
		s.body.velocity.x=velX;
		s.body.velocity.y=velY;
		s.body.angularVelocity=rot;
		s.body.damping=damping;
	},
	hitBullet:function(p,b){
		if(this.isPlaying){
			if(b.sprite.alive){
				b.sprite.kill();
				this.playerHP--;
				this.HPTS.changeText('HP: '+this.playerHP);
				if(this.rnd.between(1,100)<30){
					this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_HORIZONTAL);
					this.M.SE.play('Damage5',{volume:1});
				}else{
					this.M.SE.play('Damage'+this.rnd.integerInRange(1,4),{volume:1});
				}
				if(this.playerHP<0&&Math.abs(this.playerHP)%50==0){
					this.add.tween(this.HPTS.scale).to({x:'+2',y:'+2'},300,Phaser.Easing.Sinusoidal.Out,!0,0,0,!0);
					this.M.SE.play('Combo',{volume:1});
				}
			}
		}
	},
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