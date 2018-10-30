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
		this.curLevel=this.M.gGlb('curLevel');
		this.LevelInfo=this.M.gGlb('LevelInfo');
		this.curLevelInfo=this.LevelInfo[this.curLevel];
		// Val
		this.respawnTimer=1E3;
		this.respawnInterval=this.curLevelInfo.respawnInterval;

		this.appearItemTimer=this.curCharInfo.appearItemInterval;
		this.appearItemInterval=this.curCharInfo.appearItemInterval;

		this.tickTimer=1E3;
		this.leftTime=this.curLevelInfo.leftTime;

		this.isTimeAttack=this.curLevelInfo.timeAttack;
		this.reviveInterval=this.curCharInfo.reviveInterval;
		this.playerSpeed=this.curCharInfo.playerSpeed;
		this.respawnCount=1+this.curCharInfo.addRespawnCount+this.curLevelInfo.respawnCount;

		this.moveTargetStartY=this.world.height*.15;
		this.moveTargetEndY=this.world.height*.65;

		this.isHit=!1;
		this.isPenetrate=!1;
		this.isReviving=!1;
		this.score=0;
		this.baseScoreRate=1;
		this.itemCount=0;

		this.targetScore=this.curLevelInfo.targetScore;

		// Obj
		this.Player=this.Enemies=this.Items=this.BgS=this.FlashS=
		this.PlayerCollisionGroup=this.EnemyCollisionGroup=this.ItemCollisionGroup=
		this.HUD=this.ScoreTS=this.LeftTimeTS=this.HowToS=
		null;
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		this.stage.backgroundColor='#000';
		this.M.SE.playBGM('PlayBGM_'+this.rnd.between(1,2),{volume:1});

		if(this.game.device.touch){
			this.respawnCount--;
			this.baseScoreRate=1.2;
		}

		this.genContents();
		this.M.gGlb('endTut')?this.genStart():this.genTut();
		this.test();
	},
	update:function(){
		if(this.isPlaying){
			this.respawnTimer-=this.time.elapsed;
			if(this.respawnTimer<0){
				this.respawnTimer=this.respawnInterval;
				for(var i=0;i<this.respawnCount;i++)this.respawnEnemy();
			}
			this.appearItemTimer-=this.time.elapsed;
			if(this.appearItemTimer<0){
				this.appearItemTimer=this.appearItemInterval;
				this.appearItem();
			}
			this.tickTimer-=this.time.elapsed;
			if(this.tickTimer<0){
				this.tickTimer=1E3;
				this.leftTime--;
				this.LeftTimeTS.changeText(this.curWords.LeftTime+this.leftTime);
				if(this.leftTime==0)this.gameOver();
			}
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(this.clear,this);
			// this.Player.body.debug=!0;
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.genBg();
		this.setPhysics();
		this.genEnemy();
		this.genItem();
		this.genPlayer();
		this.genEff();
		this.genHUD();
	},
	genBg:function(){
		this.BgS=this.add.sprite(0,0,'Bg_'+this.rnd.between(1,4));
		///// this.genStarTween();
		for(var i=0;i<30;i++){
			this.M.S.genBmpCclSp(this.world.randomX,this.world.randomY,5,'#ffffff')
		}
		this.FlashS=this.add.sprite(0,0,'WP');
		this.FlashS.alpha=0;
	},
	genStarTween:function(){
		var starAS=this.add.group();
		var starBS=this.add.group();
		for(var i=0;i<10;i++){
			starAS.add(this.M.S.genBmpCclSp(this.world.randomX,this.world.randomY,5,'#ffffff'));
			starBS.add(this.M.S.genBmpCclSp(this.world.randomX,this.world.randomY,5,'#ffffff'));
		}
		starBS.alpha=0;
		this.add.tween(starAS).to({alpha:0},3E3,null,!0,500,-1,!0);
		this.add.tween(starBS).to({alpha:1},3E3,null,!0,500,-1,!0);
	},
	setPhysics:function(){
		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.setImpactEvents(!0);
		this.physics.p2.restitution=.8;
		this.PlayerCollisionGroup=this.physics.p2.createCollisionGroup();
		this.EnemyCollisionGroup=this.physics.p2.createCollisionGroup();
		this.ItemCollisionGroup=this.physics.p2.createCollisionGroup();
		this.physics.p2.updateBoundsCollisionGroup();
	},
	genEnemy:function(){
		this.Enemies=this.add.group();
		this.Enemies.physicsBodyType=Phaser.Physics.P2JS;
		this.Enemies.enableBody=!0;
		var arr=[];
		for(i=1;i<=15;i++)if(i!=5)arr.push('circle_'+i);
		this.Enemies.createMultiple(10,arr);
		this.Enemies.forEach(function(s){
			s.smoothed=!1;
			s.outOfBoundsKill=!0;
			s.checkWorldBounds=!0;
			s.body.collideWorldBounds=!1;
			s.body.setCircle(s.width*.5);
			s.body.setCollisionGroup(this.EnemyCollisionGroup);
			s.body.collides(this.PlayerCollisionGroup);
		},this);
	},
	respawnEnemy:function(){
		var s=this.rnd.pick(this.Enemies.children.filter(function(e){return!e.alive}));
		if(s)this.moveTarget(s);
	},
	moveTarget:function(s){
		var speedMin=this.curLevelInfo.targetMoveSpeedMin;
		var speed=this.rnd.between(speedMin,speedMin*1.5)*this.time.physicsElapsedMS;

		if(this.rnd.between(0,100)<50){
			var y=this.rnd.between(this.moveTargetStartY,this.moveTargetEndY);
			s.reset(this.world.width,y);
			s.body.moveLeft(speed);
		}else{
			var y=this.rnd.between(this.moveTargetStartY,this.moveTargetEndY);
			s.reset(0,y);
			s.body.moveRight(speed);
		}
		////// s.body.debug=!0
	},
	genItem:function(){
		this.Items=this.add.group();
		this.Items.physicsBodyType=Phaser.Physics.P2JS;
		this.Items.enableBody=!0;
		this.Items.createMultiple(5,'circle_5');
		for(var k in this.Items.children){
			var s=this.Items.children[k];
			s.smoothed=!1;
			s.outOfBoundsKill=!0;
			s.checkWorldBounds=!0;
			s.body.collideWorldBounds=!1;
			s.body.setCircle(s.width*.6);
			s.body.setCollisionGroup(this.ItemCollisionGroup);
			s.body.collides(this.PlayerCollisionGroup);
			var txtstyl=this.M.S.txtstyl(20);
			txtstyl.fill=txtstyl.mStroke='#000';
			var ts=this.M.S.genTxt(0,s.height*.5,this.curWords['Ability_'+k],txtstyl);
			s.addChild(ts);
			s.ability=k;
		}
	},
	appearItem:function(){
		var s=this.rnd.pick(this.Items.children.filter(function(e){return!e.alive}));
		if(s)this.moveTarget(s);
	},
	genPlayer:function(){
		this.Player=this.add.sprite(this.world.centerX,this.world.height*.8,'circle_'+this.curChar);
		this.Player.anchor.setTo(.5);
		this.physics.p2.enable(this.Player);
		this.Player.smoothed=!1;
		this.Player.body.setCircle(this.Player.width*.5);
		this.Player.outOfBoundsKill=!0;
		this.Player.checkWorldBounds=!0;
		this.Player.body.collideWorldBounds=!1;
		this.Player.events.onKilled.add(this.miss,this);
		this.Player.body.static=!0;
		this.Player.body.setCollisionGroup(this.PlayerCollisionGroup);
		this.Player.body.collides(this.ItemCollisionGroup,this.getItem,this);
		this.Player.body.collides(this.EnemyCollisionGroup,this.hitEnemy,this);
		this.input.onDown.add(this.fire,this);
	},
	hitEnemy:function(p,e){
		this.isHit=!0;
		e.sprite.kill();

		var doubleScore=p.sprite.key==e.sprite.key?2:1;

		this.score+=Math.floor(
			(this.world.height-this.Player.y)
			*this.curCharInfo.scoreRate
			*this.curLevel
			*this.baseScoreRate
			*doubleScore);
		this.ScoreTS.changeText(this.curWords.Score+this.formatScore());

		this.Eff.x=this.Player.x;
		this.Eff.y=this.Player.y;
		this.Eff.explode(800,Math.floor(400/this.time.physicsElapsedMS));

		if(this.targetScore&&this.score>=this.targetScore)return this.clear();

		if(!this.isPenetrate){
			p.sprite.kill();
			this.resetPlayer();
		}

		this.M.SE.play('Catch',{volume:1});
	},
	getItem:function(p,i){
		i.sprite.kill();

		this.score+=Math.floor(
			(this.world.height-this.Player.y)
			*this.curCharInfo.scoreRate
			*this.curLevel
			*this.baseScoreRate
			*.8);
		this.ScoreTS.changeText(this.curWords.Score+this.formatScore());

		this.Eff.x=this.Player.x;
		this.Eff.y=this.Player.y;
		this.Eff.explode(800,Math.floor(400/this.time.physicsElapsedMS));

		this.itemCount++;

		if(this.targetScore&&this.score>=this.targetScore)return this.clear();

		if(this.checkItem(i.sprite.ability)){
			this.M.SE.play('GetItem',{volume:1})
		}
	},
	checkItem:function(ability){
		///// ['貫通','スコア＋','タイム＋','速','遅'];
		switch(ability){
			case '0':
				if(this.Player.tint!=0xffffff)return !1;
				this.isPenetrate=!0;
				this.Player.tint=0xff0000;
				this.time.events.add(5E3,function(){
					this.isPenetrate=!1;
					this.Player.tint=0xffffff;
				},this);
				return !0;
			case '1':
				if(this.Player.tint!=0xffffff)return !1;
				this.baseScoreRate=2;
				this.Player.tint=0x00ff00;
				this.time.events.add(5E3,function(){
					this.baseScoreRate=1;
					this.Player.tint=0xffffff;
				},this);
				return !0;
			case '2':
				this.leftTime+=3;
				this.LeftTimeTS.changeText(this.curWords.LeftTime+this.leftTime);
				return !0;
			case '3':
				if(this.Player.tint!=0xffffff)return !1;
				this.playerSpeed-=300;
				this.Player.tint=0x1e90ff;
				this.time.events.add(5E3,function(){
					this.playerSpeed+=300;
					this.Player.tint=0xffffff;
				},this);
				return !0;
			case '4':
				if(this.Player.tint!=0xffffff)return !1;
				this.playerSpeed+=300;
				this.Player.tint=0xffa500;
				this.time.events.add(5E3,function(){
					this.playerSpeed-=300;
					this.Player.tint=0xffffff;
				},this);
				return !0;
		}
		return !1;
	},
	fire:function(p){
		if(this.isPlaying&&this.inputEnabled&&this.Player.alive){
			this.inputEnabled=!1;
			this.Player.body.velocity.y=this.playerSpeed;
			this.Player.body.velocity.x=(p.x-this.Player.x)*1.5;
			this.M.SE.play('Shoot',{volume:1});
		}
	},
	miss:function(){
		if(this.isPenetrate)return this.resetPlayer();

		if(!this.isHit){
			this.score-=Math.floor(
				this.world.centerY
				*this.curCharInfo.scoreRate
				*this.curLevel
				*this.baseScoreRate
				*1.5);
			this.ScoreTS.changeText(this.curWords.Score+this.formatScore());

			this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
			this.resetPlayer();

			this.M.SE.play('Miss',{volume:1});
		}else{
			this.resetPlayer();
		}
	},
	resetPlayer:function(){
		if(!this.isReviving){
			this.isReviving=!0;
			this.isHit=!1;
			this.time.events.add(this.reviveInterval,function(){
				this.isReviving=!1;
				this.isHit=!1;
				if(this.isPlaying){
					this.inputEnabled=!0;
					this.Player.reset(this.world.centerX,this.world.height*.8);
				}
			},this);

			this.add.tween(this.FlashS).to({alpha:.3},200,null,!0,0,0,!0);
		}
	},
	genEff:function(){
		this.Eff=this.add.emitter(0,0,200);
		this.Eff.makeParticles('eff');
		this.Eff.setScale(2,.3,2,.3,800);
		this.Eff.setAlpha(1,0,800);
		this.Eff.setXSpeed(-200,200);
		this.Eff.setYSpeed(-200,200);
		this.Eff.gravity.x=0;
		this.Eff.gravity.y=0;
	},
	genHUD:function(){
		this.HUD=this.add.group();

		var txtstyl=this.M.S.txtstyl(30);
		txtstyl.fill=txtstyl.mStroke='#008000';
		this.ScoreTS=this.M.S.genTxt(this.world.centerX,this.world.height*.97,this.curWords.Score+this.score,txtstyl);
		this.HUD.add(this.ScoreTS);
		if(this.targetScore){
			this.HUD.add(this.M.S.genTxt(this.world.centerX,this.world.height*.9,this.curWords.TargetScore+this.M.H.formatComma(this.targetScore),txtstyl));
		}

		txtstyl.fill=txtstyl.mStroke='#2E2EFE';
		this.LeftTimeTS=this.M.S.genTxt(this.world.centerX,this.world.height*.05,this.curWords.LeftTime+this.leftTime,txtstyl);
		this.HUD.add(this.LeftTimeTS);
		this.HUD.visible=!1;
	},
	formatScore:function(){
		return this.M.H.formatComma(this.score);
	},
	gameOver:function(){
		if(this.isPlaying){
			this.isClear=!1;
			this.end();
			if(this.isTimeAttack){
				this.genEnd(this.curWords.TimeUp,'#DF0101');
			}else{
				this.genEnd(this.curWords.GameOver,'#DF0101');
			}
		}
	},
	clear:function(){
		if(this.isPlaying){
			this.isClear=!0;
			this.end();
			this.genEnd(this.curWords.Clear,'#FACC2E');	
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
		var s=this.M.S.genTxt(this.world.width*1.5,this.world.centerY,this.curWords.Start,txtstyl);
		var twA=this.M.T.moveA(s,{xy:{x:this.world.centerX}});
		var twB=this.M.T.moveA(s,{xy:{x:-this.world.centerX},delay:300});
		twA.chain(twB);
		twA.start();
		twA.onComplete.add(function(){this.inputEnabled=!0},this);
		twA.onComplete.add(function(){this.destroy},s);
		this.M.SE.play('GenStart',{volume:1});
		this.HUD.visible=!0;
		this.start();
	},
	genEnd:function(text,color){
		var txtstyl=this.M.S.txtstyl(45);
		txtstyl.fill=txtstyl.mStroke=color;
		this.EndTS=this.M.S.genTxt(this.world.centerX,this.world.height*2,text,txtstyl);
		var tw=this.M.T.moveA(this.EndTS,{xy:{y:this.world.centerY}});
		tw.onComplete.add(this.genRes,this);
		tw.start();
		this.M.SE.play('GenEnd',{volume:1});
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

		txtstyl.fill=txtstyl.mStroke='#dc143c';
		if(this.isTimeAttack){
			s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.22,this.curWords.ResScore+this.formatScore(),txtstyl));
		}else{
			s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.22,
				this.isClear?this.curWords.Clear:this.curWords.NotClear,txtstyl));
		}

		var charS=this.add.sprite(this.world.centerX,this.world.height*.42,'panel_'+this.curChar);
		charS.anchor.setTo(.5);
		s.addChild(charS);
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.6,this.curCharInfo.cName));

		var lX=this.world.width*.25,rX=this.world.width*.75;
		if(this.isClear&&this.curLevel<6){
			s.addChild(this.M.S.genLbl(lX,this.world.height*.7,this.nextLevel,this.curWords.NextLevel));
		}else{
			s.addChild(this.M.S.genLbl(lX,this.world.height*.7,this.again,this.curWords.Again));
		}

		txtstyl.fontSize=25;
		s.addChild(this.M.S.genLbl(rX,this.world.height*.7,this.tweet,this.curWords.TwBtn));
		s.addChild(this.M.S.genLbl(lX,this.world.height*.8,this.back,this.curWords.Back));

		txtstyl.fill=txtstyl.mStroke='#ffa500';
		lbl=this.M.S.genLbl(rX,this.world.height*.8,this.othergames,this.curWords.OtherGames,txtstyl);
		lbl.tint=0xffa500;
		s.addChild(lbl);

		if(this.curCharInfo.tw){
			txtstyl.fill=txtstyl.mStroke='#49c8f0';
			lbl=this.M.S.genLbl(lX,this.world.height*.9,this.tw,'Twitter',txtstyl);
			s.addChild(lbl);
		}

		if(this.curCharInfo.yt){
			txtstyl.fill=txtstyl.mStroke='#ff0000';
			lbl=this.M.S.genLbl(rX,this.world.height*.9,this.yt,'YouTube',txtstyl);
			lbl.tint=0xff0000;
			s.addChild(lbl);
		}

		if(this.itemCount>9){
			this.CharInfo[5].open=!0;
		}
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
	nextLevel:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnStart',{volume:1});
			this.M.sGlb('curLevel',Number(this.curLevel)+1);
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('nextLevel','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
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
			if(this.curLevel<7){
				var res=
					this.curWords.TwSelectChar+this.curCharInfo.cName+'\n'+
					this.curWords.TwLevel+this.curLevel+'\n'+
					this.curWords.TwRes+(this.isClear?this.curWords.Clear:this.curWords.NotClear)+'\n';
			}else{
				var res=
					this.curWords.TwSelectChar+this.curCharInfo.cName+'\n'+
					this.curWords.TwLevel+this.curWords.TimeAttack+this.curLevelInfo.leftTime+'\n'+
					this.curWords.Score+this.formatScore()+'\n';
			}
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
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectLevel')},this);
			this.Tween.start();
		}
	},
};