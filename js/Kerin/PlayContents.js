BasicGame.Play.prototype.EnemyContainer = function () {
	this.Enemys = this.add.group();
	this.addRowOfEnemys();
};

BasicGame.Play.prototype.addRowOfEnemys = function () {
	var holeCount = 5; // TODO per level
	var enemyCount = 10; // TODO adjust by size
	var x = this.world.width;
	var holeNum = this.rnd.integerInRange(1,enemyCount-holeCount-1);
	for (var i=0;i<enemyCount;i++) {
		var addFlag = true;
		for (var j=0;j<holeCount;j++) {
			var checkNum = holeNum + j;
			if (i == checkNum) {
				addFlag = false;
				break;
			}
		}
		if (addFlag) this.addOneEnemy(x, i * 60 + 10); // TODO adjust size
	}
};

BasicGame.Play.prototype.addOneEnemy = function (x,y) {
	var enemy = this.add.sprite(x,y,'Enemy');
	this.Enemys.add(enemy);
	this.physics.arcade.enable(enemy);
	enemy.body.velocity.x = -200; // TODO per level? or adjust
	enemy.checkWorldBounds = true;
	enemy.outOfBoundsKill = true;
	enemy.body.immovable = true;
};

BasicGame.Play.prototype.PlayerContainer = function () {
	var sprite = this.add.sprite(100,100,'Player');
	this.physics.arcade.enable(sprite);
	sprite.body.gravity.y = 1000; // TODO per level? or adjust // TODO on after start???if it,start angle=-20
	sprite.anchor.setTo(-.2,.5);
	// sprite.body.immovable = true;
	this.Player = sprite;
	this.game.input.onDown.add(this.jumpPlayer, this);
};

BasicGame.Play.prototype.jumpPlayer = function () {
	if (this.isPlaying) {
		var jumpPower = 20; // TODO per level? or adjust
		var deltaTime = this.time.physicsElapsedMS;
		this.Player.body.velocity.y = - jumpPower * deltaTime;
		this.add.tween(this.Player).to({angle: -20}, 100).start();
	}
};

