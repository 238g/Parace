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
		this.notesTimer=1E3;
		this.loopNotesTime=this.curStageInfo.loopNotesTime;
		this.obstaclesTimer=1E3;
		this.loopObstaclesTime=this.curStageInfo.loopObstaclesTime;

		this.playerMoveSpeed=this.curStageInfo.playerMoveSpeed;
		this.playerLife=this.curStageInfo.playerLife;

		this.score=0;

		this.timeAttackTimer=1E3;
		this.timeAttackLeftTime=this.curStageInfo.timeAttackLeftTime;

		this.endTxt=null;
		// Obj
		this.Tween={};
		this.LeftKey=this.RightKey=
		this.ArrowRightS=this.ArrowLeftS=this.Player=this.Notes=this.Obstacles=
		this.NotesEmitter=
		this.CurScoreTS=this.TargetScoreTS=this.TimeTS=
		this.Lives=
		this.HUD=
		null;
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		this.stage.backgroundColor='#000';
		this.genContents();
		this.M.gGlb('endTut')?this.start():this.tut();
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			this.notesTimer-=this.time.elapsed;
			if(this.notesTimer<0){
				this.notesTimer=this.loopNotesTime;
				this.respawnNotes();
			}
			this.obstaclesTimer-=this.time.elapsed;
			if(this.obstaclesTimer<0){
				this.obstaclesTimer=this.loopObstaclesTime;
				this.respawnObstacles();
			}
			if(this.input.activePointer.isDown){
				if(this.input.activePointer.x>this.world.centerX){
					this.Player.body.x+=(this.playerMoveSpeed*this.time.physicsElapsedMS);
					if(this.ArrowRightS.tint!=16711680)this.ArrowRightS.tint=16711680;//0xff0000
					if(this.ArrowLeftS.tint!=16777215)this.ArrowLeftS.tint=16777215;//0xffffff
				}else{
					this.Player.body.x-=(this.playerMoveSpeed*this.time.physicsElapsedMS);
					if(this.ArrowRightS.tint!=16777215)this.ArrowRightS.tint=16777215;//0xffffff
					if(this.ArrowLeftS.tint!=16711680)this.ArrowLeftS.tint=16711680;//0xff0000
				}
				if(this.Player.centerX<0)this.Player.centerX=this.world.width;
				if(this.Player.centerX>this.world.width)this.Player.centerX=0;
			}else{
				if(this.RightKey.isDown){
					this.Player.body.x+=(this.playerMoveSpeed*this.time.physicsElapsedMS);
					if(this.ArrowRightS.tint!=16711680)this.ArrowRightS.tint=16711680;//0xff0000
					if(this.ArrowLeftS.tint!=16777215)this.ArrowLeftS.tint=16777215;//0xffffff
					if(this.Player.centerX<0)this.Player.centerX=this.world.width;
					if(this.Player.centerX>this.world.width)this.Player.centerX=0;
				}else if(this.LeftKey.isDown){
					this.Player.body.x-=(this.playerMoveSpeed*this.time.physicsElapsedMS);
					if(this.ArrowRightS.tint!=16777215)this.ArrowRightS.tint=16777215;//0xffffff
					if(this.ArrowLeftS.tint!=16711680)this.ArrowLeftS.tint=16711680;//0xff0000
					if(this.Player.centerX<0)this.Player.centerX=this.world.width;
					if(this.Player.centerX>this.world.width)this.Player.centerX=0;
				}else{
					if(this.ArrowRightS.tint!=16777215)this.ArrowRightS.tint=16777215;//0xffffff
					if(this.ArrowLeftS.tint!=16777215)this.ArrowLeftS.tint=16777215;//0xffffff
				}
			}
			if(this.curStageInfo.mode==2){
				this.timeAttackTimer-=this.time.elapsed;
				if(this.timeAttackTimer<0){
					this.timeAttackTimer=1E3;
					this.timeAttackLeftTime--;
					this.TimeTS.changeText(this.curWords.TimeAttack+this.timeAttackLeftTime);
					if(this.timeAttackLeftTime<=0)this.timeout();
				}
			}
			this.physics.arcade.overlap(this.Player,this.Notes,this.collideNotes,null,this);
			this.physics.arcade.overlap(this.Player,this.Obstacles,this.collideObstacles,null,this);
		}
	},
	tut:function(){
		this.M.sGlb('endTut',!0);
		// TODO item list
		this.start();
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	render:function(){
		this.game.debug.body(this.Player);
	},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(this.clear,this);
			this.input.keyboard.addKey(Phaser.Keyboard.T).onDown.add(this.timeout,this);
			// if(this.M.H.getQuery('f')){this.AGroup.pendingDestroy=!0;this[this.M.H.getQuery('f')]();}
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.enableBody=!0;

		this.LeftKey=this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		this.RightKey=this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

		this.add.sprite(0,0,'Bg_1');

		this.ArrowRightS=this.add.sprite(this.world.width,this.world.height,'GameIconsWhite','arrowRight');
		this.ArrowRightS.anchor.setTo(1);
		this.ArrowRightS.smoothed=!1;
		this.ArrowLeftS=this.add.sprite(0,this.world.height,'GameIconsWhite','arrowLeft');
		this.ArrowLeftS.anchor.setTo(0,1);
		this.ArrowLeftS.smoothed=!1;

		this.Player=this.add.sprite(this.world.centerX,this.world.height,'Kazaki_1');
		this.Player.anchor.setTo(.5,1);
		this.physics.arcade.enable(this.Player);
		this.Player.body.setCircle(this.Player.width*.4,this.Player.width*.1,this.Player.height*.05);
		this.Player.smoothed=!1;

		this.Notes=this.add.group();
		this.Notes.enableBody=!0;
		this.Notes.physicsBodyType=Phaser.Physics.ARCADE;
		this.Notes.createMultiple(Math.floor(200/this.curStageInfo.noteKeys.length),this.curStageInfo.noteKeys);
		this.Notes.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
			c.smoothed=!1;
		},this);

		this.Obstacles=this.add.group();
		this.Obstacles.enableBody=!0;
		this.Obstacles.physicsBodyType=Phaser.Physics.ARCADE;
		this.Obstacles.createMultiple(Math.floor(200/this.curStageInfo.obstacleKeys.length),this.curStageInfo.obstacleKeys);
		this.Obstacles.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
			c.smoothed=!1;
		},this);

		this.NotesEmitter=this.add.emitter(0,0,300);
		this.NotesEmitter.makeParticles(null,0,300,!1,!1);
		this.NotesEmitter.gravity=200;
		this.NotesEmitter.maxParticleScale=.5;
		this.NotesEmitter.minParticleScale=.5;

		if(this.curStageInfo.mode!=2){
			this.Lives=this.add.group();
			for(var i=0;i<this.curStageInfo.playerLife;i++){
				var life=this.add.sprite(0,0,'HealthHeart');
				this.Lives.add(life);
			}
			this.Lives.align(1,-1,life.width,life.height*1.5);
			this.Lives.alignIn(this.world.bounds,Phaser.RIGHT_CENTER,-life.width*.5,0);
		}

		this.HUD=this.add.group();
		if(this.curStageInfo.mode==1){
			this.TargetScoreTS=this.M.S.genTxt(this.world.centerX,this.world.height*.04,this.curWords.TargetScore+this.M.H.formatComma(this.curStageInfo.targetScore),this.M.S.txtstyl(25));
			this.CurScoreTS=this.M.S.genTxt(this.world.centerX,this.world.height*.11,this.curWords.CurScore+this.M.H.formatComma(this.score),this.M.S.txtstyl(30));
			this.HUD.add(this.TargetScoreTS);
			this.HUD.add(this.CurScoreTS);
		}else if(this.curStageInfo.mode==2){
			this.TimeTS=this.M.S.genTxt(this.world.centerX,this.world.height*.04,this.curWords.TimeAttack+this.curStageInfo.timeAttackLeftTime,this.M.S.txtstyl(25));
			this.CurScoreTS=this.M.S.genTxt(this.world.centerX,this.world.height*.11,this.curWords.CurScore+this.M.H.formatComma(this.score),this.M.S.txtstyl(30));
			this.HUD.add(this.TimeTS);
			this.HUD.add(this.CurScoreTS);
		}else{
			this.CurScoreTS=this.M.S.genTxt(this.world.centerX,this.world.height*.05,this.curWords.CurScore+this.M.H.formatComma(this.score),this.M.S.txtstyl(30));
			this.HUD.add(this.CurScoreTS);
		}

	},
	respawnNotes:function(){
		var s=this.rnd.pick(this.Notes.children.filter(function(c){return!c.alive}));
		if(s){
			s.reset(this.world.randomX,0);
			s.body.gravity.y=this.rnd.between(this.curStageInfo.gravityRangeMin,this.curStageInfo.gravityRangeMax);
		}
	},
	respawnObstacles:function(){
		var s=this.rnd.pick(this.Obstacles.children.filter(function(c){return!c.alive}));
		if(s){
			s.reset(this.world.randomX,0);
			s.body.gravity.y=this.rnd.between(this.curStageInfo.gravityRangeMin,this.curStageInfo.gravityRangeMax);
		}
	},
	collideNotes:function(player,note){
		note.kill();
		for(var i=0;i<4;i++)this.NotesEmitter.emitParticle(note.x,note.y,note.key);
		// this.M.SE.play('Hit',{volume:1});

		this.score+=this.getScore(note);
		this.CurScoreTS.changeText(this.curWords.CurScore+this.M.H.formatComma(this.score));

		if(this.curStageInfo.mode==1){
			if(this.score>this.curStageInfo.targetScore)
				return this.clear();
		}
	},
	collideObstacles:function(player,obstacle){
		obstacle.kill();
		this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_BOTH);
		// this.M.SE.play('Hit',{volume:1});

		for(var i=0;i<4;i++)this.NotesEmitter.emitParticle(obstacle.x,obstacle.y,obstacle.key);

		if(this.curStageInfo.mode==2){
			this.score+=this.getScore(obstacle);
			this.CurScoreTS.changeText(this.curWords.CurScore+this.M.H.formatComma(this.score));
		}else{
			this.playerLife--;
			this.Lives.getBottom().destroy();
			if(this.playerLife==0){
				this.Player.alive=!1;
				// TODO effect
				return this.gameOver();
			}			
		}
	},
	getScore:function(s){
		var score=(this.rnd.between(111,155)*s.body.gravity.y*this.curStageInfo.scoreRate*.01);
		switch(s.key){
			case 'Banana_3':score*=-3;break;
			case 'Obstacle_1':score*=-5;break;
			case 'Obstacle_2':score*=-10;break;
			default:score*=Number(String(s.key).split('_')[1]);
		}
		return Math.floor(score);
	},
	gameOver:function(){this.genEnd(this.curWords.GameOver)},
	clear:function(){this.genEnd(this.curWords.Clear)},
	timeout:function(){this.genEnd(this.curWords.Timeout)},
	genEnd:function(txt){
		this.end();
		var ts=this.M.S.genTxt(this.world.width*1.5,this.world.centerY,txt,this.M.S.txtstyl(50));
		var tw=this.M.T.moveA(ts,{xy:{x:this.world.centerX},delay:500});
		tw.onComplete.add(this.genRes,this);
		tw.start();
		this.endTxt=txt;
		this.HUD.add(ts);
	},
	genRes:function(){
		this.time.events.add(500,function(){
			this.HUD.destroy();
			var s=this.add.sprite(-this.world.width,0,'TWP');
			s.tint=0x000000;
			var tw=this.M.T.moveA(s,{xy:{x:0}});
			tw.onComplete.add(function(){
				this.inputEnabled=!0;
				this.M.S.genLbl(this.world.width*.25,this.world.height*.7,this.again,this.curWords.Again);
				this.M.S.genLbl(this.world.width*.75,this.world.height*.7,this.tweet,this.curWords.Tweet);
				this.M.S.genLbl(this.world.width*.25,this.world.height*.82,this.othergames,this.curWords.OtherGames);
				this.M.S.genLbl(this.world.width*.75,this.world.height*.82,this.back,this.curWords.Back);
			},this);
			tw.start();
			var txtstyl=this.M.S.txtstyl(35);
			txtstyl.fill=txtstyl.mStroke='#FF0040';
			s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.15,this.curWords.Result,txtstyl));
			if(this.curStageInfo.mode==1){
				txtstyl.fontSize=50;
				s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.35,this.endTxt,txtstyl));
			}else if(this.curStageInfo.mode==2){
				s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.35,this.curWords.CurScore+this.M.H.formatComma(this.score),txtstyl));
			}else{
				s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.35,this.curWords.CurScore+this.M.H.formatComma(this.score),txtstyl));
			}
		},this);
	},
	again:function(){
		if(!this.Tween.isRunning){
			this.inputEnabled=!1;
			// this.M.SE.play('Enter',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			myGa('restart','Play','playCount_'+this.M.gGlb('playCount'),this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(!this.Tween.isRunning){
			this.inputEnabled=!1;
			// this.M.SE.play('Enter',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectStage')},this);
			this.Tween.start();
		}
	},
	yt:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});
			this.game.device.desktop?window.open(BasicGame.YOUTUBE_URL,"_blank"):location.href=BasicGame.YOUTUBE_URL;
			myGa('youtube','Play','playCount_'+this.M.gGlb('playCount'),this.M.gGlb('playCount'));
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});

			var e=['🍌🍌🍌🍌🍌🍌','🦍🦍🦍🦍🦍🦍','🐻🐻🐻🐻🐻🐻',
				'🍯🍯🍯🍯🍯🍯','🌳🌳🌳🌳🌳🌳','🍓🍓🍓🍓🍓🍓',];

			var res='あああああああああああああああああああああああああ\n';//TODO

			var txt=this.rnd.pick(e)+'\n'+this.curWords.TweetTtl+'\n'+res+this.rnd.pick(e)+'\n';
			this.M.H.tweet(txt,this.curWords.TweetHT,location.href);
			myGa('tweet','Play','playCount_'+this.M.gGlb('playCount'),this.M.gGlb('playCount'));
		}
	},
	othergames:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});
			this.game.device.desktop?window.open(__VTUBER_GAMES,"_blank"):location.href=__VTUBER_GAMES;
			myGa('othergames','Play','Stage_'+this.curStg,this.M.gGlb('playCount'));
		}
	},
};