BasicGame.Play = function (game) {};

BasicGame.Play.prototype = {

	init: function () {
		var g = this.game.global;
		this.targetTime = g.targetTime; // For view
		this.startTime = 0; // Set Date.now()
		this.currentCharNum = g.currentCharNum;

		// For visible, invisible
		this.startBtn;
		this.stopBtn;
		this.restartBtn;
		this.againBtn;
		this.backBtn;
		this.currentTimeTextSprite;
		this.charSprite;
		this.resultWordsSprite;
	},

	create: function () {
		this.genBackGround();
		this.manageBGM();
		this.charController();
		this.genTimerContainer();
		this.btnsContainer();
		this.genPlayCountText();
		this.test();
	},

	genBackGround: function () {
		this.stage.setBackgroundColor(0xfbf6d5);
	},

	manageBGM: function () {
		this.game.global.soundManager.soundStop('currentBGM');
	},

	genTimerContainer: function () {
		this.genTargetTimeText();
		this.currentTimeTextSprite = this.genCurrentTimeText();
	},

	genTargetTimeText: function () {
		var textStyle = { font: '40px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 10 };
		var textSprite = this.add.text(this.world.centerX, this.world.centerY/2-100, this.targetTime+'.00 でピッタリ止めろ', textStyle);
		textSprite.anchor.setTo(.5);
	},

	genCurrentTimeText: function () {
		var initText = (this.targetTime*0)+'.00';
		var textStyle = { font: '40px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 10 };
		var textSprite = this.add.text(this.world.centerX, this.world.centerY/2-50, initText, textStyle);
		textSprite.anchor.setTo(.5);
		textSprite.show = function (text) {
			if (text) {
				textSprite.setText(text);
				textSprite.visible = true;
			} else {
				console.log('Error: Please set text to arg');
			}
		};
		textSprite.hide = function () {
			textSprite.visible = false;
		};
		textSprite.initText = function () {
			textSprite.setText(initText);
		};
		return textSprite;
	},

	btnsContainer: function () {
		var x = this.world.centerX;
		var y = this.world.height-100;

		this.startBtn = this.genStartBtn(x, y);
		this.stopBtn = this.genStopBtn(x, y);
		this.againBtn = this.genAgainBtn(x, y);
		// this.restartBtn = this.genRestartBtn(x, y);
		this.backBtn = this.genBackBtn();
	},

	genStartBtn: function (x, y) { return this.btnTemplate(x, y, this.timerStart, '  START  '); },

	genStopBtn: function (x, y) {
		var btnSprite = this.btnTemplate(x, y, this.timerStop, '  STOP  ');
		btnSprite.hide();
		return btnSprite;
	},

	genRestartBtn: function (x, y) {
		var btnSprite = this.btnTemplate(x, y, this.timerStart, '  RESTART  ');
		btnSprite.hide();
		return btnSprite;
	},

	genAgainBtn: function (x, y) {
		var btnSprite = this.btnTemplate(x, y, this.ready, '  AGAIN  ');
		btnSprite.hide();
		return btnSprite;
	},

	genBackBtn: function () {
		var x = 100;
		var y = 30;
		return this.btnTemplate(x, y, this.backToCharSelect, '  BACK  ');
	},

	btnTemplate: function (x, y, inputFunc, text) {
		var btnSprite = this.add.button(
			x, y, 'redSheet', 
			inputFunc, this, 
			'red_button01', 'red_button13', 'red_button02'
		);
		btnSprite.anchor.setTo(.5);

		var textStyle = { fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 3 };
		var textSprite = this.add.text(x, y, text, textStyle);
		textSprite.anchor.setTo(.5);
		textSprite.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 10);

		btnSprite.show = function () {
			btnSprite.visible = true;
			textSprite.visible = true;
		};
		btnSprite.hide = function () {
			btnSprite.visible = false;
			textSprite.visible = false;
		};

		return btnSprite;
	},

	ready: function () {
		this.currentTimeTextSprite.initText();
		this.againBtn.hide();
		this.startBtn.show();
		this.charSprite.initImg();
		this.resultWordsSprite.hide();
	},

	timerStart: function () {
		this.startTime = Date.now();
		this.startBtn.hide();
		this.againBtn.hide();
		// this.restartBtn.hide();
		this.backBtn.hide();
		this.stopBtn.show();
		this.currentTimeTextSprite.hide();

		this.game.global.soundManager.soundPlay('stopwatchSE');
	},

	timerStop: function () {
		var elapsedTime = (Date.now() - this.startTime) / 1000;
		var currentTime = elapsedTime.toFixed(2);

		this.stopBtn.hide();
		this.againBtn.show();
		// this.restartBtn.show();
		this.backBtn.show();
		this.currentTimeTextSprite.show(currentTime);

		this.game.global.soundManager.soundPlay('stopwatchSE');

		var result = this.checkTime(currentTime);
		this.resultView(result);
	},

	checkTime: function (currentTime) {
		var targetTime = this.targetTime;

		var marginTime_1 = targetTime * 0.05;
		var marginTime_2 = targetTime * 0.3;
		var marginTime_3 = targetTime * 0.5;
		var marginTime_4 = targetTime * 2;

		function between (targetTime,marginTime,currentTime) {
			return (targetTime-marginTime <= currentTime && currentTime <= targetTime+marginTime);
		}

		var c = this.game.const;
		if (targetTime == currentTime) {
			return c.GAME_RESULT_CONGRATULATIONS;
		} else if (between(targetTime, marginTime_1, currentTime)) {
			return c.GAME_RESULT_CLOSE;
		} else if (between(targetTime, marginTime_2, currentTime)) {
			return c.GAME_RESULT_NORMAL;
		} else if (between(targetTime, marginTime_3, currentTime)) {
			return c.GAME_RESULT_AWKWARD;
		} else if (between(targetTime, marginTime_4, currentTime)) {
			return c.GAME_RESULT_FUCKYOU;
		} else {
			return c.GAME_RESULT_FUCKYOU;
		}
	},

	resultView: function (result) {
		this.charSprite.changeImg(result);
		this.resultWordsSprite.show(result);
	},

	backToCharSelect: function () {
		this.game.global.soundManager.soundPlay('cancelSE');
		this.game.global.goToNextSceen('CharacterSelect');
	},

	genPlayCountText: function () {
		// TODO for twitter ,today,total /per char, per seconds, all,
	},

	charController: function () {
		var wordsInfo = this.game.conf.charInfo[this.currentCharNum].resultWords;
		this.charSprite = this.genCharSprite(wordsInfo);
		this.resultWordsSprite = this.genResultWords(wordsInfo);
	},

	genCharSprite: function (wordsInfo) {
		var x = this.world.centerX;
		var y = this.world.centerY;
		var currentCharNum = this.currentCharNum;
		var charSprite = this.add.sprite(x, y, 'normal_1_'+currentCharNum);
		charSprite.anchor.setTo(.5);
		charSprite.changeImg = function (result) {
			var resultWords = wordsInfo[result];
			var emotion = resultWords.emotion;
			var c = this.game.const;
			var versionNum = 1;
			if (resultWords.version) {
				versionNum = resultWords.version;
			}
			charSprite.x = resultWords.charX || x;
			charSprite.y = resultWords.charY || y;
			charSprite.scale.setTo(resultWords.scale || 1);
			charSprite.loadTexture(emotion+'_'+versionNum+'_'+currentCharNum);
		};
		charSprite.initImg = function () {
			charSprite.x = x;
			charSprite.y = y;
			charSprite.loadTexture('normal_1_'+currentCharNum);
		};
		return charSprite;
	},

	genResultWords: function (wordsInfo) {
		var textStyle = wordsInfo.commonTextStyle || { font: '40px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 10 };
		var textSprite = this.add.text(wordsInfo.commonX, wordsInfo.commonY, '', textStyle);
		textSprite.anchor.setTo(.5);
		textSprite.show = function (result) {
			var resultWords = wordsInfo[result];
			if (resultWords.textStyle) {
				for (var key in resultWords.textStyle) {
					var val = resultWords.textStyle[key];
					textSprite[key] = val;
				}
			}
			textSprite.setText(resultWords.words);
			textSprite.visible = true;
		};
		textSprite.hide = function () {
			textSprite.x = wordsInfo.commonX;
			textSprite.y = wordsInfo.commonY;
			textSprite.angle = 0;
			textSprite.setStyle(textStyle);
			textSprite.visible = false;
		};
		return textSprite;
	},

	test: function () {
		// return;
		var str = window.location.href;
		var result = str.slice(-1);
		if (result != 'l' && result != '?') {
			this.charSprite.changeImg(result);
			this.resultWordsSprite.show(result);
		}
	}
};