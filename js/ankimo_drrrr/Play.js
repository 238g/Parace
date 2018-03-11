BasicGame.Play = function () {};

BasicGame.Play.prototype = {
	init: function () {
		this.player = null;
		this.walls = null;
		this.enemys = null;
		this.exp = null;
		this.HUD = {};
		this.currentSound = null;
		this.score = 0;
		this.isPlaying = false;
		this.enemyMaxCount = this.game.const.ENEMY_MAX_COUNT;
		this.finishDuration = 1000;
	},

	create: function () {
		this.ready();
	},

	ready: function () {
		this.player = this.playerContainer();
		this.walls = this.wallContainer();
		this.enemys = this.enemyContainer();
		this.exp = this.genParticles();
		this.HUD = this.genHUDContainer();

		this.game.global.SoundManager.stop('currentBGM');
		this.currentSound = 'Male_3';
		this.countDown(this.currentSound);
	},

	countDown: function (key) {
		var s = this.game.global.SoundManager;
		if (key == 'HappyArcadeTune') {
			s.stop('currentBGM');
			s.play({key:key,isBGM:true,loop:true});
			s.setVolume(key, .7);
			this.HUD.countDown('hide');
			this.play();
		} else {
			s.play(key);
			s.onComplete(key, function () {
				var text = '2';
				switch (this.currentSound) {
					case 'Male_3': this.currentSound = 'Male_2'; break;
					case 'Male_2': this.currentSound = 'Male_1'; text = '1'; break;
					case 'Male_1': this.currentSound = 'Go'; text = 'Go!!'; break;
					case 'Go': this.currentSound = 'HappyArcadeTune'; break;
					default: return;
				}
				this.countDown(this.currentSound);
				this.HUD.countDown(text);
			}, this);
		}
	},

	play: function () {
		this.isPlaying = true;
		this.player.active();
		this.inputController();
		this.physicsController();
	},

	update: function () {
		if (this.isPlaying) {
			this.collisionWall();
			this.collisionEnemy();

			this.score += Math.floor(this.time.elapsed/10);
			this.HUD.changeScore('スコア: ' + this.score);

			// side warp
			if (this.player.x < 0) {
				this.player.x = this.world.width;
			} else if (this.player.x > this.world.width) {
				this.player.x = 0;
			}
		}
	},

	collisionWall: function () {
		this.physics.arcade.collide(this.player, this.walls, this.gameOver, null, this);
	},

	collisionEnemy: function () {
		this.physics.arcade.overlap(this.player, this.enemys, this.gameOver, null, this);
	},

	inputController: function () {
		if (this.isPlaying) {
			this.game.input.onDown.add(function (pointer/*, event*/) {
				this.player.body.velocity.x = (this.player.x-pointer.x)*2;
				this.player.body.velocity.y = (this.player.y-pointer.y)*2;
				this.player.body.angularVelocity = 200;
				this.game.global.SoundManager.play('Jump');
			}, this);
		} else {
			this.game.input.onDown.removeAll();
			this.game.input.onDown.add(function (pointer) {
				if (!pointer.targetObject) {
					this.game.global.nextSceen = 'Title';
					this.state.start(this.game.global.nextSceen);
				}
			}, this);
		}
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
		sprite.body.enable = true;
		sprite.body.setCircle(150);
		sprite.active = function () {
			sprite.visible = true;
			sprite.body.gravity.y = 600;
		};
		return sprite;
	},

	wallContainer: function () {
		var walls = this.add.group();
		var spriteWidth = 137;
		var animalsList = this.game.conf.animalsList;
		for (var i=0;i<7;i++) {
			var frame1 = animalsList[this.rnd.integerInRange(0, animalsList.length)];
			var floor = this.add.sprite(i*spriteWidth, 0, 'squareAnimals', frame1);
			this.physics.arcade.enable(floor);
			floor.body.immovable = true;
			walls.add(floor);
			var frame2 = animalsList[this.rnd.integerInRange(0, animalsList.length)];
			var ceiling = this.add.sprite(i*spriteWidth, this.world.height, 'squareAnimals', frame2);
			ceiling.anchor.setTo(0,1);
			this.physics.arcade.enable(ceiling);
			ceiling.body.immovable = true;
			walls.add(ceiling);
		}
		return walls;
	},

	enemyContainer: function () {
		var enemys = this.add.group();
		for (var i=1;i<=this.enemyMaxCount;i++) {
			var duration = i*i*2*1000+2500;
			setTimeout(function () {
				var enemy = this.genEnemy();
				enemys.add(enemy);
			}.bind(this), duration);
		}
		return enemys;
	},

	genEnemy: function () {
		var x = this.rnd.integerInRange(0, this.world.width);
		var y = this.world.height;
		var animalsList = this.game.conf.animalsList;
		var frame = animalsList[this.rnd.integerInRange(0, animalsList.length-1)];
		var sprite = this.add.sprite(x,y,'roundAnimals',frame);
		sprite.anchor.setTo(.5);
		sprite.scale.setTo(.5);
		this.physics.arcade.enable(sprite);
		sprite.body.setCircle(70);
		sprite.body.angularVelocity = this.rnd.integerInRange(-200, 200);
		var duration = this.rnd.integerInRange(4000, 8000);
		var toPos = 1600;
		sprite.body.moveTo(duration, toPos, 270);
		sprite.body.onMoveComplete.add(function () {
			sprite.x = this.rnd.integerInRange(0, this.world.width);
			sprite.y = y;
			sprite.frameName = animalsList[this.rnd.integerInRange(0, animalsList.length-1)];
			var rndNum = this.rnd.integerInRange(0, 100);
			if (95 < rndNum) {
				var scale = 3;
			} else if (rndNum < 20) {
				var scale = 1;
			} else {
				var scale = .001 * this.rnd.integerInRange(400, 600);
			}
			sprite.scale.setTo(scale);
			sprite.body.angularVelocity = this.rnd.integerInRange(-200, 200);
			var newDuration = this.rnd.integerInRange(4000, 8000);
			sprite.body.moveTo(newDuration, toPos, 270);
		}, this);
		return sprite;
	},

	genHUDContainer: function () {
		var HUDController = {}; 
		var textStyle = {
			fill: '#000000',
			stroke:'#FFFFFF',
			strokeThickness: 20,
			multipleStroke:'#000000',
			multipleStrokeThickness: 20,
		};
		var scoreTextSprite = this.genScoreTextSprite(textStyle);
		var gameOverTextSprite = this.genGameOverTextSprite(textStyle);
		var backToTopTextSprite = this.genBackToTopTextSprite(textStyle);
		var countDownTextSprite = this.genCountDownTextSprite(textStyle);
		HUDController.countDown = function (text) {
			if (text == 'hide') {
				countDownTextSprite.hide();
				return;
			}
			countDownTextSprite.changeText(text);
		};
		HUDController.changeScore = scoreTextSprite.changeText;
		HUDController.resultView = function () {
			scoreTextSprite.scale.setTo(0);
			scoreTextSprite.multipleTextSprite.scale.setTo(0);
			scoreTextSprite.move(this.world.centerX, this.world.centerY);
			scoreTextSprite.setTextStyle({fontSize: '100px'});
			scoreTextSprite.tween.start();
			scoreTextSprite.tween2.start();
			gameOverTextSprite.show();
			gameOverTextSprite.tween.start();
			gameOverTextSprite.tween2.start();
			setTimeout(function () {
				backToTopTextSprite.show();
				backToTopTextSprite.tween.start();
				backToTopTextSprite.tween2.start();
			}, this.finishDuration);
			this.genTweetBtnSprite();
		}.bind(this);
		return HUDController;
	},

	genCountDownTextSprite: function (textStyle) {
		textStyle.fontSize = '150px';
		textStyle.fill = '#FF0000';
		var textSprite = this.game.global.SpriteManager.genText(
			this.world.centerX, this.world.centerY, '3', textStyle
		);
		return textSprite;
	},

	genScoreTextSprite: function (textStyle) {
		var textSprite = this.game.global.SpriteManager.genText(
			this.world.centerX, 50, 'スコア: ' + this.score, textStyle
		);
		textSprite.tween = this.add.tween(textSprite.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out);
		textSprite.tween2 = this.add.tween(textSprite.multipleTextSprite.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out);
		return textSprite;
	},

	genGameOverTextSprite: function (textStyle) {
		textStyle.fontSize = '100px';
		var textSprite = this.game.global.SpriteManager.genText(
			this.world.centerX, this.world.centerY-120, 'ゲームオーバー', textStyle
		);
		textSprite.hide();
		textSprite.scale.setTo(0);
		textSprite.multipleTextSprite.scale.setTo(0);
		textSprite.tween = this.add.tween(textSprite.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out);
		textSprite.tween2 = this.add.tween(textSprite.multipleTextSprite.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out);
		return textSprite;
	},

	genBackToTopTextSprite: function (textStyle) {
		textStyle.fontSize = '100px';
		var textSprite = this.game.global.SpriteManager.genText(
			this.world.centerX, this.world.centerY+120, 'もどる', textStyle
		);
		textSprite.hide();
		textSprite.scale.setTo(0);
		textSprite.multipleTextSprite.scale.setTo(0);
		textSprite.tween = this.add.tween(textSprite.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out);
		textSprite.tween2 = this.add.tween(textSprite.multipleTextSprite.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Elastic.Out);
		return textSprite;
	},

	genParticles: function () {
		var particle = this.add.emitter(0, 0, 20);
		particle.makeParticles('player');
		particle.setYSpeed(-150, 300);
		particle.setXSpeed(-150, 300);
		particle.gravity = 0;
		particle.effect = function (pos) {
			particle.x = pos.x;
			particle.y = pos.y;
			particle.start(true, 800, null, 20);
		};
		return particle;
	},

	gameOver: function (/*player, collisionGroup*/) {
		this.isPlaying = false;
		this.game.global.SoundManager.play('GameOver');
		this.player.kill();
		this.exp.effect(this.player);
		setTimeout(function () {
			this.inputController();
		}.bind(this), this.finishDuration);
		this.HUD.resultView();
	},

	genTweetBtnSprite: function () {
		var s = this.game.global.SpriteManager;
		var x = this.world.centerX;
		var y = this.world.centerY+320;
		var btnSprite = s.genButton(x,y,'greySheet',this.tweet,this);
		btnSprite.setFrames(
			// overFrame, outFrame, downFrame, upFrame
			'grey_button00', 'grey_button00', 'grey_button01', 'grey_button00');
		btnSprite.anchor.setTo(.5);
		btnSprite.scale.setTo(2);
		btnSprite.tint = 0xe68946;
		btnSprite.textSprite = s.genText(x,y,'結果をツイート',{ fontSize:'40px', });
		return btnSprite;
	},

	tweet: function () {
		var text = 'あなたのスコアは '+this.score+' です！\n🐻🐻🐻🐻🐻🐻\n『レッツ・あん肝！』';
		var tweetText = encodeURIComponent(text);
		var tweetUrl = location.href;
		var tweetHashtags = 'そらゲーム,あん肝ゲーム'; // 'A,B,C'
		window.open(
			'https://twitter.com/intent/tweet?text='+tweetText+'&url='+tweetUrl+'&hashtags='+tweetHashtags, 
			'share window', 
			'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
		);
		return false;
	},

	/*	
	render: function () {
		for (var key in this.enemys.children) { this.game.debug.body(this.enemys.children[key]); }
		for (var key in this.walls.children) { this.game.debug.body(this.walls.children[key]); }
		this.game.debug.body(this.player);
		this.game.debug.pointer(this.game.input.activePointer);
	},
	*/

};
