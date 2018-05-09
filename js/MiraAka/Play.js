BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GM = {};
		this.Act = {};
		this.HUD = {};
	},

	create: function () {
		this.GameManager();
		this.BtnContainer();
		this.QuizContainer();
		this.HUDContainer();
		this.ready();
		this.test();
	},

	GameManager: function () {
		this.GM = {
			isPlaying: false,
			isCounting: false,
			timer: 1000,
			QuestionInfo: this.M.getConf('QuestionInfo'),
			COUNTDOWN_COUNT: 6,
			countdownCount: 6,
			touchOrClick: (this.game.device.touch)?'タッチ':'クリック',
			curQuestion: '',
			curAnswer: '',
			curQuestionCount: 0,
			curCorrectCount: 0,
			curWrongCount: 0,
			CORRECT: 'CORRECT',
			WRONG: 'WRONG',
			NONE_SELECT: 'NONE_SELECT',
			curSelectedJudge: 'NONE_SELECT',
		};
	},

	update: function () {
		if (this.GM.isPlaying) {
			this.TimeManager();
		}
	},

	TimeManager: function () {
		if (this.GM.timer<0) {
			this.GM.timer = 1000;
			this.countDown();
		}
		this.GM.timer-=this.time.elapsed;
	},

	countDown: function () {
		if (this.GM.isCounting) {
			this.GM.countdownCount--;
			this.Act.setStartBtnText(this.GM.countdownCount, 60);
			if (this.GM.countdownCount == 0) this.endCountDown();
		}
	},

	endCountDown: function () {
		this.GM.isCounting = false;
		this.GM.countdownCount = this.GM.COUNTDOWN_COUNT;
		this.Act.setStartBtnText('回答時間', 40);
		// TODO auto answer on off
		this.time.events.add(500,function () { // TODO del
		// this.time.events.add(3500,function () {
			this.Act.startBtnActive(true);
			this.Act.setStartBtnText(this.GM.touchOrClick+'で\n答えを確認', 30);
		}, this);
	},

	BtnContainer: function () {
		var x = this.world.centerX;
		var y = this.world.centerY;
		var textStyle = this.M.S.BaseTextStyleS(25);
		var tint = this.M.getConst('MAIN_TINT');
		this.genStartBtnSprite(x,y);
		this.genVolumeBtnSprite(50,this.world.height-40,tint);
		this.genFullScreenBtnSprite(this.world.width-50,this.world.height-40,tint);
		this.genBackBtnSprite(x,this.world.height-40,tint,textStyle);
		this.genTweetBtnSprite(x,this.world.height-100,tint,textStyle);
		this.genCorrectBtnSprite(x*.4,y*1.5);
		this.genWrongBtnSprite(x*1.6,y*1.5);
	},

	genStartBtnSprite: function (x,y) {
		var textStyle = this.M.S.BaseTextStyleS(40);
		var btnSprite = this.add.button(x,y+100,'CircleBtns',this.onClickStart,this,'Hover','Normal','Push','Normal');
		btnSprite.anchor.setTo(.5);
		var textSprite = this.M.S.genText(0,0,'スタート',textStyle);
		textSprite.addToChild(btnSprite);
		this.Act.startBtnActive = function (TorF) {
			btnSprite.inputEnabled = TorF;
		};
		this.Act.setStartBtnText = function (text, fontSize) {
			textSprite.setTextStyle({fontSize:fontSize});
			textSprite.changeText(text);
		};
	},

	onClickStart: function () {
		if (this.GM.isPlaying) {
			this.showAnswer();
		} else {
			if (this.GM.QuestionInfo.length == 0) {
				this.gameOver();
			} else {
				this.start();
			}
		}
	},

	showAnswer: function () {
		this.GM.isPlaying = false;
		this.GM.timer = 1000;
		this.Act.showCorrectBtn();
		this.Act.showWrongBtn();
		this.Act.startBtnActive(false);
		this.Act.setAnswer(this.GM.curAnswer);
		this.Act.setStartBtnText('正解？\n不正解？',35);
	},

	genVolumeBtnSprite: function (x,y,tint) {
		var maxImg = 'VolumeMax';
		var halfImg = 'VolumeHalf';
		var muteImg = 'VolumeMute';
		var curImg = this.sound.mute ? muteImg : (this.sound.volume==1) ? maxImg : halfImg;
		var volumeSprite = this.M.S.genSprite(x,y,'VolumeIcon',curImg);
		volumeSprite.anchor.setTo(.5);
		volumeSprite.scale.setTo(.5);
		volumeSprite.UonInputDown(function (sprite) {
			if (this.sound.mute) {
				sprite.frameName = maxImg;
				this.sound.mute = false;
				this.sound.volume = 1;
			} else {
				if (this.sound.volume == 1) {
					sprite.frameName = halfImg;
					this.sound.volume = .5;
				} else {
					sprite.frameName = muteImg;
					this.sound.volume = 0;
					this.sound.mute = true;
				}
			}
		});
	},

	genFullScreenBtnSprite: function (x,y,tint) {
		var offImg = 'smaller';
		var onImg = 'larger';
		var curImg = this.scale.isFullScreen ? offImg : onImg;
		var fullScreenSprite = this.M.S.genSprite(x,y,'GameIconsBlack',curImg);
		fullScreenSprite.anchor.setTo(.5);
		fullScreenSprite.scale.setTo(.5);
		fullScreenSprite.UonInputDown(function (sprite) {
			if (this.scale.isFullScreen) {
				sprite.frameName = onImg;
				this.scale.stopFullScreen(false);
			} else {
				sprite.frameName = offImg;
				this.scale.startFullScreen(false);
			}
		});
	},

	genBackBtnSprite: function (x,y,tint,textStyle) {
		this.M.S.BasicWhiteLabelS(x,y,function () {
			this.M.NextScene('Title');
		},'戻る',textStyle,{tint:tint});
	},

	genTweetBtnSprite: function (x,y,tint,textStyle) {
		this.M.S.BasicWhiteLabelS(x,y,this.tweet,'結果をツイート',textStyle,{tint:tint});
	},

	tweet: function () {
		var quotes = (this.GM.curWrongCount<4) ? ['なし'] : [
			'罰ゲーム1',
			'罰ゲーム2',
			'罰ゲーム3',
			'罰ゲーム4',
		]; // TODO
		var emoji = '💣💣💣💣💣💣';
		var text = 
					'『'+this.M.getConst('GAME_TITLE')+'』で遊んだよ！\n'
					+emoji+'\n'
					+'出題数: '+this.GM.curQuestionCount+'\n'
					+'正解: '+this.GM.curCorrectCount+'\n'
					+'不正解: '+this.GM.curWrongCount+'\n'
					+'罰ゲーム: '+this.rnd.pick(quotes)+'\n'
					+emoji+'\n';
		var hashtags = 'ミラアカゲーム';
		this.M.H.tweet(text,hashtags,location.href);
	},

	genCorrectBtnSprite: function (x,y) {
		var btnSprite = this.M.S.genButton(x,y,'RedBtns',this.selectCorrectOrWrong);
		btnSprite.setFrames(0,0,1,0);
		btnSprite.anchor.setTo(.5);
		btnSprite.tag = this.GM.CORRECT;
		var textSprite = this.M.S.genText(0,0,'◯',{});
		textSprite.addToChild(btnSprite);
		btnSprite.hide();
		this.Act.showCorrectBtn = function () {
			btnSprite.show();
		};
		this.Act.hideCorrectBtn = function () {
			btnSprite.hide();
		};
	},

	genWrongBtnSprite: function (x,y) {
		var btnSprite = this.M.S.genButton(x,y,'BlueBtns',this.selectCorrectOrWrong);
		btnSprite.setFrames(0,0,1,0);
		btnSprite.anchor.setTo(.5);
		btnSprite.tag = this.GM.WRONG;
		var textSprite = this.M.S.genText(0,0,'☓',{});
		textSprite.addToChild(btnSprite);
		btnSprite.hide();
		this.Act.showWrongBtn = function () {
			btnSprite.show();
		};
		this.Act.hideWrongBtn = function () {
			btnSprite.hide();
		};
	},

	selectCorrectOrWrong: function (sprite) {
		// TODO auto on off -> auto start
		this.Act.startBtnActive(true);
		this.Act.setStartBtnText('もう一度\nスタート', 40);
		if (sprite.tag == this.GM.CORRECT) {
			if (this.GM.curSelectedJudge == this.GM.CORRECT) return;
			this.GM.curCorrectCount++;
			if (this.GM.curSelectedJudge == this.GM.WRONG) this.GM.curWrongCount--;
			this.GM.curSelectedJudge = this.GM.CORRECT;
		} else {
			if (this.GM.curSelectedJudge == this.GM.WRONG) return;
			this.GM.curWrongCount++;
			if (this.GM.curSelectedJudge == this.GM.CORRECT) this.GM.curCorrectCount--;
			this.GM.curSelectedJudge = this.GM.WRONG;
		}
		this.HUD.setCorrectCount(this.GM.curCorrectCount);
		this.HUD.setWrongCount(this.GM.curWrongCount);
	},

	QuizContainer: function () {
		var x = this.world.centerX;
		var textStyle = this.M.S.BaseTextStyleS(35);
		this.genQuestionTextSprite(x,150,textStyle);
		this.genAnswerTextSprite(x,300,textStyle);
	},

	genQuestionTextSprite: function (x,y,textStyle) {
		var baseText = 'Q. ';
		var textSprite = this.M.S.genText(x,y,baseText+'ここに問題が\n表示されるよ！',textStyle);
		this.Act.setQuestion = function (text) {
			textSprite.changeText(baseText+text);
		};
	},

	genAnswerTextSprite: function (x,y,textStyle) {
		var baseText = 'A. ';
		var textSprite = this.M.S.genText(x,y,baseText+'ここに答えが\n表示されるよ！',textStyle);
		this.Act.setAnswer = function (text) {
			textSprite.changeText(baseText+text);
		};
	},

	HUDContainer: function () {
		var textStyle = this.M.S.BaseTextStyleS(25);
		this.genQuestionCountTextSprite(80,50,textStyle);
		this.genCorrectCountTextSprite(this.world.centerX,50,textStyle);
		this.genWrongCountTextSprite(this.world.width-80,50,textStyle);
	},

	genQuestionCountTextSprite: function (x,y,textStyle) {
		var baseText = '出題数: ';
		var textSprite = this.M.S.genText(x,y,baseText+this.GM.curQuestionCount,textStyle);
		this.HUD.setQuestionCount = function (val) {
			textSprite.changeText(baseText+val);
		};
	},

	genCorrectCountTextSprite: function (x,y,textStyle) {
		var baseText = '正解: ';
		var textSprite = this.M.S.genText(x,y,baseText+this.GM.curCorrectCount,textStyle);
		this.HUD.setCorrectCount = function (val) {
			textSprite.changeText(baseText+val);
		};
	},

	genWrongCountTextSprite: function (x,y,textStyle) {
		var baseText = '不正解: ';
		var textSprite = this.M.S.genText(x,y,baseText+this.GM.curWrongCount,textStyle);
		this.HUD.setWrongCount = function (val) {
			textSprite.changeText(baseText+val);
		};
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
		this.GM.isPlaying = true;
		this.GM.isCounting = true;
		this.GM.curSelectedJudge = this.GM.NONE_SELECT;
		this.Act.startBtnActive(false);
		this.Act.setStartBtnText(this.GM.COUNTDOWN_COUNT, 60);
		this.Act.hideCorrectBtn();
		this.Act.hideWrongBtn();
		this.setQuestion();
	},

	setQuestion: function () {
		var QuestionInfo = this.GM.QuestionInfo;
		var rndNum = this.rnd.integerInRange(0,QuestionInfo.length-1);
		var info = QuestionInfo[rndNum];
		this.GM.curQuestion = info[0];
		this.GM.curAnswer = info[1];
		QuestionInfo.splice(rndNum, 1);
		this.Act.setQuestion(this.GM.curQuestion);
		this.Act.setAnswer('????');
		this.GM.curQuestionCount++;
		this.HUD.setQuestionCount(this.GM.curQuestionCount);
	},

	gameOver: function () {
		this.GM.isPlaying = false;
		this.Act.startBtnActive(false);
		this.Act.setStartBtnText('全問題\n終了！', 30);
		this.Act.hideCorrectBtn();
		this.Act.hideWrongBtn();
	},

	renderT: function () {
	},

	test: function () {
		if (__ENV!='prod') {
			this.game.debug.font='40px Courier';
			this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function () {
				this.GM.countdownCount = 1;
			}, this);
			this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
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
