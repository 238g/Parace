BasicGame.Play = function () {};

BasicGame.Play.prototype = {
	init: function () {
		this.GAME = null;
		this.bg = null;
		this.player = null;
		this.obstacles = null;
		this.HUD = null;
		this.Result = null;
	},

	create: function () {
		this.GAME = this.gameController();
		this.soundController();
		this.bg = this.genBGContainer();
		this.player = this.genPlayerSprite();
		this.physicsController();
		this.inputController();
		this.genObstacleContainer();
		this.HUD = this.genHUDContainer();
		this.Result = this.genResultContainer();
		this.test();
	},

	update: function () {
		this.collisionObstacle();
		this.collisionGround();
		this.killToDestroyObstacle();
		this.bg.tileMove(this.GAME.speed);
	},
	collisionObstacle: function () { this.physics.arcade.collide(this.player, this.obstacles, this.GAME.gameOver, null, this); },
	collisionGround: function () { this.physics.arcade.collide(this.player, this.bg.ground); },
	killToDestroyObstacle: function () {
		if (this.obstacles.children[0] && this.obstacles.children[0].alive === false && this.GAME.isPlaying) {
			this.obstacles.children[0].destroy();
			this.GAME.plusScore();
			this.GAME.checkStageLevel();
			this.GAME.bgColor();
			this.GAME.nuisance();
		}
	},

	gameController: function () {
		var controller = {};
		var self = this;
		var c = this.game.const;
		var timer = null;
		var score = 0;
		controller.currentStage = c.STAGE_1;
		controller.speed = 1;
		// var highScore = 0;
		controller.isPlaying = true;
		controller.okToTop = false;
		controller.scoreCountToGoToStage2 = 30;
		controller.scoreCountToGoToStage3 = 60;
		controller.plusScore = function () {
			score += 1;
			self.HUD.changeScore('スコア: ' + score);
		};
		controller.setObstacleTimer = function () {
			if (timer) { self.time.events.remove(timer); }
			if (this.currentStage == c.STAGE_2) {
				timer = self.time.events.loop(self.rnd.integerInRange(1200, 1500), self.genObstacleSprite, self);
			} else if (this.currentStage == c.STAGE_3) {
				timer = self.time.events.loop(self.rnd.integerInRange(1000, 1500), self.genObstacleSprite, self);
			} else {
				timer = self.time.events.loop(1500, self.genObstacleSprite, self);
			}
		};
		controller.gameOver = function (player,obstacle) {
			controller.isPlaying = false;
			this.time.events.remove(timer);
			player.kill();
			obstacle.kill();
			setTimeout(function () {
				controller.okToTop = true;
			}, 1000);
			this.Result.show();
			this.HUD.resultView();
		}; // <- bind(this)
		controller.checkStageLevel = function () {
			if (score >= this.scoreCountToGoToStage3 && this.currentStage == c.STAGE_2) {
				this.setStageLevel(c.STAGE_3);
			} else if (score >= this.scoreCountToGoToStage2 && this.currentStage == c.STAGE_1) {
				this.setStageLevel(c.STAGE_2);
			}
		};
		controller.bgColor = function () {
			var remainder = score % 90;
			if (remainder == 0) {
				self.bg.daytime();
			} else if (remainder == 30) {
				self.bg.evening();
			} else if (remainder == 60) {
				self.bg.night();
			}
		};
		controller.setStageLevel = function (level) {
			if (level == c.STAGE_2) {
				this.currentStage = c.STAGE_2;
				this.speed = 2;
				this.setObstacleTimer();
				self.player.speedUp(this.speed);
				if (__ENV!='prod') { console.log('stage2'); }
			} else if (level == c.STAGE_3) {
				this.currentStage = c.STAGE_3;
				this.speed = 3;
				this.setObstacleTimer();
				self.player.speedUp(this.speed);
				if (__ENV!='prod') { console.log('stage3'); }
			}
		};
		controller.getObstacleSpeed = function () {
			if (this.currentStage == c.STAGE_2) {
				return self.rnd.integerInRange(1000, 1500);
			} else if (this.currentStage == c.STAGE_3) {
				return self.rnd.integerInRange(1200, 2000);
			}
			return 1000;
		};
		controller.nuisance = function () {
			if (this.currentStage == c.STAGE_2) {
				if (self.rnd.integerInRange(1, 20) == 1) {
					// TODO nuisance
				}
			} else if (this.currentStage == c.STAGE_3) {
				if (self.rnd.integerInRange(1, 10) == 1) {
					// TODO nuisance
				}
			}
		};
		return controller;
	},

	soundController: function () {
		var s = this.game.global.SoundManager;
		s.stop('currentBGM');
		setTimeout(function () {
			s.play({key:'DaytimeBGM',isBGM:true,loop:true});
			s.setVolume('DaytimeBGM', .6);
		}, 500);
	},

	genBGContainer: function () {
		var controller = {};
		var skyTileSprite = this.genSkyTileSprite();
		var mountainTileSprite = this.genMountainTileSprite();
		var groundTileSprite = this.genGroundTileSprite();
		controller.tileMove = function (speed) {
			skyTileSprite.tilePosition.x += (speed * .5);
			mountainTileSprite.tilePosition.x += (speed * 3);
			groundTileSprite.tilePosition.x += (speed * 5 + 5);
		};
		controller.daytime = function () {
			skyTileSprite.daytimeTween.start();
			mountainTileSprite.daytimeTween.start();
			groundTileSprite.daytimeTween.start();
		};
		controller.evening = function () {
			skyTileSprite.eveningTween.start();
			mountainTileSprite.eveningTween.start();
			groundTileSprite.eveningTween.start();
		};
		controller.night = function () {
			skyTileSprite.nightTween.start();
			mountainTileSprite.nightTween.start();
			groundTileSprite.nightTween.start();
		};
		controller.ground = groundTileSprite;
		return controller;
	},

	genSkyTileSprite: function () {
		var c = this.game.const;
		var tileSprite = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'sky');
		tileSprite.daytimeTween = this.tweenTint(tileSprite, c.DAYTIME_COLOR, 3000);
		tileSprite.eveningTween = this.tweenTint(tileSprite, c.EVENING_COLOR, 3000);
		tileSprite.nightTween = this.tweenTint(tileSprite, c.NIGHT_COLOR, 3000);
		return tileSprite;
	},

	genMountainTileSprite: function () {
		var c = this.game.const;
		var tileSprite = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'mountain');
		tileSprite.daytimeTween = this.tweenTint(tileSprite, c.DAYTIME_COLOR, 3000);
		tileSprite.eveningTween = this.tweenTint(tileSprite, c.EVENING_COLOR, 3000);
		tileSprite.nightTween = this.tweenTint(tileSprite, c.NIGHT_COLOR, 3000);
		return tileSprite;
	},

	genGroundTileSprite: function () {
		var c = this.game.const;
		var tileSprite = this.add.tileSprite(0, this.world.height-120, this.world.width, 120, 'ground');
		tileSprite.daytimeTween = this.tweenTint(tileSprite, c.DAYTIME_COLOR, 3000);
		tileSprite.eveningTween = this.tweenTint(tileSprite, c.EVENING_COLOR, 3000);
		tileSprite.nightTween = this.tweenTint(tileSprite, c.NIGHT_COLOR, 3000);
		this.physics.arcade.enable(tileSprite);
		tileSprite.body.immovable = true;
		return tileSprite;
	},

	tweenTint: function (obj, toColor, time) {
		var colorBlend = {step: 0};
		var colorTween = this.add.tween(colorBlend).to({step: 100}, time);
		colorTween.onUpdateCallback(function() {
			console.log(obj.tint, toColor);
			obj.tint = Phaser.Color.interpolateColor(obj.tint, toColor, 100, colorBlend.step);
		});
		// colorTween.start();
		return colorTween;
	},

	inputController: function () {
		this.game.input.onDown.add(function (/*pointer, event*/) {
			if (this.GAME.isPlaying) {
				this.player.jump();
			} else {
				if (this.GAME.okToTop) {
					this.game.global.nextSceen = 'Title';
					this.state.start(this.game.global.nextSceen);
				}
			}
		}, this);
	},

	physicsController: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.enableBody = true;
	},

	genPlayerSprite: function () {
		var self = this;
		var sprite = this.add.sprite(this.world.centerX+500, this.world.centerY, 'player');
		sprite.anchor.setTo(.5);
		this.physics.arcade.enable(sprite);
		sprite.body.enable = true;
		sprite.body.setCircle(120, 70, 60);
		sprite.body.gravity.y = 5000; // init stage 1
		sprite.body.collideWorldBounds = true;
		sprite.animations.add('running');
		sprite.animations.play('running', 10, true); // init stage 1
		sprite.jumpVal = 2200; // init stage 1
		sprite.jump = function () {
			if (sprite.body.touching.down) {
				sprite.body.velocity.y = -sprite.jumpVal;
				self.game.global.SoundManager.play('Jump');
			}
		};
		sprite.speedUp = function (speed) {
			sprite.jumpVal = 1000 + 1000 * speed;
			sprite.body.gravity.y = 5000 * speed;
			sprite.animations.stop();
			sprite.animations.play('running', (5 + 5*speed), true);
		};
		return sprite;
	},

	genObstacleContainer: function () {
		this.obstacles = this.add.group();
		this.GAME.setObstacleTimer();
	},

	genObstacleSprite: function () {
		var sprite = null;
		var y = this.world.height-120;
		switch (this.rnd.integerInRange(1, 2)) {
			case 1:
				sprite = this.add.sprite(0, y, 'obstacle_1');
				sprite.scale.setTo(.5);
				break;
			case 2:
				sprite = this.add.sprite(0, y, 'obstacle_2');
				sprite.scale.setTo(.6);
				break;
		}
		sprite.anchor.setTo(.5,1);
		this.obstacles.add(sprite);
		this.physics.arcade.enable(sprite);
		sprite.body.setCircle(200);
		sprite.body.velocity.x = this.GAME.getObstacleSpeed();
		sprite.checkWorldBounds = true;
		sprite.outOfBoundsKill = true;
		return sprite;
	},

	genHUDContainer: function () {
		var controller = {};
		var self = this;
		var textStyle = {
			fill: '#000000',
			stroke:'#FFFFFF',
			strokeThickness: 20,
			multipleStroke:'#000000',
			multipleStrokeThickness: 20,
		};
		var scoreTextSprite = this.genScoreTextSprite(textStyle);
		// var highScoreTextSprite = this.genHighScoreTextSprite(textStyle);
		controller.changeScore = scoreTextSprite.changeText;
		// controller.changeHighScore = highScoreTextSprite.changeText;
		controller.resultView = function () {
			scoreTextSprite.scale.setTo(0);
			scoreTextSprite.multipleTextSprite.scale.setTo(0);
			scoreTextSprite.move(self.world.centerX, self.world.centerY);
			scoreTextSprite.tween.start();
			scoreTextSprite.tween2.start();
		};
		return controller;
	},

	genScoreTextSprite: function (textStyle) {
		var textSprite = this.game.global.SpriteManager.genText(
			this.world.centerX/2, 50, 'スコア: 0', textStyle
		);
		textSprite.tween = this.add.tween(textSprite.scale).to({x: 2, y: 2}, 1000, Phaser.Easing.Elastic.Out);
		textSprite.tween2 = this.add.tween(textSprite.multipleTextSprite.scale).to({x: 2, y: 2}, 1000, Phaser.Easing.Elastic.Out);
		return textSprite;
	},

	genHighScoreTextSprite: function (textStyle) {
		var textSprite = this.game.global.SpriteManager.genText(
			this.world.centerX/2*3, 50, 'ハイスコア: 0', textStyle
		);
	},

	genResultContainer: function () {
		var sprite = this.add.sprite(this.world.width,this.world.height,'siro_res');
		sprite.anchor.setTo(1);
		sprite.visible = false;
		sprite.show = function () {
			sprite.visible = true;
			sprite.tween.start();
		};
		// .to(properties [, duration] [, ease] [, autoStart] [, delay] [, repeat] [, yoyo])
		sprite.tween = this.add.tween(sprite).to({x: this.world.width-10}, 100, Phaser.Easing.Bounce.InOut, false, 0, -1, true);
		return sprite;
	},

	test: function () {
		if (__ENV!='prod') {
			if (getQuery('sl')) {
				this.GAME.setStageLevel(getQuery('sl'));
			}
			if (getQuery('sc2')) {
				this.GAME.scoreCountToGoToStage2 = getQuery('sc2');
			}
			if (getQuery('sc3')) {
				this.GAME.scoreCountToGoToStage3 = getQuery('sc3');
			}
		}
	},
	
	render: function () {
		this.game.debug.body(this.player);
		for (var key in this.obstacles.children) { this.game.debug.body(this.obstacles.children[key]); }
		this.game.debug.pointer(this.game.input.activePointer);
	},

};