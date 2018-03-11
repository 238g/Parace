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
		this.collisionManager();
		this.killToDestroyObstacle();
		this.bg.tileMove(this.GAME.speed);
	},

	collisionManager:function () {
		this.physics.arcade.collide(this.player, this.obstacles, this.GAME.gameOver, null, this);
		this.physics.arcade.collide(this.player, this.bg.ground);
	},

	killToDestroyObstacle: function () {
		if (this.obstacles.children[0] && this.obstacles.children[0].alive === false && this.GAME.isPlaying) {
			this.obstacles.children[0].destroy();
			this.GAME.plusScore();
			this.GAME.checkStageLevel();
			this.GAME.bgColor();
			this.GAME.checkNuisance();
		}
	},

	gameController: function () {
		var controller = {};
		var self = this;
		var c = this.game.const;
		var timer = null;
		controller.score = 0;
		controller.currentStage = c.STAGE_1;
		controller.speed = 1;
		controller.isPlaying = true;
		controller.okToTop = false;
		controller.scoreCountToGoToStage2 = 30;
		controller.scoreCountToGoToStage3 = 60;
		controller.scoreCountToGoToStage4 = 90;
		controller.scoreCountToGoToStage5 = 120;
		controller.plusScore = function () {
			controller.score += 1;
			self.HUD.changeScore('スコア: ' + controller.score);
		};
		controller.setObstacleTimer = function () {
			if (timer) { self.time.events.remove(timer); }
			switch (this.currentStage) {
				case c.STAGE_2: timer = self.time.events.loop(self.rnd.integerInRange(1400, 1500), self.genObstacleSprite, self); break;
				case c.STAGE_3: timer = self.time.events.loop(self.rnd.integerInRange(1300, 1500), self.genObstacleSprite, self); break;
				case c.STAGE_4: timer = self.time.events.loop(self.rnd.integerInRange(1200, 1500), self.genObstacleSprite, self); break;
				case c.STAGE_5: timer = self.time.events.loop(self.rnd.integerInRange(1000, 1500), self.genObstacleSprite, self); break;
				default: timer = self.time.events.loop(1500, self.genObstacleSprite, self); break;
			}
		};
		controller.gameOver = function (player,obstacle) {
			controller.isPlaying = false;
			this.time.events.remove(timer);
			player.kill();
			obstacle.kill();
			this.game.global.SoundManager.play('GameOver');
			setTimeout(function () {
				controller.okToTop = true;
			}, 1000);
			this.Result.show();
			this.Result.tweetBtn.allShow();
			this.HUD.showGameOver();
		}; // <- bind(this)
		controller.checkStageLevel = function () {
			if (controller.score >= this.scoreCountToGoToStage5 && this.currentStage == c.STAGE_4) {
				this.setStageLevel(c.STAGE_5);
				if (__ENV!='prod') { self.bg.evening(); }
			} else if (controller.score >= this.scoreCountToGoToStage4 && this.currentStage == c.STAGE_3) {
				this.setStageLevel(c.STAGE_4);
				if (__ENV!='prod') { self.bg.daytime(); }
			} else if (controller.score >= this.scoreCountToGoToStage3 && this.currentStage == c.STAGE_2) {
				this.setStageLevel(c.STAGE_3);
				if (__ENV!='prod') { self.bg.night(); }
			} else if (controller.score >= this.scoreCountToGoToStage2 && this.currentStage == c.STAGE_1) {
				this.setStageLevel(c.STAGE_2);
				if (__ENV!='prod') { self.bg.evening(); }
			}
		};
		controller.bgColor = function () {
			var remainder = controller.score % 90;
			if (remainder == 0) {
				self.bg.daytime();
			} else if (remainder == 30) {
				self.bg.evening();
			} else if (remainder == 60) {
				self.bg.night();
			}
		};
		controller.setStageLevel = function (level) {
			this.currentStage = level;
			switch (level) {
				case c.STAGE_2: this.speed = 1; break;
				case c.STAGE_3: this.speed = 2; break;
				case c.STAGE_4: this.speed = 2; break;
				case c.STAGE_5: this.speed = 3; break;
			}
			this.setObstacleTimer();
			self.player.speedUp(this.speed);
			self.game.global.SoundManager.play('LevelUp');
			if (__ENV!='prod') { console.log('stage'+this.currentStage); }
		};
		controller.getObstacleSpeed = function () {
			switch (this.currentStage) {
				case c.STAGE_2: return self.rnd.integerInRange(1000, 1500);
				case c.STAGE_3: return self.rnd.integerInRange(1000, 1600);
				case c.STAGE_4: return self.rnd.integerInRange(1000, 1800);
				case c.STAGE_5: return self.rnd.integerInRange(1200, 2200);
				default: return 1000;
			}
		};
		controller.checkNuisance = function () {
			var rndNum = self.rnd.integerInRange(0,100);
			switch (this.currentStage) {
				case c.STAGE_2: if (rndNum < 3) {self.bg.actNuisance();} break;
				case c.STAGE_3: if (rndNum < 5) {self.bg.actNuisance();} break;
				case c.STAGE_4: if (rndNum < 10) {self.bg.actNuisance();} break;
				case c.STAGE_5: if (rndNum < 15) {self.bg.actNuisance();} break;
				default: if (rndNum === 0) {self.bg.actNuisance();} break;
			}
		};
		return controller;
	},

	soundController: function () {
		var s = this.game.global.SoundManager;
		s.stop('currentBGM');
		setTimeout(function () {
			s.play({key:'DaytimeBGM',isBGM:true,loop:true,volume:.4});
		}, 500);
	},

	genBGContainer: function () {
		var controller = {};
		var self = this;
		var s = this.game.global.SoundManager;
		var skyTileSprite = this.genSkyTileSprite();
		var mountainTileSprite = this.genMountainTileSprite();
		var groundTileSprite = this.genGroundTileSprite();
		var nuisanceSprite = this.genNuisanceSprite();
		controller.tileMove = function (speed) {
			skyTileSprite.tilePosition.x += (speed * .5);
			mountainTileSprite.tilePosition.x += (speed * 3);
			groundTileSprite.tilePosition.x += (speed * 5 + 5);
		};
		controller.daytime = function () {
			skyTileSprite.daytimeTween.START();
			mountainTileSprite.daytimeTween.START();
			groundTileSprite.daytimeTween.START();
			s.fadeOut('currentBGM', 1000);
			s.onComplete('currentBGM', function () {
				if (this.GAME.isPlaying) {
					s.play({key:'DaytimeBGM',isBGM:true,loop:true,volume:.4});
				}
			}, self);
		};
		controller.evening = function () {
			skyTileSprite.eveningTween.START();
			mountainTileSprite.eveningTween.START();
			groundTileSprite.eveningTween.START();
			s.fadeOut('currentBGM', 1000);
			s.onComplete('currentBGM', function () {
				if (this.GAME.isPlaying) {
					s.play({key:'EveningBGM',isBGM:true,loop:true,volume:.6});
				}
			}, self);
		};
		controller.night = function () {
			skyTileSprite.nightTween.START();
			mountainTileSprite.nightTween.START();
			groundTileSprite.nightTween.START();
			s.fadeOut('currentBGM', 1000);
			s.onComplete('currentBGM', function () {
				if (this.GAME.isPlaying) {
					s.play({key:'NightBGM',isBGM:true,loop:true,volume:.6});
				}
			}, self);
		};
		controller.actNuisance = function () {
			if (!nuisanceSprite.tween.isRunning && !nuisanceSprite.tweenBack.isRunning) {
				nuisanceSprite.tween.start();
			}
		};
		controller.ground = groundTileSprite;
		return controller;
	},

	genSkyTileSprite: function () {
		var c = this.game.const;
		var tileSprite = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'sky');
		tileSprite.daytimeTween = this.tweenTint(tileSprite, c.NIGHT_COLOR, c.DAYTIME_COLOR, 3000);
		tileSprite.eveningTween = this.tweenTint(tileSprite, c.DAYTIME_COLOR, c.EVENING_COLOR, 3000);
		tileSprite.nightTween = this.tweenTint(tileSprite, c.EVENING_COLOR, c.NIGHT_COLOR, 3000);
		return tileSprite;
	},

	genMountainTileSprite: function () {
		var c = this.game.const;
		var tileSprite = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'mountain');
		tileSprite.daytimeTween = this.tweenTint(tileSprite, c.NIGHT_COLOR, c.DAYTIME_COLOR, 3000);
		tileSprite.eveningTween = this.tweenTint(tileSprite, c.DAYTIME_COLOR, c.EVENING_COLOR, 3000);
		tileSprite.nightTween = this.tweenTint(tileSprite, c.EVENING_COLOR, c.NIGHT_COLOR, 3000);
		return tileSprite;
	},

	genGroundTileSprite: function () {
		var c = this.game.const;
		var tileSprite = this.add.tileSprite(0, this.world.height-120, this.world.width, 120, 'ground');
		tileSprite.daytimeTween = this.tweenTint(tileSprite, c.NIGHT_COLOR, c.DAYTIME_COLOR, 3000);
		tileSprite.eveningTween = this.tweenTint(tileSprite, c.DAYTIME_COLOR, c.EVENING_COLOR, 3000);
		tileSprite.nightTween = this.tweenTint(tileSprite, c.EVENING_COLOR, c.NIGHT_COLOR, 3000);
		this.physics.arcade.enable(tileSprite);
		tileSprite.body.immovable = true;
		return tileSprite;
	},

	tweenTint: function (obj, startColor, endColor, time) {
		var colorBlend = {step: 0};
		var colorTween = this.add.tween(colorBlend).to({step: 100}, time);
		colorTween.onUpdateCallback(function() {
			obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);
		});
		colorTween.START = function () {
			colorBlend.step = 0;
			colorTween.start();
		};
		return colorTween;
	},

	genNuisanceSprite: function () {
		var y = this.world.height-120;
		var sprite = this.game.global.SpriteManager.genSprite(0, y, 'nuisance');
		sprite.anchor.setTo(1);
		sprite.scale.setTo(.5);
		var toX = this.world.centerX;
		sprite.tween = this.add.tween(sprite).to({x:'+'+toX}, 1800, Phaser.Easing.Elastic.Out);
		sprite.tweenBack = this.add.tween(sprite).to({x:0}, 3000, Phaser.Easing.Linear.None);
		sprite.tween.onComplete.add(function () {
			sprite.tweenBack.start();
		}, this);
		return sprite;
	},

	inputController: function () {
		this.game.input.onDown.add(function (pointer) {
			if (this.GAME.isPlaying) {
				this.player.jump();
			} else {
				if (this.GAME.okToTop && !pointer.targetObject) {
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
		sprite.body.setCircle(100, 90, 90);
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
		var y = this.world.height-120;
		var rndNum = this.rnd.integerInRange(1, 4);
		var sprite = this.add.sprite(0, y, 'obstacle_'+rndNum);
		sprite.anchor.setTo(.5,1);
		this.obstacles.add(sprite);
		this.physics.arcade.enable(sprite);
		sprite.body.velocity.x = this.GAME.getObstacleSpeed();
		sprite.checkWorldBounds = true;
		sprite.outOfBoundsKill = true;
		switch (rndNum) {
			case 1: // ->
				sprite.scale.setTo(.5); 
				sprite.body.setCircle(190, 60);
				break;
			case 2: // ○
				sprite.scale.setTo(.6); 
				sprite.body.setCircle(150, 50);
				break;
			case 3: // ＿|￣|○
				sprite.scale.setTo(.9); 
				sprite.body.setCircle(130, 60, -20);
				break;
			case 4: // ＼(^o^)／
				sprite.scale.setTo(.7); 
				sprite.body.setCircle(190, 0, -20);
				break;
		}
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
		controller.changeScore = scoreTextSprite.changeText;
		controller.showGameOver = function () {
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
		sprite.tweetBtn = this.genTweetBtnSprite();
		return sprite;
	},

	genTweetBtnSprite: function () {
		var btnSprite = this.genBtnTpl(250,80,this.tweet,'結果をツイート');
		btnSprite.hide();
		btnSprite.textSprite.hide();
		var self = this;
		btnSprite.allShow = function () {
			btnSprite.show();
			btnSprite.textSprite.show();
		};
		return btnSprite;
	},

	genBtnTpl: function (x,y,func,text) {
		var textStyle = {
			fontSize:'40px',
		};
		var s = this.game.global.SpriteManager;
		var btnSprite = s.genButton(x, y, 'greySheet',func,this);
		btnSprite.setFrames(
			// overFrame, outFrame, downFrame, upFrame
			'grey_button00', 'grey_button00', 'grey_button01', 'grey_button00');
		btnSprite.anchor.setTo(.5);
		btnSprite.scale.setTo(2);
		btnSprite.tint = 0x5fa0dc;
		btnSprite.textSprite = s.genText(x,y,text,textStyle);
		btnSprite.UonInputDown(function () {
			this.game.global.SoundManager.play({key:'MenuClick',volume:1,});
		}, this);
		return btnSprite;
	},

	tweet: function () {
		var addText = '';
		for (var i=0;i<6;i++) {
			var rndNum = this.rnd.integerInRange(1,10);
			if (rndNum == 1) {
				addText += '🐴';
			} else {
				addText += '🐬';		
			}
		}
		var text = 'あなたのスコアは '+this.GAME.score+' です！\n'+addText+'\n『シロラン』';
		var tweetText = encodeURIComponent(text);
		var tweetUrl = location.href;
		var tweetHashtags = 'シロゲーム,シロラン'; // 'A,B,C'
		window.open(
			'https://twitter.com/intent/tweet?text='+tweetText+'&url='+tweetUrl+'&hashtags='+tweetHashtags, 
			'share window', 
			'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
		);
		return false;
	},

	test: function () {
		if (__ENV!='prod') {
			var sl = getQuery('sl'); if (sl) { this.GAME.setStageLevel(this.game.const['STAGE_'+sl]); }
			this.GAME.scoreCountToGoToStage2 = getQuery('sc2') || this.GAME.scoreCountToGoToStage2;
			this.GAME.scoreCountToGoToStage3 = getQuery('sc3') || this.GAME.scoreCountToGoToStage3;
			this.GAME.scoreCountToGoToStage4 = getQuery('sc4') || this.GAME.scoreCountToGoToStage4;
			this.GAME.scoreCountToGoToStage5 = getQuery('sc5') || this.GAME.scoreCountToGoToStage5;
		}
	},
	
	/*
	render: function () {
		this.game.debug.body(this.player);
		for (var key in this.obstacles.children) { this.game.debug.body(this.obstacles.children[key]); }
		this.game.debug.pointer(this.game.input.activePointer);
	},
	*/

};