BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GM = null;
		this.HUD = null;
	},

	create: function () {
		this.GameManager();
		this.BgContainer();
		this.BtnContainer();
		this.HUDContainer();
		this.ready();
		this.test();
	},

	GameManager: function () {
		this.GM = {
			isPlaying: false,
		};
	},

	BgContainer: function () {
		this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
	},

	BtnContainer: function () {
	},

	HUDContainer: function () {
		this.HUD = {
			showGameOver:null,
			textStyle: this.StaticBaseTextStyle(),
		};
		this.genStartTextSprite();
		this.genGameOverTextSprite();
	},

	genStartTextSprite: function () {
		var baseText = 'スタート';
		var textSprite = this.M.S.genText(this.world.centerX,this.world.height-270,baseText,this.HUD.textStyle);
		textSprite.setAnchor(.5);
	},

	genGameOverTextSprite: function () {
		var baseText = 'クリア！！';
		var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,this.HUD.textStyle);
		textSprite.setAnchor(.5);
		textSprite.setScale(0,0);
		this.HUD.showGameOver = function () {
			textSprite.addTween('popUpB',{scale:{x:2,y:2}});
			textSprite.startTween('popUpB');
		};
	},

	start: function () {
		this.GM.isPlaying = true;
	},

	ready: function () {
		this.stopBGM();
		this.playBGM();
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

	gameOver: function () {
		this.GM.isPlaying = false;
	},

	ResultContainer: function () {
		this.M.S.genDialog('Dialog',{
			tint: this.M.getConst('SUB_TINT'),
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
			'はおー！',
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
