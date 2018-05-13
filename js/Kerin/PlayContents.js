BasicGame.Play.prototype.BgContainer = function () {
	this.SkyTileSprite = this.add.tileSprite(0,0,this.world.width,this.world.height,'Sky');
};

BasicGame.Play.prototype.EnemyContainer = function () {
	this.Enemies = this.add.group();
	this.Enemies.createMultiple(100,this.LevelInfo.imgName);
};

BasicGame.Play.prototype.addRowOfEnemies = function () {
	var x = this.world.width;
	var holeTopNum = this.rnd.integerInRange(1,this.ENEMY_ROW_COUNT-this.holeCount-1);
	for (var i=0;i<this.ENEMY_ROW_COUNT;i++) {
		var addFlag = true;
		for (var j=0;j<this.holeCount;j++) {
			if (i == (holeTopNum + j)) {
				addFlag = false;
				break;
			}
		}
		if (addFlag) this.addOneEnemy(x, i * this.ENEMY_HEIGHT + i * 10);
	}
};

BasicGame.Play.prototype.addOneEnemy = function (x,y) {
	if (this.LevelInfo.multipleImg) {
		this.EnemyPool = this.rnd.pick(this.Enemies.children.filter(function(e){return !e.alive;}));
	} else {
		this.EnemyPool = this.Enemies.getFirstDead();
	}
	this.EnemyPool.reset(x,y);
	this.physics.arcade.enable(this.EnemyPool);
	this.EnemyPool.body.velocity.x = - this.ENEMY_SPEED * this.time.physicsElapsedMS;
	this.EnemyPool.checkWorldBounds = true;
	this.EnemyPool.outOfBoundsKill = true;
	this.EnemyPool.body.immovable = true;
};

BasicGame.Play.prototype.PlayerContainer = function () {
	this.Player = this.add.sprite(this.PLAYER_FIRST_POS_X,this.PLAYER_FIRST_POS_Y,'Player');
	this.physics.arcade.enable(this.Player);
	this.Player.anchor.setTo(1.2,.5);
	// this.Player.body.immovable = true;
	this.game.input.onDown.add(this.jumpPlayer, this);
};

BasicGame.Play.prototype.resetPlayer = function () {
	this.Player.x = this.PLAYER_FIRST_POS_X;
	this.Player.y = this.PLAYER_FIRST_POS_Y;
	this.Player.body.gravity.y = 1000;
	this.Player.body.setSize(this.Player.width*.2,this.Player.height*.2,this.Player.width*.6,this.Player.height*.3);
};

BasicGame.Play.prototype.jumpPlayer = function () {
	if (this.isPlaying) {
		this.Player.body.velocity.y = - this.JUMP_SPEED * this.time.physicsElapsedMS;
		this.add.tween(this.Player).to({angle: -10}, 200).start();
	}
};

BasicGame.Play.prototype.FrontContainer = function () {
	this.genStartTextSprite();
	this.genBadEndSprige();
	this.genEndTextSprite();
};

BasicGame.Play.prototype.genStartTextSprite = function () {
	this.StartTextSprite = this.M.S.genText(
		this.world.centerX,this.world.centerY,
		'目的地まで\n障害を避けて行け！',this.M.S.BaseTextStyleS(50)
	);
	this.StartTextSprite.setScale(0,0);
	this.StartTextSprite.addTween('popUpB',{duration: 1200});
	this.M.T.onComplete(this.StartTextSprite.multipleTextTween.popUpB,function () {
		this.time.events.add(800, this.start, this);
	});
	this.StartTextSprite.startTween('popUpB');
};

BasicGame.Play.prototype.genBadEndSprige = function () {
	this.BadEndSprite = this.add.sprite(this.world.width*2,this.world.centerY,'BadEnd');
	this.BadEndSprite.anchor.setTo(.5);
	this.BadEndSprite.visible = false;
};

BasicGame.Play.prototype.genEndTextSprite = function () {
	this.EndTextSprite = this.M.S.genText(
		this.world.centerX,this.world.centerY,
		this.TOUCH_OR_CLICK+'して結果画面へ',
		this.M.S.BaseTextStyleS(40)
	);
	this.EndTextSprite.hide();
};

BasicGame.Play.prototype.showBadEnd = function () {
	this.BadEndSprite.visible = true;
	// this.M.SE.play('BombKerin',{volume:.5}); // TODO release
	var tween = this.add.tween(this.BadEndSprite).to({x:-this.world.width*2}, 3000)
	this.M.T.onComplete(tween, this.nextScene);
	tween.start();
};

BasicGame.Play.prototype.showEndText = function () {
	this.EndTextSprite.show();
};
