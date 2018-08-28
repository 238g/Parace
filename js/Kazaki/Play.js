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
		// Obj
		this.Tween={};
		this.LeftKey=this.RightKey=
		this.ArrowRightS=this.ArrowLeftS=this.Player=this.Notes=this.Obstacles=
		null;
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
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
			this.physics.arcade.overlap(this.Player,this.Notes,this.collideNotes,null,this);
			this.physics.arcade.overlap(this.Player,this.Obstacles,this.collideObstacles,null,this);
		}
	},
	tut:function(){
		this.M.sGlb('endTut',!0);
		// TODO item list
		this.start();
	},
	start:function(){
		this.isPlaying=this.inputEnabled=!0;
	},
	end:function(){
		this.isPlaying=this.inputEnabled=!1;
	},
	render:function(){
		this.game.debug.body(this.Player);
	},
	tes:function(){
		if(__ENV!='prod'){
			// this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.end,this);
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
		this.ArrowLeftS=this.add.sprite(0,this.world.height,'GameIconsWhite','arrowLeft');
		this.ArrowLeftS.anchor.setTo(0,1);

		this.Player=this.add.sprite(this.world.centerX,this.world.height,'Kazaki_1');
		this.Player.anchor.setTo(.5,1);
		this.physics.arcade.enable(this.Player);
		this.Player.body.setCircle(this.Player.width*.5,0,0);

		this.Notes=this.add.group();
		this.Notes.enableBody=!0;
		this.Notes.physicsBodyType=Phaser.Physics.ARCADE;
		this.Notes.createMultiple(10,this.curStageInfo.noteKeys);
		this.Notes.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
		},this);

		this.Obstacles=this.add.group();
		this.Obstacles.enableBody=!0;
		this.Obstacles.physicsBodyType=Phaser.Physics.ARCADE;
		this.Obstacles.createMultiple(10,this.curStageInfo.obstacleKeys);
		this.Obstacles.children.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
		},this);
	},
	respawnNotes:function(){
		var s=this.rnd.pick(this.Notes.children.filter(function(c){return!c.alive;}));
		if(s){
			s.reset(this.world.randomX,0);
			s.body.gravity.y=this.rnd.between(this.curStageInfo.gravityRangeMin,this.curStageInfo.gravityRangeMax);
		}
	},
	respawnObstacles:function(){
		var s=this.rnd.pick(this.Obstacles.children.filter(function(c){return!c.alive;}));
		if(s){
			s.reset(this.world.randomX,0);
			s.body.gravity.y=this.rnd.between(this.curStageInfo.gravityRangeMin,this.curStageInfo.gravityRangeMax);
		}
	},
	collideNotes:function(player,note){
		note.kill();
		// TODO score++
	},
	collideObstacles:function(player,obstacle){
		obstacle.kill();
		this.playerLife--;
		if(this.playerLife==0){
			this.Player.alive=!1;
			// TODO effect
			// TODO shake
			return this.end();
		}
	},




	//TODO res
	back:function(){
		if(this.inputEnabled){
			if(!this.Tween.isRunning){
				this.end();
				// this.M.SE.play('Enter',{volume:1});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
				this.Tween.onComplete.add(function(){this.M.NextScene('SelectStage')},this);
				this.Tween.start();
			}
		}
	},
	yt:function(){

	},
	tweet:function(){

	},
	othergames:function(){
		// this.M.SE.play('OnBtn',{volume:1});
		if (this.game.device.desktop) {
			window.open(BasicGame.MY_GAMES_URL,'_blank');
		} else {
			location.href=BasicGame.MY_GAMES_URL;
		}
		myGa('othergames','Play','Stage_'+this.curStg,this.M.gGlb('playCount'));
	},
};