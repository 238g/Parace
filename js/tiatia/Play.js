BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GM = {};
		this.BG = {};
		this.Player = {};
		this.PlayerWeapon = {};
		this.Enemys = {};
		this.EnemysWeapon = {};
		this.Items = {};
		this.Effect = {};
		this.HUD = {};
		this.time.events.removeAll();
	},

	create: function () {
		this.GameManager();
		this.BgContainer();
		this.PhysicsManager();
		this.PlayerContainer();
		this.EnemyContainer();
		this.ItemContainer();
		this.EffectContainer();
		this.HUDContainer();
		this.ready();
		this.test();
	},

	GameManager: function () {
		this.GM = {
			isPlaying: false,
			timer: 1000,
			respawnEnemyTimer: 500,
			respawnEnemyCountdown: 1000,
			EnemyInfo: this.M.getConf('EnemyInfo'),
			EnemyInfoLength: this.M.getGlobal('EnemyInfoLength'),
			DifficultyInfo: this.genDifficultyInfo(),
			EnemyKeys: this.setFirstEnemyKeys(),
			EnemyKeyTimeCounter: 0,
			ADD_ENEMY_KEY_TIMING: 20,
			fulfillEnemyKeys: false,
			curDifficulty: 'Normal',
			curLevel: 1,
			score: 0,
			MAX_PLAYER_HEALTH: 5,
			// MAX_BULLET_POWER: 5,
			bulletPower: 1,
			existingBoss: false,
			bossTimeCounter: 0,
			ADD_BOSS_TIMING: 30,
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
				respawnEnemyCountdown: 1000,
				enemyBulletSpeed: 500,
				enemyFireRate: 4000,
			},
			'Yellow': {
				enemyTint: 0xffff66,
				magnification: 1.2,
				respawnEnemyCountdown: 1000,
				enemyBulletSpeed: 700,
				enemyFireRate: 3500,
			},
			'Blue': {
				enemyTint: 0x3399ff,
				magnification: 1.5,
				respawnEnemyCountdown: 800,
				enemyBulletSpeed: 800,
				enemyFireRate: 3000,
			},
			'Red': {
				enemyTint: 0xff3300,
				magnification: 2,
				respawnEnemyCountdown: 600,
				enemyBulletSpeed: 1000,
				enemyFireRate: 2000,
			},
			'Purple': {
				enemyTint: 0x9900FF,
				magnification: 3,
				respawnEnemyCountdown: 500,
				enemyBulletSpeed: 1500,
				enemyFireRate: 1000,
			},
		};
	},

	update: function () {
		if (this.GM.isPlaying) {
			this.respawnEnemyManager();
			this.timeManager();
			this.collisionManager();
		}
	},

	respawnEnemyManager: function () {
		if (this.GM.respawnEnemyTimer<0) {
			this.GM.respawnEnemyTimer = this.GM.respawnEnemyCountdown;
			this.respawnEnemy();
		}
		this.GM.respawnEnemyTimer-=this.time.elapsed;
	},

	timeManager: function () {
		if (this.GM.timer<0) {
			this.GM.timer = 1000;
			this.addNewEnemyKey();
			this.checkSpawnBoss();
		}
		this.GM.timer-=this.time.elapsed;
	},

	respawnEnemy: function () {
		var respawnEnemy = this.Enemys.getFirstDead();
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
		respawnEnemy.tint = DI.enemyTint;
		respawnEnemy.updateList = {};
		if (EI.imgAnim>0) {
			respawnEnemy.animations.add('Moving');
			respawnEnemy.play('Moving', EI.imgAnim, true);
		}
		if (EI.Waver) {
			var waveRange = this.rnd.between(100,300);
			respawnEnemy.updateList.Waver = function () {
				respawnEnemy.y = waveRange*Math.sin(respawnEnemy.x/waveRange)+y;
			};
		}
		if (EI.Tracker) this.physics.arcade.moveToObject(respawnEnemy,this.Player,EI.speed);
		if (EI.Shoter) {
			respawnEnemy.body.maxVelocity.x = 300;
			if (EI.circleShot) {
				respawnEnemy.updateList.Shoter = function () {
					if (respawnEnemy.alive) {
						var maxDis = self.world.width;
						var ex = respawnEnemy.x;
						var ey = respawnEnemy.y;
						self.EnemysWeapon.fireFrom.x = ex;
						self.EnemysWeapon.fireFrom.y = ey;
						self.EnemysWeapon.fireAtXY(ex-maxDis,ey); // West
						self.EnemysWeapon.fireAtXY(ex+maxDis,ey); // East
						self.EnemysWeapon.fireAtXY(ex,ey-maxDis); // North
						self.EnemysWeapon.fireAtXY(ex,ey+maxDis); // South
						self.EnemysWeapon.fireAtXY(ex-maxDis,ey-maxDis); // NorthWest
						self.EnemysWeapon.fireAtXY(ex+maxDis,ey-maxDis); // NorthEast
						self.EnemysWeapon.fireAtXY(ex-maxDis,ey+maxDis); // SouthWest
						self.EnemysWeapon.fireAtXY(ex+maxDis,ey+maxDis); // SouthEast
					}
				};
			} else {
				respawnEnemy.updateList.Shoter = function () {
					if (respawnEnemy.alive) {
						self.EnemysWeapon.fireFrom.x = respawnEnemy.x;
						self.EnemysWeapon.fireFrom.y = respawnEnemy.y;
						self.EnemysWeapon.fireAtSprite(self.Player);
					}
				};
			}
		}
		respawnEnemy.updateList.worldBoundsKill = function () {
			if (respawnEnemy.x<-100) self.resetEnemyToGroup(respawnEnemy);
		};
		respawnEnemy.update = function () {
			for (var key in this.updateList) {
				this.updateList[key]();
			}
		};
	},

	addNewEnemyKey: function () {
		if (!this.GM.fulfillEnemyKeys) {
			if (this.GM.EnemyKeys.length < this.GM.EnemyInfoLength-1) {
				if (!this.GM.existingBoss) {
					this.GM.EnemyKeyTimeCounter++;
					if (this.GM.EnemyKeyTimeCounter >= this.GM.ADD_ENEMY_KEY_TIMING) {
						this.GM.EnemyKeyTimeCounter = 0;
						this.GM.EnemyKeys.push('Enemy_'+(this.GM.EnemyKeys.length+1));
					}
				}
			} else {
				this.GM.fulfillEnemyKeys = true;
			}
		}
	},

	checkSpawnBoss: function () {
		if (!this.GM.existingBoss) {
			this.GM.bossTimeCounter++;
			if (this.GM.bossTimeCounter >= this.GM.ADD_BOSS_TIMING) {
				this.GM.existingBoss = true;
				this.GM.bossTimeCounter = 0;
				this.spawnBoss();
			}
		}
	},

	spawnBoss: function () {
		var boss = this.add.sprite(this.world.width+300,this.world.centerY,'Boss');
		boss.kill();
		boss.visible = true;
		boss.anchor.setTo(.5);
		var EI = this.GM.EnemyInfo[boss.key];
		var DI = this.GM.DifficultyInfo[this.GM.curDifficulty];
		var m = DI.magnification;
		var tween = this.M.T.moveB(boss,{xy:{x:'-500'},duration:4000});
		this.M.T.onComplete(tween,function () {
			this.HUD.hideWarningBoss();
			boss.reset(boss.x,boss.y);
			boss.health = 3; // TODO del
			// boss.health = EI.health*m;
			var bottomMargin = this.world.height-100;
			var speed = EI.speed;
			var self = this;
			boss.update = function () {
				if (boss.alive) {
					boss.y += speed;
					if (boss.y<100||boss.y>bottomMargin) speed *= -1;
					var maxDis = self.world.width;
					var ex = boss.x;
					var ey = boss.y;
					self.EnemysWeapon.fireFrom.x = ex;
					self.EnemysWeapon.fireFrom.y = ey;
					self.EnemysWeapon.fireAtXY(ex-maxDis,ey); // West
					self.EnemysWeapon.fireAtXY(ex-maxDis,ey-maxDis); // NorthWest
					self.EnemysWeapon.fireAtXY(ex-maxDis,ey-maxDis/2); // NorthWestWest
					self.EnemysWeapon.fireAtXY(ex-maxDis,ey+maxDis); // SouthWest
					self.EnemysWeapon.fireAtXY(ex-maxDis,ey+maxDis/2); // SouthWestWest
					self.EnemysWeapon.fireAtSprite(self.Player);
				}
			};
		});
		tween.start();
		boss.score = EI.score*m;
		boss.isBoss = EI.isBoss;
		boss.tint = DI.enemyTint;
		this.Enemys.add(boss);
		this.BG.showWarning();
		this.HUD.showWarningBoss();
		// TODO child HP gage
	},

	collisionManager: function () {
		this.physics.arcade.overlap(this.Player, this.Enemys, this.enemyHitsPlayer, null, this);
		this.physics.arcade.overlap(this.Player, this.Items, this.getItem);
		this.physics.arcade.overlap(this.PlayerWeapon.bullets, this.Enemys, this.hitBulletToEnemy, null, this);
		this.physics.arcade.overlap(this.EnemysWeapon.bullets, this.Player, this.hitBulletToPlayer, null, this);
	},

	enemyHitsPlayer: function (player, enemy) {
		player.takeDamage();
		if (enemy.isBoss) return;
		this.resetEnemyToGroup(enemy);
	},

	getItem: function (player, item) {
		// TODO
	},

	hitBulletToEnemy: function (bullet, enemy) {
		bullet.kill();
		enemy.damage(this.GM.bulletPower);
		this.Effect.fireDamageEffect(bullet.right,bullet.y);
		if (!enemy.alive) {
			this.GM.score += enemy.score;
			this.HUD.changeScore(this.GM.score);
			this.Effect.fireKillEffect(enemy);
			if (enemy.isBoss) this.onKilledBoss();
			this.resetEnemyToGroup(enemy);
		}
	},

	resetEnemyToGroup: function (enemy) {
		enemy.destroy();
		this.genEnemySprite();
	},

	onKilledBoss: function () {
		this.GM.existingBoss = false;
		this.levelUp();
	},

	levelUp: function () {
		this.GM.curLevel++;
		this.setDifficultyFromLevel();
		this.HUD.showLevelUp();
		this.difficultySetting();
	},

	difficultySetting: function () {
		var DI = this.GM.DifficultyInfo[this.GM.curDifficulty];
		this.GM.respawnEnemyCountdown = DI.respawnEnemyCountdown;
		this.EnemysWeapon.bulletSpeed = DI.enemyBulletSpeed;
		this.EnemysWeapon.fireRate = DI.enemyFireRate;
	},

	setDifficultyFromLevel: function () {
		switch (this.GM.curLevel) {
			case 1:
			case 2:
			case 3:
			case 4: this.GM.curDifficulty = 'Normal'; break;
			case 5:
			case 6:
			case 7: this.GM.curDifficulty = 'Yellow'; break;
			case 8:
			case 9:
			case 10: this.GM.curDifficulty = 'Blue'; break;
			case 20: this.GM.curDifficulty = 'Purple'; break;
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
		this.BG = {
			curMtBg: null,
			showWarning: null,
		};
		this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
		this.genSkyBgTileSprite();
		this.genMtBgTileSprite();
		this.genWarningSprite();
	},

	genSkyBgTileSprite: function () {
		var skyTileSprite = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'SkyBg_1');
		skyTileSprite.update = function () {
			this.tilePosition.x -= 1;
		};
	},

	genMtBgTileSprite: function () {
		this.BG.curMtBg = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'MtBg_1');
		this.BG.curMtBg.update = function () {
			this.tilePosition.x -= 5;
		};
		// TODO changebg...
	},

	genWarningSprite: function () {
		var sprite = this.M.S.genBmpSprite(0,0,this.world.width,this.world.height,'#ff0000');
		sprite.alpha = 0;
		var tween = this.M.T.fadeOutB(sprite,{alpha:.2,duration:500});
		tween.repeat(3);
		tween.yoyo(true);
		this.BG.showWarning = function () {
			tween.start();
		};
	},

	PhysicsManager: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.enableBody = true;
	},

	PlayerContainer: function () {
		this.Player = this.add.sprite(100,this.world.centerY,'Player');
		this.Player.anchor.setTo(.5);
		this.Player.inputEnabled = true;
		this.Player.input.enableDrag(true);
		// TODO doubleShot?
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
		var self = this;
		this.Player.takeDamage = function () {
			if (this.takingDamage) return;
			this.takingDamage = true;
			this.damage(1);
			tween.start();
			self.GM.bulletPower = 1;
			self.camera.shake(.05,200,true,Phaser.Camera.SHAKE_HORIZONTAL);
		};
		var radius = 30;
		this.Player.body.setCircle(radius,this.Player.width/2-radius,this.Player.height/2-radius);
		this.Player.events.onKilled.add(this.onKilledPlayer, this);
		var weapon = this.genPlayerWeapon();
		this.Player.update = function () {
			if (this.alive) {
				if (this.tripleShot) {
					weapon.fireMany([
						{x:0,y:-50},
						{x:0,y:50},
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
		weapon.trackSprite(this.Player, this.Player.centerX, 0, true);
		weapon.multiFire = true;
		return weapon;
	},

	EnemyContainer: function () {
		this.Enemys = this.add.group();
		this.Enemys.enableBody = true;
		this.Enemys.physicsBodyType = Phaser.Physics.ARCADE;
		// this.Enemys.createMultiple(1,'Enemy_7'); // TODO del
		this.Enemys.createMultiple(5,'Enemy_7'); // TODO del
		// this.Enemys.createMultiple(3,this.GM.EnemyKeys);
		this.Enemys.setAll('anchor.x', .5);
		this.Enemys.setAll('anchor.y', .5);
		this.Enemys.shuffle();
		this.EnemysWeapon = this.genEnemyWeapon();
	},

	genEnemyWeapon: function () {
		var weapon = this.add.weapon(40, 'EnemyBullet');
		weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		weapon.bulletAngleOffset = 90;
		weapon.bulletSpeed = 500;
		// weapon.bulletSpeed = 1000;
		weapon.fireRate = 4000;
		// weapon.fireRate = 3000;
		weapon.multiFire = true;
		return weapon;
	},

	ItemContainer: function () {
		this.Itmes = this.add.group();
		this.Itmes.enableBody = true;
		this.Itmes.physicsBodyType = Phaser.Physics.ARCADE;
		// this.Itmes.createMultiple(1,[]);
		// this.Itmes.setAll('anchor.x', .5);
		// this.Itmes.setAll('anchor.y', .5);
		// this.Itmes.shuffle();
		// TODO expand item bounds
	},

	EffectContainer: function () {
		this.Effect = {
			fireDamageEff: null,
			fireKillEffect: null,
		};
		this.genDamageEffect();
		this.genKillEffect();
	},

	genDamageEffect: function () {
		var particle = this.add.emitter(0, 0, 100);
		particle.makeParticles('DamageEffect');
		particle.setYSpeed(-300, 300);
		particle.setXSpeed(-300, 300);
		particle.gravity = 0;
		this.Effect.fireDamageEffect = function (x,y) {
			particle.x = x;
			particle.y = y;
			particle.explode(300,3);
		};
	},

	genKillEffect: function () {
		var particle = this.add.emitter(0, 0, 100);
		particle.makeParticles('KillEffect');
		particle.setYSpeed(-300, 300);
		particle.setXSpeed(-300, 300);
		particle.setRotation(0, 0);
		this.Effect.fireKillEffect = function (target) {
			particle.x = target.x;
			particle.y = target.y;
			if (target.isBoss) {
				particle.gravity.y = -1000;
				particle.explode(800,30);
			} else {
				particle.gravity.y = -2000;
				particle.explode(500,5);
			}
		};

	},

	HUDContainer: function () {
		this.HUD = {
			self: this,
			showGameOver: null,
			changeScore: null,
			showWarningBoss: null,
			hideWarningBoss: null,
			showLevelUp: null,
		};
		this.genScoreTextSprite();
		this.genGameOverTextSprite();
		this.genLevelUpTextSprite();
		this.genWarningBossTextSprite();
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

	genLevelUpTextSprite: function () {
		var textStyle = this.BaseTextStyle();
		textStyle.fontSize = 150;
		var baseText = 'LEVEL ';
		var x = this.world.width+500;
		var y = this.world.centerY-200;
		var textSprite = this.M.S.genText(x,y,baseText+this.GM.curLevel,textStyle);
		textSprite.setAnchor(.5);
		textSprite.hide();
		textSprite.addTween('moveA',{xy:{x:this.world.centerX},tweenName:'move1',duration:1200});
		textSprite.addTween('moveA',{xy:{x:-500},tweenName:'move2',delay:1000,duration:1200});
		textSprite.chainTween('move1','move2');
		this.M.T.onComplete(textSprite.multipleTextTween.move2, function () {
			textSprite.move(x,y);
		});
		this.HUD.showLevelUp = function () {
			textSprite.changeText(baseText+this.self.GM.curLevel);
			textSprite.show();
			textSprite.startTween('move1');
		};
	},

	genWarningBossTextSprite: function () {
		var textStyle = this.BaseTextStyle();
		textStyle.fontSize = 200;
		var baseText = 'BOSS';
		var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,textStyle);
		textSprite.setAnchor(.5);
		textSprite.hide();
		this.HUD.showWarningBoss = textSprite.show;
		this.HUD.hideWarningBoss = textSprite.hide;
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
		// for (var key in this.Enemys.children) this.game.debug.body(this.Enemys.children[key]);
		this.game.debug.pointer(this.game.input.activePointer);
	},

	test: function () {
		if (__ENV!='prod') {
			this.game.debug.font='40px Courier';
			this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.D).onDown.add(this.gameOver, this);
			this.input.keyboard.addKey(Phaser.Keyboard.L).onDown.add(this.levelUp, this);
			this.input.keyboard.addKey(Phaser.Keyboard.B).onDown.add(function () {this.GM.bossTimeCounter=29;}, this);
			if(this.M.H.getQuery('curDifficulty')) this.GM.curDifficulty = this.M.H.getQuery('curDifficulty');
			this.stage.backgroundColor = '#333333';
		}
	},
};
