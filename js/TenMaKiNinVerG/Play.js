BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GC = {};
		this.HUD = {};
		this.stoneGroup = {};
	},

	create: function () {
		this.GC = this.GameController();
		this.inputController();
		this.spawnBoard();
		this.HUD = this.genHUDContainer();
		this.start();
		this.test();
	},

	GameController: function () {
		return {
			isPlaying: false,
			score: 0,
			leftTime: 30,
			timeCounter: 0,
			BOARD_COLS: 8,
			BOARD_ROWS: 10,
			GAME_FRAME: {x:200,y:300},
			STONE_SIZE_SPACED: 66,
			MATCH_MIN: 3,
			allowInput: false,
			selectedStoneStartPos: {x:0,y:0},
			selectedStone: null,
			tempShiftedStone: null,
			selectedStoneTween: null,
		};
	},

	genBgContainer: function () {
	},

	inputController: function () {
		this.input.addMoveCallback(this.slideStone, this);
	},

	soundController: function () {
		var s = this.game.global.SoundManager;
		s.stop('currentBGM');
		// TODO fix time 1800 ->
		this.time.events.add(1800, function () {
			s.stop('currentBGM');
			s.play({key:'HappyBGM_2',isBGM:true,loop:true,volume:1.2,});
		}, this);
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

	spawnBoard: function () {
		this.stoneGroup = this.add.group();
		for (var i=0;i<this.GC.BOARD_COLS;i++) {
			for (var j=0;j<this.GC.BOARD_ROWS;j++) {
				var coord = this.getGameFrameCoordinate(i,j);
				var stone = this.stoneGroup.create(coord.x, coord.y, 'STONES');
				// stone.name = 'stone_'+i+'_'+j;
				stone.inputEnabled = true;
				stone.events.onInputDown.add(this.selectStone, this);
				stone.events.onInputUp.add(this.releaseStone, this);
				this.randomizeStone(stone);
				// this.setStonePos(stone, i, j);
				stone.kill();
			}
		}
		this.removeKilledStones();
		var dropStoneDuration = 10;
		// var dropStoneDuration = this.dropStones();
		this.time.events.add(dropStoneDuration*100, this.refillBoard, this);
		// this.GC.allowInput = false;
		// this.GC.selectedStone = null;
		// this.GC.tempShiftedStone = null;
	},

	getGameFrameCoordinate: function (x,y) {
		return {
			x:x*this.GC.STONE_SIZE_SPACED+this.GC.GAME_FRAME.x,
			y:y*this.GC.STONE_SIZE_SPACED+this.GC.GAME_FRAME.y,
		};
	},

	selectStone: function (stone) {
		if (this.GC.allowInput) {
			this.GC.selectedStone = stone;
			this.GC.selectedStoneStartPos.x = stone.posX;
			this.GC.selectedStoneStartPos.y = stone.posY;
			console.log(stone);
		}
	},

	releaseStone: function () {
		if (this.GC.tempShiftedStone === null) {
			this.GC.selectedStone = null;
			return;
		}
		var canKill = this.checkAndKillStoneMatches(this.GC.selectedStone);
		canKill = this.checkAndKillStoneMatches(this.GC.tempShiftedStone) || canKill;
		if (!canKill) {
			var stone = this.GC.selectedStone;
			if (stone.posX!==this.GC.selectedStoneStartPos.x||stone.posY!==this.GC.selectedStoneStartPos.y) {
				if (this.GC.selectedStoneTween!==null) {
					this.tweens.remove(this.GC.selectedStoneTween);
				}
				this.GC.selectedStoneTween = this.tweenStonePos(stone, this.GC.selectedStoneStartPos.x, this.GC.selectedStoneStartPos.y);
				if (this.GC.tempShiftedStone!==null) {
					this.tweenStonePos(this.GC.tempShiftedStone, stone.posX, stone.posY);
				}
				this.swapStonePosition(stone, this.GC.tempShiftedStone);
				this.GC.tempShiftedStone = null;
			}
		}
		this.removeKilledStones();
		var dropStoneDuration = this.dropStones();
		this.time.events.add(dropStoneDuration*100,this.refillBoard,this);
		this.GC.allowInput = false;
		this.GC.selectedStone = null;
		this.GC.tempShiftedStone = null;
	},

	slideStone: function (pointer, x, y) {
		if (this.GC.selectedStone && pointer.isDown) {
			var coord = this.getStonePos(x,y);
			var cursorStonePosX = coord.x;
			var cursorStonePosY = coord.y;
			console.log(this.GC.selectedStoneStartPos.x, this.GC.selectedStoneStartPos.y, cursorStonePosX, cursorStonePosY);
			console.log(this.checkIfStoneCanBeMovedHere(this.GC.selectedStoneStartPos.x, this.GC.selectedStoneStartPos.y, cursorStonePosX, cursorStonePosY));
			if (this.checkIfStoneCanBeMovedHere(this.GC.selectedStoneStartPos.x, this.GC.selectedStoneStartPos.y, cursorStonePosX, cursorStonePosY)) {
				if (cursorStonePosX!==this.GC.selectedStone.posX||cursorStonePosY!==this.GC.selectedStone.posY) {
					if (this.GC.selectedStoneTween!==null) {
						this.tweens.remove(this.GC.selectedStoneTween);
					}
					this.GC.selectedStoneTween = this.tweenStonePos(this.GC.selectedStone, cursorStonePosX, cursorStonePosY);
					this.stoneGroup.bringToTop(this.GC.selectedStone);
					if (this.GC.tempShiftedStone!==null) {
						this.tweenStonePos(this.GC.tempShiftedStone, this.GC.selectedStone.posX, this.GC.selectedStone.posY);
						this.swapStonePosition(this.GC.selectedStone, this.GC.tempShiftedStone);
					}
					this.GC.tempShiftedStone = this.getStone(cursorStonePosX, cursorStonePosY);
					if (this.GC.tempShiftedStone===this.GC.selectedStone) {
						this.GC.tempShiftedStone = null;
					} else {
						this.tweenStonePos(this.GC.tempShiftedStone, this.GC.selectedStone.posX, this.GC.selectedStone.posY);
						this.swapStonePosition(this.GC.selectedStone, this.GC.tempShiftedStone);
					}
				}
			}
		}
	},

	checkIfStoneCanBeMovedHere: function (fromPosX, fromPosY, toPosX, toPosY) {
		if (toPosY<0||toPosX>this.GC.BOARD_COLS||toPosY<0||toPosY>=this.GC.BOARD_ROWS) {
			return false;
		}
		if (fromPosX===toPosX&&fromPosY>=toPosY-1&&fromPosY<=toPosY+1) {
			return true;
		}
		if (fromPosY===toPosY&&fromPosX>=toPosX-1&&fromPosX<=toPosX+1) {
			return true;
		}
		return false;
	},

	getStonePos: function (x,y) {
		return {
			x:Math.floor((x-this.GC.GAME_FRAME.x)/this.GC.STONE_SIZE_SPACED),
			y:Math.floor((y-this.GC.GAME_FRAME.y)/this.GC.STONE_SIZE_SPACED),
		};
	},

	swapStonePosition: function (stone1, stone2) {
		var tempPosX = stone1.posX;
		var tempPosY = stone1.posY;
		this.setStonePos(stone1, stone2.posX, stone2.posY);
		this.setStonePos(stone2, tempPosX, tempPosY);
	},

	randomizeStone: function (stone) {
		var TotalFrame = this.game.conf.ModeInfo[this.game.global.currentMode].TotalFrame;
		stone.frame = +this.rndInt(0,TotalFrame);
		// stone.frame = this.rnd.integerInRange(0,stone.animations.frameTotal-1);
	},

	setStonePos: function (stone, posX, posY) {
		stone.posX = posX;
		stone.posY = posY;
		stone.id = this.calcStoneId(posX, posY);
	},

	calcStoneId: function (posX, posY) {
		return posX + posY * this.GC.BOARD_COLS;
	},

	removeKilledStones: function () {
		this.stoneGroup.forEach(function (stone) {
			if (!stone.alive) {
				this.setStonePos(stone, -1, -1);
			}
		}, this);
	},

	dropStones: function () {
		var dropRowCountMax = 0;
		for (var i=0;i<this.GC.BOARD_COLS;i++) {
			var dropRowCount = 0;
			for (var j=this.GC.BOARD_ROWS-1;j>=0;j--) {
				var stone = this.getStone(i, j);
				if (stone === null) {
					dropRowCount++;
				} else if (dropRowCount > 0) {
					stone.dirty = true;
					this.setStonePos(stone, stone.posX, stone.posY + dropRowCount);
					this.tweenStonePos(stone, stone.posX, stone.posY, dropRowCount);
				}
			}
			dropRowCountMax = Math.max(dropRowCount, dropRowCountMax);
		}
		return dropRowCountMax;
	},

	getStone: function (posX, posY) {
		return this.stoneGroup.iterate('id', this.calcStoneId(posX, posY), Phaser.Group.RETURN_CHILD);
	},

	tweenStonePos: function (stone, newPosX, newPosY, durationMultiplier) {
		if (durationMultiplier === null || typeof durationMultiplier === 'undefined') {
			durationMultiplier = 1;
		}
		var coord = this.getGameFrameCoordinate(newPosX, newPosY);
		return this.add.tween(stone).to(
			{x:coord.x,y:coord.y},
			100*durationMultiplier, Phaser.Easing.Linear.None, true
		);
	},

	refillBoard: function () {
		var maxStonesMissingFromCol = 0;
		for (var i=0;i<this.GC.BOARD_COLS;i++) {
			var stonesMissingFromCol = 0;
			for (var j=this.GC.BOARD_ROWS-1;j>=0;j--) {
				var stone = this.getStone(i,j);
				if (stone === null) {
					stonesMissingFromCol++;
					stone = this.stoneGroup.getFirstDead();
					var coord = this.getGameFrameCoordinate(i,j);
					stone.reset(coord.x+this.rndInt(-300,300),-stonesMissingFromCol*this.GC.STONE_SIZE_SPACED+this.world.randomY);
					stone.dirty = true;
					this.randomizeStone(stone);
					this.setStonePos(stone, i, j);
					this.tweenStonePos(stone, stone.posX, stone.posY, stonesMissingFromCol*2);
				}
			}
			maxStonesMissingFromCol = Math.max(maxStonesMissingFromCol,stonesMissingFromCol);
		}
		this.time.events.add(maxStonesMissingFromCol*2*100,this.boardRefilled,this);
	},

	boardRefilled: function () {
		var canKill = false;
		for (var i=0;i<this.GC.BOARD_COLS;i++) {
			for (var j=this.GC.BOARD_ROWS-1;j>=0;j--) {
				var stone = this.getStone(i,j);
				if (stone.dirty) {
					stone.dirty = false;
					canKill = this.checkAndKillStoneMatches(stone) || canKill;
				}
			}
		}
		if (canKill) {
			this.removeKilledStones();
			var dropStoneDuration = this.dropStones();
			this.time.events.add(dropStoneDuration*100, this.refillBoard, this);
			this.GC.allowInput = false;
		} else {
			this.GC.allowInput = true;
		}
	},

	checkAndKillStoneMatches: function (stone) {
		if (stone === null) { return; }
		var canKill = false;
		var countUp = this.countSameColorStones(stone, 0, -1);
		var countDown = this.countSameColorStones(stone, 0, 1);
		var countLeft = this.countSameColorStones(stone, -1, 0);
		var countRight = this.countSameColorStones(stone, 1, 0);
		var countHoriz = countLeft + countRight + 1;
		var countVert = countUp + countDown + 1;
		if (countVert>=this.GC.MATCH_MIN) {
			this.killStoneRange(stone.posX,stone.posY-countUp,stone.posX,stone.posY+countDown);
			canKill = true;
		}
		if (countHoriz>=this.GC.MATCH_MIN) {
			this.killStoneRange(stone.posX-countLeft,stone.posY,stone.posX+countRight,stone.posY);
			canKill = true;
		}
		return canKill;
	},

	countSameColorStones: function (startStone, moveX, moveY) {
		var curX = startStone.posX + moveX;
		var curY = startStone.posY + moveY;
		var count = 0;
		while (curX>=0 && curY>=0 && curX<this.GC.BOARD_COLS && curY<this.GC.BOARD_ROWS && this.getStoneColor(this.getStone(curX,curY))===this.getStoneColor(startStone)) {
			count++;
			curX += moveX;
			curY += moveY;
		}
		return count;
	},

	getStoneColor: function (stone) {
		return stone.frame;
	},

	killStoneRange: function (fromX, fromY, toX, toY) {
		fromX = Phaser.Math.clamp(fromX, 0, this.GC.BOARD_COLS-1);
		fromY = Phaser.Math.clamp(fromY, 0, this.GC.BOARD_ROWS-1);
		toX = Phaser.Math.clamp(toX, 0, this.GC.BOARD_COLS-1);
		toY = Phaser.Math.clamp(toY, 0, this.GC.BOARD_ROWS-1);
		for (var i=fromX;i<=toX;i++) {
			for (var j=fromY;j<=toY;j++) {
				var stone = this.getStone(i,j);
				stone.kill();
			}
		}
	},

	genHUDContainer: function () {
		var c = {score:null,gameover:null,textStyle:null,};
		c.textStyle = {
			fill: '#a0522d', // TODO color
			stroke:'#FFFFFF',
			strokeThickness: 10,
			multipleStroke:'#a0522d', // TODO color
			multipleStrokeThickness: 10,
		};
		this.genScoreTextSprite(c);
		this.genTimeCounterTextSprite(c);
		return c;
	},

	genScoreTextSprite: function (HUD) {
		var s = this.game.global.SpriteManager;
		var baseText = 'スコア: ';
		var textSprite = s.genText(this.world.centerX,50,baseText+this.GC.score,HUD.textStyle);
		HUD.changeScore = function (val) {
			textSprite.changeText(baseText+val);
		};
		HUD.score = textSprite;
	},

	genTimeCounterTextSprite: function (HUD) {
		var s = this.game.global.SpriteManager;
		var baseText = 'タイム: ';
		var textSprite = s.genText(120,50,baseText+this.GC.leftTime,HUD.textStyle);
		HUD.changeTime = function (val) {
			textSprite.changeText(baseText+val);
		};
	},

	addScoreEffect: function (text) {
		text = text+'';
		var s = this.game.global.SpriteManager;
		var t = this.game.global.TweenManager;
		var textStyle = {stroke:'#00ff00'};
		var x = this.HUD.score.right;
		if (text[0]=='-') {
			textStyle.stroke = '#dd5a52';
			x += 150;
		}
		var textSprite = s.genText(x, this.HUD.score.y, text,textStyle);
		var tween = t.moveA(textSprite, {y:'+50'});
		t.onComplete(tween,function () {
			setTimeout(function () {
				textSprite.destroy();
			},this);
		},this);
		tween.start();
	},

	ready: function () {
	},

	start: function () {
		this.GC.isPlaying = true;
	},

	gameOver: function () {
		this.GC.isPlaying = false;
		// this.time.events.removeAll();
		// this.HUD.showGameOver();
		console.log("game over");
	},

	rndInt: function (min, max) {
		return this.rnd.integerInRange(min, max);
	},

	test: function () {
		if (__ENV!='prod') {
			this.GC.leftTime = getQuery('time') || this.GC.leftTime;
		}
	},
};