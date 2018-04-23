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
			RESPAWN_ENEMY_COUNTDOWN: 1000,
			EnemyInfo: this.M.getConf('EnemyInfo'),
			LevelInfo: this.genLevelInfo(),
			PlayerInfo: this.genPlayerInfo(),
			EnemyKeys: this.setFirstEnemyKeys(),
			currentLevel: 'Normal',
			score: 0,
		};
	},

	setFirstEnemyKeys: function () {
		var keys = [];
		for (var i=1;i<=3;i++) keys.push('Enemy_'+i);
		return keys;
	},

	genLevelInfo: function () {
		return {
			1:'Normal',2:'Normal',3:'Normal',
			4:'Blue',5:'Blue',6:'Blue',
			7:'Yellow',8:'Yellow',9:'Yellow',
			10:'Red',
			/////////////////////////////////
			'Normal': {
				enemyTint: 0xffffff,
				magnification: 1,
			},
			'Blue': {
				enemyTint: 0x3399ff,
				magnification: 1.2,
			},
			'Yellow': {
				enemyTint: 0xffff66,
				magnification: 1.5,
			},
			'Red': {
				enemyTint: 0xff3300,
				magnification: 2,
			},
		};
	},

	genPlayerInfo: function () {
		return {
			MAX_HEALTH: 5,
			FIRST_HEALTH: 3,
			HIT_RANGE_RADIUS: 30,
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
			this.GM.timeCounter = this.GM.RESPAWN_ENEMY_COUNTDOWN;
			this.respawnEnemy();
		}
		this.GM.timeCounter-=this.time.elapsed;
	},

	respawnEnemy: function () {
		// TODO foreach enemy count get wave info
		var respawnEnemy = this.Enemys.getFirstDead();
		// var respawnEnemy = this.Enemys.getRandom();

		if (respawnEnemy) this.addPowerToEnemy(respawnEnemy);
	},

	addPowerToEnemy: function (respawnEnemy) {
		var EI = this.GM.EnemyInfo[respawnEnemy.key];
		var LI = this.GM.LevelInfo[this.GM.currentLevel];
		var m = LI.magnification;
		var x = this.world.width-300;
		var y = this.world.randomY-100; // TODO pos get enemy info 
		respawnEnemy.reset(x,y);
		respawnEnemy.body.velocity.x = -EI.speed*m;
		respawnEnemy.health = EI.health*m;
		respawnEnemy.score = EI.score*m;
		respawnEnemy.isBoss = EI.isBoss;
		if (EI.Waver) {
			var waveRange = this.rnd.between(100,300);
			respawnEnemy.update = function () {
				this.y = waveRange*Math.sin(this.x/waveRange)+y;
			};
		}
		if (EI.Tracker) this.physics.arcade.moveToObject(respawnEnemy,this.Player,EI.speed);
		if (EI.Shoter) {
			var self = this;
			respawnEnemy.update = function () {
				if (this.alive) {
					self.EnemysWeapon.fireFrom.x = this.x;
					self.EnemysWeapon.fireFrom.y = this.y;
					self.EnemysWeapon.fireAtSprite(self.Player);
				}
			};
		}
	},

	collisionManager: function () {
		this.physics.arcade.overlap(this.Player, this.Enemys, this.enemyHitsPlayer);
		this.physics.arcade.overlap(this.PlayerWeapon.bullets, this.Enemys, this.hitBulletToEnemy, null, this);
		this.physics.arcade.overlap(this.EnemysWeapon.bullets, this.Player, this.hitBulletToPlayer);
	},

	enemyHitsPlayer: function (player, enemy) {
		player.Udamage();
		if (enemy.isBoss) return;
		enemy.kill();
	},

	hitBulletToEnemy: function (bullet, enemy) {
		bullet.kill();
		enemy.damage(1);
		if (!enemy.alive) this.onKilledEnemy(enemy);
	},

	onKilledEnemy: function (enemy) {
		this.GM.score += enemy.score;
		this.HUD.changeScore(this.GM.score);
		enemy.destroy();

		// TODO create?
		var newEnemy = this.add.sprite(0,0,this.rnd.pick(this.GM.EnemyKeys));
		newEnemy.kill();
		newEnemy.outOfBoundsKill = true;
		newEnemy.checkWorldBounds = true;
		this.Enemys.add(newEnemy);
		// this.Enemys.create(0,0,this.rnd.pick(this.GM.EnemyKeys),null,false);
		// this.Enemys.setAll('outOfBoundsKill', true);
		// this.Enemys.setAll('checkWorldBounds', true);
	},

	hitBulletToPlayer: function (player, bullet) {
		bullet.kill();
		player.Udamage();
	},

	BgContainer: function () {
		this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
		this.genBgTileSprite();
	},

	genBgTileSprite: function () {
		// this.add.tileSprite(0,0,1600,900,'');
	},

	PhysicsManager: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.enableBody = true;
	},

	PlayerContainer: function () {
		var PI = this.GM.PlayerInfo;
		this.Player = this.add.sprite(100,this.world.centerY,'Player');
		this.Player.inputEnabled = true;
		this.Player.input.enableDrag(true);
		this.Player.tripleShot = false;
		this.Player.damaging = false;
		this.Player.health = PI.FIRST_HEALTH;
		this.Player.maxHealth = PI.MAX_HEALTH;
		var tween = this.M.T.fadeOutB(this.Player,{alpha:.3,duration:100});
		tween.repeat(5);
		tween.yoyo(true);
		this.M.T.onComplete(tween,function () {
			this.Player.damaging = false;
		});
		this.Player.Udamage = function () {
			if (this.damaging) return;
			this.damaging = true;
			this.damage(1);
			tween.start();
		};
		var radius = PI.HIT_RANGE_RADIUS;
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
				weapon.debug(16,32,true); // TODO del
			}
		};
		this.PlayerWeapon = weapon;
	},

	onKilledPlayer: function () {
		this.gameOver();
	},

	genPlayerWeapon: function () {
		var weapon = this.add.weapon(40, 'Bullet');
		// weapon.setBulletFrames(0, 80, true);
		weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		weapon.bulletAngleOffset = 90;
		// weapon.bulletAngleVariance = 10;
		// weapon.bulletSpeedVariance = 200;
		weapon.bulletSpeed = 1000;
		// weapon.fireRate = 1000;
		weapon.fireRate = 200;
		// weapon.autofire = true;
		weapon.trackSprite(this.Player, this.Player.width, this.Player.height/2, true);
		// weapon.trackSprite(this.Player, this.Player.width/2, 0, false);
		weapon.multiFire = true;
		console.log(weapon); // TODO del
		return weapon;
	},

	EnemyContainer: function () {
		this.Enemys = this.add.group();
		this.Enemys.enableBody = true;
		this.Enemys.physicsBodyType = Phaser.Physics.ARCADE;
		// this.Enemys.createMultiple(1,'Enemy_1');
		// this.Enemys.createMultiple(10,'Enemy_1');
		this.Enemys.createMultiple(3,this.GM.EnemyKeys);
		// this.Enemys.setAll('anchor.x', .5);
		// this.Enemys.setAll('anchor.y', .5);
		this.Enemys.setAll('outOfBoundsKill', true);
		this.Enemys.setAll('checkWorldBounds', true);
		this.Enemys.shuffle();
		this.EnemysWeapon = this.genEnemyWeapon();
	},

	genEnemyWeapon: function () {
		var weapon = this.add.weapon(40, 'Attack');
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
		// for (var key in this.Enemys.children) this.game.debug.body(this.Enemys.children[key]);
		this.game.debug.pointer(this.game.input.activePointer);
	},

	test: function () {
		if (__ENV!='prod') {
			this.game.debug.font='40px Courier';
			this.game.debug.lineHeight=100;
			if(this.M.H.getQuery('gameOver')) this.gameOver();
			this.stage.backgroundColor = '#333333';
		}
	},
};
