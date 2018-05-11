BasicGame.Play.prototype.EnemyContainer = function () {
	this.Enemys = this.add.group();
	this.Enemys.createMultiple(100,'Enemy');
};

BasicGame.Play.prototype.addRowOfEnemys = function () {
	var x = this.world.width;
	var holeNum = this.rnd.integerInRange(1,this.enemyCount-this.holeCount-1);
	for (var i=0;i<this.enemyCount;i++) {
		var addFlag = true;
		for (var j=0;j<this.holeCount;j++) {
			if (i == (holeNum + j)) {
				addFlag = false;
				break;
			}
		}
		if (addFlag) this.addOneEnemy(x, i * 60 + 10); // TODO adjust size
	}
};

BasicGame.Play.prototype.addOneEnemy = function (x,y) {
	this.EnemyPool = this.Enemys.getFirstDead();
	this.EnemyPool.reset(x,y);
	this.physics.arcade.enable(this.EnemyPool);
	this.EnemyPool.body.velocity.x = - this.enemySpeed * this.time.physicsElapsedMS;
	this.EnemyPool.checkWorldBounds = true;
	this.EnemyPool.outOfBoundsKill = true;
	this.EnemyPool.body.immovable = true;
};

BasicGame.Play.prototype.PlayerContainer = function () {
	this.Player = this.add.sprite(this.PLAYER_FIRST_POS_X,this.PLAYER_FIRST_POS_Y,'Player');
	this.physics.arcade.enable(this.Player);
	this.Player.anchor.setTo(-.2,.5);
	// this.Player.body.immovable = true;
	this.game.input.onDown.add(this.jumpPlayer, this);
};

BasicGame.Play.prototype.resetPlayer = function () {
	this.Player.x = this.PLAYER_FIRST_POS_X;
	this.Player.y = this.PLAYER_FIRST_POS_Y;
	this.Player.body.gravity.y = 1000; // TODO per level? or adjust // TODO on after start???if it,start angle=-20
};

BasicGame.Play.prototype.jumpPlayer = function () {
	if (this.isPlaying) {
		this.Player.body.velocity.y = - this.jumpSpeed * this.time.physicsElapsedMS;
		this.add.tween(this.Player).to({angle: -20}, 100).start();
	}
};

