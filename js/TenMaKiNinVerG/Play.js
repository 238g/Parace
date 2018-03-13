BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GC = null;
		this.HUD = null;
		this.stoneGroup = null;
		this.ModeInfo = null;
	},

	create: function () {
		this.GC = this.GameController();
		this.time.reset();
		this.genBgContainer();
		// TODO skill btn
		this.inputController();
		this.spawnBoard();
		this.HUD = this.genHUDContainer();
		this.ready();
		this.test();
	},

	GameController: function () {
		this.ModeInfo = this.game.conf.ModeInfo[this.game.global.currentMode];
		return {
			isPlaying: false,
			touched: false,
			score: 0,
			mashScore: 0,
			TimeLimit: this.ModeInfo.TimeLimit,
			CountLimit: 20,
			BOARD_COLS: 8,
			BOARD_ROWS: 10,
			GAME_FRAME: {x:30,y:300},
			STONE_SIZE_SPACED: 105,
			MATCH_MIN: 3,
			allowInput: false,
			selectedStoneStartPos: {x:0,y:0},
			selectedStone: null,
			tempShiftedStone: null,
			selectedStoneTween: null,
			stoneFrames: this.makeStoneFrames(),
			isMovingStone: false,
		};
	},

	makeStoneFrames: function () {
		var baseFrames = [0,1,2,3,4];
		if (this.ModeInfo.TotalFrame < 5) {
			Phaser.ArrayUtils.removeRandomItem(baseFrames);
		}
		return baseFrames;
	},

	genBgContainer: function () {
		// TODO
		// per char bg
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
		} else if (this.GC.isMovingStone === false) {
			this.GC.isMovingStone = 'END';
			this.time.events.add(1500,this.genResultPanelContainer,this);
		}
	},

	timeManager: function () {
		var leftTime = this.GC.TimeLimit - this.time.totalElapsedSeconds();
		this.HUD.changeTime(leftTime);
		if (leftTime <= 0) {
			this.gameOverTime();
		}
	},

	spawnBoard: function () {
		this.stoneGroup = this.add.group();
		for (var i=0;i<this.GC.BOARD_COLS;i++) {
			for (var j=0;j<this.GC.BOARD_ROWS;j++) {
				var coord = this.getGameFrameCoordinate(i,j);
				var stone = this.stoneGroup.create(coord.x, coord.y, 'CharStones');
				stone.inputEnabled = true;
				stone.events.onInputDown.add(this.selectStone, this);
				stone.events.onInputUp.add(this.releaseStone, this);
				this.randomizeStone(stone);
				// this.setStonePos(stone, i, j);
				stone.kill();
			}
		}
		this.removeKilledStones();
		var dropStoneDuration = 10; // TODO ready total time (*100)
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
		if (this.GC.allowInput && this.GC.isPlaying) {
			this.GC.touched = true;
			this.GC.selectedStone = stone;
			this.GC.selectedStoneStartPos.x = stone.posX;
			this.GC.selectedStoneStartPos.y = stone.posY;
			stone.scale.setTo(1.4);
		}
	},

	releaseStone: function () {
		if (this.GC.selectedStone) {
			this.GC.selectedStone.scale.setTo(1);
		}
		if (this.GC.tempShiftedStone === null || this.GC.isPlaying === false) {
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
		this.GC.CountLimit--;
		this.HUD.changeCountLimit(this.GC.CountLimit);
		if (this.GC.CountLimit<=0) {
			this.gameOverCount();
		}
	},

	slideStone: function (pointer, x, y) {
		if (this.GC.selectedStone && pointer.isDown && this.GC.isPlaying) {
			var coord = this.getStonePos(x,y);
			var cursorStonePosX = coord.x;
			var cursorStonePosY = coord.y;
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
		var TotalFrame = this.ModeInfo.TotalFrame;
		stone.frame = this.GC.stoneFrames[this.rndInt(0,TotalFrame-1)];
		// stone.frame = this.rnd.integerInRange(0,stone.animations.frameTotal-1); // ORIGIN
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
		this.GC.mashScore += 1;
		if (this.GC.mashScore>1) {
			// TODO combo tween
		}
		this.GC.isMovingStone = true;
		var maxStonesMissingFromCol = 0;
		for (var i=0;i<this.GC.BOARD_COLS;i++) {
			var stonesMissingFromCol = 0;
			for (var j=this.GC.BOARD_ROWS-1;j>=0;j--) {
				var stone = this.getStone(i,j);
				if (stone === null) {
					stonesMissingFromCol++;
					stone = this.stoneGroup.getFirstDead();
					var coord = this.getGameFrameCoordinate(i,j);
					if (this.game.global.currentMode == this.game.const.HARD_MODE) {
						stone.reset(this.rnd.pick([0,this.world.width]),this.world.randomY);
					} else if (this.game.global.currentMode == this.game.const.NORMAL_MODE) {
						stone.reset(this.rnd.pick([0,this.world.width]),-stonesMissingFromCol*this.GC.STONE_SIZE_SPACED);
					} else {
						stone.reset(coord.x,-stonesMissingFromCol*this.GC.STONE_SIZE_SPACED);
					}
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
			this.GC.isMovingStone = false;
			this.GC.mashScore = 1;
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
			this.addScore(countVert);
			canKill = true;
		}
		if (countHoriz>=this.GC.MATCH_MIN) {
			this.killStoneRange(stone.posX-countLeft,stone.posY,stone.posX+countRight,stone.posY);
			this.addScore(countHoriz);
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

	addScore: function (stoneCount) {
		var bonusScore = this.ModeInfo.BonusScore;
		if (this.GC.touched) {
			var addScore = 73
				*stoneCount*stoneCount*stoneCount*stoneCount*stoneCount
				*bonusScore
				*this.GC.mashScore*this.GC.mashScore;
		} else {
			var addScore = 73
				*stoneCount
				*bonusScore;
		}
		this.GC.score += addScore;
		this.HUD.changeScore(this.GC.score);
		this.addScoreEffect(addScore);
	},

	genHUDContainer: function () {
		var c = {
			score:null,
			textStyle:{
				fill: '#800000',
				stroke:'#FFFFFF',
				strokeThickness: 10,
				multipleStroke:'#800000',
				multipleStrokeThickness: 10,
			},
		};
		this.genScoreTextSprite(c);
		this.genTimeCounterTextSprite(c);
		this.genCountLimitTextSprite(c);
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
		var textSprite = s.genText(10,10,'',HUD.textStyle);
		textSprite.setAnchor(0,0);
		HUD.changeTime = function (val) {
			textSprite.changeText(baseText+val.toFixed(2));
		};
		HUD.changeTime(this.GC.TimeLimit);
	},

	genCountLimitTextSprite: function (HUD) {
		var s = this.game.global.SpriteManager;
		var baseText = '残り移動回数: ';
		var textSprite = s.genText(this.world.width-10,10,'',HUD.textStyle);
		textSprite.setAnchor(1,0);
		HUD.changeCountLimit = function (val) {
			textSprite.changeText(baseText+val);
		};
		HUD.changeCountLimit(this.GC.CountLimit);
	},

	addScoreEffect: function (text) {
		text = text+'';
		var s = this.game.global.SpriteManager;
		var t = this.game.global.TweenManager;
		var textStyle = {stroke:'#00ff00'};
		var x = this.HUD.score.right;
		if (text[0]=='-') {
			textStyle.stroke = '#dd5a52';
			x = this.HUD.score.right;
		} else if (text[0]=='+') {
		} else {
			text = '+'+text;
		}
		var textSprite = s.genText(x, this.HUD.score.y, text,textStyle);
		var tween = t.moveA(textSprite, {y:'-50'}, this.rndInt(800,1200));
		t.onComplete(tween,function () {
			textSprite.destroy();
		},this);
		tween.start();
	},

	ready: function () {
		this.start();
	},

	start: function () {
		this.GC.isPlaying = true;
	},

	gameOverTime: function () {
		this.gameOver();
		this.HUD.changeTime(0);
		this.genResultTextSprite('タイムアップ！');
	},

	gameOverCount: function () {
		this.gameOver();
		this.genResultTextSprite('チャレンジ終了！');
	},

	gameOver: function () {
		this.GC.isPlaying = false;
		this.GC.allowInput = false;
	},

	genResultTextSprite: function (text) {
		var s = this.game.global.SpriteManager;
		var textStyle = {
			fontSize: '100px',
			fill: '#800000',
			stroke:'#FFFFFF',
			strokeThickness: 10,
			multipleStroke:'#800000',
			multipleStrokeThickness: 10,
		};
		var textSprite = s.genText(this.world.centerX, this.world.centerY, text, textStyle);
		textSprite.setScale(0,0);
		this.game.global.TweenManager.popUpB(textSprite, 800).start();
		this.game.global.TweenManager.popUpB(textSprite.multipleTextSprite, 800).start();
	},

	genResultPanelContainer: function () {
		this.time.events.removeAll();
		var textStyle = {
			fontSize: '100px',
			fill: '#800000',
			stroke:'#FFFFFF',
			strokeThickness: 10,
			multipleStroke:'#800000',
			multipleStrokeThickness: 10,
		};
		var panelSprite = this.genPanelSprite();
		var panelTextSprite = this.genPanelTextSprite(textStyle);
		var modeTextSprite = this.genModeTextSprite(textStyle);
		var restartLabel = this.genRestartLabel();
		var tweetLabel = this.genTweetLabel();
		var backLabel = this.genBackLabel();
		var t = this.game.global.TweenManager;
		var tween = t.popUpB(panelSprite, 500, {x:8,y:13});
		t.onComplete(tween, function () {
			panelTextSprite.show();
			modeTextSprite.show();
			this.genPanelScoreTextSprite(0,400,textStyle);
			this.genPanelScoreTextSprite(1,400,textStyle);
			restartLabel.allShow(600);
			tweetLabel.allShow(800);
			backLabel.allShow(1000);
		}, this);
		tween.start();
		return panelSprite;
	},

	genPanelSprite: function () {
		var s = this.game.global.SpriteManager;
		var panelSprite = s.genSprite(this.world.centerX, this.world.centerY, 'greySheet', 'grey_panel');
		panelSprite.tint = 0xffe4b5;
		panelSprite.scale.setTo(0);
		panelSprite.anchor.setTo(.5);
		return panelSprite;
	},

	genPanelTextSprite: function (textStyle) {
		var s = this.game.global.SpriteManager;
		var textSprite = s.genText(this.world.centerX, 300, '結果発表', textStyle);
		textSprite.setScale(0,0);
		var t = this.game.global.TweenManager;
		textSprite.show = function () {
			t.popUpB(textSprite, 800).start();
			t.popUpB(textSprite.multipleTextSprite, 800).start();
		};
		return textSprite;
	},

	genModeTextSprite: function (textStyle) {
		var s = this.game.global.SpriteManager;
		textStyle.fontSize = '80px';
		var c = this.game.conf.CharInfo[this.game.global.currentChar];
		var textSprite = s.genText(this.world.centerX, 450, '難易度: '+c.modeName, textStyle);
		textSprite.setScale(0,0);
		var t = this.game.global.TweenManager;
		textSprite.show = function () {
			t.popUpB(textSprite, 800).start();
			t.popUpB(textSprite.multipleTextSprite, 800).start();
		};
		return textSprite;
	},

	genPanelScoreTextSprite: function (num,delay,textStyle) {
		var s = this.game.global.SpriteManager;
		var text = this.HUD.score.text;
		text = text.split(': ')[num];
		var textSprite = s.genText(this.world.centerX, 600+(num*150), text, textStyle);
		textSprite.setScale(0,0);
		this.game.global.TweenManager.popUpB(textSprite, 800, null, delay).start();
		this.game.global.TweenManager.popUpB(textSprite.multipleTextSprite, 800, null, delay).start();
	},

	genRestartLabel: function () {
		return this.genLabelTpl(this.world.centerX,this.world.centerY+100,function () {
			this.state.start(this.game.global.nextSceen);
		}, 'もう一度挑戦');
	},

	genTweetLabel: function () {
		return this.genLabelTpl(this.world.centerX,this.world.centerY+300,this.tweet, '結果をツイート');
	},

	genBackLabel: function () {
		return this.genLabelTpl(this.world.centerX,this.world.centerY+500,function () {
			this.game.global.nextSceen = 'Title';
			this.state.start(this.game.global.nextSceen);
		}, 'タイトルにもどる');
	},

	genLabelTpl: function (x,y,func,text) {
		var textStyle = {
			fontSize:'45px',
			// TODO current char color
			fill: '#b8860b',
			stroke:'#FFFFFF',
			strokeThickness: 10,
			multipleStroke:'#b8860b',
			multipleStrokeThickness: 10,
		};
		var s = this.game.global.SpriteManager;
		var btnSprite = s.genButton(x,y,'greySheet',func,this);
		btnSprite.setFrames('grey_button00', 'grey_button00', 'grey_button01', 'grey_button00');
		btnSprite.anchor.setTo(.5);
		btnSprite.scale.setTo(0);
		btnSprite.tint = 0xf5deb3; // TODO current char color
		var textSprite = s.genText(x,y,text,textStyle);
		btnSprite.UonInputDown(function () {
			// this.game.global.SoundManager.play({key:'Click',volume:1,});
		}, this);
		textSprite.setScale(0,0);
		var t = this.game.global.TweenManager;
		btnSprite.allShow = function (delay) {
			delay = delay || 0;
			t.popUpB(btnSprite, 800, {x:2.3,y:2.3}, delay).start();
			t.popUpB(textSprite, 800, null, delay).start();
			t.popUpB(textSprite.multipleTextSprite, 800, null, delay).start();
		};
		return btnSprite;
	},

	tweet: function () {
		var c = this.game.conf.CharInfo[this.game.global.currentChar];
		// this.game.global.SoundManager.play('MenuStart'); // TODO
		var text = '叩き出したスコアは '+this.GC.score+' です！\n'
		+c.emoji+'\n'
		+'・選んだVtuber: '+c.name+'\n'
		+'・挑戦した難易度: '+c.modeName+'\n'
		+'👼👿🤖🐱‍💻🦍\n'
		+'『'+this.game.const.GAME_TITLE+'』';
		var tweetText = encodeURIComponent(text);
		var tweetUrl = location.href;
		var tweetHashtags = '天魔機忍verGゲーム'; // 'A,B,C'
		window.open(
			'https://twitter.com/intent/tweet?text='+tweetText+'&url='+tweetUrl+'&hashtags='+tweetHashtags, 
			'share window', 
			'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
		);
		return false;
	},

	rndInt: function (min, max) {
		return this.rnd.integerInRange(min, max);
	},

	test: function () {
		if (__ENV!='prod') {
			this.GC.TimeLimit = getQuery('time') || this.GC.TimeLimit;
			this.GC.CountLimit = getQuery('count') || this.GC.CountLimit;
		}
	},
};