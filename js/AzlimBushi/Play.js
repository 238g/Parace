BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GC = null;
		this.HUD = null;
	},

	create: function () {
		this.GC = this.GameController();
		// this.physicsController(); // TODO dont need?
		this.FishContainer();
		this.HUD = this.HUDContainer();
		this.ready();
		this.test();
	},

	GameController: function () {
		return {
			timeCounter: 0,
			leftTime: 30,
			// started: false,
			isPlaying: false,
			// touched: false,
			score: 0,
		};

	},

	// TODO dont need?
	physicsController: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.enableBody = true;
	},

	update: function () {
		if (this.GC.isPlaying) {
			this.timeManager();
		}
	},

	timeManager: function () {
		this.GC.timeCounter += this.time.elapsed;
		if (this.GC.timeCounter > 1000) {
			this.GC.timeCounter = 0;
			this.GC.leftTime--;
			this.HUD.changeTime(this.GC.leftTime);
		}
		if (this.GC.leftTime <= 0) {
			this.gameOver();
		}
	},

	FishContainer: function () {
		// TODO
		// var fishGroup = this.add.group();
		// this.createMultiple(fishGroup, 'Fish', 100);

		// TODO
		var segmentWidth = 400 / 10;
		var points = [];
		for (var i = 0; i < 10; i++) points.push(new Phaser.Point(i * segmentWidth, 0));
		var fish = this.add.rope(300, this.world.centerY, 'Fish', null, points);
		fish.anchor = {x:.5,y:.5};
		// console.log(fish);
		// return;
		// this.physics.arcade.enable(fish);
		// fish.anchor.setTo(.5);
		var count = 0;
		fish.updateAnimation = function() {
			count += 0.1;
			points[points.length - 1].y = Math.sin(count) * 3;
			for (var i = 0; i < points.length - 1; i++) points[i].y = points[i + 1].y * 1.3;
		};
		console.log(fish);
		// fish.body.gravity.x = 200;

	},

		// TODO
	fishAnimation: function () {

	},

		// TODO
	createMultiple: function (group, keys, quantity) {
		var emitter = this.add.emitter(this.world.centerX, this.world.centeY, 200);
		emitter.makeParticles('Fish');
		emitter.setYSpeed(80, 500);
		emitter.gravity = 0;
		emitter.minParticleScale = .8;
		emitter.maxParticleScale = 3;
		emitter.width = this.world.width;
		emitter.onChildInputDown.add(function (a,b,c,d) {
			console.log(a,b,c,d);
		}, this);
		emitter.onDestroy.add(function () {

		}, this);
		emitter.start(false, 3000, 500);
		console.log(emitter);


		return;
		group.inputEnableChildren = true;
		group.createMultiple(quantity, keys);
		group.children.forEach(function (target) {
			target.anchor.setTo(.5);
		}, this);
		group.onChildInputDown.add(this.damageTarget, this);
	},

		// TODO
	damageTarget: function (target) {
		if (this.GC.isPlaying) {
			/*
			target.damage(1);
			var rndNum = this.rndInt(0,20);
			var keyNum = ('0'+rndNum).slice(-2);
			this.game.global.SoundManager.play({key:'MiniZombieVoice_'+keyNum,volume:.5,});
			this.fireParticle(target);
			var addScore = target.score*this.GOP.bonusScore;
			this.GOP.score += addScore;
			this.addScoreEffect(addScore);
			this.HUD.changeScore(this.GOP.score);
			*/
			console.log(target);
		}
	},

	HUDContainer: function () {
		var c = {
			score:null,
			textStyle:{
				fill: '#800000', // TODO
				stroke:'#FFFFFF',
				strokeThickness: 15,
				multipleStroke:'#800000', // TODO
				multipleStrokeThickness: 10,
			},
		};
		this.genScoreTextSprite(c);
		this.genTimeCounterTextSprite(c);
		// this.genCountLimitTextSprite(c); // TODO del?
		return c;
	},

	genScoreTextSprite: function (HUD) {
		var s = this.game.global.SpriteManager;
		var baseText = 'スコア: ';
		var textSprite = s.genText(this.world.centerX,this.world.height-50,baseText+this.GC.score,HUD.textStyle);
		HUD.changeScore = function (val) {
			textSprite.changeText(baseText+val);
		};
		HUD.score = textSprite;
	},

	genTimeCounterTextSprite: function (HUD) {
		var s = this.game.global.SpriteManager;
		var baseText = '制限時間: ';
		var textSprite = s.genText(20,20,'',HUD.textStyle);
		textSprite.setAnchor(0,0);
		HUD.changeTime = function (val) {
			textSprite.changeText(baseText+val);
		};
		HUD.changeTime(this.GC.leftTime);
	},

	ready: function () {
		this.start();
	},

	start: function () {
		this.GC.isPlaying = true;
	},

	gameOver: function () {
		this.GC.isPlaying = false;
		console.log('gameover');
	},

	/*
	render: function () {
		this.game.debug.ropeSegments(this.fish);
	},
	*/

	test: function () {
		if (__ENV!='prod') {
			this.GC.leftTime = getQuery('time') || this.GC.leftTime;
			// this.GC.CountLimit = getQuery('count') || this.GC.CountLimit;
			// this.game.global.currentChar = getQuery('char') || this.game.global.currentChar;
		}
	},
};