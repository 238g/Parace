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
		this.respawnInterval=1E3;
		this.respawnTimer=1E3;
		this.playerCanMove=!0;
		this.playerTurnSpeed=250;
		this.lanePosX=[];
		// Obj
		this.PlayerGroup=this.ObGroup=this.TgGroup=
		null;
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		this.stage.backgroundColor='#000';
		// this.playBgm();
		this.genContents();
		// this.M.gGlb('endTut')?this.genStart():this.genTut();
		this.start();
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
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	tes:function(){
		if(__ENV!='prod'){
			// this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.gameOver,this);
			// this.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(function(){this.score=this.curLevelInfo.nextLevel-1;this.nextLevel=this.curLevelInfo.nextLevel;},this);
			// this.curLevel=this.M.H.getQuery('level')||1;this.curLevelInfo=this.LevelInfo[this.curLevel];
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.genOb();
		this.genTg();
		this.genPlayer();
	},
	genOb:function(){
		this.ObGroup=this.add.group();
		this.ObGroup.enableBody=!0;
		this.ObGroup.physicsBodyType=Phaser.Physics.ARCADE;
		this.ObGroup.createMultiple(10,'test3');
		this.ObGroup.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
			c.smoothed=!1;
		},this);
	},
	genTg:function(){
		this.TgGroup=this.add.group();
		this.TgGroup.enableBody=!0;
		this.TgGroup.physicsBodyType=Phaser.Physics.ARCADE;
		this.TgGroup.createMultiple(10,'test4');
		this.TgGroup.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
			c.smoothed=!1;
		},this);
	},
	genPlayer:function(){
		var y=this.world.height*.2;
		var laneW=this.world.width/8;
		this.PlayerGroup=this.add.group();
		for(var i=0;i<2;i++){//0right_1left
			var s=this.add.sprite(0,y,'test'+(i+1));//TODO
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
			this.PlayerGroup.add(s);
		}
		this.input.onDown.add(this.movePlayer,this);
	},
	movePlayer:function(p){
		if(this.playerCanMove){
			this.playerCanMove=!1;
			if(this.world.centerX<p.x){//left
				var num=1;
			}else{//right
				var num=0;
			}
			var s=this.PlayerGroup.children[num];
			var twA=this.add.tween(s).to({angle:20-40*s.side},this.playerTurnSpeed*.5,Phaser.Easing.Linear.None,!0);
			twA.onComplete.add(function(s){
				this.add.tween(s).to({angle:0},this.playerTurnSpeed*.5,Phaser.Easing.Linear.None,!0);
			},this);
			s.side=1-s.side;
			var twB=this.add.tween(s).to({x:s.lanePosX[s.side]},this.playerTurnSpeed,Phaser.Easing.Linear.None,!0);
			twB.onComplete.add(function(){
				this.playerCanMove=!0;
			},this);
		}
	},
	collideOb:function(){
		// this.end();
		console.log('END');
		this.M.NextScene('Play');
	},
	collideTg:function(p,t){
		t.kill();
		// TODO add score???
		// console.log(p,t);
	},
	respawnObj:function(){
		var s,laneNum;
		for(var i=0;i<2;i++){
			if(this.rnd.between(1,100)<50){
				s=this.ObGroup.getFirstDead();
				laneNum=i*2+this.rnd.between(0,1);
				if(s)this.moveObj(s,laneNum);
			}else{
				s=this.TgGroup.getFirstDead();
				laneNum=i*2+this.rnd.between(0,1);
				if(s)this.moveObj(s,laneNum);
			}

			// TODO level
			/*
				s=this.ObGroup.getFirstDead();
				if(s)this.moveObj(s,i*2);
				s=this.TgGroup.getFirstDead();
				if(s)this.moveObj(s,i*2+1);
				////
				s=this.TgGroup.getFirstDead();
				if(s)this.moveObj(s,i*2);
				s=this.ObGroup.getFirstDead();
				if(s)this.moveObj(s,i*2+1);
			*/

			// TODO level tint
		}
	},
	moveObj:function(s,laneNum){
		s.reset(this.lanePosX[laneNum],this.world.height);
		s.body.velocity.y=-300;//TODO
	},
	genHUD:function(){
		this.HUD=this.add.group();

		this.ScoreTS=this.M.S.genTxt(this.world.centerX,this.world.height*.05,this.curWords.Score+this.score,this.M.S.txtstyl(30));
		this.HUD.add(this.ScoreTS);

		this.HPTS=this.M.S.genTxt(this.world.centerX,this.world.height*.95,'HP: '+this.hp,this.M.S.txtstyl(30));
		this.HUD.add(this.HPTS);
		this.HUD.visible=!1;
	},
	gameOver:function(){
		this.end();
		this.genEnd();
	},
	playBgm:function(){
		if(!this.M.SE.isPlaying('currentBGM')||this.M.SE.isPlaying('TitleBGM')){
			this.M.SE.stop('currentBGM');
			var bgm=this.M.SE.play('PlayBGM_1',{volume:1,isBGM:!0});
			bgm.onStop.add(this.loopBgm,this);
		}
	},
	loopBgm:function(){
		if(this.M.currentScene=='Play'){
			this.M.sGlb('curBgmNum',this.M.gGlb('curBgmNum')+1);
			if(this.M.gGlb('curBgmNum')==4)this.M.sGlb('curBgmNum',1);;
			var bgm=this.M.SE.play('PlayBGM_'+this.M.gGlb('curBgmNum'),{volume:1,isBGM:!0});
			bgm.onStop.add(this.loopBgm,this);
		}
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

		var txtstyl=this.M.S.txtstyl(45);

		txtstyl.fill=txtstyl.mStroke='#01DF3A';
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.2,this.curWords.Result,txtstyl));

		txtstyl.fill=txtstyl.mStroke=this.curCharInfo.color;
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.4,this.curWords.ResScore+this.score,txtstyl));

		s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.65,this.again,this.curWords.Again));
		s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.65,this.tweet,this.curWords.TwBtn));
		s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.75,this.back,this.curWords.Back));
		s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.75,this.othergames,this.curWords.OtherGames));

		var b=this.add.button(0,this.world.height-120,'Select_'+this.curChar,this.yt,this);
		txtstyl.fontSize=30;
		txtstyl.fill=txtstyl.mStroke='#ff0000';
		b.addChild(this.M.S.genTxt((this.curChar==1||this.curChar==4)?300:100,40,'YouTube',txtstyl));
		s.addChild(b);
	},
	yt:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curCharInfo.yt;
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('youtube','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	/*
	tw:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curCharInfo.tw;
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('twitter','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	*/
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
	othergames:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=__VTUBER_GAMES;
			if(this.curLang=='en')url+='?lang=en';
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('othergames','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var e=this.curCharInfo.emoji;
			var res=this.curWords.SelectTw+this.curCharInfo.charName+'\n'+this.curWords.Score+this.score+'\n';
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			this.M.H.tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
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
		this.FollowEff.start(!1,1E3,6*this.time.physicsElapsedMS);
	},
};