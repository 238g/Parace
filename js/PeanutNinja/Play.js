BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () { 
		////////// Const
		////////// Val
		this.isPlaying=!1;
		this.bladePoints = [];
		this.contactPoint = new Phaser.Point(0,0);
		this.TargetInfo = this.M.getConf('TargetInfo');
		this.curLevel = this.M.getGlobal('curLevel');
		this.LevelInfo = this.M.getConf('LevelInfo')[this.curLevel];
		this.targetSpawnRate = this.LevelInfo.targetSpawnRate;
		this.obstarcleSpawnRate = this.LevelInfo.obstacleSpawnRate;
		this.targetSpawnTimer = this.targetSpawnRate;
		this.obstarcleSpawnTimer = this.obstarcleSpawnRate;
		this.countdown = this.curLevel;
		this.countdownTimer=1E3;
		this.goalScore = this.LevelInfo.goalScore;
		this.curScore = 0;
		this.leftScore = this.goalScore;
		this.life = this.LevelInfo.life;
		////////// Obj
		this.BladePaint=this.BladeLine=
		this.Targets=this.Obstarcles=this.TargetPool=this.Emitters=
		this.TimerTextSprite=this.GoalScoreTextSprite=this.CurScoreTextSprite=this.LeftScoreTextSprite=
		this.LifeGroup=null;
	},

	create: function () {
		this.time.events.removeAll();
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = 300;
		this.BladePaint = this.add.graphics(0, 0);
		this.TargetContainer(); // PlayContents.js
		this.HUDContainer(); // PlayContents.js
		this.playBGM();
		this.start(); // TODO del
		this.test();
	},

	update: function () {
		if (this.isPlaying) {
			this.LevelInfo.TA&&this.TimeManager();
			this.Spawner();
			this.BladeGenerator(); // PlayContents.js
			this.Targets.forEachAlive(this.checkIntersects,this);
			this.Obstarcles.forEachAlive(this.checkIntersects,this);
		}
	},

	TimeManager: function () {
		if (this.countdownTimer<0) {
			this.countdownTimer=1E3;
			this.countdown--;
			0>=this.countdown&&this.endTA();
			this.TimerTextSprite.changeText('残り時間:'+this.countdown);
		}
		this.countdownTimer-=this.time.elapsed;
	},

	Spawner: function () {
		if (this.targetSpawnTimer<0) {
			this.targetSpawnTimer = this.targetSpawnRate;
			for (var i=0;i<2;i++) 
				this.genTarget('Targets'); // PlayContents.js
		}
		this.targetSpawnTimer-=this.time.elapsed;
		if (this.obstarcleSpawnTimer<0) {
			this.obstarcleSpawnTimer = this.obstarcleSpawnRate;
			this.genTarget('Obstarcles'); // PlayContents.js
		}
		this.obstarcleSpawnTimer-=this.time.elapsed;
	},

	checkIntersects: function (target) {
		var l1 = new Phaser.Line(target.body.right-target.width,target.body.bottom-target.height,target.body.right,target.body.bottom);
		var l2 = new Phaser.Line(target.body.right-target.width,target.body.bottom,target.body.right,target.body.bottom-target.height);
		l2.angle = 90;
		if (Phaser.Line.intersects(this.BladeLine,l1,true) || Phaser.Line.intersects(this.BladeLine,l2,true)) {
			this.contactPoint.x = this.input.x;
			this.contactPoint.y = this.input.y;
			if (Phaser.Point.distance(this.contactPoint, new Phaser.Point(target.x, target.y)) > 110) return;
			target.kill();
			for (var i=0;i<4;i++) 
				this.Emitters[target.key].emitParticle(this.contactPoint.x,this.contactPoint.y,target.key+'_Cut',i);
			this.checkGameStatus(target);
		}
	},

	checkGameStatus: function (target) {
		if (this.LevelInfo.TA) {
			this.curScore+= target.score + parseInt((target.body.velocity.y*.01-30)*(target.body.velocity.y*.01-30)*target.scoreRate);
			this.CurScoreTextSprite.changeText('スコア:'+this.curScore);
		} else {
			if (target.isTarget) {
				var score = target.score + parseInt((target.body.velocity.y*.01 - 30) * (target.body.velocity.y*.01 - 30) * .1 * target.scoreRate);
				this.curScore += score;
				this.leftScore -= score;
				this.leftScore<0&&(this.leftScore=0);
				this.setScores();
				this.goalScore<=this.curScore&&this.clear();
			} else {
				this.camera.shake(.05,200,true,Phaser.Camera.SHAKE_HORIZONTAL);
				this.life--;
				this.LifeGroup.removeChildAt(0);
				this.life<=0&&this.gameOver();
			}
		}
	},

	playBGM: function () {
		return; // TODO
		if (this.M.SE.isPlaying('PlayBGM')) return;
		this.M.SE.stop('currentBGM');
		this.M.SE.stop('TitleBGM');
		this.M.SE.play('PlayBGM',{isBGM:!0,loop:!0,volume:1});
	},

	start: function () {
		if (this.isPlaying==0) {
			this.isPlaying=!0;
		}
	},

	clear: function () {
		this.isPlaying=!1;
		console.log('clear');
	},

	gameOver: function () {
		this.isPlaying=!1;
		console.log('gameOver');
	},

	endTA: function () {
		this.isPlaying=!1;
		console.log('endTA'); 
	},

	renderT: function () {
		// this.game.debug.geom(this.BladeLine);
		for (var key in this.Targets.children) this.game.debug.body(this.Targets.children[key]);
	},

	test: function () {
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.stage.backgroundColor=BasicGame.WHITE_COLOR;
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(this.clear,this);
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
			this.input.keyboard.addKey(Phaser.Keyboard.T).onDown.add(function(){this.countdown=2;},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
