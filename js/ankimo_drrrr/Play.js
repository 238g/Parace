BasicGame.Play = function () {};

BasicGame.Play.prototype = {
	player:null,

	create: function () {
		this.ready();
	},

	ready: function () {
		this.player = this.playerContainer();
		this.walls = this.wallContainer();

		/*
		this.add.audio('Male_3').play();
		setTimeout(function () {
			this.add.audio('Male_2').play();
			setTimeout(function () {
				this.add.audio('Male_1').play();
				setTimeout(function () {
					this.add.audio('go').play();
					this.play();
				}.bind(this), 1000);
			}.bind(this), 1000);
		}.bind(this), 1000);
		*/
					this.play();
	},

	play: function () {
		this.player.active();
		this.inputController();
		this.physicsController();
	},

	update: function () {
		this.physics.arcade.collide(this.player, this.walls, function () {
			console.log('collision');
			this.player.body.enable = false;
		}.bind(this));
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
		document.body.style.cursor = 'pointer';
		this.game.input.onDown.add(function (pointer/*, event*/) {
			this.player.body.velocity.x = (this.player.x-pointer.x)*2;
			this.player.body.velocity.y = (this.player.y-pointer.y)*2;
			this.player.body.angularVelocity = 200;
			// TODO
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

	playerContainer: function () {
		var sprite = this.add.sprite(this.world.centerX, this.world.centerY, 'player');
		sprite.anchor.setTo(.5);
		sprite.scale.setTo(.5);
		sprite.visible = false;
		this.physics.arcade.enable(sprite);
		sprite.body.setCircle(150);
		sprite.active = function () {
			sprite.visible = true;
			sprite.body.gravity.y = 600;
			// sprite.body.bounce.y = 0.5;
		};
		// sprite.body.collideWorldBounds = true;
		return sprite;
	},

	wallContainer: function () {
		var walls = this.add.group();
		var floor = this.add.graphics(0,this.world.height-50);
		floor.lineStyle(10, 0xff0000, 1);
		floor.drawRect(0,0,this.world.width,10);
		this.physics.arcade.enable(floor);
		floor.body.immovable = true;
		walls.add(floor);
		var ceiling = this.add.graphics(0,50);
		ceiling.lineStyle(10, 0xff0000, 1);
		ceiling.drawRect(0,0,this.world.width,10);
		this.physics.arcade.enable(ceiling);
		ceiling.body.immovable = true;
		walls.add(ceiling);
		return walls;
	},

	test: function () {
	},

	
	render: function () {
		this.game.debug.body(this.player);
		this.game.debug.pointer(this.game.input.activePointer);
	},


};
