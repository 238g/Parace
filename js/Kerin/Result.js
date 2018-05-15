BasicGame.Result = function () {};
BasicGame.Result.prototype = {
	init: function () {
		this.DeclearVal();
	},

	DeclearVal: function () {
		this.clearFlag = this.M.getGlobal('clearFlag');
		this.clearText = (this.clearFlag)?'クリア！':'残念！';
		this.curLevelKey = this.M.getGlobal('curLevelKey');
		this.LevelInfo = this.M.getConf('LevelInfo')[this.curLevelKey];
		this.spawnCount = this.M.getGlobal('spawnCount');
	},

	create: function () {
		var x = this.world.centerX;
		var y = this.world.centerY;
		this.add.sprite(0,0,'Sky');
		this.add.sprite(x,y,'Result_'+this.rnd.integerInRange(1,3)).anchor.setTo(.5);
		this.genResultTextSprite(x,100,'結果発表！',0);
		this.genResultTextSprite(x,200,(this.LevelInfo.infinite)?'回避数: '+this.spawnCount:this.clearText,800);
		this.genResultBtnSprite(x,y+200,'結果をツイート',this.tweet,1100);
		this.genResultBtnSprite(x,y+300,'タイトルにもどる',function () {
			this.M.SE.play('OnBtn',{volume:1});
			this.M.NextScene('Title');
		},1300);
	},

	genResultTextSprite: function (x,y,text,delay) {
		var textSprite = this.M.S.genText(x,y,text,this.M.S.BaseTextStyleS(40));
		textSprite.setScale(0,0);
		textSprite.addTween('popUpB',{duration:800,delay:delay});
		textSprite.startTween('popUpB');
	},

	genResultBtnSprite: function (x,y,text,func,delay) {
		var btnSprite = this.M.S.BasicWhiteLabelS(x,y,func,text,this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT});
		btnSprite.scale.setTo(0);
		this.M.T.popUpB(btnSprite,{duration:800,delay:delay}).start();
	},

	tweet: function () {
		this.M.SE.play('OnBtn',{volume:1});
		var resultText = (this.LevelInfo.infinite) ? '回避数: '+this.spawnCount : '結果: '+this.clearText;
		var emoji = '💥🚀💥🚀💥🚀';
		var text =  '『'+BasicGame.GAME_TITLE+'』で遊んだよ！\n'
					+emoji+'\n'
					+'目的地: '+this.LevelInfo.name+'\n'
					+resultText+'\n'
					+emoji+'\n';
		var hashtags = 'ケリンゲーム';
		this.M.H.tweet(text,hashtags,location.href);
	},

};
