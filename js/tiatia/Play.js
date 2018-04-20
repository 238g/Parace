BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GM = {};
		this.Player = {};
		this.PlayerWeapon = {};
		this.Enemys = {};
		this.EnemysWeapon = {};
		this.HUD = {};
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
			RESPAWN_ENEMY_COUNTDOWN: 1000, // TODO if change this,, prepare other var, this->_FIRST
			timeCounter: 500,
			EnemyInfo: this.M.getConf('EnemyInfo'),

			// TODO level info ? -> enemy bullet speed
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
		// console.log(respawnEnemy);
		if (respawnEnemy) {
			// var enemyNum = respawnEnemy.key.split('_')[1]; // TODO or Enemy_1 / search json
			// TODO pos get enemy info
			respawnEnemy.reset(this.world.width-300,this.world.randomY-100);
			respawnEnemy.body.velocity.x = -200; // TODO speed get enemy info
			// respawnEnemy.body.velocity.x = -50; // TODO speed get enemy info
			respawnEnemy.health = 10; // TODO get enemy Info
			// TODO set score get enemy info

			respawnEnemy.events.onKilled.add(function (sprite) {
				if (sprite.x < -sprite.width) return; // TODO fix because now anchor 0
				// TODO score up because here is player kill enemy
			}, this);

			if (respawnEnemy.key == 'Enemy_2') {
				this.physics.arcade.moveToObject(respawnEnemy,this.Player,120);
			}
			if (respawnEnemy.key == 'Enemy_3') {
				var self = this;
				respawnEnemy.update = function () {
					if (this.alive) {
						self.EnemysWeapon.fireFrom.x = this.x;
						self.EnemysWeapon.fireFrom.y = this.y;
						self.EnemysWeapon.fireAtSprite(self.Player);
					}
				};
			}
		}
	},

	collisionManager: function () {
		this.physics.arcade.overlap(this.Player, this.Enemys, this.enemyHitsPlayer);
		this.physics.arcade.overlap(this.PlayerWeapon.bullets, this.Enemys, this.hitBulletToEnemy);
		this.physics.arcade.overlap(this.EnemysWeapon.bullets, this.Player, this.hitBulletToPlayer);
	},

	enemyHitsPlayer: function (player, enemy) {
		// TODO player none damage time??
		enemy.kill(); // TODO if were player none damage, enemy none kill
		player.damage(1);
	},

	hitBulletToEnemy: function (bullet, enemy) {
		bullet.kill();
		enemy.damage(1);
	},

	hitBulletToPlayer: function (player, bullet) {
		bullet.kill();
		player.damage(1);
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
		this.Player = this.add.sprite(100,this.world.centerY,'Player');
		this.Player.inputEnabled = true;
		this.Player.input.enableDrag(true);
		this.Player.tripleShot = false;
		// this.Player.health = 1;
		this.Player.health = 10; // TODO Const
		var radius = 30; // TODO Const
		this.Player.body.setCircle(radius,this.Player.width/2-radius,this.Player.height/2-radius);
		this.Player.events.onKilled.add(this.killedPlayer, this);
		console.log(this.Player);
		var weapon = this.genPlayerWeapon();
		this.Player.update = function () {
			if (this.alive) {
				if (this.tripleShot) {
					// this.weapon.fireOffset(0,-100);
					// this.weapon.fireOffset(0,100);
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

	killedPlayer: function () {
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
		var keys = [];
		for (var i=1;i<=3;i++) {
			// TODO adjustment for
			keys.push('Enemy_'+i);
		}
		// this.Enemys.createMultiple(1,['Enemy_3']);
		this.Enemys.createMultiple(100,keys);

		// this.Enemys.setAll('anchor.x', .5);
		// this.Enemys.setAll('anchor.y', .5);
		this.Enemys.setAll('outOfBoundsKill', true);
		this.Enemys.setAll('checkWorldBounds', true);


		this.Enemys.shuffle(); // TODO need?
		this.EnemysWeapon = this.genEnemyWeapon();

		// this.Enemys.createMultiple(1,['Enemy_1','Enemy_2']);
		// this.Enemys.shuffle(); // TODO need?

		// this.respawnEnemy(); // TODO test del
	},

	genEnemyWeapon: function () {
		var weapon = this.add.weapon(40, 'Attack');
		weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		weapon.bulletAngleOffset = 90;
		weapon.bulletSpeed = 1000;
		weapon.fireRate = 3000;
		weapon.multiFire = true;
		console.log(weapon); // TODO del
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
			if(this.M.H.getQuery('gameOver')) this.gameOver();
			this.stage.backgroundColor = '#333333';
		}
	},
};
