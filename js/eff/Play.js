BasicGame.Play = function () {};

BasicGame.Play.prototype = {
	init: function () {
		this.stage.backgroundColor = '#5beea0';
		this.currentCount = 0;
	},

	create: function () {
		this.genTreeContainer();
	},

	update: function () {
	},

	genTreeContainer: function () {
		var textStyle = {
			fontSize:'80px',
			fill: '#dd5a52',
			stroke:'#FFFFFF',
			strokeThickness: 20,
			multipleStroke:'#dd5a52',
			multipleStrokeThickness: 30,
		};
		var s = this.game.global.SpriteManager;
		this.currentCount = 1;
		// var horizontal = 1; // TODO del
		var horizontal = 6;
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
				var fireSprite = s.genSprite(x, y, 'Fire_'+this.rand(1,2));
				fireSprite.hide();
				fireSprite.anchor.setTo(.5);
				var buttonSprite = this.add.button(x, y, 'Tree', function (pointer/*, event*/) {
					console.log(pointer.count);
					if (pointer.count == this.currentCount) {
						pointer.loadTexture('DeadTree');
						pointer.fireSprite.show();
						pointer.textSprite.hide();
						this.currentCount += 1;
						if (pointer.count == maxTreeCount) {
							console.log('nextStage');
						}
					} else {
						console.log('damage');
					}
				}, this);
				buttonSprite.anchor.setTo(.5);
				var textSprite = s.genText(x, y, rndNum, textStyle);
				textSprite.anchor.setTo(.5);
				buttonSprite.count = rndNum;
				buttonSprite.fireSprite = fireSprite;
				buttonSprite.textSprite = textSprite;
			}
		}
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