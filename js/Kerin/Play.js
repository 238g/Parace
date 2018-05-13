BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.DeclearConst();
		this.DeclearVal();
		this.DeclearObj();
	},

	DeclearConst: function () {
		this.PLAYER_FIRST_POS_X = this.world.centerX;
		this.PLAYER_FIRST_POS_Y = this.world.centerY*.5;
		this.ENEMY_HEIGHT = 80;
		this.TOUCH_OR_CLICK = this.M.getConst('TOUCH_OR_CLICK');
		this.ENEMY_ROW_COUNT = 9;
		this.ENEMY_SPEED = 12;
		this.SPAWN_RATE = 1500;
		this.JUMP_SPEED = 30;
	},

	DeclearVal: function () {
		this.curLevelKey = this.M.getGlobal('curLevelKey');
		this.LevelInfo = this.M.getConf('LevelInfo')[this.curLevelKey];
		this.isPlaying = false;
		this.secTimer = 500;
		this.holeCount = this.LevelInfo.holeCount;
		this.spawnCount = 0;
		this.clearCount = this.LevelInfo.clearCount;
	},

	DeclearObj: function () {
		this.Player = null;
		this.Enemies = null;
		this.EnemyPool = null;
		this.BadEndSprite = null;
		this.SkyTileSprite = null;
		this.StartTextSprite = null;
		this.EndTextSprite = null;
	},

	create: function () {
		this.time.events.removeAll();
		this.PhysicsManager();
		this.BgContainer(); // PlayContents.js
		this.EnemyContainer(); // PlayContents.js
		this.PlayerContainer(); // PlayContents.js
		this.FrontContainer(); // PlayContents.js
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
			this.SkyTileSprite.tilePosition.x -= 1;
		}
	},

	TimeManager: function () {
		if (this.secTimer<0) {
			this.secTimer = this.SPAWN_RATE;
			console.log(this.spawnCount); // TODO set text
			if (this.spawnCount >= this.clearCount) return this.clear();
			this.addRowOfEnemies();
			this.spawnCount++;
		}
		this.secTimer-=this.time.elapsed;
	},

	endLevel: function () {
		this.Player.body.velocity.y = 0;
		this.Player.body.gravity.y = 0;
		this.isPlaying = false;
		this.stopEnemies();
	},

	checkPlayerStatus: function () {
		if (this.Player.y < 0 || this.Player.y > this.world.height) this.gameOver();
		if (this.Player.angle < 30) this.Player.angle += 1.2;
	},

	collisionManager: function () {
		this.physics.arcade.collide(this.Player,this.Enemies,this.hitEnemy,null,this);
	},

	hitEnemy: function () {
		if (this.Player.alive == false) return;
		this.Player.alive = false;
		this.isPlaying = false;
		this.stopEnemies();
		this.Player.body.velocity.y = 0;
		this.time.events.add(500, function () {
			this.Player.kill();
			this.gameOver();
		}, this);
	},

	stopEnemies: function () {
		this.Enemies.setAll('body.velocity.x',0,true);
	},

	ready: function () {
		this.stopBGM();
		this.playBGM();
	},

	playBGM: function () {
		if (this.M.SE.isPlaying('PlayBGM')) return;
		this.M.SE.play('PlayBGM',{isBGM:true,loop:true,volume:.8});
	},

	stopBGM: function () {
		if (this.M.SE.isPlaying('PlayBGM')) return;
		this.M.SE.stop('currentBGM');
		this.M.SE.stop('TitleBGM');
	},

	start: function () {
		if (this.isPlaying == false) {
			this.StartTextSprite.hide();
			this.isPlaying = true;
			this.Enemies.killAll();
			this.resetPlayer();
		}
	},

	clear: function () {
		this.isPlaying = false;
		this.Player.body.velocity.y = 0;
		this.Player.body.gravity.y = 0;
	},

	gameOver: function () {
		this.isPlaying = false;
		this.Player.kill();
		this.showBadEnd();
	},

	nextScene: function () {
		this.showEndText();
		this.game.input.onDown.add(function () {
			this.M.NextScene('Title');
		}, this);
	},

	render: function () {
		this.game.debug.body(this.Player);
		for (var key in this.Enemies.children) this.game.debug.body(this.Enemies.children[key]);
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
