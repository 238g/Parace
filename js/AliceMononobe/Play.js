BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GM = {};
		this.HUD = {};
		this.Darts = {};
		this.Board = {};
		this.Dialog = {};
	},

	create: function () {
		this.GameManager();
		this.BgContainer();
		this.BtnContainer();
		this.DartsContainer();
		this.HUDContainer();
		this.ready();
		this.test();
	},

	GameManager: function () {
		this.GM = {
			inputEnabled: false,
			isPlaying: false,
			Card: {},
			Cards: [],
			currentRoundCount: 1,
			MAX_ROUND_COUNT: 12,
			currentMode: 301,
			ModeInfos: [301,501,701,901,1001,1501],
			currentScore: 301,
			beforeScore: 301,
			TrumpInfos: this.getTrumpInfors(),
			currentRoundTrumps: [],
			currentCardNum: 0,
			onDartsCardsNum: 0,
			DartsInfos: {
				Dart_blue: {
					score: 0,
					setCard: 0,
					MULTIPLE_SCORE: 1,
				},
				Dart_red: {
					score: 0,
					setCard: 0,
					MULTIPLE_SCORE: 3,
				},
				Dart_yellow: {
					score: 0,
					setCard: 0,
					MULTIPLE_SCORE: 5,
				},
			},
			ENABLE_SET_CARDS_NUM: 6,
			throwCount: 0,
			throwTimer: null,
			deckPos: {x:120,y:this.world.centerY+280},
		};
	},

	getTrumpInfors: function () {
		var arr = [];
		for (var i=1;i<=13;i++) {
			arr.push('Heart_'+i);
			arr.push('Spade_'+i);
			arr.push('Club_'+i);
			arr.push('Diamond_'+i);
		}
		return arr;
	},

	BgContainer: function () {
		this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
		this.genDeckSprite();
		this.genBoardSprite();
	},

	BtnContainer: function () {
		// TODO rule btn
	},

	genDeckSprite: function () {
		this.add.sprite(this.GM.deckPos.x,this.GM.deckPos.y,'Trump','BackCard_Black').anchor.setTo(.5);
	},

	genBoardSprite: function () {
		this.Board = this.add.sprite(this.world.centerX+80,380,'Board');
		this.Board.anchor.setTo(.5);
	},

	DartsContainer: function () {
		var centerX = this.Board.x;
		var y = this.world.height-400;
		this.Darts = {
			Dart_blue: this.genDartSprite(centerX-200,y,'Dart_blue'),
			Dart_red: this.genDartSprite(centerX,y,'Dart_red'),
			Dart_yellow: this.genDartSprite(centerX+200,y,'Dart_yellow'),
		};
	},

	genDartSprite: function (x,y,frame) {
		var dartSprite = this.M.S.genSprite(x,y,'Darts',frame);
		dartSprite.anchor.setTo(.5);
		dartSprite.firstX = dartSprite.x;
		dartSprite.firstY = dartSprite.y;
		dartSprite.UonInputDown(this.setCardToDart);
		this.genMultipleScoreTextSprite(x,y-150,this.GM.DartsInfos[frame].MULTIPLE_SCORE);
		this.genPointingArrowSprite(x,y+300);
		return dartSprite;
	},

	setCardToDart: function (sprite) {
		if (this.GM.isPlaying && this.GM.inputEnabled) {
			var dartFrameName = sprite.frameName;
			if (this.GM.DartsInfos[dartFrameName].setCard==3) return;
			this.GM.inputEnabled = false;
			var addY=100+this.GM.DartsInfos[dartFrameName].setCard*70;
			this.M.T.moveA(this.GM.Card,{xy:{x:sprite.x,y:sprite.y+addY}}).start();
			this.GM.DartsInfos[dartFrameName].setCard += 1;
			this.GM.onDartsCardsNum++;
			this.GM.Cards.push(this.GM.Card);
			var cardFrameName = this.GM.Card.frameName;
			this.GM.DartsInfos[dartFrameName].score += (cardFrameName.split('_')[1]*this.GM.DartsInfos[dartFrameName].MULTIPLE_SCORE);
			if (this.GM.onDartsCardsNum==this.GM.ENABLE_SET_CARDS_NUM) return this.throwDart();
			this.setNextCard();
		}
	},

	genMultipleScoreTextSprite: function (x,y,addText) {
		var baseText = 'x';
		var textStyle = this.StaticBaseTextStyle();
		this.M.S.genText(x,y,baseText+addText,textStyle);
	},

	genPointingArrowSprite: function (x,y) {
		var arrowSprite = this.add.sprite(x,y,'GameIcons','arrowUp');
		arrowSprite.anchor.setTo(.5);
		arrowSprite.tint = 0x00f371;
		this.M.T.pointingA(arrowSprite,{xy:{y:'+50'}}).start();
	},

	throwDart: function () {
		this.GM.inputEnabled = false;
		var tweens = [];
		for (var frameName in this.Darts) {
			var tween = this.M.T.moveB(this.Darts[frameName],{xy:{y:this.Board.y+this.rnd.integerInRange(0,400)},duration:200});
			this.M.T.onComplete(tween,this.throwDartOnComplete);
			tweens.push(tween);
		}
		var currentTween = 0;
		this.GM.throwTimer = this.time.events.repeat(1500, tweens.length, function () {
			tweens[currentTween].start();
			currentTween++;
		}, this);
	},

	throwDartOnComplete: function (sprite) {
		var frameName = sprite.frameName;
		this.GM.throwCount++;
		this.GM.beforeScore = this.GM.currentScore;
		var minusScore = this.GM.DartsInfos[frameName].score;
		this.GM.currentScore -= minusScore;
		this.HUD.minusScoreEffect(minusScore);
		this.HUD.changeScore(this.GM.currentScore);
		if (this.GM.currentScore==0) {
			this.time.events.remove(this.GM.throwTimer);
			this.gameOver();
		} else if (this.GM.currentScore<0) {
			this.time.events.remove(this.GM.throwTimer);
			this.time.events.add(1500, function () {
				this.missRound();
			}, this);
		} else if (frameName=='Dart_yellow') {
			this.time.events.remove(this.GM.throwTimer);
			this.time.events.add(1500, function () {
				this.againRound();
			}, this);
		}
	},

	missRound: function () {
		this.GM.currentScore = this.GM.beforeScore;
		this.HUD.changeScore(this.GM.currentScore);
		this.againRound();
	},

	againRound: function () {
		this.GM.currentRoundCount++;
		this.startRound();
	},

	HUDContainer: function () {
		this.HUD = {
			self: this,
			showRound: null,
			showGameOver: null,
			changeScore: null,
			minusScoreEffect: null,
		};
		// TODO throw count
		this.genRoundTextSprite();
		this.genScoreTextSprite();
		this.genMinusScoreTextSprite();
		this.genGameOverTextSprite();
	},

	genRoundTextSprite: function () {
		var textStyle = this.StaticBaseTextStyle();
		textStyle.fontSize = 100;
		var baseText = 'ラウンド目';
		var x = this.world.width+500;
		var y = this.world.centerY;
		var textSprite = this.M.S.genText(x,y,this.GM.currentRoundCount+baseText,textStyle);
		textSprite.setAnchor(.5);
		textSprite.hide();
		textSprite.addTween('moveA',{xy:{x:this.world.centerX},tweenName:'move1'});
		textSprite.addTween('moveA',{xy:{x:-500},tweenName:'move2',delay:500});
		textSprite.chainTween('move1','move2');
		this.M.T.onComplete(textSprite.multipleTextTween.move2, function () {
			textSprite.move(x,y);
		});
		this.HUD.showRound = function () {
			textSprite.changeText(this.self.GM.currentRoundCount+baseText);
			textSprite.show();
			textSprite.startTween('move1');
		};
	},

	genMinusScoreTextSprite: function () {
		var baseText = '-';
		var textStyle = this.StaticBaseTextStyle();
		textStyle.fontSize = 80;
		textStyle.fill = '#e7161b';
		textStyle.multipleStroke = '#e7161b';
		var textSprite = this.M.S.genText(100,50,0,textStyle);
		textSprite.setAnchor(0,0);
		textSprite.hide();
		textSprite.addTween('moveA',{xy:{y:'+50'}});
		this.M.T.onComplete(textSprite.multipleTextTween.moveA, function () {
			textSprite.hide();
			textSprite.move(100,50);
		});
		this.HUD.minusScoreEffect = function (minusScore) {
			textSprite.show();
			textSprite.changeText(baseText+minusScore);
			textSprite.startTween('moveA');
		};
	},

	genScoreTextSprite: function () {
		var baseText = '';
		var textStyle = this.StaticBaseTextStyle();
		textStyle.fontSize = 80;
		var textSprite = this.M.S.genText(50,50,this.GM.currentScore,textStyle);
		textSprite.setAnchor(0,0);
		this.HUD.changeScore = function (val) {
			textSprite.changeText(val);
		};
		this.HUD.score = textSprite;
	},

	genGameOverTextSprite: function () {
		var baseText = '終了！！';
		var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,this.StaticBaseTextStyle());
		textSprite.setAnchor(.5);
		textSprite.setScale(0,0);
		this.HUD.showGameOver = function () {
			textSprite.addTween('popUpB',{scale:{x:2,y:2}});
			textSprite.startTween('popUpB');
		};
	},

	ready: function () {
		this.stopBGM();
		this.playBGM();
		this.SelectModeContainer();
	},

	playBGM: function () {
		return; // TODO
		var s = this.M.SE;
		if (s.isPlaying('PlayBGM')) return;
		s.play('PlayBGM',{isBGM:true,loop:true,volume:1});
	},

	stopBGM: function () {
		return; // TODO
		var s = this.M.SE;
		if (s.isPlaying('PlayBGM')) return;
		s.stop('currentBGM');
		s.stop('TitleBGM');
	},

	SelectModeContainer: function () {
		this.Dialog = this.add.group();
		var dialog = this.M.S.genDialog('Dialog',{
			tint: this.M.getConst('SUB_TINT'),
		});
		dialog.switchShow();
		this.Dialog.add(dialog);
		var x = this.world.centerX;
		var y = 220;
		this.genModeTitleTextSprite(x,y);
		for (var key in this.GM.ModeInfos) {
			y+=180;
			this.genModeLabel(x,y,this.GM.ModeInfos[key]);
		}
	},

	genModeTitleTextSprite: function (x,y) {
		var textStyle = this.StaticBaseTextStyle();
		var text = 'モードを選択してください';
		var textSprite = this.M.S.genText(x,y,text,textStyle);
		textSprite.addGroup(this.Dialog);
	},

	genModeLabel: function (x,y,text) {
		var textStyle = this.StaticBaseTextStyle();
		var tint = this.M.getConst('MAIN_TINT');
		var label = this.M.S.BasicGrayLabel(x,y,function (btn) {
			var score = Number(btn.textSprite.text);
			this.GM.currentMode = score;
			this.GM.currentScore = score;
			this.HUD.changeScore(score);
			this.Dialog.setAll('pendingDestroy',true);
			this.start();
		},text,textStyle,{tint:tint});
		label.addGroup(this.Dialog);
	},

	start: function () {
		this.GM.isPlaying = true;
		this.startRound();
	},

	startRound: function () {
		this.HUD.showRound();
		this.GM.currentRoundTrumps = this.M.H.getRndItemsFromArr(this.GM.TrumpInfos,this.GM.ENABLE_SET_CARDS_NUM);
		this.GM.currentRoundTrumps.push('BackCard_Red');
		this.GM.currentCardNum = 0;
		this.GM.onDartsCardsNum = 0;
		for (var key in this.GM.Cards) this.GM.Cards[key].destroy();
		for (var key in this.GM.DartsInfos) {
			this.GM.DartsInfos[key].score = 0;
			this.GM.DartsInfos[key].setCard = 0;
		}
		for (var key in this.Darts) {
			var dartSprite = this.Darts[key];
			dartSprite.x = dartSprite.firstX;
			dartSprite.y = dartSprite.firstY;
		}
		this.setNextCard();
	},

	setNextCard: function () {
		this.GM.inputEnabled = false;
		var frameName = this.GM.currentRoundTrumps[this.GM.currentCardNum];
		this.GM.Card = this.add.sprite(this.GM.deckPos.x,this.GM.deckPos.y,'Trump',frameName);
		this.GM.Card.anchor.setTo(.5);
		var tween = this.M.T.moveA(this.GM.Card,{xy:{y:'+330'}});
		this.M.T.onComplete(tween, function () {
			this.GM.inputEnabled = true;
			this.GM.currentCardNum++;
		});
		tween.start();
	},

	gameOver: function () {
		this.GM.isPlaying = false;
		this.GM.inputEnabled = false;
		this.HUD.showGameOver();
		// this.M.SE.play('Gong'); // TODO
		this.time.events.add(1500, function () {
			this.ResultContainer();
			// this.M.SE.play('Gong'); // TODO
		}, this);
	},

	ResultContainer: function () {
		this.M.S.genDialog('Dialog',{
			// tint: this.M.getConst('SUB_TINT'),
			onComplete:this.openedResult,
		}).tweenShow();
	},

	openedResult: function () {
		var x = this.world.centerX;
		var y = this.world.centerY;
		var textStyle = this.StaticBaseTextStyle();
		var tint = this.M.getConst('MAIN_TINT');
		this.M.S.genText(x,y-570,'結果発表',this.M.H.mergeJson({fontSize:80},this.StaticBaseTextStyle()));
		this.genResultLevelTextSprite(x,y-350,{duration:800});
		this.genResultTimeTextSprite(x,y-150,{duration:800});
		this.genRestartLabel(x,y+100,textStyle,{duration:800,delay:600},tint);
		this.genTweetLabel(x,y+300,textStyle,{duration:800,delay:800},tint);
		this.genBackLabel(x,y+500,textStyle,{duration:800,delay:1000},tint);
	},

	genResultLevelTextSprite: function (x,y,tweenOption) {
		var textStyle = this.StaticBaseTextStyle();
		textStyle.fontSize = 90;
		var text = 'レベル: aaaaaa';
		var textSprite = this.M.S.genText(x,y,text,textStyle);
		textSprite.setScale(0,0);
		textSprite.addTween('popUpB',tweenOption);
		textSprite.startTween('popUpB');
	},

	genResultTimeTextSprite: function (x,y,tweenOption) {
		var textStyle = this.StaticBaseTextStyle();
		textStyle.fontSize = 90;
		var text = 'タイム: aaaa';
		var textSprite = this.M.S.genText(x,y,text,textStyle);
		textSprite.setScale(0,0);
		textSprite.addTween('popUpB',tweenOption);
		textSprite.startTween('popUpB');
	},

	genRestartLabel: function (x,y,textStyle,tweenOption,tint) {
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			this.M.NextScene('Play');
		},'もう一度プレイ',textStyle,{tint:tint});
		label.setScale(0,0);
		label.addTween('popUpB',tweenOption);
		label.startTween('popUpB');
	},

	genTweetLabel: function (x,y,textStyle,tweenOption,tint) {
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			this.tweet();
		},'結果をツイート',textStyle,{tint:tint});
		label.setScale(0,0);
		label.addTween('popUpB',tweenOption);
		label.startTween('popUpB');
	},

	genBackLabel: function (x,y,textStyle,tweenOption,tint) {
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			this.M.NextScene('Title');
		},'タイトルにもどる',textStyle,{tint:tint});
		label.setScale(0,0);
		label.addTween('popUpB',tweenOption);
		label.startTween('popUpB');
	},

	tweet: function () {
		var quotes = [
			'',
		];
		var emoji = '';
		var text = this.rnd.pick(quotes)+'\n'
					+emoji+'\n'
					+emoji+'\n'
					+'『'+this.M.getConst('GAME_TITLE')+'』で遊んだよ！\n';
		var hashtags = 'アリスゲーム,有栖ゲーム';
		this.M.H.tweet(text,hashtags,location.href);
	},

	StaticBaseTextStyle: function () {
		return {
			fill: this.M.getConst('MAIN_TEXT_COLOR'),
			stroke: this.M.getConst('WHITE_COLOR'),
			strokeThickness: 15,
			multipleStroke: this.M.getConst('MAIN_TEXT_COLOR'),
			multipleStrokeThickness: 10,
		};
	},

	Trender: function () {
	},

	test: function () {
		if (__ENV!='prod') {
			if(this.M.H.getQuery('gameOver')) this.gameOver();
		}
	},
};
