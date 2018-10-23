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
		this.respawnTimer=500;//TODO
		this.respawnInterval=500;//TODO

		this.appearItemTimer=this.curCharInfo.appearItemInterval;
		this.appearItemInterval=this.curCharInfo.appearItemInterval;

		this.tickTimer=1E3;
		this.leftTime=this.curLevelInfo.leftTime;

		this.isTimeAttack=this.curLevelInfo.timeAttack;
		this.reviveInterval=this.curCharInfo.reviveInterval;
		this.playerSpeed=this.curCharInfo.playerSpeed;
		this.respawnCount=1+this.curCharInfo.addRespawnCount;

		this.isHit=!1;
		this.isPenetrate=!1;
		this.isReviving=!1;
		this.score=0;
		this.baseScoreRate=1;

		// Obj
		this.Player=this.Enemies=this.Items=
		this.PlayerCollisionGroup=this.EnemyCollisionGroup=this.ItemCollisionGroup=
		this.HUD=this.ScoreTS=this.LeftTimeTS=this.HowToS=
		null;
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000';//TODO
		// this.playBgm();//TODO
		this.genContents();
		// this.M.gGlb('endTut')?this.genStart():this.genTut();//TODO
		this.genStart();//TODO del
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
			this.Player.body.debug=!0;
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.setPhysics();
		this.genEnemy();
		this.genItem();
		this.genPlayer();
		this.genHUD();
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
		this.Enemies.createMultiple(10,['todo_1']);//TODO
		this.Enemies.forEach(function(s){
			s.smoothed=!1;
			s.outOfBoundsKill=!0;
			s.checkWorldBounds=!0;
			s.body.collideWorldBounds=!1;
			s.body.setCircle(s.width*.5);
			s.body.setCollisionGroup(this.EnemyCollisionGroup);
			s.body.collides(this.PlayerCollisionGroup);
		},this);

		//TODO del
		var s=this.rnd.pick(this.Enemies.children.filter(function(e){return!e.alive}));
		s.reset(this.world.centerX-30,300);
		var s=this.rnd.pick(this.Enemies.children.filter(function(e){return!e.alive}));
		s.reset(this.world.centerX+30,300);
	},
	respawnEnemy:function(){
		var s=this.rnd.pick(this.Enemies.children.filter(function(e){return!e.alive}));
		if(s)this.moveTarget(s);
	},
	moveTarget:function(s){
		var rnd=this.rnd.between(0,100);
		if(rnd<50){
			var y=this.rnd.between(100,400);//TODO adjust
			s.reset(this.world.width,y);
			s.body.moveLeft(200);//TODO rnd
		}else{
			var y=this.rnd.between(100,400);//TODO adjust
			s.reset(0,y);
			s.body.moveRight(200);//TODO rnd
		}
		s.body.debug=!0//TODO del
	},
	genItem:function(){
		this.Items=this.add.group();
		this.Items.physicsBodyType=Phaser.Physics.P2JS;
		this.Items.enableBody=!0;
		this.Items.createMultiple(1,['todo_2']);//TODO
		this.Items.forEach(function(s){
			s.smoothed=!1;
			s.outOfBoundsKill=!0;
			s.checkWorldBounds=!0;
			s.body.collideWorldBounds=!1;
			s.body.setCircle(s.width*.6);//TODO adjust
			s.body.setCollisionGroup(this.ItemCollisionGroup);
			s.body.collides(this.PlayerCollisionGroup);
			// TODO ability...text
		},this);
	},
	appearItem:function(){
		var s=this.rnd.pick(this.Items.children.filter(function(e){return!e.alive}));
		if(s)this.moveTarget(s);
	},
	genPlayer:function(){
		this.Player=this.M.S.genBmpCclSp(this.world.centerX,this.world.height*.8,50,'#ff6347');
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
		this.ScoreTS.changeText(this.formatScore());

		if(!this.isPenetrate){
			p.sprite.kill();
			this.resetPlayer();
		}
	},
	getItem:function(p,i){
		i.sprite.kill();

		var doubleScore=p.sprite.key==i.sprite.key?2:1;

		this.score+=Math.floor(
			(this.world.height-this.Player.y)
			*this.curCharInfo.scoreRate
			*this.curLevel
			*this.baseScoreRate
			*doubleScore);
		this.ScoreTS.changeText(this.formatScore());

		//TODO key????
		switch(i.sprite.key){
			case 'penetrate':
				break;
			case 'scoreUp':
				break;
		}
		// penetrateBig/penetrateSpeed/reviveInterval/playerSpeed/ScoreUP/poison
	},
	fire:function(p){
		if(this.inputEnabled&&this.Player.alive){
			this.inputEnabled=!1;
			this.Player.body.velocity.y=this.playerSpeed;
			this.Player.body.velocity.x=(p.x-this.Player.x)*1.5;
		}
	},
	miss:function(){
		if(this.isPenetrate)return this.resetPlayer();

		if(!this.isHit){
			this.score+=Math.floor(
				this.world.centerY
				*this.curCharInfo.scoreRate
				*this.curLevel
				*this.baseScoreRate
				*1.5);
			this.ScoreTS.changeText(this.formatScore());

			this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
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
					this.Player.reset(this.world.centerX,this.world.height*.8);//TODO rnd pos???
				}
			},this);
		}
	},
	genHUD:function(){
		this.HUD=this.add.group();

		var txtstyl=this.M.S.txtstyl(20);
		txtstyl.fill=txtstyl.mStroke='#64FE2E';
		this.ScoreTS=this.M.S.genTxt(this.world.centerX,this.world.height*.05,this.curWords.Score+this.score,txtstyl);
		this.ScoreTS.anchor.setTo(1,0);
		this.ScoreTS.children[0].anchor.setTo(1,0);
		this.HUD.add(this.ScoreTS);

		txtstyl.fill=txtstyl.mStroke='#2E2EFE';
		this.LeftTimeTS=this.M.S.genTxt(this.world.centerX,this.world.height*.05,this.curWords.LeftTime+this.leftTime,txtstyl);
		this.LeftTimeTS.anchor.setTo(0);
		this.LeftTimeTS.children[0].anchor.setTo(0);
		this.HUD.add(this.LeftTimeTS);
		this.HUD.visible=!1;
	},
	formatScore:function(){
		return this.M.H.formatComma(this.score);
	},
	gameOver:function(){
		this.isClear=!1;
		this.end();
		if(this.isTimeAttack){
			this.genEnd(this.curWords.TimeUp,'#DF0101');
		}else{
			this.genEnd(this.curWords.GameOver,'#DF0101');
		}
	},
	clear:function(){
		this.isClear=!0;
		this.end();
		this.genEnd(this.curWords.Clear,'#FACC2E');
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
		// this.M.SE.play('GenStart',{volume:1});//TODO
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
		// this.M.SE.play('End',{volume:1});//TODO
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
		var txtstyl=this.M.S.txtstyl(45);

		txtstyl.fill=txtstyl.mStroke='#01DF3A';
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.1,this.curWords.Result,txtstyl));

		txtstyl.fill=txtstyl.mStroke='#01DF3A';//TODO per char?
		if(this.isTimeAttack){
			s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.4,this.curWords.ResScore+this.score,txtstyl));
		}else{
			s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.4,
				this.isClear?this.curWords.Clear:this.curWords.NotClear,txtstyl));
		}

		var lX=this.world.width*.25,rX=this.world.width*.75;
		//TODO txtstyle???
		if(this.isClear){
			s.addChild(this.M.S.genLbl(lX,this.world.height*.65,this.nextLevel,this.curWords.NextLevel));
		}else{
			s.addChild(this.M.S.genLbl(lX,this.world.height*.65,this.again,this.curWords.Again));
		}

		s.addChild(this.M.S.genLbl(rX,this.world.height*.65,this.tweet,this.curWords.TwBtn));
		s.addChild(this.M.S.genLbl(lX,this.world.height*.75,this.back,this.curWords.Back));
		s.addChild(this.M.S.genLbl(rX,this.world.height*.75,this.othergames,this.curWords.OtherGames));

		//TODO color and tint
		txtstyl.fontSize=25;
		txtstyl.fill=txtstyl.mStroke='#01DF3A';
		lbl=this.M.S.genLbl(lX,this.world.height*.85,this.tw,'Twitter',txtstyl);
		lbl.tint=0xff0000;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#01DF3A';
		lbl=this.M.S.genLbl(rX,this.world.height*.85,this.yt,'YouTube',txtstyl);
		lbl.tint=0x00ff00;
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
	nextLevel:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			// this.M.SE.play('OnStart',{volume:1});//TODO
			this.M.sGlb('curLevel',this.M.gGlb('curLevel')+1);
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
			var e=4444444;//TODO
			var res=33333333;//TODO
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			this.M.H.tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			// this.M.SE.play('OnBtn',{volume:1});//TODO
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectChar')},this);
			this.Tween.start();
		}
	},
	playBgm:function(){
		//TODO
		if(!this.M.SE.isPlaying('currentBGM')||this.M.SE.isPlaying('TitleBGM')){
			this.M.SE.stop('currentBGM');
			var bgm=this.M.SE.play('PlayBGM_1',{volume:1,isBGM:!0});
			bgm.onStop.add(this.loopBgm,this);
		}
	},
	loopBgm:function(){
		//TODO
		if(this.M.currentScene=='Play'){
			this.M.sGlb('curBgmNum',this.M.gGlb('curBgmNum')+1);
			if(this.M.gGlb('curBgmNum')==4)this.M.sGlb('curBgmNum',1);;
			var bgm=this.M.SE.play('PlayBGM_'+this.M.gGlb('curBgmNum'),{volume:1,isBGM:!0});
			bgm.onStop.add(this.loopBgm,this);
		}
	},
};