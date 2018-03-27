Middleware = function (game,BasicGame,BootClass) { this.initialize(game,BasicGame,BootClass); };
Middleware.prototype = {
	initVar: function () {
		this.game = null;
		this.S = null;
		this.T = null;
		this.SE = null;
		this.H = null;
		this.currentScene = null;
		this.orientated = null;
		this.nextScene = null;
		this.global = {};
		this.const = {};
		this.conf = {};
	},
	initialize: function (game,BasicGame,BootClass) {
		this.initVar();
		game.M = this;
		for (var className in BasicGame) game.state.add(className, BasicGame[className]);
		this.S = new this.SpriteManager(game, this);
		this.T = new this.TweenManager(game, this);
		this.SE = new this.SoundManager(game, this);
		this.H = new this.Helper(this);
		this.currentScene = BootClass;
		this.game = game;
		game.state.start(BootClass);
		this.setMiddleware();
	},
	BootInit: function (orientation) {
		var Scene = this.getScene();
		Scene.input.maxPointers = 1;
		Scene.stage.backgroundColor = '#424242';
		Scene.stage.disableVisibilityChange = true;
		Scene.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		if (orientation) {
			// TODO test
			Scene.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

			if (!Scene.game.device.desktop) {
				Scene.scale.forceOrientation(true, false);
				Scene.scale.enterIncorrectOrientation.add(function () {
					Middleware.orientated = false;
					document.getElementById('orientation').style.display = 'block';
				}, Scene);
				Scene.scale.leaveIncorrectOrientation.add(function () {
					Middleware.orientated = true;
					document.getElementById('orientation').style.display = 'none';
				}, Scene);
			}
		} else {
			if (Scene.game.device.desktop) {
				Scene.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
			} else {
				Scene.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
			}
		}
		Scene.scale.parentIsWindow = true;
		Scene.scale.refresh();
	},
	NextScene: function (nextScene) {
		var Scene = this.getScene();
		Scene.state.start(nextScene);
		this.currentScene = nextScene;
		this.setMiddleware();
	},
	getScene: function () { return this.game.state.states[this.currentScene]; },
	setMiddleware: function () { this.getScene().M = this; },
	defineGlobal: function (val) { this.global = val; },
	setGlobal: function (key, val) { this.global[key] = val; },
	getGlobal: function (key) { return this.global[key]; },
	defineConst: function (val) { this.const = val; },
	getConst: function (key) { return this.const[key]; },
	defineConf: function (val) { this.conf = val; },
	setConf: function (key, val) { this.conf[key] = val; },
	getConf: function (key) { return this.conf[key]; },
};

/////////////////////////////////////////////////////////////////////

