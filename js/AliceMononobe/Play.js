BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){
		this.GM=this.HUD=this.Darts=this.Board=this.Dialog=this.RuleDialog={};
	},
	create:function(){
		this.time.events.removeAll();
		this.GameManager();
		this.BgContainer();
		this.RuleContainer();
		this.DartsContainer();
		this.HUDContainer();
		this.ready();
		this.test();
	},
	GameManager:function(){
		this.GM={
			inputEnabled:!1,isPlaying:!1,
			Card:{},Cards:[],
			currentRoundCount:1,
			MAX_ROUND_COUNT:12,
			currentMode:301,
			ModeInfos:[301,501,701,901,1001,1501],
			currentScore:301,
			beforeScore:301,
			TrumpInfos:this.getTrumpInfors(),
			currentRoundDeckTrumps:[],
			currentCardNum:0,
			onDartsCardsCount:0,
			DartsInfos:{
				Dart_blue:{score:0,setCard:0,MULTIPLE_SCORE:1,},
				Dart_red:{score:0,setCard:0,MULTIPLE_SCORE:3,},
				Dart_yellow:{score:0,setCard:0,MULTIPLE_SCORE:5,},},
			MAX_CARDS_COUNT:6,
			MAX_CARDS_PER_DARTS_COUNT:3,
			throwCount:0,
			throwTimer:null,
			deckPos:{x:this.world.width*.13,y:this.world.height-400*.67},
			clearFlag:!1,
		};
	},
	getTrumpInfors:function(){
		var a=[];
		for(var i=1;i<=13;i++){
			a.push('Heart_'+i);
			a.push('Spade_'+i);
			a.push('Club_'+i);
			a.push('Diamond_'+i);
		}
		return a;
	},
	BgContainer: function () {
		this.stage.backgroundColor=this.M.getConst('WHITE_COLOR');
		this.genBgSprite();
		this.add.sprite(this.GM.deckPos.x,this.GM.deckPos.y,'Trump','BackCard_Black').anchor.setTo(.5);
		this.Board=this.add.sprite(this.world.centerX+40,190,'Board');
		this.Board.anchor.setTo(.5);
	},
	genBgSprite:function(){
		this.add.sprite(this.world.centerX,this.world.centerY,'PlayBg').anchor.setTo(.5);
		if (this.game.device.desktop){
			this.M.S.genText(this.world.centerX+40,140,'●',{
				fontSize:815,
				fill:this.M.getConst('WHITE_COLOR'),
				stroke:this.M.getConst('MAIN_TEXT_COLOR'),
				strokeThickness:8,
			});
		}
	},
	RuleContainer: function () {
		this.genRuleBtnSprite();
		this.genRuleDialog();
		this.genRuleTextSprite();
	},
	genRuleDialog: function () {
		this.RuleDialog=this.M.S.genSprite(this.world.centerX,this.world.centerY,'Dialog');
		this.RuleDialog.anchor.setTo(.5);
		this.RuleDialog.UonInputDown(function(sprite){
			this.GM.inputEnabled=!0;
			sprite.hide();
		});
		this.RuleDialog.hide();
	},
	genRuleBtnSprite: function () {
		var lbl=this.M.S.BasicGrayLabelM(this.world.width*.22,this.world.centerY,function(){
			if (this.GM.isPlaying) {
				this.M.SE.play('OpenDialog',{volume:1.5});
				this.GM.inputEnabled = false;
				this.RuleDialog.bringToTop();
				this.RuleDialog.show();
			}
		},'ルール',this.StaticBaseTextStyle(),{tint:this.M.getConst('MAIN_TINT')});
	},
	genRuleTextSprite: function () {
		var action=(this.game.device.touch)?'タッチ':'クリック';
		var ruleText=''
			+'トランプとダーツを組み合わせた\n'
			+'新感覚のゲームよ✨\n'
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
			+'1つ前に投げた点数に戻るわねっ💦\n';
		var textStyle=this.StaticBaseTextStyle();
		textStyle.fontSize=20;
		var textSprite=this.M.S.genText(0,20,ruleText,textStyle);
		this.RuleDialog.addChild(textSprite.multipleTextSprite);
		this.RuleDialog.addChild(textSprite);
	},
	DartsContainer: function () {
		var centerX=this.Board.x;
		var y=this.world.height*.7;
		this.Darts={
			Dart_blue:this.genDartSprite(centerX-100,y,'Dart_blue'),
			Dart_red:this.genDartSprite(centerX,y,'Dart_red'),
			Dart_yellow:this.genDartSprite(centerX+100,y,'Dart_yellow'),};
	},
	genDartSprite:function(x,y,frame){
		var dart=this.M.S.genSprite(x,y,'Darts',frame);
		dart.anchor.setTo(.5);
		dart.firstX=dart.x;
		dart.firstY=dart.y;
		dart.UonInputDown(this.setCardToDart);
		this.genMultipleScoreTextSprite(x,y-75,this.GM.DartsInfos[frame].MULTIPLE_SCORE);
		this.genPointingArrowSprite(x,y+150);
		return dart;
	},
	setCardToDart: function (sprite) {
		if (this.GM.isPlaying && this.GM.inputEnabled) {
			var dartFrameName = sprite.frameName;
			if (this.GM.DartsInfos[dartFrameName].setCard>=this.GM.MAX_CARDS_PER_DARTS_COUNT) return;
			this.M.SE.play('CardSlide',{volume:1.5});
			this.GM.inputEnabled = false;
			var addY=100+this.GM.DartsInfos[dartFrameName].setCard*35;
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
			var tween = this.M.T.moveB(this.Darts[frameName],{xy:{y:this.Board.y+this.rnd.integerInRange(0,200)},duration:200});
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
	HUDContainer:function(){
		this.HUD={
			self:this,
			showRound:null,
			showGameOver:null,
			changeScore:null,
			changeThrowCount:null,
			minusScoreEffect:null,
		};
		this.genRoundTextSprite();
		this.genScoreTextSprite();
		this.genThrowCountTextSprite();
		this.genMinusScoreTextSprite();
		this.genGameOverTextSprite();
	},
	genRoundTextSprite:function(){
		var textStyle=this.StaticBaseTextStyle();
		textStyle.fontSize=50;
		var x=this.world.width*1.5;
		var y=this.world.height*.4;
		var ts=this.M.S.genText(x,y,this.GM.currentRoundCount+'ラウンド目',textStyle);
		ts.setAnchor(.5);
		ts.hide();
		ts.addTween('moveA',{xy:{x:this.world.centerX},tweenName:'move1'});
		ts.addTween('moveA',{xy:{x:-500},tweenName:'move2',delay:500});
		ts.chainTween('move1','move2');
		this.M.T.onComplete(ts.multipleTextTween.move2,function(s){
			ts.move(x,y);
		});
		this.HUD.showRound=function(){
			ts.changeText(this.self.GM.currentRoundCount+'ラウンド目');
			ts.show();
			ts.startTween('move1');
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
	genScoreTextSprite:function(){
		var txtstyl=this.StaticBaseTextStyle();
		txtstyl.fontSize=30;
		var ts=this.M.S.genText(75,50,'点数:'+this.GM.currentScore,txtstyl);
		this.HUD.changeScore=function(v){ts.changeText('点数:'+v)};
	},
	genThrowCountTextSprite: function () {
		var txtstyl=this.StaticBaseTextStyle();
		txtstyl.fontSize=30;
		var ts=this.M.S.genText(75,100,this.GM.throwCount+'投',txtstyl);
		this.HUD.changeThrowCount=function(v){ts.changeText(v+'投')};
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
	playBGM:function(){
		var s=this.M.SE;
		if(s.isPlaying('PlayBGM'))return;
		s.play('PlayBGM',{isBGM:true,loop:true,volume:2});
	},
	stopBGM:function(){
		var s=this.M.SE;
		if (s.isPlaying('PlayBGM'))return;
		s.stop('currentBGM');
		s.stop('TitleBGM');
	},
	SelectModeContainer:function(){
		this.Dialog=this.add.group();
		var dialog=this.M.S.genDialog('Dialog');
		dialog.switchShow();
		this.Dialog.add(dialog);
		var x=this.world.centerX;
		var y=140;
		var textSprite = this.M.S.genText(x,y,'モードを選択して\nもらいたいわねっ💕',this.StaticBaseTextStyle());
		textSprite.addGroup(this.Dialog);
		for (var k in this.GM.ModeInfos) {
			y+=85;
			this.genModeLabel(x-75,y,this.GM.ModeInfos[k]);
		}
		this.genModeCharSprite();
		this.genModeRecommendTextSprite();
	},
	genModeLabel:function(x,y,text){
		var textStyle=this.StaticBaseTextStyle();
		var tint=this.M.getConst('MAIN_TINT');
		var lbl=this.M.S.BasicGrayLabelM(x,y,function(btn) {
			var score=Number(btn.children[0].text);
			this.GM.currentMode=score;
			this.GM.currentScore=score;
			this.HUD.changeScore(score);
			this.Dialog.setAll('pendingDestroy',!0);
			this.start();
		},text,textStyle,{tint:tint});
		this.Dialog.add(lbl);
	},
	genModeCharSprite: function () {
		var charSprite = this.add.sprite(this.Dialog.right,this.Dialog.bottom,'Alice_1');
		charSprite.scale.setTo(.7);
		charSprite.anchor.setTo(1);
		this.Dialog.add(charSprite);
	},
	genModeRecommendTextSprite: function () {
		var textSprite=this.M.S.genText(this.Dialog.right-40,this.world.centerY-90,'←オススメ',this.StaticBaseTextStyle());
		textSprite.setAnchor(1,.5);
		this.M.T.pointingA(textSprite.multipleTextSprite,{xy:{x:'-50'}}).start();
		this.M.T.pointingA(textSprite,{xy:{x:'-50'}}).start();
		textSprite.addGroup(this.Dialog);
	},
	start:function(){
		this.GM.isPlaying=!0;
		this.startRound();
		this.M.setGlobal('playCount',this.M.getGlobal('playCount')+1);
		myGa('play','Play','Mode_'+this.GM.currentMode,this.M.getGlobal('playCount'));
	},
	startRound:function(){
		this.HUD.showRound();
		this.GM.currentRoundDeckTrumps=this.M.H.getRndItemsFromArr(this.GM.TrumpInfos,this.GM.MAX_CARDS_COUNT);
		this.GM.currentRoundDeckTrumps.push('BackCard_Red');
		this.GM.currentCardNum=0;
		this.GM.onDartsCardsCount=0;
		for (var k in this.GM.Cards) this.GM.Cards[k].destroy();
		for (var k in this.GM.DartsInfos){
			this.GM.DartsInfos[k].score=0;
			this.GM.DartsInfos[k].setCard=0;
		}
		for (var k in this.Darts){
			var dart=this.Darts[k];
			dart.x=dart.firstX;
			dart.y=dart.firstY;
		}
		this.setNextCard();
	},
	setNextCard:function(){
		this.GM.inputEnabled=!1;
		var frameName=this.GM.currentRoundDeckTrumps[this.GM.currentCardNum];
		this.GM.Card=this.add.sprite(this.GM.deckPos.x,this.GM.deckPos.y,'Trump',frameName);
		this.GM.Card.anchor.setTo(.5);
		var tw=this.M.T.moveA(this.GM.Card,{xy:{y:'+150'}});
		this.M.T.onComplete(tw,function(){
			this.GM.inputEnabled=!0;
			this.GM.currentCardNum++;
		});
		this.M.SE.play('CardSlide',{volume:1.5});
		tw.start();
	},
	gameOver:function(){
		this.GM.isPlaying=!1;
		this.GM.inputEnabled=!1;
		this.HUD.showGameOver();
		this.M.SE.play('GameOver');
		this.time.events.add(1500,function(){
			this.ResultContainer();
			this.M.SE.play('Applause',{volume:2});
		},this);
	},
	ResultContainer:function(){
		this.M.S.genDialog('Dialog',{
			onComplete:this.openedResult,
		}).tweenShow();
	},
	openedResult:function(){
		var x=this.world.centerX;
		var y=this.world.centerY;
		this.genResultCharSprite(x,y+40);
		var tint=this.M.getConst('MAIN_TINT');
		var textStyle=this.StaticBaseTextStyle();
		textStyle.fontSize=40;
		this.genResultTextSprite(x,y-250,'結果発表',textStyle);
		textStyle.fontSize=30;
		this.genResultTextSprite(x-75,y-175,'モード: '+this.GM.currentMode,textStyle);
		this.genResultTextSprite(x-75,y-110,'ダーツ: '+this.GM.throwCount+'投',textStyle);
		this.genResultTextSprite(x-75,y-45,'ターン: '+this.GM.currentRoundCount,textStyle);
		this.genResultTextSprite(x-75,y+20,'結果: '+(this.GM.clearFlag?'クリア':'残念'),textStyle);
		textStyle.fontSize=25;
		this.genRestartLabel(x,y+100,textStyle,{duration:800,delay:600},tint);
		this.genTweetLabel(x,y+175,textStyle,{duration:800,delay:800},tint);
		this.genBackLabel(x,y+250,textStyle,{duration:800,delay:1000},tint);
	},
	genResultCharSprite:function(x,y){
		var clearArr=['Giruzaren','Alice_3','Alice_4'];
		var key=(this.GM.clearFlag?this.rnd.pick(clearArr):'Alice_2');
		var charSprite=this.add.sprite(x,y,key);
		charSprite.anchor.setTo(0,1);
	},
	genResultTextSprite:function(x,y,text,textStyle){
		var ts=this.M.S.genText(x,y,text,textStyle);
		ts.setScale(0,0);
		ts.addTween('popUpB',{duration:800});
		ts.startTween('popUpB');
	},
	genRestartLabel:function(x,y,textStyle,twOp,tint){
		var l=this.M.S.BasicGrayLabelM(x,y,function(){
			this.M.NextScene('Play');
		},'もう一度プレイ',textStyle,{tint:tint});
		l.scale.setTo(0);
		this.M.T.popUpB(l,twOp).start();
	},

	genTweetLabel:function(x,y,textStyle,twOp,tint){
		var l=this.M.S.BasicGrayLabelM(x,y,function(){
			this.tweet();
		},'結果をツイート',textStyle,{tint:tint});
		l.scale.setTo(0);
		this.M.T.popUpB(l,twOp).start();
	},

	genBackLabel:function(x,y,textStyle,twOp,tint){
		var l=this.M.S.BasicGrayLabelM(x,y,function(){
			this.M.NextScene('Title');
		},'タイトルにもどる',textStyle,{tint:tint});
		l.scale.setTo(0);
		this.M.T.popUpB(l,twOp).start();
	},
	tweet:function(){
		var emoji = '';
		for(var i=0;i<6;i++){
			var rndNum=this.rnd.integerInRange(1,7);
			switch(rndNum){
				case 1: emoji+='⏰'; break;
				case 2: emoji+='🃏'; break;
				case 3: emoji+='♠'; break;
				case 4: emoji+='♣'; break;
				case 5: emoji+='♦'; break;
				case 6: emoji+='♥'; break;
				case 7: emoji+='🐰'; break;
			}
		}
		var text='『'+this.M.getConst('GAME_TITLE')+'』で遊んだよ！\n'
					+emoji+'\n'
					+'挑戦したモード: '+this.GM.currentMode+'\n'
					+'投げたダーツ数: '+this.GM.throwCount+'投'+'\n'
					+'所要ターン: '+this.GM.currentRoundCount+'\n'
					+'結果: '+(this.GM.clearFlag?'クリア😆':'残念😰')+'\n'
					+emoji+'\n';
		var hashtags='アリスゲーム,有栖ゲーム';
		this.M.H.tweet(text,hashtags,location.href);
	},
	StaticBaseTextStyle:function(){
		return {
			fill:this.M.getConst('MAIN_TEXT_COLOR'),
			stroke:this.M.getConst('WHITE_COLOR'),
			strokeThickness:8,
			multipleStroke:this.M.getConst('MAIN_TEXT_COLOR'),
			multipleStrokeThickness:5,
			fontSize:25,
		};
	},
	test:function(){
		if (__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
			this.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(function(){
				this.GM.currentScore=0;
			},this);
			this.input.keyboard.addKey(Phaser.Keyboard.F).onDown.add(function(){
				this.GM.currentRoundCount=12;
			},this);
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function(){
				this.GM.clearFlag=!0;
			},this);
		}
	},
};
