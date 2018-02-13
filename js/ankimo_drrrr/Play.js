BasicGame.Play = function () {};

BasicGame.Play.prototype = {
	player:null,

	create: function () {
		this.player = this.playerContainer();
		this.inputController();
		this.physicsController();

		this.test();
	},

	update: function () {
		if (this.player.x < 0) {
			this.player.x = this.world.width;
		} else if (this.player.x > this.world.width) {
			this.player.x = 0;
		}
		if (this.player.y < 0) {
			console.log('upper game over');
		} else if (this.player.y > this.world.height) {
			console.log('lower game over');
		}
	},

	inputController: function () {
		this.game.input.onDown.add(function (pointer/*, event*/) {
			// TODO
			this.player.body.velocity.x = (this.player.x-pointer.x)*2;
			this.player.body.velocity.y = (this.player.y-pointer.y)*2;
			this.player.body.angularVelocity = 200;
			console.log(
				'this.player.x,',this.player.x,
				'this.player.y,',this.player.y,
				'pointer.x,',pointer.x,
				'pointer.y,',pointer.y,
			);

		}, this);
	},

	physicsController: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.enableBody = true;
	},

	// TODO
	playerContainer: function () {
		var sprite = this.add.sprite(this.world.centerX, this.world.centerY, 'player');
		sprite.anchor.setTo(.5);
		this.physics.arcade.enable(sprite);
		// sprite.body.bounce.y = 0.5;
		sprite.body.gravity.y = 600;
		// sprite.body.collideWorldBounds = true;
		console.log(sprite);
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
