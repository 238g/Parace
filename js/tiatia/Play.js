BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GM = {};
		this.Player = {};
		this.PlayerWeapon = {};
		this.Enemys = {};
		this.EnemysWeapon = {};
		this.HUD = {};
		this.time.events.removeAll();
	},

	create: function () {
		this.GameManager();
		this.BgContainer();
		this.PhysicsManager();
		this.PlayerContainer();
		this.EnemyContainer();
		this.HUDContainer();
		this.ready();
		this.test();
	},

	GameManager: function () {
		this.GM = {
			isPlaying: false,
			timeCounter: 500,
			respawnEnemyCountdown: 1000,
			EnemyInfo: this.M.getConf('EnemyInfo'),
			DifficultyInfo: this.genDifficultyInfo(),
			EnemyKeys: this.setFirstEnemyKeys(),
			curDifficulty: 'Normal',
			curLevel: 1,
			score: 0,
			MAX_PLAYER_HEALTH: 5,
			// MAX_BULLET_POWER: 5,
			bulletPower: 1,
		};
	},

	setFirstEnemyKeys: function () {
		var keys = [];
		for (var i=1;i<=3;i++) keys.push('Enemy_'+i); // TODO 3->2
		return keys;
	},

	genDifficultyInfo: function () {
		return {
			'Normal': {
				enemyTint: 0xffffff,
				magnification: 1,
				RESPAWN_ENEMY_COUNTDOWN: 1000,
			},
			'Blue': {
				enemyTint: 0x3399ff,
				magnification: 1.2,
				RESPAWN_ENEMY_COUNTDOWN: 1000,
			},
			'Yellow': {
				enemyTint: 0xffff66,
				magnification: 1.5,
				RESPAWN_ENEMY_COUNTDOWN: 800,
			},
			'Red': {
				enemyTint: 0xff3300,
				magnification: 2,
				RESPAWN_ENEMY_COUNTDOWN: 600,
			},
		};
	},

	update: function () {
		if (this.GM.isPlaying) {
			this.respawnEnemyManager();
			this.collisionManager();
		}
	},

	respawnEnemyManager: function () {
		if (this.GM.timeCounter<0) {
			this.GM.timeCounter = this.GM.respawnEnemyCountdown;
			this.respawnEnemy();
		}
		this.GM.timeCounter-=this.time.elapsed;
	},

	respawnEnemy: function () {
		// TODO foreach enemy count get wave info
		var respawnEnemy = this.Enemys.getFirstDead();
		// var respawnEnemy = this.Enemys.getRandom();

		if (respawnEnemy) this.givePowerToEnemy(respawnEnemy);
	},

	givePowerToEnemy: function (respawnEnemy) {
		var EI = this.GM.EnemyInfo[respawnEnemy.key];
		var DI = this.GM.DifficultyInfo[this.GM.curDifficulty];
		var m = DI.magnification;
		var x = this.world.width;
		var y = this.world.randomY;
		var self = this;
		respawnEnemy.reset(x,y);
		respawnEnemy.body.velocity.x = -EI.speed*m;
		respawnEnemy.health = EI.health*m;
		respawnEnemy.score = EI.score*m;
		respawnEnemy.isBoss = EI.isBoss;
		respawnEnemy.worldBoundsKill = function () {
			if (this.x<-100) self.resetEnemyToGroup(this);
		};
		var updateFlag = false;
		if (EI.imgAnim>0) {
			respawnEnemy.animations.add('Moving');
			respawnEnemy.play('Moving', EI.imgAnim, true);
		}
		if (EI.Waver) {
			var waveRange = this.rnd.between(100,300);
			respawnEnemy.update = function () {
				this.y = waveRange*Math.sin(this.x/waveRange)+y;
				this.worldBoundsKill();
			};
			updateFlag = true;
		}
		if (EI.Tracker) this.physics.arcade.moveToObject(respawnEnemy,this.Player,EI.speed);
		if (EI.Shoter) {
			if (EI.circleShot>0) {
				respawnEnemy.update = function () {
					if (this.alive) {
						self.EnemysWeapon.fireFrom.x = this.x;
						self.EnemysWeapon.fireFrom.y = this.y;
						// self.EnemysWeapon.fireAtSprite(self.Player); // TODO circle
					}
					this.worldBoundsKill();
				};
			} else {
				respawnEnemy.update = function () {
					if (this.alive) {
						self.EnemysWeapon.fireFrom.x = this.x;
						self.EnemysWeapon.fireFrom.y = this.y;
						self.EnemysWeapon.fireAtSprite(self.Player);
					}
					this.worldBoundsKill();
				};
			}
			updateFlag = true;
		}
		if (!updateFlag) {
			respawnEnemy.update = function () {
				this.worldBoundsKill();
			};
		}
	},

	collisionManager: function () {
		this.physics.arcade.overlap(this.Player, this.Enemys, this.enemyHitsPlayer, null, this);
		this.physics.arcade.overlap(this.PlayerWeapon.bullets, this.Enemys, this.hitBulletToEnemy, null, this);
		this.physics.arcade.overlap(this.EnemysWeapon.bullets, this.Player, this.hitBulletToPlayer, null, this);
	},

	enemyHitsPlayer: function (player, enemy) {
		player.takeDamage();
		if (enemy.isBoss) return;
		this.resetEnemyToGroup(enemy);
	},

	hitBulletToEnemy: function (bullet, enemy) {
		bullet.kill();
		enemy.damage(this.GM.bulletPower);
		if (!enemy.alive) {
			this.GM.score += enemy.score;
			this.HUD.changeScore(this.GM.score);
			if (enemy.isBoss) this.levelUp();
			this.resetEnemyToGroup(enemy);
		}
	},

	resetEnemyToGroup: function (enemy) {
		enemy.destroy();
		this.genEnemySprite();
	},

	levelUp: function () {
		this.GM.curLevel++;
		this.setDifficultyFromLevel();
		// TODO
	},

	setDifficultyFromLevel: function () {
		switch (this.GM.curLevel) {
			case 1:
			case 2:
			case 3: this.GM.curDifficulty = 'Normal'; break;
			case 4:
			case 5:
			case 6: this.GM.curDifficulty = 'Blue'; break;
			case 7:
			case 8:
			case 9: this.GM.curDifficulty = 'Yellow'; break;
			default: this.GM.curDifficulty = 'Red'; break;
		}
	},

	genEnemySprite: function () {
		var enemy = this.add.sprite(0,0,this.rnd.pick(this.GM.EnemyKeys));
		enemy.kill();
		enemy.anchor.setTo(.5);
		this.Enemys.add(enemy);
	},

	hitBulletToPlayer: function (player, bullet) {
		bullet.kill();
		player.takeDamage();
	},

	BgContainer: function () {
		this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
		this.genSkyBgTileSprite();
		this.genMtBgTileSprite();
	},

	genSkyBgTileSprite: function () {
		var skyTileSprite = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'SkyBg_1');
		skyTileSprite.update = function () {
			this.tilePosition.x -= 1;
		};
	},

	genMtBgTileSprite: function () {
		var mtTileSprite = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'MtBg_1');
		mtTileSprite.update = function () {
			this.tilePosition.x -= 5;
		};
	},

	PhysicsManager: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.enableBody = true;
	},

	PlayerContainer: function () {
		this.Player = this.add.sprite(100,this.world.centerY,'Player');
		this.Player.inputEnabled = true;
		this.Player.input.enableDrag(true);
		this.Player.tripleShot = false;
		this.Player.takingDamage = false;
		this.Player.health = 3;
		this.Player.maxHealth = this.GM.MAX_PLAYER_HEALTH;
		var tween = this.M.T.fadeOutB(this.Player,{alpha:.3,duration:100});
		tween.repeat(5);
		tween.yoyo(true);
		this.M.T.onComplete(tween,function () {
			this.Player.takingDamage = false;
		});
		this.Player.takeDamage = function () {
			if (this.takingDamage) return;
			this.takingDamage = true;
			this.damage(1);
			tween.start();
		};
		var radius = 30;
		this.Player.body.setCircle(radius,this.Player.width/2-radius,this.Player.height/2-radius);
		this.Player.events.onKilled.add(this.onKilledPlayer, this);
		var weapon = this.genPlayerWeapon();
		this.Player.update = function () {
			if (this.alive) {
				if (this.tripleShot) {
					weapon.fireMany([
						{x:0,y:-100},
						{x:0,y:100},
						{x:0,y:0},
					]);
				} else {
					weapon.fire();
				}
			}
		};
		// TODO addChild radius range sprite = white circle
		this.PlayerWeapon = weapon;
	},

	onKilledPlayer: function () {
		this.gameOver();
	},

	genPlayerWeapon: function () {
		var weapon = this.add.weapon(40, 'PlayerBullet');
		weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		// weapon.bulletAngleVariance = 10;
		// weapon.bulletSpeedVariance = 200;
		weapon.bulletSpeed = 1000;
		weapon.fireRate = 200;
		weapon.trackSprite(this.Player, this.Player.width, this.Player.height/2, true);
		weapon.multiFire = true;
		return weapon;
	},

	EnemyContainer: function () {
		this.Enemys = this.add.group();
		this.Enemys.enableBody = true;
		this.Enemys.physicsBodyType = Phaser.Physics.ARCADE;
		// this.Enemys.createMultiple(1,'Enemy_5'); // TODO del
		// this.Enemys.createMultiple(10,'Enemy_1'); // TODO del
		this.Enemys.createMultiple(3,this.GM.EnemyKeys);
		this.Enemys.setAll('anchor.x', .5);
		this.Enemys.setAll('anchor.y', .5);
		this.Enemys.shuffle();
		this.EnemysWeapon = this.genEnemyWeapon();
	},

	genEnemyWeapon: function () {
		var weapon = this.add.weapon(40, 'EnemyBullet');
		weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		weapon.bulletAngleOffset = 90;
		weapon.bulletSpeed = 1000;
		weapon.fireRate = 3000;
		weapon.multiFire = true;
		return weapon;
	},

	HUDContainer: function () {
		this.HUD = {
			self: this,
			showGameOver: null,
			changeScore: null,
		};
		// TODO level/boss text -> = alice round
		this.genScoreTextSprite();
		this.genGameOverTextSprite();
	},

	genScoreTextSprite: function () {
		var baseText = 'スコア: ';
		var textStyle = this.BaseTextStyle();
		textStyle.fontSize = 60;
		var textSprite = this.M.S.genText(150,600,baseText+0,textStyle);
		this.HUD.changeScore = function (val) {
			textSprite.changeText(baseText+val);
		};
	},

	genGameOverTextSprite: function () {
		var baseText = '終了！！';
		var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,this.BaseTextStyle());
		textSprite.setAnchor(.5);
		textSprite.setScale(0,0);
		this.HUD.showGameOver = function () {
			textSprite.addTween('popUpB',{scale:{x:2,y:2}});
			textSprite.startTween('popUpB');
		};
	},

	ready: function () {
		this.stopBGM();
		this.playBGM();

		this.start(); // TODO
	},

	playBGM: function () {
		return; // TODO
		var s = this.M.SE;
		if (s.isPlaying('PlayBGM')) return;
		s.play('PlayBGM',{isBGM:true,loop:true,volume:1});
	},

	stopBGM: function () {
		return; // TODO
		var s = this.M.SE;
		if (s.isPlaying('PlayBGM')) return;
		s.stop('currentBGM');
		s.stop('TitleBGM');
	},

	start: function () {
		this.GM.isPlaying = true;
	},

	gameOver: function () {
		this.GM.isPlaying = false;
		this.HUD.showGameOver();
		// this.M.SE.play('Gong'); // TODO
		this.time.events.add(1500, function () {
			this.ResultContainer();
			// this.M.SE.play('Gong'); // TODO
		}, this);
	},

	ResultContainer: function () {
		// TODO lay
		this.M.S.genDialog('Dialog',{
			onComplete:this.openedResult,
		}).tweenShow();
	},

	// TODO lay
	openedResult: function () {
		var y = this.world.centerY;
		this.genResultTextSprite(y-500,'結果発表');
		this.genResultTextSprite(y-350,'モード: ');
		this.genResultTextSprite(y-220,'ダーツ: ');
		this.genResultTextSprite(y-90,'ターン: ');
		this.genResultTextSprite(y+40,'結果: ');
		this.genResultLabel(y+200,'もう一度プレイ',function () {
			this.M.NextScene('Play');
		},600);
		this.genResultLabel(y+350,'結果をツイート',this.tweet,800);
		this.genResultLabel(y+500,'タイトルにもどる',function () {
			this.M.NextScene('Title');
		},1000);
	},

	genResultTextSprite: function (y,text) {
		var textSprite = this.M.S.genText(this.world.centerX,y,text,this.BaseTextStyle(80));
		textSprite.setScale(0,0);
		textSprite.addTween('popUpB',{duration:800});
		textSprite.startTween('popUpB');
	},

	genResultLabel: function (y,text,func,delay) {
		var label = this.M.S.BasicGrayLabel(this.world.centerX,y,func,text,this.BaseTextStyle(50),{tint:this.M.getConst('MAIN_TINT')});
		label.setScale(0,0);
		label.addTween('popUpB',{duration:800,delay:delay});
		label.startTween('popUpB');
	},

	tweet: function () {
		var emoji = '';
		for (var i=0;i<6;i++) {
			var rndNum = this.rnd.integerInRange(1,7);
			switch (rndNum) {
				case 1: emoji += '⏰'; break;
				case 2: emoji += '🃏'; break;
				case 3: emoji += '♠'; break;
				case 4: emoji += '♣'; break;
				case 5: emoji += '♦'; break;
				case 6: emoji += '♥'; break;
				case 7: emoji += '🐰'; break;
			}
		}
		var text = '『'+this.M.getConst('GAME_TITLE')+'』で遊んだよ！\n'
					+emoji+'\n'
					+emoji+'\n';
		var hashtags = ',';
		this.M.H.tweet(text,hashtags,location.href);
	},

	BaseTextStyle: function (fontSize) {
		return {
			fontSize: fontSize||50,
			fill: this.M.getConst('MAIN_TEXT_COLOR'),
			stroke: this.M.getConst('WHITE_COLOR'),
			strokeThickness: 15,
			multipleStroke: this.M.getConst('MAIN_TEXT_COLOR'),
			multipleStrokeThickness: 10,
		};
	},

	render: function () {
		this.game.debug.body(this.Player);
		for (var key in this.Enemys.children) this.game.debug.body(this.Enemys.children[key]);
		this.game.debug.pointer(this.game.input.activePointer);
	},

	test: function () {
		if (__ENV!='prod') {
			this.game.debug.font='40px Courier';
			this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.D).onDown.add(this.gameOver, this);
			if(this.M.H.getQuery('curDifficulty')) this.GM.curDifficulty = this.M.H.getQuery('curDifficulty');
			this.stage.backgroundColor = '#333333';
		}
	},
};
