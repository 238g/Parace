BasicGame = {};BasicGame.Boot = function() {};BasicGame.Boot.prototype = {init: function () {this.input.maxPointers = 1;this.stage.backgroundColor = '#424242';this.stage.disableVisibilityChange = true;this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;this.scale.parentIsWindow = true;this.scale.refresh();},preload: function () {this.load.crossOrigin = 'Anonymous';this.load.atlasJSONHash('loading', 'images/loading/loading.png', 'images/loading/loading.json');},create: function () {this.defineConst();this.defineGlobal();this.defineConf();var nextSceenName = (__ENV!='prod') ? getQuery('s') || 'Title' : 'Title';this.game.global.nextSceen = nextSceenName;this.state.start('Preloader');},
	defineConst: function () {
		this.game.const = {
			GAME_TITLE: 'あああああああああ',
			GAME_MAIN_COLOR: '#d494fd',
			EASY_MODE: 1,
			NORMAL_MODE: 2,
			HARD_MODE: 3,
		};
	},
	defineGlobal: function () {
		this.game.global = {
			nextSceen: null,
			loadedOnlyFirst: false,
			SpriteManager: new SpriteManager(this),
			SoundManager: null,
			TweenManager: new TweenManager(this),
			currentMode: 1,
		};
	},
	defineConf: function () {
		var c = this.game.const;
		this.game.conf = {
		};
	},
};
BasicGame.Preloader = function () {};BasicGame.Preloader.prototype = {init: function () { this.sounds = null; },create: function () { this.loadManager(); },loadManager: function () {this.loadingAnim();this.loadingText();this.load.onLoadComplete.add(this.loadComplete, this);this.loadAssets();this.load.start();},loadingAnim: function () {var loadingSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'loading');loadingSprite.anchor.setTo(.5);loadingSprite.scale.setTo(1.5);loadingSprite.animations.add('loading').play(18, true);},loadingText: function () {var textSprite = this.add.text(this.world.centerX, this.world.centerY+120, '0%', { font: '30px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 10 });textSprite.anchor.setTo(.5);this.load.onFileComplete.add(function (progress/*, cacheKey, success, totalLoaded, totalFiles*/) {textSprite.setText(progress+'%');}, this);},
	loadAssets: function () {
		this.load.atlasXML('greySheet', 
			'./images/public/sheets/greySheet.png', './images/public/sheets/greySheet.xml');
		this.load.atlasXML('fishSpritesheet', 
			'./images/AzlimBushi/fishSpritesheet.png', './images/AzlimBushi/fishSpritesheet.xml');
		var imageAssets = {
			// 'StaminaGage':      './images/public/orientation.png', // Dont need
			'Net':      './images/ankimo_drrrr/player.png',
		};
		for (var key in imageAssets) { this.load.image(key, imageAssets[key]); }
		// this.load.spritesheet('CharStones', './images/TenMaKiNinVerG/CharStones.png', 100, 100);
		this.loadAudio();
	},loadAudio: function () {},loadOnlyFirst: function () {if (!this.game.global.loadedOnlyFirst) {	if (this.game.device.desktop) { document.body.style.cursor = 'pointer'; }	this.game.global.SoundManager = new SoundManager(this, this.sounds);	this.game.global.loadedOnlyFirst = true;}},loadComplete: function () {this.loadOnlyFirst();__setSPBrowserColor(this.game.const.GAME_MAIN_COLOR);this.state.start(this.game.global.nextSceen);},
};BasicGame.Title = function () {};BasicGame.Title.prototype = {create: function () {this.play();},play: function () {this.game.global.nextSceen = 'Play';this.state.start(this.game.global.nextSceen);},};
BasicGame.Play = function () {};BasicGame.Play.prototype = {init: function () {this.GC = null;this.HUD = null;},
	create: function () {
		this.physicsController();
		this.inputController();
		// this.gauge();
		this.fish();
		this.count = 0;
	},GameController: function () {return { isPlaying: false, score: 0,};},
	physicsController: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.enableBody = true;
	},
	inputController: function () {
		this.game.input.onDown.add(this.net, this);
	},
	update: function () {
		if (this.sprite) {
			this.physics.arcade.overlap(this.emitter1, this.sprite, this.catch, null, this);
			this.physics.arcade.overlap(this.emitter2, this.sprite, this.catch, null, this);
		}
	},
	catch: function (net, fish) {
		this.count+=1
		console.log(this.count+')CATCH: ',fish.frameName);
		if (net.alive) { // OK
			this.time.events.add(500, function () {
				this.viewSprite.visible = false;
				console.log(4);
				this.count = 0;
			}, this);
		}
		net.kill();
	},
	net: function (pointer) {
		this.viewSprite = this.add.sprite(pointer.x,pointer.y,'Net');
		this.viewSprite.anchor.setTo(.5);
		/////////////
		this.time.events.add(500, function () {
			this.sprite = this.add.sprite(pointer.x,pointer.y,'Net');
			this.sprite.anchor.setTo(.5);
			this.physics.arcade.enable(this.sprite);
			this.sprite.body.setCircle(180, 0, 0);
			// this.sprite.enableBody = true;
		}, this);
	},
	fish: function () {
		// this.fish = this.add.sprite(300,300,'fishSpritesheet', 'FishBlueS');
		emitterFunc.bind(this)(1);
		emitterFunc.bind(this)(2);

		function emitterFunc (num) {
			// Blue/Red/Orange/Green/Eel/Pink/Blowfish
			var fishArr = [
				'FishBlue',
				'FishRed',
				'FishOrange',
				'FishPink',
				'FishGreen',
				'FishEel',
				'FishBlowfish',
				// 'FishBlueBone',
			];
			if (num==1) {
				// this.emitter = this.add.emitter(200, this.world.centerY, 100);
				var emitter = this.add.emitter(0, this.world.centerY, 1000);
				this.emitter1 = emitter;
				// this.emitter.makeParticles('fishSpritesheet', fishArr, 100, true, true);
				// this.emitter.setXSpeed(80, 500);
				// this.emitter.gravity.x = 0;
				emitter.gravity.x = 100;
				emitter.gravity.y = 0;
			} else {
				var emitter = this.add.emitter(this.world.width, this.world.centerY, 1000);
				this.emitter2 = emitter;
				// this.emitter.makeParticles('fishSpritesheet', fishArr, 100, true, true);
				// this.emitter.setXSpeed(-80, -500);
				emitter.setScale(-1,-1,1,1);
				// this.emitter.gravity.x = 0;
				emitter.gravity.x = -100;
				emitter.gravity.y = 0;
				// this.emitter.gravity.isZero();
			}
			emitter.makeParticles('fishSpritesheet', fishArr, 1000, true, false);
			// this.emitter.makeParticles('fishSpritesheet', fishArr, 100, true, true);
			// this.emitter.enableBody = true;
			// this.emitter.enableBodyDebug = true;
			console.log(emitter);
			// this.emitter.gravity.x = 0;
			// this.emitter.gravity = 0;
			emitter.height = this.world.height;
			emitter.maxRotation = 0;
			emitter.minRotation = 0;
			// this.emitter.checkWorldBounds = true;
			// this.emitter.checkWorldBounds = false;
			// this.emitter.outOfBoundsKill = true;
			// emitter.start(false, 12000, 15);
			emitter.start(false, 12000, 1000);
			return;
			// OK
			this.time.events.add(5000, function () {
				emitter.frequency = 100;
			}, this);
		}
	},

	// OK
	gauge: function () {
		var x = 300;
		var y = 300;
		var width = 200;
		var height = 100;
		var gaugebg = this.add.bitmapData(width,height);
		gaugebg.ctx.fillStyle = '#ff00ff';
		gaugebg.ctx.beginPath();
		gaugebg.ctx.rect(0,0,width,height);
		gaugebg.ctx.fill();
		gaugebg.update();

		var bgSprite = this.add.sprite(x,y,gaugebg);
		bgSprite.anchor.setTo(.5);

		var gaugeFront = this.add.bitmapData(width,height);
		gaugeFront.ctx.fillStyle = '#AAAAAA';
		gaugeFront.ctx.beginPath();
		gaugeFront.ctx.rect(0,0,width,height);
		gaugeFront.ctx.fill();
		gaugeFront.update();

		var barSprite = this.add.sprite(x-bgSprite.width/2,y,gaugeFront);
		barSprite.anchor.setTo(0,.5);

		var self = this;
		function setPercent (newValue) {
			if(newValue < 0) newValue = 0;
			if(newValue > 100) newValue = 100;
			var newWidth =  (newValue * width) / 100;
			// setWidth(newWidth);
			self.add.tween(barSprite).to({width: newWidth}, 200, Phaser.Easing.Linear.None, true);
			// console.log(self.tweens.getAll());
			// console.log(self);
		}

		var percent = 80;
		this.time.events.add(1000, function () {
			setPercent(percent);
		}, this);
		return;
		this.time.events.loop(1000, function () {
			percent -= 5;
			setPercent(percent);
		}, this);
	},
	render: function () {
		if (this.sprite) this.game.debug.body(this.sprite);
		for (var key in this.emitter1.children) { this.game.debug.body(this.emitter1.children[key]); }
		for (var key in this.emitter2.children) { this.game.debug.body(this.emitter2.children[key]); }
	},
HUDContainer: function () {	var c = {};	return c;},test: function () {},
};



