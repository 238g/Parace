BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.DeclearConst();
		this.DeclearVal();
		this.DeclearObj();
	},

	DeclearConst: function () {
	},

	DeclearVal: function () {
		this.isPlaying = false;
		this.spawnRate = 1500; // TODO per level
		this.secTimer = this.spawnRate;
	},

	DeclearObj: function () {
		this.Player = null;
		this.Enemys = null;
	},

	create: function () {
		this.time.events.removeAll();
		this.PhysicsManager();
		this.EnemyContainer();
		this.PlayerContainer();
		// TODO HUD
		this.ready();
		this.test();
	},

	PhysicsManager: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		// this.world.enableBody = true;
	},

	update: function () {
		if (this.isPlaying) {
			this.TimeManager();
			this.checkPlayerStatus();
			this.collisionManager();
		}
	},

	TimeManager: function () {
		if (this.secTimer<0) {
			this.secTimer = this.spawnRate;
			this.addRowOfEnemys(); // TODO
		}
		this.secTimer-=this.time.elapsed;
	},

	checkPlayerStatus: function () {
		var player = this.Player;
		if (player.y < 0 || player.y > this.world.height) this.gameOver();
		if (player.angle < 20) player.angle += 1;
	},

	collisionManager: function () {
		this.physics.arcade.collide(this.Player,this.Enemys,this.hitEnemy,null,this);
	},

	hitEnemy: function () {
		if (this.Player.alive == false) return;
		this.Player.alive = false;
		this.isPlaying = false;
		this.Enemys.forEach(function (enemy) {
			enemy.body.velocity.x = 0;
		}, this);
		this.Player.body.velocity.y = 0;
		this.time.events.add(500, function () { // TODO del
		// this.time.events.add(2000, function () {
			this.Player.kill();
			this.gameOver();
		}, this);
	},

	ready: function () {
		// TODO
		// this.stopBGM();
		// this.playBGM();
		this.start(); // TODO del
	},

	playBGM: function () {
		var s = this.M.SE;
		if (s.isPlaying('Stage_1')) return;
		s.play('Stage_1',{isBGM:true,loop:true,volume:1});
	},

	stopBGM: function () {
		var s = this.M.SE;
		if (s.isPlaying('PlayBGM')) return;
		s.stop('currentBGM');
		s.stop('TitleBGM');
	},

	start: function () {
		this.isPlaying = true;
	},

	gameOver: function () {
		this.isPlaying = false;
		this.Player.kill();
		console.log('GameOver');
	},

	renderT: function () {
	},

	test: function () {
		if (__ENV!='prod') {
			this.game.debug.font='40px Courier';
			this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function () {}, this);
			this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		}
	},
};
