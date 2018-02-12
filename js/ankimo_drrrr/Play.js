BasicGame.Play = function () {};

BasicGame.Play.prototype = {
	player:null,

	create: function () {
		this.player = this.playerContainer();
		this.inputController();
		this.physicsController();

		this.test();
	},

	// TODO
	// update: function () {

	// },

	inputController: function () {
		this.game.input.onDown.add(function (pointer/*, event*/) {
			// TODO


		}, this);
	},

	physicsController: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.enableBody = true;
	},

	// TODO
	playerContainer: function () {
		var sprite = this.add.sprite(100, 100, '');
		// sprite.body.gravity.y = 600;
		return sprite;
	},


	test: function () {
		// sound oncomplete???
		
		this.add.audio('Male_3').play();
		setTimeout(function () {
			this.add.audio('Male_2').play();
			setTimeout(function () {
				this.add.audio('Male_1').play();
				setTimeout(function () {
					this.add.audio('go').play();
				}.bind(this), 1000);
			}.bind(this), 1000);
		}.bind(this), 1000);

	}

};
