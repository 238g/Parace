BasicGame.Play = function (game) {};

BasicGame.Play.prototype = {

	init: function () {
		var g = this.game.global;
		this.targetTime = g.targetTime; // For view
		this.startTime = 0; // Set Date.now()

		// For visible, invisible
		this.startBtn;
		this.stopBtn;
		this.restartBtn;
		this.backBtn;
		this.currentTimeTextSprite;

		this.const = this.game.const;
	},

	create: function () {
		this.genBackGround();
		this.genTimerContainer();
		// TODO character
		this.btnsContainer();
	},

	genBackGround: function () {
		this.stage.setBackgroundColor(0xfbf6d5);
	},

	genTimerContainer: function () {
		this.genTargetTimeText();
		this.currentTimeTextSprite = this.genCurrentTimeText();
	},

	genTargetTimeText: function () {
		var textStyle = { font: "40px Arial", fill: "#fff", align: "center" };
		var textSprite = this.add.text(this.world.centerX, this.world.centerY/2-100, this.targetTime+'.00 でピッタリ止めろ', textStyle);
		textSprite.anchor.setTo(.5);
		textSprite.stroke = '#000000';
		textSprite.strokeThickness = 10;
	},

	genCurrentTimeText: function () {
		var textStyle = { font: "40px Arial", fill: "#fff", align: "center" };
		var textSprite = this.add.text(this.world.centerX, this.world.centerY/2, (this.targetTime*0)+'.00', textStyle);
		textSprite.anchor.setTo(.5);
		textSprite.stroke = '#000000';
		textSprite.strokeThickness = 10;
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
		return textSprite;
	},

	btnsContainer: function () {
		var x = this.world.centerX;
		var y = this.world.centerY+200;

		this.startBtn = this.genStartBtn(x, y);
		this.stopBtn = this.genStopBtn(x, y);
		this.restartBtn = this.genRestartBtn(x, y);
		this.backBtn = this.genBackBtn();
	},

	genStartBtn: function (x, y) {
		return this.btnTemplate(x, y, this.timerStart, '  START  ');
	},

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

	genBackBtn: function () {
		var x = this.world.centerX;
		var y = this.world.centerY+300;

		return this.btnTemplate(x, y, this.backToCharSelect, '  BACK  ');
	},

	btnTemplate: function (x, y, inputFunc, text) {
		var btnSprite = this.add.button(
			x, y, 'redSheet', 
			inputFunc, this, 
			'red_button01', 'red_button13', 'red_button02'
		);
		btnSprite.anchor.setTo(.5);

		var textStyle = { fill: "#fff", align: "center" };
		var textSprite = this.add.text(x, y, text, textStyle);
		textSprite.anchor.setTo(.5);
		textSprite.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 10);
		textSprite.stroke = '#000000';
		textSprite.strokeThickness = 3;

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

	timerStart: function () {
		this.startTime = Date.now();
		this.startBtn.hide();
		this.restartBtn.hide();
		this.backBtn.hide();
		this.stopBtn.show();
		this.currentTimeTextSprite.hide();

		this.game.global.sounds.click.play(); // TODO change sound???

		// TODO *2 upper auto stop!!
	},

	timerStop: function () {
		var elapsedTime = (Date.now() - this.startTime) / 1000;
		var currentTime = elapsedTime.toFixed(2);

		this.stopBtn.hide();
		this.restartBtn.show(); // TODO settimeout???
		this.backBtn.show();
		this.currentTimeTextSprite.show(currentTime);

		this.game.global.sounds.click.play(); // TODO change sound???

		var result = this.checkTime(currentTime);
		this.resultView(result); // TODO view???char???
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

		if (targetTime == currentTime) {
			return this.const.GAME_RESULT_CONGRATULATIONS;
		} else if (between(targetTime, marginTime_1, currentTime)) {
			return this.const.GAME_RESULT_CLOSE;
		} else if (between(targetTime, marginTime_2, currentTime)) {
			return this.const.GAME_RESULT_NORMAL;
		} else if (between(targetTime, marginTime_3, currentTime)) {
			return this.const.GAME_RESULT_AWKWARD;
		} else if (between(targetTime, marginTime_4, currentTime)) {
			return this.const.GAME_RESULT_FUCKYOU;
		} else {
			return this.const.GAME_RESULT_FUCKYOU;
		}
	},

	resultView: function (result) {
		switch (result) {
			case this.const.GAME_RESULT_CONGRATULATIONS:
				break;
			case this.const.GAME_RESULT_CLOSE:
				break;
			case this.const.GAME_RESULT_NORMAL:
				break;
			case this.const.GAME_RESULT_AWKWARD:
				break;
			case this.const.GAME_RESULT_FUCKYOU:
			default:
				break;
		}
	},

	backToCharSelect: function () {
		this.game.global.sounds.click.play(); // TODO change sound???
		this.game.global.goToNextSceen('CharacterSelect');
	}
};