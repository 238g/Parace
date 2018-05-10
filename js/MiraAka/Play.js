BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.DeclearConst();
		this.DeclearVal();
		this.DeclearObj();
	},

	DeclearConst: function () {
		this.COUNTDOWN_COUNT = 6;
		this.CORRECT = 1;
		this.WRONG = 2;
		this.NONE_SELECT = 3;
		this.QUESTION_BASE_TEXT = 'Q. ';
		this.ANSWER_BASE_TEXT = 'A. ';
		this.QUESTION_COUNT_BASE_TEXT = '出題数: ';
		this.CORRECT_COUNT_BASE_TEXT = '正解: ';
		this.WRONG_COUNT_BASE_TEXT = '不正解: ';
		this.FULL_SCREEN_OFF_IMG = BasicGame.FULL_SCREEN_OFF_IMG;
		this.FULL_SCREEN_ON_IMG = BasicGame.FULL_SCREEN_ON_IMG;
	},

	DeclearVal: function () {
		this.isPlaying = false;
		this.isCounting = false;
		this.secTimer = 1000;
		this.QuestionInfo = this.M.getConf('QuestionInfo');
		this.countdownCount = this.COUNTDOWN_COUNT;
		this.touchOrClick = (this.game.device.touch)?'タッチ':'クリック';
		this.curQuestion = 'ここに問題が\n表示されるよ！';
		this.curAnswer = 'ここに答えが\n表示されるよ！';
		this.curQuestionCount = 0;
		this.curCorrectCount = 0;
		this.curWrongCount = 0;
		this.curSelectedJudge = this.NONE_SELECT;
	},

	DeclearObj: function () {
		this.StartBtnSprite = null;
		this.StartBtnTextSprite = null;
		this.CorrectBtnSprite = null;
		this.WrongBtnSprite = null;
		this.QuestionTextSprite = null;
	},

	create: function () {
		this.time.events.removeAll();
		this.BtnContainer(); // PlayBtn.js
		this.QuizContainer();
		this.HUDContainer(); // PlayHUD.js
		this.ready();
		this.test();
	},

	update: function () {
		if (this.isPlaying) {
			this.TimeManager();
		}
	},

	TimeManager: function () {
		if (this.secTimer<0) {
			this.secTimer = 1000;
			this.countDown();
		}
		this.secTimer-=this.time.elapsed;
	},

	countDown: function () {
		if (this.isCounting) {
			this.countdownCount--;
			this.setStartBtnText(this.countdownCount, 60);
			if (this.countdownCount == 0) this.endCountDown();
		}
	},

	endCountDown: function () {
		this.isCounting = false;
		this.countdownCount = this.COUNTDOWN_COUNT;
		this.setStartBtnText('回答時間', 40);
		// TODO auto answer on off
		this.time.events.add(500,function () { // TODO del
		// this.time.events.add(3500,function () {
			this.startBtnActive(true);
			this.setStartBtnText(this.touchOrClick+'で\n答えを確認', 30);
		}, this);
	},

	QuizContainer: function () {
		var x = this.world.centerX;
		var textStyle = this.M.S.BaseTextStyleS(35);
		this.genQuestionTextSprite(x,150,textStyle);
		this.genAnswerTextSprite(x,300,textStyle);
	},

	genQuestionTextSprite: function (x,y,textStyle) {
		this.QuestionTextSprite = this.M.S.genText(x,y,this.QUESTION_BASE_TEXT+'ここに問題が\n表示されるよ！',textStyle);
	},

	setQuestionText: function (text) {
		this.QuestionTextSprite.changeText(this.QUESTION_BASE_TEXT+text);
	},

	genAnswerTextSprite: function (x,y,textStyle) {
		this.AnswerTextSprite = this.M.S.genText(x,y,this.ANSWER_BASE_TEXT+'ここに答えが\n表示されるよ！',textStyle);
	},

	setAnswerText: function (text) {
		this.AnswerTextSprite.changeText(this.ANSWER_BASE_TEXT+text);
	},

	ready: function () {
		// TODO
		// this.stopBGM();
		// this.playBGM();
	},

	playBGM: function () {
		var s = this.M.SE;
		if (s.isPlaying('Stage_1')) return;
		s.play('Stage_1',{isBGM:true,loop:true,volume:1});
	},

	stopBGM: function () {
		var s = this.M.SE;
		if (s.isPlaying('PlayBGM')) return;
		s.stop('currentBGM');
		s.stop('TitleBGM');
	},

	start: function () {
		this.isPlaying = true;
		this.isCounting = true;
		this.curSelectedJudge = this.NONE_SELECT;
		this.startBtnActive(false);
		this.setStartBtnText(this.COUNTDOWN_COUNT, 60);
		this.hideCorrectBtn();
		this.hideWrongBtn();
		this.setQuestion();
	},

	setQuestion: function () {
		var QuestionInfo = this.QuestionInfo;
		var rndNum = this.rnd.integerInRange(0,QuestionInfo.length-1);
		var info = QuestionInfo[rndNum];
		this.curQuestion = info[0];
		this.curAnswer = info[1];
		this.M.H.splice1(QuestionInfo,rndNum);
		this.setQuestionText(this.curQuestion);
		this.setAnswerText('????');
		this.curQuestionCount++;
		this.setQuestionCount(this.curQuestionCount);
	},

	gameOver: function () {
		this.isPlaying = false;
		this.startBtnActive(false);
		this.setStartBtnText('全問題\n終了！', 30);
		this.hideCorrectBtn();
		this.hideWrongBtn();
	},

	renderT: function () {
	},

	test: function () {
		if (__ENV!='prod') {
			this.game.debug.font='40px Courier';
			this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function () {
				this.countdownCount = 1;
			}, this);
			this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		}

		/*
			option icon -> dialog
				auto show answer
				auto next question after select correct/wrong
				hide correct count text
				hide wrong count text
		*/
	},
};
