BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.DeclearConst();
		this.DeclearVal();
		this.DeclearObj();
	},

	DeclearConst: function () {
		this.WORLD_GRAVITY_Y = 300;
	},

	DeclearVal: function () {
		this.isPlaying = false;
		this.spawnRate = 1000;
		this.spawnTimer = 1000;
		this.bladePoints = [];
		this.contactPoint = new Phaser.Point(0,0);
	},

	DeclearObj: function () {
		this.BladePaint = null;
		this.BladeLine = null;
		this.Targets = null;
		this.TargetPool = null;
		this.Obstarcles = null;
		this.ObstarclePool = null;
	},

	create: function () {
		this.time.events.removeAll();
		this.PhysicsManager();
		this.BladePaint = this.add.graphics(0, 0);
		this.ObstarclesContainer(); // PlayContents.js
		this.TargetContainer(); // PlayContents.js
		this.ready();
		this.test();
	},

	PhysicsManager: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = this.WORLD_GRAVITY_Y;
	},

	update: function () {
		if (this.isPlaying) {
			this.Spawner();
			this.BladeGenerator(); // PlayContents.js
			this.Targets.forEachAlive(this.checkIntersects,this);
			this.Obstarcles.forEachAlive(this.checkIntersects,this);
		}
	},

	Spawner: function () {
		if (this.spawnTimer<0) {
			this.spawnTimer = this.spawnRate;
			// for (var i=0;i<5;i++) 
				this.genTarget();
			// for (var i=0;i<3;i++) 
				this.genObstarcle();
		}
		this.spawnTimer-=this.time.elapsed;
	},

	checkIntersects: function (target) {
		var l1 = new Phaser.Line(target.body.right-target.width,target.body.bottom-target.height,target.body.right,target.body.bottom);
		var l2 = new Phaser.Line(target.body.right-target.width,target.body.bottom,target.body.right,target.body.bottom-target.height);
		l2.angle = 90;
		if (Phaser.Line.intersects(this.BladeLine,l1,true) || Phaser.Line.intersects(this.BladeLine, l2, true)) {
			this.contactPoint.x = this.input.x;
			this.contactPoint.y = this.input.y;
			var distance = Phaser.Point.distance(this.contactPoint, new Phaser.Point(target.x, target.y));
			if (Phaser.Point.distance(this.contactPoint, new Phaser.Point(target.x, target.y)) > 110) return;
			target.kill();
		}
	},

	ready: function () {
		this.playBGM();
		this.start(); // TODO del
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
	},

	gameOver: function () {
		this.isPlaying = false;
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
