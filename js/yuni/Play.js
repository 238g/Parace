BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.curLevel=this.M.gGlb('curLevel');
		this.LevelInfo=this.M.gGlb('LevelInfo');
		this.curLevelInfo=this.LevelInfo[this.curLevel];
		// Val
		this.respawnInterval=this.curLevelInfo.respawnInterval;
		this.respawnTimer=1E3;
		this.playerCanMoveLeft=!0;
		this.playerCanMoveRight=!0;
		this.playerTurnSpeed=this.curLevelInfo.playerTurnSpeed;
		this.objVel=this.curLevelInfo.objVel;

		if(!this.game.device.desktop&&this.curLevel>=8){
			this.objGrv=this.curLevelInfo.objGrv+200;
		}else{
			this.objGrv=this.curLevelInfo.objGrv;
		}

		this.lanePosX=[];
		this.hp=3;
		this.score=0;
		this.scoreRate=100;
		this.targetScore=this.curLevel*this.scoreRate*this.curLevelInfo.goalCount;
		this.isClear=!1;
		this.mode=this.curLevelInfo.mode;
		// Obj
		this.PlayerGroup=this.ObGroup=this.TgGroup=
		this.HUD=this.ScoreTS=this.HPTS=
		this.HowToS=this.EndTS=this.BgS=
		null;
		this.Tween={};
		this.respawnMode=this['respawnMode_'+this.curLevelInfo.objMode];
	},
	create:function(){
		this.input.maxPointers=2;
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		this.stage.backgroundColor='#000';
		this.M.SE.playBGM('PlayBGM',{volume:1});
		this.genContents();
		this.M.gGlb('endTut')?this.genStart():this.genTut();
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			this.respawnTimer-=this.time.elapsed;
			if(this.respawnTimer<0){
				this.respawnTimer=this.respawnInterval;
				this.respawnObj();
			}

			this.physics.arcade.collide(this.PlayerGroup,this.ObGroup,this.collideOb,null,this);
			this.physics.arcade.collide(this.PlayerGroup,this.TgGroup,this.collideTg,null,this);
		}
		this.BgS.tilePosition.y-=1;
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.gameOver,this);
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(this.clear,this);
		}
	},
	////////////////////////////////////// PlayContents
	renderT:function(){
		this.PlayerGroup.forEachAlive(function(c){this.game.debug.body(c)},this);
		this.ObGroup.forEachAlive(function(c){this.game.debug.body(c)},this);
		this.TgGroup.forEachAlive(function(c){this.game.debug.body(c)},this);
	},
	genContents:function(){
		this.physics.startSystem(Phaser.Physics.ARCADE);

		this.BgS=this.add.tileSprite(0,0,this.world.width,this.world.height,'PlayBg_1');
		this.genDropEff();
		this.genOb();
		this.genTg();
		this.genPlayer();
		this.genHUD();

		this.input.onDown.add(this.onInputClick,this);
		this.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(this.onInputLeft,this);
		this.input.keyboard.addKey(Phaser.Keyboard.J).onDown.add(this.onInputRight,this);
	},
	genDropEff:function(){
		var e=this.add.emitter(this.world.centerX,this.world.height,200);
		e.width=this.world.width;
		e.makeParticles(['Drop_1','Drop_2']);
		e.minParticleScale=.1;
		e.maxParticleScale=1;
		e.setYSpeed(-800,-1E3);
		e.setXSpeed(0,0);
		e.start(!1,1E3,this.time.physicsElapsedMS*3,0);
	},
	genOb:function(){
		this.ObGroup=this.add.group();
		this.ObGroup.enableBody=!0;
		this.ObGroup.physicsBodyType=Phaser.Physics.ARCADE;
		this.ObGroup.createMultiple(10,'Ob');
		this.ObGroup.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
			c.smoothed=!1;
			c.tint=this.curLevelInfo.tint;
		},this);
	},
	genTg:function(){
		this.TgGroup=this.add.group();
		this.TgGroup.enableBody=!0;
		this.TgGroup.physicsBodyType=Phaser.Physics.ARCADE;
		this.TgGroup.createMultiple(10,'Tg');
		this.TgGroup.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
			c.smoothed=!1;
			c.tint=this.curLevelInfo.tint;
		},this);
	},
	genPlayer:function(){
		var y=this.world.height*.23;
		var laneW=this.world.width/8;
		this.PlayerGroup=this.add.group();
		for(var i=0;i<2;i++){//0right_1left
			var s=this.add.sprite(0,y,'Player_'+(i+1));
			s.anchor.setTo(.5);
			s.smoothed=!1;
			s.side=i;
			var la=laneW*(1+4*i);
			var lb=laneW*(3+4*i);
			s.lanePosX=[la,lb];
			this.lanePosX[i*2]=la;
			this.lanePosX[i*2+1]=lb;
			s.x=s.lanePosX[s.side];
			this.physics.enable(s,Phaser.Physics.ARCADE);
			s.body.allowRotation=!1;
			s.body.moves=!1;
			s.body.setSize(s.width*.4,s.height*.5,s.width*.3,s.height*.5);
			this.PlayerGroup.add(s);
			if(i==1)s.update=function(){this.angle-=1};
		}
	},
	onInputClick:function(p){
		if(this.isPlaying){
			if(this.playerCanMoveLeft&&p.x<this.world.centerX){
				this.playerCanMoveLeft=!1;
				this.movePlayer(0);
			}else if(this.playerCanMoveRight){
				this.playerCanMoveRight=!1;
				this.movePlayer(1);
			}
		}
	},
	movePlayer:function(num){
		var s=this.PlayerGroup.children[num];
		if(num==0){
			var twA=this.add.tween(s).to({angle:20-40*s.side},this.playerTurnSpeed*.5,Phaser.Easing.Linear.None,!0);
			twA.onComplete.add(function(s){
				this.add.tween(s).to({angle:0},this.playerTurnSpeed*.5,Phaser.Easing.Linear.None,!0);
			},this);
		}
		s.side=1-s.side;
		var twB=this.add.tween(s).to({x:s.lanePosX[s.side]},this.playerTurnSpeed,Phaser.Easing.Linear.None,!0);
		if(num==0){
			twB.onComplete.add(function(){this.playerCanMoveLeft=!0},this);
		}else{
			twB.onComplete.add(function(){this.playerCanMoveRight=!0},this);
		}
		this.M.SE.play('Move',{volume:1});
	},
	collideOb:function(p,o){
		o.kill();
		this.M.SE.play('Damage',{volume:1});
		this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
		this.hp--;
		this.HPTS.changeText(this.curWords.HP+this.hp);
		if(this.hp<=0)this.gameOver();
	},
	collideTg:function(p,t){
		t.kill();
		this.M.SE.play('GetScore',{volume:1});
		this.score+=this.curLevel*this.scoreRate;
		this.ScoreTS.changeText(this.genScoreText(this.score));
		if(this.score>=this.targetScore&&this.mode=='score')this.clear();
	},
	genScoreText:function(score){
		return this.curWords.Score+this.M.H.formatComma(score);
	},
	respawnObj:function(){this.respawnMode()},
	respawnMode:function(){},
	respawnMode_1:function(){//50,50,0
		var s,laneNum;
		for(var i=0;i<2;i++){
			var r=this.rnd.between(1,100);
			if(r<50){
				s=this.ObGroup.getFirstDead();
				laneNum=i*2+this.rnd.between(0,1);
				if(s)this.moveObj(s,laneNum);
			}else{
				s=this.TgGroup.getFirstDead();
				laneNum=i*2+this.rnd.between(0,1);
				if(s)this.moveObj(s,laneNum);
			}
		}
	},
	respawnMode_2:function(){//40,40,20
		var s,laneNum;
		for(var i=0;i<2;i++){
			var r=this.rnd.between(1,100);
			if(r<40){
				s=this.ObGroup.getFirstDead();
				laneNum=i*2+this.rnd.between(0,1);
				if(s)this.moveObj(s,laneNum);
			}else if(r<80){
				s=this.TgGroup.getFirstDead();
				laneNum=i*2+this.rnd.between(0,1);
				if(s)this.moveObj(s,laneNum);
			}else{
				if(r<90){
					s=this.ObGroup.getFirstDead();
					if(s)this.moveObj(s,i*2);
					s=this.TgGroup.getFirstDead();
					if(s)this.moveObj(s,i*2+1);
				}else{
					s=this.TgGroup.getFirstDead();
					if(s)this.moveObj(s,i*2);
					s=this.ObGroup.getFirstDead();
					if(s)this.moveObj(s,i*2+1);
				}
			}
		}
	},
	respawnMode_3:function(){//20,20,60
		var s,laneNum;
		for(var i=0;i<2;i++){
			var r=this.rnd.between(1,100);
			if(r<20){
				s=this.ObGroup.getFirstDead();
				laneNum=i*2+this.rnd.between(0,1);
				if(s)this.moveObj(s,laneNum);
			}else if(r<20){
				s=this.TgGroup.getFirstDead();
				laneNum=i*2+this.rnd.between(0,1);
				if(s)this.moveObj(s,laneNum);
			}else{
				if(r<70){
					s=this.ObGroup.getFirstDead();
					if(s)this.moveObj(s,i*2);
					s=this.TgGroup.getFirstDead();
					if(s)this.moveObj(s,i*2+1);
				}else{
					s=this.TgGroup.getFirstDead();
					if(s)this.moveObj(s,i*2);
					s=this.ObGroup.getFirstDead();
					if(s)this.moveObj(s,i*2+1);
				}
			}
		}
	},
	moveObj:function(s,laneNum){
		s.reset(this.lanePosX[laneNum],this.world.height);
		s.body.velocity.y=this.objVel;
		s.body.gravity.y=this.objGrv;
	},
	genHUD:function(){
		this.HUD=this.add.group();

		if(this.mode=='score'){
			var tgScoreTS=this.M.S.genTxt(this.world.centerX,this.world.height*.05,this.curWords.TargetScore+this.M.H.formatComma(this.targetScore),this.M.S.txtstyl(30));
			this.HUD.add(tgScoreTS);
			this.ScoreTS=this.M.S.genTxt(this.world.centerX,this.world.height*.11,this.genScoreText(this.score),this.M.S.txtstyl(30));
			this.HUD.add(this.ScoreTS);
		}else{
			this.ScoreTS=this.M.S.genTxt(this.world.centerX,this.world.height*.05,this.genScoreText(this.score),this.M.S.txtstyl(30));
			this.HUD.add(this.ScoreTS);
		}

		this.HPTS=this.M.S.genTxt(this.world.centerX,this.world.height*.95,this.curWords.HP+this.hp,this.M.S.txtstyl(30));
		this.HUD.add(this.HPTS);
		this.HUD.visible=!1;
	},
	onInputLeft:function(){
		if(this.isPlaying&&this.playerCanMoveLeft){
			this.playerCanMoveLeft=!1;
			this.movePlayer(0);
		}
	},
	onInputRight:function(){
		if(this.isPlaying&&this.playerCanMoveRight){
			this.playerCanMoveRight=!1;
			this.movePlayer(1);
		}
	},
	clear:function(){
		this.isClear=!0;
		this.end();
		this.M.SE.play('Clear',{volume:1});
		this.genEnd();
	},
	gameOver:function(){
		this.isClear=!1;
		this.end();
		this.M.SE.play('GameOver',{volume:1});
		this.genEnd();
	},
	////////////////////////////////////////////////////////////////////////////////////
	genEnd:function(){
		var txtstyl=this.M.S.txtstyl(45);
		txtstyl.fill=txtstyl.mStroke='#DF0101';
		this.EndTS=this.M.S.genTxt(this.world.centerX,-this.world.centerY,this.isClear?this.curWords.Clear:this.curWords.GameOver,txtstyl);
		var tw=this.M.T.moveA(this.EndTS,{xy:{y:this.world.centerY}});
		tw.onComplete.add(this.genRes,this);
		tw.start();
	},
	genRes:function(){
		var s=this.add.sprite(0,this.world.height,'TWP');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600});
		tw.onComplete.add(function(){this.inputEnabled=!0},this);
		tw.onComplete.add(function(){this.visible=!1},this.EndTS);
		tw.onStart.add(function(){this.M.SE.play('Res',{volume:1})},this);
		tw.start();
		this.HUD.visible=!1;

		var txtstyl=this.M.S.txtstyl(45);

		txtstyl.fill=txtstyl.mStroke='#04B45F';
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.2,this.curWords.Result,txtstyl));

		txtstyl.fill=txtstyl.mStroke='#00BFFF';
		if(this.mode=='score'){
			s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.4,'Level '+this.curLevel+'\n'+(this.isClear?this.curWords.Clear:this.curWords.GameOver),txtstyl));
		}else{
			s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.4,this.curWords.ResScore+'\n'+this.M.H.formatComma(this.score),txtstyl));
		}

		if(this.isClear&&this.curLevel<10){
			s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.65,this.nextLevel,this.curWords.NextLevel));
		}else{
			s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.65,this.again,this.curWords.Again));
		}

		s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.65,this.tweet,this.curWords.TwBtn));
		s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.75,this.back,this.curWords.Back));
		s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.75,this.othergames,this.curWords.OtherGames));

		var b=this.add.button(this.world.centerX,this.world.height*.9,'YuNi_2',this.yt,this);
		b.anchor.setTo(.5);
		s.addChild(b);
		txtstyl.fill=txtstyl.mStroke='#DF013A';
		s.addChild(this.M.S.genTxt(this.world.width*.26,this.world.height*.85,'YouTube',txtstyl));
	},
	yt:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=BasicGame.YOUTUBE_URL;
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('youtube','Play','Level_'+this.curLevel,this.M.gGlb('playCount'));
		}
	},
	nextLevel:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnStart',{volume:1});
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			this.M.sGlb('curLevel',Number(this.curLevel)+1);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('next_level','Play','Level_'+this.curLevel,this.M.gGlb('playCount'));
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
			myGa('again','Play','Level_'+this.curLevel,this.M.gGlb('playCount'));
		}
	},
	othergames:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=__VTUBER_GAMES;
			if(this.curLang=='en')url+='?lang=en';
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('othergames','Play','Level_'+this.curLevel,this.M.gGlb('playCount'));
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var e='';
			var arr=['🎵','🎶','🎼','🎤','🎧','💽','💿','🦄'];
			for(var i=0;i<6;i++)e+=this.rnd.pick(arr);
			if(this.mode=='score'){
				var res=this.curWords.TwLevel+this.curLevel+'\n'+this.curWords.TwRes+(this.isClear?this.curWords.Clear:this.curWords.GameOver)+'\n';
			}else{
				var res=this.curWords.TwLevel+this.curWords.TwMode+'\n'+this.genScoreText(this.score)+'\n';
			}
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			this.M.H.tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','Level_'+this.curLevel,this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnBtn',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectLevel')},this);
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
		txtstyl.fill=txtstyl.mStroke='#00FF00';
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
};