BasicGame.Play = function () {};

BasicGame.Play.prototype = {
	init: function () {
		this.player = null;
		this.obstacles = null;
		this.timer = null;
	},

	create: function () {
		// http://www.lessmilk.com/tutorial/flappy-bird-phaser-1
		this.player = this.playerContainer();
		this.physicsController();
		this.inputController();
		this.obstacleContainer();
	},

	update: function () {
		this.collisionObstacle();
	},

	collisionObstacle: function () {
		this.physics.arcade.collide(this.player, this.obstacles, this.gameOver, null, this);
	},

	inputController: function () {
		this.game.input.onDown.add(function (pointer/*, event*/) {
			this.player.body.velocity.y = -1800;
			console.log(this.player,this.obstacles);
		}, this);
	},

	physicsController: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.enableBody = true;
	},

	playerContainer: function () {
		var sprite = this.add.sprite(this.world.centerX+500, this.world.centerY, 'player');
		sprite.anchor.setTo(.5);
		this.physics.arcade.enable(sprite);
		sprite.body.enable = true;
		sprite.body.setCircle(150);
		sprite.body.gravity.y = 3000;
		sprite.body.collideWorldBounds = true;
		return sprite;
	},

	obstacleContainer: function () {
		this.obstacles = this.add.group();
		this.addOneObstacle(0,100);
		this.timer = this.time.events.loop(1500, this.addOneObstacle, this);
	},

	addOneObstacle: function () {
		var sprite = this.add.sprite(0, this.world.height, 'player');
		sprite.anchor.setTo(.5,1);
		this.obstacles.add(sprite);
		this.physics.arcade.enable(sprite);
		sprite.body.velocity.x = 1000;
		sprite.checkWorldBounds = true; // TODO check
		sprite.outOfBoundsKill = true; // TODO check
	},

	gameOver: function (/*player,obstacle*/) {
		// TODO
		this.time.events.remove(this.timer);
	},
	
	render: function () {
		this.game.debug.body(this.player);
		this.game.debug.pointer(this.game.input.activePointer);
	},

};
