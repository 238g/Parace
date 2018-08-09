BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GM = {};
		this.HUD = {};
		this.Darts = {};
		this.Board = {};
		this.Dialog = {};
		this.RuleDialog = {};
		this.time.events.removeAll();
	},

	create: function () {
		this.GameManager();
		this.BgContainer();
		this.RuleContainer();
		this.DartsContainer();
		this.HUDContainer();
		this.ready();
		this.test();
	},

	GameManager:function(){
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
			currentRoundDeckTrumps: [],
			currentCardNum: 0,
			onDartsCardsCount: 0,
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
			MAX_CARDS_COUNT: 6,
			MAX_CARDS_PER_DARTS_COUNT: 3,
			throwCount: 0,
			throwTimer: null,
			deckPos: {x:120,y:this.world.centerY+280},
			clearFlag: false,
		};
	},

	getTrumpInfors:function(){
		var a=[];
		for(var i=1;i<=13;i++)a.push('Heart_'+i);a.push('Spade_'+i);a.push('Club_'+i);a.push('Diamond_'+i);
		return a;
	},

	BgContainer: function () {
		this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
		this.genBgSprite();
		this.genDeckSprite();
		this.genBoardSprite();
	},

	genBgSprite: function () {
		this.add.sprite(this.world.centerX,this.world.centerY,'PlayBg').anchor.setTo(.5);
		if (this.game.device.desktop) {
			this.M.S.genText(this.world.centerX+80,280,'●',{
				fontSize:1630,
				fill:this.M.getConst('WHITE_COLOR'),
				stroke:this.M.getConst('MAIN_TEXT_COLOR'),
				strokeThickness: 15,
			});
		}
	},

	genDeckSprite: function () {
		this.add.sprite(this.GM.deckPos.x,this.GM.deckPos.y,'Trump','BackCard_Black').anchor.setTo(.5);
	},

	genBoardSprite: function () {
		this.Board = this.add.sprite(this.world.centerX+80,380,'Board');
		this.Board.anchor.setTo(.5);
	},

	RuleContainer: function () {
		this.genRuleBtnSprite();
		this.genRuleDialog();
		this.genRuleTextSprite();
	},

	genRuleDialog: function () {
		this.RuleDialog = this.M.S.genSprite(this.world.centerX,this.world.centerY,'Dialog');
		this.RuleDialog.anchor.setTo(.5);
		this.RuleDialog.UonInputDown(function (sprite) {
			this.GM.inputEnabled = true;
			sprite.hide();
		});
		this.RuleDialog.hide();
	},

	genRuleBtnSprite: function () {
		var label = this.M.S.BasicGrayLabel(120,this.world.centerY,function () {
			if (this.GM.isPlaying) {
				this.M.SE.play('OpenDialog',{volume:1.5});
				this.GM.inputEnabled = false;
				this.RuleDialog.bringToTop();
				this.RuleDialog.show();
			}
		},'ルール',this.StaticBaseTextStyle(),{tint:this.M.getConst('MAIN_TINT')});
		label.btnSprite.scale.setTo(1.2,2.2);
	},

	genRuleTextSprite: function () {
		var action = (this.game.device.touch) ? 'タッチ' : 'クリック';
		var ruleText = ''
			+'トランプとダーツを組み合わせた\n'
			+'新感覚のゲームよ✨\n'
			+'\n'
			+'1本のダーツにトランプを\n'
			+this.GM.MAX_CARDS_PER_DARTS_COUNT+'枚までセットして投げれるわっ❣\n'
			+'左上の点数を0にしたらクリア！\n'
			+'クリアは'+this.GM.MAX_ROUND_COUNT+'ターン以内にねっ💝\n'
			+'1ターンに'+this.GM.MAX_CARDS_COUNT+'枚まで山札からトランプを\n'
			+'引けるのよ✧*。ヾ(｡>﹏<｡)ﾉﾞ✧*。\n'
			+'\n'
			+'ダーツは1本ずつ倍率が変わるから\n'
			+'注意しなきゃっ((o(｡•ω•｡)o))✨\n'
			+'\n'
			+'カードをセットする時はダーツを\n'
			+action+'するんじゃいっヾﾉ｡ÒдÓ)ﾉｼ\n'
			+'点数がマイナスになると\n'
			+'1つ前に投げた点数に戻るわねっ💦\n'
			;
		var textStyle = this.StaticBaseTextStyle();
		textStyle.fontSize = 40;
		var textSprite = this.M.S.genText(0,50,ruleText,textStyle);
		this.RuleDialog.addChild(textSprite.multipleTextSprite);
		this.RuleDialog.addChild(textSprite);
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
			if (this.GM.DartsInfos[dartFrameName].setCard>=this.GM.MAX_CARDS_PER_DARTS_COUNT) return;
			this.M.SE.play('CardSlide',{volume:1.5});
			this.GM.inputEnabled = false;
			var addY=100+this.GM.DartsInfos[dartFrameName].setCard*70;
			this.M.T.moveA(this.GM.Card,{xy:{x:sprite.x,y:sprite.y+addY}}).start();
			this.GM.DartsInfos[dartFrameName].setCard += 1;
			this.GM.onDartsCardsCount++;
			this.GM.Cards.push(this.GM.Card);
			var cardFrameName = this.GM.Card.frameName;
			this.GM.DartsInfos[dartFrameName].score += (cardFrameName.split('_')[1]*this.GM.DartsInfos[dartFrameName].MULTIPLE_SCORE);
			if (this.GM.onDartsCardsCount>=this.GM.MAX_CARDS_COUNT) return this.throwDart();
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
		this.HUD.changeThrowCount(this.GM.throwCount);
		this.GM.beforeScore = this.GM.currentScore;
		var minusScore = this.GM.DartsInfos[frameName].score;
		this.GM.currentScore -= minusScore;
		this.HUD.minusScoreEffect(minusScore);
		this.HUD.changeScore(this.GM.currentScore);
		this.M.SE.play('HitDart',{volume:3});
		if (this.GM.currentScore==0) {
			this.time.events.remove(this.GM.throwTimer);
			this.GM.clearFlag = true;
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
		if (this.GM.currentRoundCount>=this.GM.MAX_ROUND_COUNT) return this.gameOver();
		this.GM.currentRoundCount++;
		this.startRound();
	},

	HUDContainer: function () {
		this.HUD = {
			self: this,
			showRound: null,
			showGameOver: null,
			changeScore: null,
			changeThrowCount: null,
			minusScoreEffect: null,
		};
		this.genRoundTextSprite();
		this.genScoreTextSprite();
		this.genThrowCountTextSprite();
		this.genMinusScoreTextSprite();
		this.genGameOverTextSprite();
	},

	genRoundTextSprite: function () {
		var textStyle = this.StaticBaseTextStyle();
		textStyle.fontSize = 100;
		var baseText = 'ラウンド目';
		var x = this.world.width+500;
		var y = this.world.centerY-200;
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
		textStyle.fill = '#e7161b';
		textStyle.multipleStroke = '#e7161b';
		var textSprite = this.M.S.genText(180,100,0,textStyle);
		textSprite.hide();
		textSprite.addTween('moveA',{xy:{y:'+50'}});
		this.M.T.onComplete(textSprite.multipleTextTween.moveA, function () {
			textSprite.hide();
			textSprite.move(180,100);
		});
		this.HUD.minusScoreEffect = function (minusScore) {
			textSprite.show();
			textSprite.changeText(baseText+minusScore);
			textSprite.startTween('moveA');
		};
	},

	genScoreTextSprite: function () {
		var baseText = '点数:';
		var textStyle = this.StaticBaseTextStyle();
		textStyle.fontSize = 60;
		var textSprite = this.M.S.genText(150,100,baseText+this.GM.currentScore,textStyle);
		this.HUD.changeScore = function (val) {
			textSprite.changeText(baseText+val);
		};
	},

	genThrowCountTextSprite: function () {
		var baseText = '投';
		var textStyle = this.StaticBaseTextStyle();
		textStyle.fontSize = 60;
		var textSprite = this.M.S.genText(150,200,this.GM.throwCount+baseText,textStyle);
		this.HUD.changeThrowCount = function (val) {
			textSprite.changeText(val+baseText);
		};
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
		var s = this.M.SE;
		if (s.isPlaying('PlayBGM')) return;
		s.play('PlayBGM',{isBGM:true,loop:true,volume:2});
	},

	stopBGM: function () {
		var s = this.M.SE;
		if (s.isPlaying('PlayBGM')) return;
		s.stop('currentBGM');
		s.stop('TitleBGM');
	},

	SelectModeContainer: function () {
		this.Dialog = this.add.group();
		var dialog = this.M.S.genDialog('Dialog');
		dialog.switchShow();
		this.Dialog.add(dialog);
		var x = this.world.centerX;
		var y = 280;
		this.genModeTitleTextSprite(x,y);
		for (var key in this.GM.ModeInfos) {
			y+=170;
			this.genModeLabel(x-150,y,this.GM.ModeInfos[key]);
		}
		this.genModeCharSprite();
		this.genModeRecommendTextSprite();
	},

	genModeTitleTextSprite: function (x,y) {
		var textStyle = this.StaticBaseTextStyle();
		var text = 'モードを選択して\nもらいたいわねっ💕';
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
		label.btnSprite.scale.setTo(1.5,2.2);
		label.addGroup(this.Dialog);
	},

	genModeCharSprite: function () {
		var charSprite = this.add.sprite(this.Dialog.right,this.Dialog.bottom,'Alice_1');
		charSprite.scale.setTo(.7);
		charSprite.anchor.setTo(1);
		this.Dialog.add(charSprite);
	},

	genModeRecommendTextSprite: function () {
		var textSprite = this.M.S.genText(this.Dialog.right-80,this.world.centerY-180,'←オススメ',this.StaticBaseTextStyle());
		textSprite.setAnchor(1,.5);
		this.M.T.pointingA(textSprite.multipleTextSprite,{xy:{x:'-50'}}).start();
		this.M.T.pointingA(textSprite,{xy:{x:'-50'}}).start();
		textSprite.addGroup(this.Dialog);
	},

	start: function () {
		this.GM.isPlaying = true;
		this.startRound();
		this.M.setGlobal('playCount',this.M.getGlobal('playCount')+1);
		myGa('play','Play','Mode_'+this.GM.currentMode,this.M.getGlobal('playCount'));
	},

	startRound: function () {
		this.HUD.showRound();
		this.GM.currentRoundDeckTrumps = this.M.H.getRndItemsFromArr(this.GM.TrumpInfos,this.GM.MAX_CARDS_COUNT);
		this.GM.currentRoundDeckTrumps.push('BackCard_Red');
		this.GM.currentCardNum = 0;
		this.GM.onDartsCardsCount = 0;
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
		var frameName = this.GM.currentRoundDeckTrumps[this.GM.currentCardNum];
		this.GM.Card = this.add.sprite(this.GM.deckPos.x,this.GM.deckPos.y,'Trump',frameName);
		this.GM.Card.anchor.setTo(.5);
		var tween = this.M.T.moveA(this.GM.Card,{xy:{y:'+330'}});
		this.M.T.onComplete(tween, function () {
			this.GM.inputEnabled = true;
			this.GM.currentCardNum++;
		});
		this.M.SE.play('CardSlide',{volume:1.5});
		tween.start();
	},

	gameOver: function () {
		this.GM.isPlaying = false;
		this.GM.inputEnabled = false;
		this.HUD.showGameOver();
		this.M.SE.play('GameOver');
		this.time.events.add(1500, function () {
			this.ResultContainer();
			this.M.SE.play('Applause',{volume:2});
		}, this);
	},

	ResultContainer: function () {
		this.M.S.genDialog('Dialog',{
			onComplete:this.openedResult,
		}).tweenShow();
	},

	openedResult: function () {
		var x = this.world.centerX;
		var y = this.world.centerY;
		this.genResultCharSprite(x,y+80);
		var tint = this.M.getConst('MAIN_TINT');
		var textStyle = this.StaticBaseTextStyle();
		textStyle.fontSize = 80;
		this.genResultTextSprite(x,y-500,'結果発表',textStyle);
		textStyle.fontSize = 60;
		this.genResultTextSprite(x-150,y-350,'モード: '+this.GM.currentMode,textStyle);
		this.genResultTextSprite(x-150,y-220,'ダーツ: '+this.GM.throwCount+'投',textStyle);
		this.genResultTextSprite(x-150,y-90,'ターン: '+this.GM.currentRoundCount,textStyle);
		this.genResultTextSprite(x-150,y+40,'結果: '+(this.GM.clearFlag?'クリア':'残念'),textStyle);
		textStyle.fontSize = 50;
		this.genRestartLabel(x,y+200,textStyle,{duration:800,delay:600},tint);
		this.genTweetLabel(x,y+350,textStyle,{duration:800,delay:800},tint);
		this.genBackLabel(x,y+500,textStyle,{duration:800,delay:1000},tint);
	},

	genResultCharSprite: function (x,y) {
		var clearArr = ['Giruzaren','Alice_3','Alice_4'];
		var key = (this.GM.clearFlag?this.rnd.pick(clearArr):'Alice_2');
		var charSprite = this.add.sprite(x,y,key);
		charSprite.anchor.setTo(0,1);
	},

	genResultTextSprite: function (x,y,text,textStyle) {
		var textSprite = this.M.S.genText(x,y,text,textStyle);
		textSprite.setScale(0,0);
		textSprite.addTween('popUpB',{duration:800});
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
		var emoji = '';
		for (var i=0;i<6;i++) {
			var rndNum = this.rnd.integerInRange(1,7);
			switch (rndNum) {
				case 1: emoji += '⏰'; break;
				case 2: emoji += '🃏'; break;
				case 3: emoji += '♠'; break;
				case 4: emoji += '♣'; break;
				case 5: emoji += '♦'; break;
				case 6: emoji += '♥'; break;
				case 7: emoji += '🐰'; break;
			}
		}
		var text = '『'+this.M.getConst('GAME_TITLE')+'』で遊んだよ！\n'
					+emoji+'\n'
					+'挑戦したモード: '+this.GM.currentMode+'\n'
					+'投げたダーツ数: '+this.GM.throwCount+'投'+'\n'
					+'所要ターン: '+this.GM.currentRoundCount+'\n'
					+'結果: '+(this.GM.clearFlag?'クリア😆':'残念😰')+'\n'
					+emoji+'\n';
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

	test: function () {
		if (__ENV!='prod') {
			if(this.M.H.getQuery('gameOver')) this.gameOver();
			if(this.M.H.getQuery('success')) this.time.events.add(2000,function () {this.GM.currentScore=0;},this);
			if(this.M.H.getQuery('failure')) this.GM.currentRoundCount=12;
			if(this.M.H.getQuery('mute')) this.sound.mute=true;
			if(this.M.H.getQuery('clear')) this.GM.clearFlag = this.M.H.getQuery('clear');
		}
	},
};