Middleware.prototype.SpriteManager = function (game, M) { this.initialize(game, M); };
Middleware.prototype.SpriteManager.prototype = {
	initVar: function () {
		this.game = null;
		this.M = null;
	},
	initialize: function (game, M) {
		this.initVar();
		this.game = game;
		this.M = M;
	},
	genSprite: function (x, y, key, frame) {
		var Scene = this.M.getScene();
		var sprite = Scene.add.sprite(x, y, key, frame);
		sprite.show = function () { sprite.visible = true; };
		sprite.hide = function () { sprite.visible = false; };
		sprite.UonInputOver = function (func) {
			sprite.inputEnabled = true;
			sprite.events.onInputOver.add(func,Scene);
		};
		sprite.UonInputOut = function (func) {
			sprite.inputEnabled = true;
			sprite.events.onInputOut.add(func,Scene);
		};
		sprite.UonInputDown = function (func) {
			sprite.inputEnabled = true;
			sprite.events.onInputDown.add(func,Scene);
		};
		sprite.UonInputUp = function (func) {
			sprite.inputEnabled = true;
			sprite.events.onInputUp.add(func,Scene);
		};
		return sprite;
	},
	genButton: function (x, y, key, func) {
		var Scene = this.M.getScene();
		var btnSprite = Scene.add.button(x, y, key, func, Scene);
		btnSprite.show = function () { btnSprite.visible = true; };
		btnSprite.hide = function () { btnSprite.visible = false; };
		btnSprite.UonInputDown = function (func) { btnSprite.onInputDown.add(func, Scene); };
		btnSprite.UonInputOver = function (func) { btnSprite.onInputOver.add(func, Scene); };
		btnSprite.UonInputOut = function (func) { btnSprite.onInputOut.add(func, Scene); };
		btnSprite.UonInputUp = function (func) { btnSprite.onInputUp.add(func, Scene); };
		return btnSprite;
	},
	genText: function (x, y, text, textStyle) {
		var Scene = this.M.getScene();
		var T = this.M.T;
		var commonTextStyle = { 
			fontSize: '50px', 
			fill: '#FFFFFF', 
			align: 'center', 
			stroke: '#000000', 
			strokeThickness: 10, 
			multipleStroke: null,
			multipleStrokeThickness: 10,
		};
		var multipleTextStyle = {
			fontSize: '50px', 
			fill: '#FFFFFF', 
			align: 'center', 
			stroke: '#000000', 
			strokeThickness: 10, 
		};
		for (var key in textStyle) {
			commonTextStyle[key] = textStyle[key];
			multipleTextStyle[key] = textStyle[key];
		}
		var multipleTextSprite = { SExist: false };
		if (commonTextStyle.multipleStroke) {
			multipleTextStyle.fill = commonTextStyle.multipleStroke;
			multipleTextStyle.stroke = commonTextStyle.multipleStroke;
			multipleTextStyle.strokeThickness = commonTextStyle.strokeThickness+commonTextStyle.multipleStrokeThickness;
			multipleTextSprite = Scene.add.text(x, y, text, multipleTextStyle);
			multipleTextSprite.anchor.setTo(.5);
			multipleTextSprite.lineSpacing = -commonTextStyle.multipleStrokeThickness;
			multipleTextSprite.SExist = true;
		}
		var textSprite = Scene.add.text(x, y, text, commonTextStyle);
		textSprite.textTween = {};
		if (multipleTextSprite.SExist) textSprite.multipleTextTween ={};
		textSprite.anchor.setTo(.5);
		textSprite.multipleTextSprite = multipleTextSprite;
		textSprite.show = function () {
			textSprite.visible = true;
			multipleTextSprite.visible = true;
		};
		textSprite.hide = function () {
			textSprite.visible = false;
			multipleTextSprite.visible = false;
		};
		textSprite.changeText = function (text) {
			textSprite.setText(text);
			if (multipleTextSprite.SExist) multipleTextSprite.setText(text);
		};
		textSprite.setScale = function (x, y) {
			textSprite.scale.setTo(x, y);
			if (multipleTextSprite.SExist) multipleTextSprite.scale.setTo(x, y);
		};
		textSprite.setAnchor = function (x, y) {
			textSprite.anchor.setTo(x, y);
			if (multipleTextSprite.SExist) multipleTextSprite.anchor.setTo(x, y);
		};
		textSprite.addMove = function (addX, addY) {
			var x = textSprite.x+addX;
			var y = textSprite.y+addY;
			textSprite.move(x,y);
		};
		textSprite.move = function (x, y) {
			textSprite.x = x;
			textSprite.y = y;
			multipleTextSprite.x = x;
			multipleTextSprite.y = y;
		};
		textSprite.setTextStyle = function (newTextStyle) {
			for (var key in newTextStyle) {
				if (textSprite[key]) textSprite[key] = newTextStyle[key];
				if (multipleTextSprite[key]) multipleTextSprite[key] = newTextStyle[key]
			}
		};
		textSprite.addGroup = function (group) {
			group.add(multipleTextSprite);
			group.add(textSprite);
		};
		textSprite.UonInputOver = function (func) {
			textSprite.inputEnabled = true;
			textSprite.events.onInputOver.add(func,Scene);
		};
		textSprite.UonInputOut = function (func) {
			textSprite.inputEnabled = true;
			textSprite.events.onInputOut.add(func,Scene);
		};
		textSprite.UonInputDown = function (func) {
			textSprite.inputEnabled = true;
			textSprite.events.onInputDown.add(func,Scene);
		};
		textSprite.UonInputUp = function (func) {
			textSprite.inputEnabled = true;
			textSprite.events.onInputUp.add(func,Scene);
		};
		textSprite.addTween = function (tween, option) {
			console.log(T[tween]);
			textSprite.textTween[tween] = T[tween](textSprite,option);
			if (multipleTextSprite.SExist) textSprite.multipleTextTween[tween] = T[tween](multipleTextSprite,option);
		};
		textSprite.startTween = function (tween) {
			textSprite.textTween[tween].start();
			if (multipleTextSprite.SExist) textSprite.multipleTextTween[tween].start();
		};
		return textSprite;
	},
	BasicGrayLabel: function (x,y,func,text,textStyle) {
		var labelContainer = {
			T: this.M.T,
			btnSprite: null,
			textSprite: null,
			btnTween: {},
			textTween: {},
			changeText: null,
		};
		var btnSprite = this.genButton(x,y,'greySheet',func);
		var textSprite = this.genText(x,y,text,textStyle);
		btnSprite.setFrames('grey_button00','grey_button00','grey_button01','grey_button00');
		btnSprite.anchor.setTo(.5);
		btnSprite.scale.setTo(2.2);
		btnSprite.textSprite = textSprite;
		labelContainer.btnSprite = btnSprite;
		labelContainer.textSprite = textSprite;
		labelContainer.show = function () {
			btnSprite.show();
			textSprite.show();
		};
		labelContainer.hide = function () {
			btnSprite.hide();
			textSprite.hide();
		};
		labelContainer.addTween = function (tween, option) {
			this.btnTween[tween] = this.T[tween](btnSprite,option);
			textSprite.addTween(tween, option);
		};
		labelContainer.startTween = function (tween) {
			this.btnTween[tween].start();
			textSprite.startTween(tween);
		};
		labelContainer.changeText = textSprite.changeText;
		return labelContainer;
	},
	BasicLoadingAnim: function () {
		var Scene = this.M.getScene();
		var loadingSprite = Scene.add.sprite(Scene.world.centerX,Scene.world.centerY,'loading');
		loadingSprite.anchor.setTo(.5);
		loadingSprite.scale.setTo(1.5);
		loadingSprite.animations.add('loading').play(18, true);
	},
	BasicLoadingText: function () {
		var Scene = this.M.getScene();
		var textSprite = Scene.add.text(
			Scene.world.centerX, Scene.world.centerY+120, '0%', 
			{ font: '30px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 10 }
		);
		textSprite.anchor.setTo(.5);
		Scene.load.onFileComplete.add(function (progress/*, cacheKey, success, totalLoaded, totalFiles*/) {
			textSprite.setText(progress+'%');
		}, Scene);
	},
};

/////////////////////////////////////////////////////////////////////

Middleware.prototype.TweenManager = function (game, M) { this.initialize(game, M); };
Middleware.prototype.TweenManager.prototype = {
	initVar: function () {
		this.game = null;
		this.M = null;
	},
	initialize: function (game, M) {
		this.initVar();
		this.game = game;
		this.M = M;
	},
	// [duration, delay]
	beatA: function (target, option) {
		var Scene = this.M.getScene();
		option = option || {};
		return Scene.add.tween(target.scale).to(
			{x: '+.1', y: '+.1'}, option.duration, 
			Phaser.Easing.Sinusoidal.Out, false, option.delay, -1, true);
	},
	// [duration, scale, delay]
	popUpA: function (target, option) {
		var Scene = this.M.getScene();
		option = option || {};
		option.scale = option.scale || {};
		return Scene.add.tween(target.scale).to(
			{x: (scale.x || 1), y: (scale.y || 1)}, option.duration, 
			Phaser.Easing.Sinusoidal.Out, false, option.delay);
	},
	// [duration, scale, delay]
	popUpB: function (target, option) {
		var Scene = this.M.getScene();
		option = option || {};
		option.scale = option.scale || {};
		return Scene.add.tween(target.scale).to(
			{x: (scale.x || 1), y: (scale.y || 1)}, option.duration, 
			Phaser.Easing.Back.Out, false, option.delay);
	},
	// xy[, duration, delay]
	moveA: function (target, option) {
		var Scene = this.M.getScene();
		option = option || {};
		return Scene.add.tween(target).to(
			option.xy, option.duration, 
			Phaser.Easing.Back.Out, false, option.delay);
	},
	// xy[, duration, delay]
	moveB: function (target, option) {
		var Scene = this.M.getScene();
		option = option || {};
		var tween = this.self.add.tween(target).to(
			option.xy, option.duration, 
			Phaser.Easing.Linear.None, false, option.delay);
		return tween;
	},
	// [duration, delay]
	fadeInA: function (target, option) {
		var Scene = this.M.getScene();
		option = option || {};
		return Scene.add.tween(target).to(
			{alpha:1}, option.duration, 
			Phaser.Easing.Linear.None, false, option.delay);
	},
	// [duration, delay]
	fadeOutA: function (target, option) {
		var Scene = this.M.getScene();
		option = option || {};
		return this.self.add.tween(target).to(
			{alpha:0}, option.duration, 
			Phaser.Easing.Linear.None, false, option.delay);
	},
	// [durations, delay]
	stressA: function (target, option) {
		var Scene = this.M.getScene();
		option = option || {};
		durations = option.durations||[200,100];
		delay = option.delay||500;
		var startTween = Scene.add.tween(target.scale).to({x:'+.1'},durations[0],Phaser.Easing.Linear.None,false,delay);
		var endTween = Scene.add.tween(target.scale).to({x:'-.1'},durations[0],Phaser.Easing.Linear.None);
		var yoyoTween = Scene.add.tween(target).to({angle:5},durations[1],Phaser.Easing.Linear.None,false,0,2,true);
		startTween.chain(yoyoTween);
		this.onComplete(startTween, function () {
			target.angle = -5;
		});
		this.onComplete(yoyoTween, function () {
			target.angle = 0;
			endTween.start();
		});
		this.onComplete(endTween, function () {
			startTween.start();
		});
		return startTween;
	},
	// [duration, delay]
	slideshow: function (group, option) {
		var slideshow = this.slideshow;
		var toBackSprite = group.getTop();
		toBackSprite.alpha = 1;
		var toTopSprite = group.getBottom();
		group.bringToTop(toTopSprite);
		var tween = this.fadeInA(toTopSprite, option);
		this.onComplete(tween, function () {
			toBackSprite.alpha = 0;
			slideshow(group, option);
		});
		tween.start();
	},
	onComplete: function (target, func) {
		var Scene = this.M.getScene();
		target.onComplete.add(func, Scene);
	},
};

/////////////////////////////////////////////////////////////////////

Middleware.prototype.SoundManager = function (game, M) { this.initialize(game, M); };
Middleware.prototype.SoundManager.prototype = {
	initVar: function () {
		this.game = null;
		this.M = null;
		this.sounds = null;
	},
	initialize: function (game, M) {
		this.initVar();
		this.game = game;
		this.M = M;
	},
	setSounds: function (soundsObj) {
		this.sounds = { currentBGM: null, };
		if (typeof soundsObj != 'object') soundsObj = this.game.cache._cache.sound;
		for (var key in soundsObj) {
			this.sounds[key] = this.game.add.audio(key);
			this.sounds[key].onComplete = false;
		}
	},
	play: function (key, option) {
		var sound = this.sounds[key];
		if (option.loop) sound.loop = true;
		if (option.volume) sound.volume = option.volume;
		if (option.isBGM) this.sounds.currentBGM = sound;
		sound.play();
	},
	stop: function (key) {
		if (this.isPlaying(key)) this.sounds[key].stop();
	},
	onComplete: function (key, func) {
		var Scene = this.M.getScene();
		var sound = this.getSound(key);
		if (sound && sound.onComplete == false) {
			sound.onComplete = true;
			sound.onStop.add(func, Scene);
		}
	},
	setVolume: function (key, val) {
		this.sounds[key].volume = val;
	},
	fadeOut: function (key, duration) {
		if (this.isPlaying(key)) this.sounds[key].fadeOut(duration);
	},
	isPlaying: function (key) {
		var sound = this.getSound(key);
		return sound ? sound.isPlaying : false;
	},
	getSound: function (key) {
		return this.sounds[key] || false;
	},
};

/////////////////////////////////////////////////////////////////////

Middleware.prototype.Helper = function (M) { this.initialize(M); };
Middleware.prototype.Helper.prototype = {
	initVar: function () {
		this.M = null;
	},
	initialize: function (M) {
		this.initVar();
		this.M = M;
	},
	getQuery: function (key) {
		var querys = window.location.search.slice(1).split('&');
		for (var i in querys) {
			var arr = querys[i].split('=');
			if (key == arr[0]) return arr[1];
		}
		return false;
	},
	getYmd: function () {
		var Y = new Date().getFullYear();
		var m = ('0'+(new Date().getMonth()+1)).slice(-2);
		var d = ('0'+(new Date().getDate())).slice(-2);
		return Y+'-'+m+'-'+d;
	},
	setSPBrowserColor: function (colorString) {
		if (document.getElementsByName('theme-color')) document.getElementsByName('theme-color')[0].setAttribute('content', colorString);
	},
	formatComma: function (val) {
		return String(val).replace(/(\d)(?=(\d{3})+$)/g,'$1,');
	},
	copyJson: function (json) {
		var newJson = {};
		for (var key in json) newJson[key] = json[key];
		return newJson;
	},
};