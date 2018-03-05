BasicGame.Play = function () {};

BasicGame.Play.prototype = {
	init: function () {
		this.stage.backgroundColor = '#5beea0';
		this.GC = {};
		this.HUD = {};
		this.Panel = {};
		this.treeGroup = null;
	},

	create: function () {
		this.GC = this.gameController();
		this.HUD = this.genHUDContainer();
		this.Panel = this.genPanelContainer();
	},

	update: function () {
		if (this.GC.isPlaying) {
			this.timerController();
		}
	},

	gameController: function () {
		var controller = {};
		controller.timeCounter = 0;
		controller.leftTime = 10;
		controller.currentTreeCount = 0;
		controller.score = 0;
		controller.isPlaying = false;
		// controller.isPlaying = true; // TODO del
		return controller;
	},

	play: function () {
		// TODO countdonw???
		this.GC.isPlaying = true;
		this.genTreeContainer();
	},

	gameOver: function () {
		this.GC.isPlaying = false;
		this.HUD.changeTimerText(0);
		console.log('gameOver');
	},

	timerController: function () {
		this.GC.timeCounter += this.time.elapsed;
		if (this.GC.timeCounter > 1000) {
			this.GC.timeCounter = 0;
			this.GC.leftTime--;
			this.HUD.changeTimerText(this.GC.leftTime);
		}
		if (this.GC.leftTime <= 0) {
			this.gameOver();
		}
	},

	genTreeContainer: function () {
		this.treeGroup = this.add.group();
		var textStyle = {
			fontSize:'80px',
			fill: '#dd5a52',
			stroke:'#FFFFFF',
			strokeThickness: 20,
			multipleStroke:'#dd5a52',
			multipleStrokeThickness: 30,
		};
		this.GC.currentTreeCount = 1;
		var horizontal = 1; // TODO del
		// var horizontal = 6;
		var vertical = 3;
		var maxTreeCount = horizontal*vertical;
		var countArr = [];
		for (var i=1;i<=maxTreeCount;i++) { countArr.push(i); }
		for (var i=0;i<horizontal;i++) {
			for (var j=0;j<vertical;j++) {
				var rndNum = countArr[Math.floor(Math.random() * countArr.length)];
				countArr = countArr.filter(function(v){ return v != rndNum; });
				var x = i*256+(i+1)*9+128;
				var y = j*240+(j+1)*10+260;
				var fireSprite = this.genFireSprite(x, y);
				var treeSprite = this.genTreeSprite(x, y);
				var treeNumberTSprite = this.genTreeNumberTSprite(x, y, rndNum, textStyle);
				treeSprite.count = rndNum;
				treeSprite.maxTreeCount = maxTreeCount;
				treeSprite.fireSprite = fireSprite;
				treeSprite.treeNumberTSprite = treeNumberTSprite;
			}
		}
	},

	genTreeSprite: function (x, y) {
		var treeSprite = this.add.button(x, y, 'Tree', function (pointer) {
			console.log(pointer.count); // TODO del
			if (this.GC.isPlaying) {
				if (pointer.count == this.GC.currentTreeCount) {
					this.fireTree(pointer);
				} else {
					this.missTouch();
				}
			}
		}, this);
		treeSprite.anchor.setTo(.5);
		this.treeGroup.add(treeSprite);
		return treeSprite;
	},

	fireTree: function (pointer) {
		pointer.loadTexture('DeadTree');
		pointer.fireSprite.show();
		pointer.treeNumberTSprite.hide();
		this.GC.currentTreeCount += 1;
		this.GC.score += 1;
		this.HUD.changeScoreText(this.GC.score);
		if (pointer.count == pointer.maxTreeCount) {
			this.clearField();
		}
	},

	missTouch: function () {
		this.GC.leftTime -= 2;
		this.HUD.changeTimerText(this.GC.leftTime);
	},

	clearField: function () {
		var self = this;
		// TODO fixed
		setTimeout(function () {
			self.treeGroup.destroy();
			self.GC.currentTreeCount = 1;
			setTimeout(function() {
				self.genTreeContainer();
			}, 500);
		}, 500);
	},

	genFireSprite: function (x, y) {
		var fireSprite = this.game.global.SpriteManager.genSprite(x, y, 'Fire_'+this.rand(1,2));
		fireSprite.hide();
		fireSprite.anchor.setTo(.5);
		this.treeGroup.add(fireSprite);
		return fireSprite;
	},

	genTreeNumberTSprite: function (x, y, text, textStyle) {
		var textSprite = this.game.global.SpriteManager.genText(x, y, text, textStyle);
		textSprite.anchor.setTo(.5);
		textSprite.addGroup(this.treeGroup);
		return textSprite;
	},

	genHUDContainer: function () {
		var s = this.game.global.SpriteManager;
		var container = {};
		var timerTextSprite = s.genText(this.world.centerX/4, 50, 'タイム: 0');
		container.changeTimerText = function (time) {
			timerTextSprite.changeText('タイム: '+time);
		};
		var scoreTextSprite = s.genText(this.world.centerX, 50, '燃やし度: 0');
		container.changeScoreText = function (score) {
			scoreTextSprite.changeText('燃やし度: '+score);
		};
		return container;
	},

	genPanelContainer: function () {
		var container = {};
		var s = this.game.global.SpriteManager;
		var panelSprite = s.genSprite(this.world.centerX, this.world.centerY, 'greySheet', 'grey_panel');
		panelSprite.scale.setTo(12, 7);
		panelSprite.anchor.setTo(.5);
		var howtoTextSprite = this.genHowtoTextSprite();
		var charSprites = this.genCharSprite(panelSprite);
		container.hide = function () {
			for (var key in charSprites) { 
				charSprites[key].hide(); 
				charSprites[key].words.hide(); 
			}
			panelSprite.hide();
			howtoTextSprite.hide();
		};
		return container;
	},

	genHowtoTextSprite: function () {
		var s = this.game.global.SpriteManager;
		var textStyle = {
			fill: '#48984b',
			stroke:'#FFFFFF',
			multipleStroke:'#48984b',
		};
		var text = 'aaaaaaaaaa';
		// TODO range paragraph
		var textSprite = s.genText(this.world.centerX, this.world.centerY, text, textStyle);
		return textSprite;
	},

	genCharSprite: function (ps) {
		var s = this.game.global.SpriteManager;
		var textStyle = {
			fill: '#dd5a52',
			stroke:'#FFFFFF',
			multipleStroke:'#dd5a52',
		};
		var spriteConf = [
			{key:'Mito_1',x:ps.left+20,ax:0,text:'わたくしではじめる'},
			{key:'Kaede_1',x:ps.right-20,ax:1,text:'燃やせ！エルフの森を燃やせ！'},
		];
		var res = [];
		for (var i=0;i<2;i++) {
			var c = spriteConf[i];
			var btnSprite = s.genButton(c.x,ps.bottom-10,c.key,function () {
				this.Panel.hide();
				this.play();
			}, this);
			btnSprite.anchor.setTo(c.ax,1);
			btnSprite.alpha = .5;
			var words = s.genText(btnSprite.centerX,btnSprite.bottom-10,c.text,textStyle);
			words.hide();
			btnSprite.words = words;
			btnSprite.over(function (p) {
				p.alpha = 1;
				p.words.show();
			}, this);
			btnSprite.out(function (p) {
				p.alpha = .5;
				p.words.hide();
			}, this);
			res.push(btnSprite);
		}
		return res;
	},

	rand: function (min, max) {
		return this.rnd.integerInRange(min, max);
	},

	test: function () {
		if (__ENV!='prod') {
			/*
			var sl = getQuery('sl'); if (sl) { this.GAME.setStageLevel(this.game.const['STAGE_'+sl]); }
			this.GAME.scoreCountToGoToStage2 = getQuery('sc2') || this.GAME.scoreCountToGoToStage2;
			*/
		}
	},
	
	/*
	render: function () {
		this.game.debug.body(this.player);
		for (var key in this.obstacles.children) { this.game.debug.body(this.obstacles.children[key]); }
		this.game.debug.pointer(this.game.input.activePointer);
	},
	*/

};