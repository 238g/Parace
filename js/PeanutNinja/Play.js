BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () { 
		////////// Const
		////////// Val
		this.isPlaying = false;
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
		this.countdownTimer = 1000;
		this.goalScore = this.LevelInfo.goalScore;
		this.curScore = 0;
		this.leftScore = this.goalScore;
		this.life = this.LevelInfo.life;
		////////// Obj
		this.BladePaint = null;
		this.BladeLine = null;
		this.Targets = null;
		this.TargetPool = null;
		this.Obstarcles = null;
		this.ObstarclePool = null;
		this.Emitters = {};
		this.GoalScoreTextSprite = null;
		this.CurScoreTextSprite = null;
		this.LeftScoreTextSprite = null;
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
			if (this.LevelInfo.TA) this.TimeManager();
			this.Spawner();
			this.BladeGenerator(); // PlayContents.js
			this.Targets.forEachAlive(this.checkIntersects,this);
			this.Obstarcles.forEachAlive(this.checkIntersects,this);
		}
	},

	TimeManager: function () {
		if (this.countdownTimer<0) {
			this.countdownTimer = 1000;
			this.countdown--;
			if (this.countdown<=0) this.gameOverTA();
			// TODO set time text
		}
		this.countdownTimer-=this.time.elapsed;
	},

	Spawner: function () {
		if (this.targetSpawnTimer<0) {
			this.targetSpawnTimer = this.targetSpawnRate;
			for (var i=0;i<2;i++) 
				this.genTarget(); // PlayContents.js
		}
		this.targetSpawnTimer-=this.time.elapsed;
		if (this.obstarcleSpawnTimer<0) {
			this.obstarcleSpawnTimer = this.obstarcleSpawnRate;
			this.genObstarcle(); // PlayContents.js
		}
		this.obstarcleSpawnTimer-=this.time.elapsed;
	},

	checkIntersects: function (target) {
		var l1 = new Phaser.Line(target.body.right-target.width,target.body.bottom-target.height,target.body.right,target.body.bottom);
		var l2 = new Phaser.Line(target.body.right-target.width,target.body.bottom,target.body.right,target.body.bottom-target.height);
		l2.angle = 90;
		if (Phaser.Line.intersects(this.BladeLine,l1,true) || Phaser.Line.intersects(this.BladeLine, l2, true)) {
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
			// TODO damage
		} else {
			if (target.isTarget) {
				var score = target.score + parseInt((target.body.velocity.y*.01 - 30) * (target.body.velocity.y*.01 - 30) * .1 * target.scoreRate);
				this.curScore += score;
				this.leftScore -= score;
				if (this.leftScore<0) this.leftScore = 0;
				this.setScores();
				if (this.goalScore <= this.curScore) this.clear();
			} else {
				// TODO damage
			}
		}
	},

	playBGM: function () {
		return; // TODO
		if (this.M.SE.isPlaying('PlayBGM')) return;
		this.M.SE.stop('currentBGM');
		this.M.SE.stop('TitleBGM');
		this.M.SE.play('PlayBGM',{isBGM:true,loop:true,volume:1});
	},

	start: function () {
		if (this.isPlaying == false) {
			this.isPlaying = true;
		}
	},

	clear: function () {
		this.isPlaying = false;
		console.log('clear');
	},

	gameOver: function () {
		this.isPlaying = false;
		console.log('gameOver');
	},

	gameOverTA: function () {
		this.isPlaying = false;
		console.log('gameOverTA');
	},

	renderT: function () {
		// this.game.debug.geom(this.BladeLine);
		for (var key in this.Targets.children) this.game.debug.body(this.Targets.children[key]);
	},

	test: function () {
		if (__ENV!='prod') {
			this.game.debug.font='40px Courier';
			this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(this.clear, this);
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver, this);
			if(this.M.H.getQuery('mute')) this.sound.mute=true;
			this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		}
	},
};
