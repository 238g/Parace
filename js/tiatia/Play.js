BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GM = {};
		this.BG = {};
		this.Player = {};
		this.PlayerWeapon = {};
		this.Enemys = {};
		this.EnemysWeapon = {};
		this.SpecialEnemysWeapon = {};
		this.Boss = {};
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
		this.PlayerHealthHeartsContainer();
		this.PlayerPowersContainer();
		this.HUDContainer();
		this.ready();
		this.test();
	},

	GameManager: function () {
		this.GM = {
			isPlaying: false,
			timer: 1000,
			respawnEnemyTimer: 500,
			respawnEnemyCountdown: 1500,
			EnemyInfo: this.M.getConf('EnemyInfo'),
			EnemyInfoLength: this.M.getGlobal('EnemyInfoLength'),
			DifficultyInfo: this.genDifficultyInfo(),
			EnemyKeys: ['Enemy_1','Enemy_2'],
			EnemyKeyTimeCounter: 0,
			ADD_ENEMY_KEY_TIMING: 16,
			fulfillEnemyKeys: false,
			curDifficulty: 'Normal',
			curLevel: 1,
			score: 0,
			existingBoss: false,
			bossTimeCounter: 0,
			ADD_BOSS_TIMING: 26,
			itemTimeCounter: 0,
			ADD_ITEM_TIMING: 19,
			ItemKeys: ['Ohepan','Oheneko'],
			playerSpecialWeaponTimeCounter: 0,
			clearLevel: 14,
			clearFlag: false,
		};
	},

	genDifficultyInfo: function () {
		return {
			'Normal': {
				enemyTint: 0xffffff,
				magnification: 1,
				respawnEnemyCountdown: 1200,
				enemyBulletSpeed: 500,
				enemyFireRate: 4000,
				changeBgNum: 1,
				bgm: 'Stage_1',
			},
			'Yellow': {
				enemyTint: 0xffff66,
				magnification: 1.2,
				respawnEnemyCountdown: 1000,
				enemyBulletSpeed: 600,
				enemyFireRate: 3500,
				changeBgNum: 2,
				bgm: 'Stage_2',
			},
			'Blue': {
				enemyTint: 0x00ffff,
				magnification: 1.5,
				respawnEnemyCountdown: 800,
				enemyBulletSpeed: 800,
				enemyFireRate: 3000,
				changeBgNum: 3,
				bgm: 'Stage_3',
			},
			'Red': {
				enemyTint: 0xff3300,
				magnification: 2,
				respawnEnemyCountdown: 600,
				enemyBulletSpeed: 1000,
				enemyFireRate: 2000,
				changeBgNum: 4,
				bgm: 'Stage_4',
			},
			'Purple': {
				enemyTint: 0x9900FF,
				magnification: 3,
				respawnEnemyCountdown: 500,
				enemyBulletSpeed: 1500,
				enemyFireRate: 1000,
				changeBgNum: 5,
				bgm: 'TitleBGM',
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
			this.checkAddItem();
			this.checkPlayerSpecialWeapon();
		}
		this.GM.timer-=this.time.elapsed;
	},

	respawnEnemy: function () {
		var respawnEnemy = this.Enemys.getFirstDead();
		if (respawnEnemy) this.giveAbilitiesToEnemy(respawnEnemy);
	},

	giveAbilitiesToEnemy: function (respawnEnemy) {
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
		if (EI.Waver) this.giveAbilityWaver(respawnEnemy,y);
		if (EI.Tracker) this.physics.arcade.moveToObject(respawnEnemy,this.Player,EI.speed);
		if (EI.Shoter) {
			respawnEnemy.body.maxVelocity.x = 300;
			if (EI.circleShot) {
				this.giveAbilityCircleShoter(respawnEnemy);
			} else if (EI.specialShot) {
				this.giveAbilitySpecialShoter(respawnEnemy);
			} else {
				this.giveAbilityShoter(respawnEnemy);
			}
		}
		var self = this;
		respawnEnemy.updateList.worldBoundsKill = function () {
			if (respawnEnemy.x<-100) self.resetEnemyToGroup(respawnEnemy);
		};
		respawnEnemy.update = function () {
			for (var key in this.updateList) this.updateList[key]();
		};
	},

	giveAbilityWaver: function (respawnEnemy,y) {
		var waveRange = this.rnd.between(100,300);
		respawnEnemy.updateList.Waver = function () {
			respawnEnemy.y = waveRange*Math.sin(respawnEnemy.x/waveRange)+y;
		};
	},

	giveAbilityCircleShoter: function (respawnEnemy) {
		var self = this;
		var maxDis = this.world.width;
		respawnEnemy.updateList.Shoter = function () {
			if (respawnEnemy.alive) {
				var ex = respawnEnemy.x;
				var ey = respawnEnemy.y;
				var WestDir = ex-maxDis;
				var EastDir = ex+maxDis;
				var NorthDir = ey-maxDis;
				var SouthDir = ey+maxDis;
				self.EnemysWeapon.fireFrom.x = ex;
				self.EnemysWeapon.fireFrom.y = ey;
				self.EnemysWeapon.fireAtXY(WestDir,ey); // West
				self.EnemysWeapon.fireAtXY(EastDir,ey); // East
				self.EnemysWeapon.fireAtXY(ex,NorthDir); // North
				self.EnemysWeapon.fireAtXY(ex,SouthDir); // South
				self.EnemysWeapon.fireAtXY(WestDir,NorthDir); // NorthWest
				self.EnemysWeapon.fireAtXY(EastDir,NorthDir); // NorthEast
				self.EnemysWeapon.fireAtXY(WestDir,SouthDir); // SouthWest
				self.EnemysWeapon.fireAtXY(EastDir,SouthDir); // SouthEast
			}
		};
	},

	giveAbilitySpecialShoter: function (respawnEnemy) {
		var self = this;
		respawnEnemy.updateList.Shoter = function () {
			if (respawnEnemy.alive) {
				self.SpecialEnemysWeapon.fireFrom.x = respawnEnemy.x;
				self.SpecialEnemysWeapon.fireFrom.y = respawnEnemy.y;
				self.SpecialEnemysWeapon.fireAtSprite(self.Player);
			}
		};
	},

	giveAbilityShoter: function (respawnEnemy) {
		var self = this;
		respawnEnemy.updateList.Shoter = function () {
			if (respawnEnemy.alive) {
				self.EnemysWeapon.fireFrom.x = respawnEnemy.x;
				self.EnemysWeapon.fireFrom.y = respawnEnemy.y;
				self.EnemysWeapon.fireAtSprite(self.Player);
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
		this.M.T.onComplete(tween,this.onSpawnedBoss);
		tween.start();
		boss.score = EI.score*m;
		boss.isBoss = EI.isBoss;
		boss.tint = DI.enemyTint;
		boss.speed = EI.speed;
		boss.baseHealth = EI.health*m;
		this.Enemys.add(boss);
		this.BG.showWarning();
		this.HUD.showWarningBoss();
		this.Boss = boss;
		this.genGaugeOfBossHealth();
		this.M.SE.play('SpawnBoss',{volume:1});
	},

	onSpawnedBoss: function () {
		var boss = this.Boss;
		this.HUD.hideWarningBoss();
		boss.reset(boss.x,boss.y);
		boss.health = boss.baseHealth;
		this.setFiringToBoss();
	},

	setFiringToBoss: function () {
		var boss = this.Boss;
		var bottomMargin = this.world.height-100;
		var maxDis = this.world.width;
		var maxDisHalf = maxDis*.5;
		var self = this;
		boss.update = function () {
			if (boss.alive) {
				boss.y += boss.speed;
				if (boss.y<100||boss.y>bottomMargin) boss.speed *= -1;
				var ex = boss.x;
				var ey = boss.y;
				var WestDir = ex-maxDis;
				var NorthDir = ey-maxDis;
				var SouthDir = ey+maxDis;
				self.EnemysWeapon.fireFrom.x = ex;
				self.EnemysWeapon.fireFrom.y = ey;
				self.EnemysWeapon.fireAtXY(WestDir,ey); // West
				self.EnemysWeapon.fireAtXY(WestDir,NorthDir); // NorthWest
				self.EnemysWeapon.fireAtXY(WestDir,ey-maxDisHalf); // NorthWestWest
				self.EnemysWeapon.fireAtXY(WestDir,SouthDir); // SouthWest
				self.EnemysWeapon.fireAtXY(WestDir,ey+maxDisHalf); // SouthWestWest
				self.SpecialEnemysWeapon.fireFrom.x = ex;
				self.SpecialEnemysWeapon.fireFrom.y = ey;
				self.SpecialEnemysWeapon.fireAtSprite(self.Player);
			}
		};
	},

	genGaugeOfBossHealth: function () {
		var x = 0;
		var y = this.Player.height-80;
		var w = this.Boss.width*.8;
		var h = 10;
		this.genGaugeSprite(x,y,w+20,h+20,'#000000');
		this.genGaugeSprite(x,y,w+10,h+10,'#dcdcdc');
		this.genGaugeSprite(x,y,w+5,h+5,'#000000');
		var backGaugeSprite = this.genGaugeSprite(x,y,w,h,'#dc143c');
		var frontGaugeSprite = this.M.S.genBmpSprite(x-backGaugeSprite.width*.5,y,w,h,'#ffff00');
		frontGaugeSprite.anchor.setTo(0,.5);
		var cropRect = new Phaser.Rectangle(0,0,w,h);
		frontGaugeSprite.crop(cropRect);
		this.Boss.addChild(frontGaugeSprite);
		this.Boss.changeGauge = function () {
			cropRect.width = w * this.health / this.baseHealth;
			frontGaugeSprite.updateCrop();
		};
	},

	genGaugeSprite: function (x,y,w,h,fillStyle) {
		var sprite = this.M.S.genBmpSprite(x,y,w,h,fillStyle);
		sprite.anchor.setTo(.5);
		this.Boss.addChild(sprite);
		return sprite;
	},

	checkAddItem: function () {
		this.GM.itemTimeCounter++;
		if (this.GM.itemTimeCounter >= this.GM.ADD_ITEM_TIMING) {
			this.GM.itemTimeCounter = 0;
			this.addItemToWorld();
		}
	},

	addItemToWorld: function () {
		var addItem = this.Items.getRandom();
		if (addItem) this.giveAbilitiesToItem(addItem);
	},

	giveAbilitiesToItem: function (item) {
		var x = this.world.width;
		var y = this.world.randomY;
		item.reset(x,y);
		item.body.velocity.x = -300;
		var self = this;
		item.update = function () {
			if (this.x<-100) self.resetItemToGroup(this);
		};
	},

	resetItemToGroup: function (item) {
		item.destroy();
		var newItem = this.add.sprite(0,0,this.rnd.pick(this.GM.ItemKeys));
		newItem.kill();
		newItem.anchor.setTo(.5);
		this.Items.add(newItem);
	},

	checkPlayerSpecialWeapon: function () {
		if (this.Player.tripleShot) {
			if (this.GM.playerSpecialWeaponTimeCounter>=this.Player.TRIPLE_SHOT_LIMIT_TIMING) {
				this.GM.playerSpecialWeaponTimeCounter = 0;
				this.Player.tripleShot = false;
			}
			this.GM.playerSpecialWeaponTimeCounter++;
		}
	},

	collisionManager: function () {
		this.physics.arcade.overlap(this.Player, this.Enemys, this.enemyHitsPlayer, null, this);
		this.physics.arcade.overlap(this.Player, this.Items, this.getItem, null, this);
		this.physics.arcade.overlap(this.PlayerWeapon.bullets, this.Enemys, this.hitBulletToEnemy, null, this);
		this.physics.arcade.overlap(this.EnemysWeapon.bullets, this.Player, this.hitBulletToPlayer, null, this);
		this.physics.arcade.overlap(this.SpecialEnemysWeapon.bullets, this.Player, this.hitBulletToPlayer, null, this);
	},

	enemyHitsPlayer: function (player, enemy) {
		if (player.takeDamage()) {
			this.M.SE.play('TakeDamage',{volume:1});
			this.camera.shake(.05,200,true,Phaser.Camera.SHAKE_HORIZONTAL);
			if (enemy.isBoss) return;
			this.resetEnemyToGroup(enemy);
		}
	},

	getItem: function (player, item) {
		this.M.SE.play('GetItem',{volume:3});
		this.resetItemToGroup(item);
		this.giveAbilityToPlayer(item.key);
	},

	giveAbilityToPlayer: function (key) {
		if (key == 'Ohepan') {
			if (this.Player.bulletPower<this.Player.maxBulletPower) {
				this.Player.bulletPower++;
				this.Player.increasePower();
			}
		} else if (key == 'Oheneko') {
			this.Player.tripleShot = true;
		} else if (key == 'HealItem') {
			this.Player.UHeal();
		}
	},

	hitBulletToEnemy: function (bullet, enemy) {
		bullet.kill();
		enemy.damage(this.Player.bulletPower);
		if (enemy.isBoss) enemy.changeGauge();
		this.Effect.fireDamageEffect(bullet.right,bullet.y);
		if (!enemy.alive) {
			this.GM.score += enemy.score;
			this.HUD.changeScore(this.GM.score);
			this.Effect.fireKillEffect(enemy);
			this.M.SE.play('KillEnemy',{volume:1});
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
		this.addHealItemToWorld();
		this.levelUp();
	},

	addHealItemToWorld: function () {
		var healItem = this.add.sprite(0,0,'HealItem');
		healItem.anchor.setTo(.5);
		this.Items.add(healItem);
		this.giveAbilitiesToItem(healItem);
	},

	levelUp: function () {
		this.GM.curLevel++;
		this.setDifficultyFromLevel();
		if (this.GM.curLevel >= this.GM.clearLevel) return this.clear();
		this.HUD.showLevelUp();
		this.HUD.changeLevel(this.GM.curLevel);
		this.setDifficultyValues();
		this.changeBg();
		this.M.SE.play('OpenSE',{volume:1});
	},

	setDifficultyFromLevel: function () {
		if (this.GM.curLevel > 12) {
			this.GM.curDifficulty = 'Purple';
		} else if (this.GM.curLevel > 9) {
			this.GM.curDifficulty = 'Red';
		} else if (this.GM.curLevel > 6) {
			this.GM.curDifficulty = 'Blue';
		} else if (this.GM.curLevel > 3) {
			this.GM.curDifficulty = 'Yellow';
		} else {
			this.GM.curDifficulty = 'Normal';
		}
	},

	setDifficultyValues: function () {
		var DI = this.GM.DifficultyInfo[this.GM.curDifficulty];
		this.GM.respawnEnemyCountdown = DI.respawnEnemyCountdown;
		this.EnemysWeapon.bulletSpeed = DI.enemyBulletSpeed;
		this.EnemysWeapon.fireRate = DI.enemyFireRate;
	},

	changeBg: function () {
		var DI = this.GM.DifficultyInfo[this.GM.curDifficulty];
		if (DI.changeBgNum) {
			if (this.BG.curBgNum != DI.changeBgNum) {
				var group = this.BG.Bgs;
				if (group.getAt(group.length-4) != -1) {
					this.setBgMove(group.getAt(group.length-3),5);
					this.setBgMove(group.getAt(group.length-4),1);
					group.getAt(group.length-1).tween.start();
					group.getAt(group.length-2).tween.start();
					this.BG.curBgNum = DI.changeBgNum;
					this.changeBGM(DI.bgm);
				}
			}
		}
	},

	changeBGM: function (bgm) {
		this.M.SE.fadeOut('currentBGM', 1000);
		this.M.SE.onComplete('currentBGM', function () {
			this.M.SE.play(bgm,{isBGM:true,loop:true,volume:1});
		});
	},

	genEnemySprite: function () {
		var enemy = this.add.sprite(0,0,this.rnd.pick(this.GM.EnemyKeys));
		enemy.kill();
		enemy.anchor.setTo(.5);
		enemy.body.setCircle(enemy.width*.5);
		this.Enemys.add(enemy);
	},

	hitBulletToPlayer: function (player, bullet) {
		if (player.takeDamage()) {
			bullet.kill();
			this.M.SE.play('TakeDamage',{volume:1});
			this.camera.shake(.05,200,true,Phaser.Camera.SHAKE_HORIZONTAL);
		}
	},

	BgContainer: function () {
		this.BG = {
			curBgNum: 1,
			Bgs: this.add.group(),
			showWarning: null,
		};
		this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
		this.genBgTileSprite();
		this.genWarningSprite();
	},

	genBgTileSprite: function () {
		var DI = this.GM.DifficultyInfo;
		var w = this.world.width;
		var h = this.world.height;
		var group = this.BG.Bgs;
		for (var key in DI) {
			var changeBgNum = DI[key].changeBgNum;
			if (changeBgNum) {
				var mtTileSprite = this.add.tileSprite(0,0,w,h,'MtBg_'+changeBgNum);
				var skyTileSprite = this.add.tileSprite(0,0,w,h,'SkyBg_'+changeBgNum);
				mtTileSprite.tween = this.M.T.fadeOutA(mtTileSprite);
				this.M.T.onComplete(mtTileSprite.tween,function (sprite) {
					sprite.destroy();
				});
				skyTileSprite.tween = this.M.T.fadeOutA(skyTileSprite);
				this.M.T.onComplete(skyTileSprite.tween,function (sprite) {
					sprite.destroy();
				});
				group.addChildAt(mtTileSprite,0);
				group.addChildAt(skyTileSprite,0);
			}
		}
		this.setBgMove(group.getAt(group.length-1),5);
		this.setBgMove(group.getAt(group.length-2),1);
	},

	setBgMove: function (target, mvVal) {
		target.update = function () {
			this.tilePosition.x -= mvVal;
		};
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
		this.Player.input.enableDrag(false);
		// this.Player.input.enableDrag(true);
		this.Player.tripleShot = false;
		this.Player.TRIPLE_SHOT_LIMIT_TIMING = 8;
		this.Player.takingDamage = false;
		this.Player.health = 3;
		this.Player.maxHealth = 5;
		this.Player.bulletPower = 1;
		this.Player.maxBulletPower = 5;
		this.setDamageEffectToPlayer();
		this.Player.UHeal = function () {
			this.heal(1);
			this.increaseHearts();
		};
		this.setWeaponToPlayer();
		var radius = 30;
		this.Player.body.setCircle(radius,this.Player.width*.5-radius,this.Player.height*.5-radius);
		this.Player.events.onKilled.add(this.gameOver, this);
		this.genPlayerHitRangeViewSprite(radius);
	},

	setDamageEffectToPlayer: function () {
		var tween = this.M.T.fadeOutB(this.Player,{alpha:.3,duration:100});
		tween.repeat(5);
		tween.yoyo(true);
		this.M.T.onComplete(tween,function () {
			this.Player.takingDamage = false;
		});
		this.Player.takeDamage = function () {
			if (this.takingDamage) return false;
			this.takingDamage = true;
			this.damage(1);
			tween.start();
			this.decreaseHearts();
			if (this.bulletPower>=3) this.bulletPower--;
			this.decreasePower();
			if (this.bulletPower==2) this.bulletPower--;
			this.decreasePower();
			return true;
		};
	},

	setWeaponToPlayer: function () {
		var weapon = this.genPlayerWeapon();
		this.Player.update = function () {
			if (this.alive) {
				if (this.tripleShot) {
					weapon.fireMany([
						{x:0,y:-80},
						{x:0,y:80},
						{x:0,y:0},
					]);
				} else {
					weapon.fire();
				}
			}
		};
		this.PlayerWeapon = weapon;
	},

	genPlayerHitRangeViewSprite: function (radius) {
		var circleSprite = this.M.S.genBmpCircleSprite(0,0,radius*2-10,'#ffffff');
		var circleFrameSprite = this.M.S.genBmpCircleSprite(0,0,radius*2,'#000000');
		circleSprite.anchor.setTo(.5);
		circleFrameSprite.anchor.setTo(.5);
		this.Player.addChild(circleFrameSprite);
		this.Player.addChild(circleSprite);
	},

	genPlayerWeapon: function () {
		var weapon = this.add.weapon(40, 'PlayerBullet');
		weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		weapon.bulletSpeed = 1000;
		weapon.fireRate = 200;
		weapon.trackSprite(this.Player, this.Player.centerX, 0, true);
		weapon.multiFire = true;
		weapon.onFire.add(function () {
			this.M.SE.play('PlayerFire',{volume:1});
		}, this);
		return weapon;
	},

	EnemyContainer: function () {
		this.Enemys = this.add.group();
		this.Enemys.enableBody = true;
		this.Enemys.physicsBodyType = Phaser.Physics.ARCADE;
		this.Enemys.createMultiple(5,this.GM.EnemyKeys);
		this.Enemys.setAll('anchor.x', .5);
		this.Enemys.setAll('anchor.y', .5);
		this.Enemys.forEach(function (enemy) {
			enemy.body.setCircle(enemy.width*.5);
		}, this);
		this.Enemys.shuffle();
		this.EnemysWeapon = this.genEnemyWeapon();
		this.SpecialEnemysWeapon = this.genSpecialEnemyWeapon();
	},

	genEnemyWeapon: function () {
		var weapon = this.add.weapon(80, 'EnemyBullet');
		weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		weapon.bulletAngleOffset = 90;
		weapon.bulletSpeed = 500;
		weapon.fireRate = 4000;
		weapon.multiFire = true;
		return weapon;
	},

	genSpecialEnemyWeapon: function () {
		var weapon = this.add.weapon(20, 'FireBall');
		weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		weapon.bulletAngleOffset = 180;
		weapon.bulletSpeed = 1000;
		weapon.fireRate = 3000;
		weapon.multiFire = true;
		weapon.onFire.add(function (bullet) {
			this.M.SE.play('FireBall',{volume:1});
			bullet.animations.add('Moving');
			bullet.play('Moving', 12, true);
		}, this);
		return weapon;
	},

	ItemContainer: function () {
		this.Items = this.add.group();
		this.Items.enableBody = true;
		this.Items.physicsBodyType = Phaser.Physics.ARCADE;
		this.Items.createMultiple(1,this.GM.ItemKeys);
		this.Items.setAll('anchor.x', .5);
		this.Items.setAll('anchor.y', .5);
		this.Items.shuffle();
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

	PlayerHealthHeartsContainer: function () {
		var breakAlpha = .3;
		var playerHealthHearts = this.add.group();
		for (var i=0;i<this.Player.maxHealth;i++) {
			var heartSprite = this.add.sprite(0,0,'HealthHeart');
			heartSprite.scale.setTo(.4);
			if (i>=this.Player.health) heartSprite.alpha = breakAlpha;
			playerHealthHearts.addChild(heartSprite);
		}
		playerHealthHearts.align(-1,1,heartSprite.width,heartSprite.height);
		playerHealthHearts.alignIn(this.world.bounds,Phaser.BOTTOM_RIGHT,-20,-20);
		this.Player.increaseHearts = function () {
			playerHealthHearts.children[this.health-1].alpha = 1;
		};
		this.Player.decreaseHearts = function () {
			playerHealthHearts.children[this.health].alpha = breakAlpha;
		};
	},

	PlayerPowersContainer: function () {
		var invalidAlpha = .3;
		var playerPowers = this.add.group();
		for (var i=0;i<this.Player.maxBulletPower;i++) {
			var powerSprite = this.add.sprite(0,0,'Power',0);
			powerSprite.scale.setTo(.26);
			if (i>=this.Player.bulletPower) powerSprite.alpha = invalidAlpha;
			playerPowers.addChild(powerSprite);
		}
		playerPowers.align(-1,1,powerSprite.width,powerSprite.height);
		playerPowers.alignIn(this.world.bounds,Phaser.BOTTOM_LEFT,-20,-20);
		this.Player.increasePower = function () {
			playerPowers.children[this.bulletPower-1].alpha = 1;
		};
		this.Player.decreasePower = function () {
			playerPowers.children[this.bulletPower].alpha = invalidAlpha;
		};
	},

	HUDContainer: function () {
		this.HUD = {
			self: this,
			showGameOver: null,
			changeScore: null,
			changeLevel: null,
			showWarningBoss: null,
			hideWarningBoss: null,
			showLevelUp: null,
			showClear: null,
		};
		this.genStartTextSprite();
		this.genScoreTextSprite();
		this.genLevelTextSprite();
		this.genGameOverTextSprite();
		this.genClearTextSprite();
		this.genLevelUpTextSprite();
		this.genWarningBossTextSprite();
	},

	genStartTextSprite: function () {
		var baseText = 'スタート';
		var textStyle = this.BaseTextStyle(200);
		var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,textStyle);
		textSprite.setAnchor(.5);
		textSprite.setScale(0,0);
		textSprite.addTween('popUpB',{duration: 1000, delay: 500});
		textSprite.startTween('popUpB');
		this.M.T.onComplete(textSprite.multipleTextTween.popUpB, function () {
			this.time.events.add(1000, function () {
				textSprite.hide();
				this.start();
			}, this);
		});
	},

	genScoreTextSprite: function () {
		var baseText = 'スコア: ';
		var textStyle = this.BaseTextStyle(60);
		var textSprite = this.M.S.genText(10,10,baseText+this.GM.score,textStyle);
		textSprite.setAnchor(0,0);
		this.HUD.changeScore = function (val) {
			textSprite.changeText(baseText+val);
		};
	},

	genLevelTextSprite: function () {
		var baseText = 'レベル: ';
		var textStyle = this.BaseTextStyle(60);
		var textSprite = this.M.S.genText(this.world.width-10,10,baseText+this.GM.curLevel,textStyle);
		textSprite.setAnchor(1,0);
		this.HUD.changeLevel = function (val) {
			textSprite.changeText(baseText+val);
		};
	},

	genGameOverTextSprite: function () {
		var baseText = '終了！！';
		var textStyle = this.BaseTextStyle(200);
		var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,textStyle);
		textSprite.setAnchor(.5);
		textSprite.setScale(0,0);
		this.HUD.showGameOver = function () {
			textSprite.addTween('popUpB',{});
			textSprite.startTween('popUpB');
		};
	},

	genClearTextSprite: function () {
		var baseText = 'クリアー！！';
		var textStyle = this.BaseTextStyle(200);
		var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,textStyle);
		textSprite.setAnchor(.5);
		textSprite.setScale(0,0);
		this.HUD.showClear = function () {
			textSprite.addTween('popUpB',{});
			textSprite.startTween('popUpB');
		};
	},

	genLevelUpTextSprite: function () {
		var textStyle = this.BaseTextStyle(150);
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
		// textSprite.multipleTextTween.move2.onStart.add(function () {
			// this.M.SE.play('CloseSE',{volume:.7});
		// }, this);
		this.HUD.showLevelUp = function () {
			textSprite.changeText(baseText+this.self.GM.curLevel);
			textSprite.show();
			textSprite.startTween('move1');
		};
	},

	genWarningBossTextSprite: function () {
		var textStyle = this.BaseTextStyle(200);
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
	},

	playBGM: function () {
		var s = this.M.SE;
		if (s.isPlaying('Stage_1')) return;
		s.play('Stage_1',{isBGM:true,loop:true,volume:1});
	},

	stopBGM: function () {
		var s = this.M.SE;
		if (s.isPlaying('PlayBGM')) return;
		s.stop('currentBGM');
		s.stop('TitleBGM');
	},

	start: function () {
		this.GM.isPlaying = true;
	},

	clear: function () {
		this.GM.isPlaying = false;
		this.HUD.showClear();
		this.GM.clearFlag = true;
		this.M.SE.play('CloseSE');
		this.time.events.add(1500, function () {
			this.M.SE.play('OpenSE');
			this.ResultContainer();
		}, this);
	},

	gameOver: function () {
		this.GM.isPlaying = false;
		this.HUD.showGameOver();
		this.M.SE.play('CloseSE');
		this.time.events.add(1500, function () {
			this.M.SE.play('OpenSE');
			this.ResultContainer();
		}, this);
	},

	ResultContainer: function () {
		this.M.S.genDialog('Dialog',{
			onComplete:this.openedResult,
		}).tweenShow();
	},

	openedResult: function () {
		var x = this.world.centerX;
		var y = this.world.centerY;
		this.genResultTextSprite(x,y-90,'結果発表');
		this.genResultTextSprite(x,y+40,
			'レベル: '+this.GM.curLevel
			+(this.GM.clearFlag ? ' クリア！🎉' : '')
		); // -300
		this.genResultTextSprite(x,y+140,'スコア: '+this.GM.score); // -300
		var marginX = 500;
		this.genResultLabel(x-marginX,y+350,'もう一度プレイ',function () {
			this.M.NextScene('Play');
		},600);
		this.genResultLabel(x,y+350,'結果をツイート',this.tweet,800);
		this.genResultLabel(x+marginX,y+350,'タイトルにもどる',function () {
			this.M.NextScene('Title');
		},1000);
	},

	genResultTextSprite: function (x,y,text) {
		var textSprite = this.M.S.genText(x,y,text,this.BaseTextStyle(80));
		textSprite.setScale(0,0);
		textSprite.addTween('popUpB',{duration:800});
		textSprite.startTween('popUpB');
	},

	genResultLabel: function (x,y,text,func,delay) {
		var label = this.M.S.BasicGrayLabel(x,y,func,text,this.BaseTextStyle(50),{tint:this.M.getConst('MAIN_TINT')});
		label.setScale(0,0);
		label.addTween('popUpB',{duration:800,delay:delay});
		label.startTween('popUpB');
	},

	tweet: function () {
		var emoji = '🌟❤🌟❤🌟';
		var text = '『'+this.M.getConst('GAME_TITLE')+'』で遊んだよ！\n'
					+emoji+'\n'
					+'到達レベル： '+this.GM.curLevel+'\n'
					+'スコア： '+this.GM.score+'\n'
					+(this.GM.clearFlag ? 'クリアおめでとう！🎉🎉🎉\n' : '')
					+emoji+'\n';
		var hashtags = 'ちあゲーム';
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

	renderT: function () {
		// this.game.debug.body(this.Player);
		// for (var key in this.Enemys.children) this.game.debug.body(this.Enemys.children[key]);
		// for (var key in this.EnemysWeapon.bullets.children) this.game.debug.body(this.EnemysWeapon.bullets.children[key]);
		// for (var key in this.SpecialEnemysWeapon.bullets.children) this.game.debug.body(this.SpecialEnemysWeapon.bullets.children[key]);
		// this.game.debug.pointer(this.game.input.activePointer);
	},

	test: function () {
		if (__ENV!='prod') {
			this.game.debug.font='40px Courier';
			this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.D).onDown.add(this.gameOver, this);
			this.input.keyboard.addKey(Phaser.Keyboard.L).onDown.add(this.levelUp, this);
			this.input.keyboard.addKey(Phaser.Keyboard.P).onDown.add(function() {this.GM.curLevel=20;this.levelUp();}, this);
			this.input.keyboard.addKey(Phaser.Keyboard.K).onDown.add(this.addNewEnemyKey, this);
			this.input.keyboard.addKey(Phaser.Keyboard.I).onDown.add(this.addItemToWorld, this);
			this.input.keyboard.addKey(Phaser.Keyboard.B).onDown.add(function () {this.GM.bossTimeCounter=29;}, this);
			if(this.M.H.getQuery('curDifficulty')) this.GM.curDifficulty = this.M.H.getQuery('curDifficulty');
			this.stage.backgroundColor = '#333333';
		}
	},
};
