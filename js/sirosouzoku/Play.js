BasicGame.Play = function () {};

BasicGame.Play.prototype = {
	init: function () {
		this.player = null;
	},

	create: function () {
		this.player = this.playerContainer();
		this.physicsController();
	},

	physicsController: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.enableBody = true;
	},

	playerContainer: function () {
		var sprite = this.add.sprite(this.world.centerX, this.world.centerY, 'player');
		sprite.anchor.setTo(.5);
		// sprite.scale.setTo(.5);
		// sprite.visible = false;
		this.physics.arcade.enable(sprite);
		sprite.body.enable = true;
		sprite.body.setCircle(150);
		/*
		sprite.active = function () {
			sprite.visible = true;
			sprite.body.gravity.y = 600;
		};
		*/
		return sprite;

	},
	
	render: function () {
		this.game.debug.body(this.player);
		this.game.debug.pointer(this.game.input.activePointer);
	},

};
