BasicGame.Result = function () {};
BasicGame.Result.prototype = {

	init: function () {
		this.CharInfo = this.M.getConf('CharInfo')[this.M.getGlobal('curCharKey')];
	},

	create: function () {
		this.BgContainer();
	},

	BgContainer: function () {
		var x = this.world.centerX;
		var y = this.world.centerY;
		this.genBgSprite(x,y);
		this.genResultCharSprite(x,y-100,300);
		this.genMainCharSprite();
		this.genResultTextSprite(x,120,'チャレンジせいこう！');
		this.genResultLabel(x*1.5,y+250,'もういちど',function () {
			this.M.NextScene('Play');
		},900);
		this.genResultLabel(x*1.5,y+400,'ツイートしちゃう',this.tweet,1100);
		this.genResultLabel(x*1.5,y+550,'タイトルにもどる',function () {
			this.M.NextScene('Title');
		},1300);
		this.genResultLabel(x*1.5,y+700,'ほぞんする…',function () {
			var a = document.createElement('a');
			a.href = this.CharInfo.bgImgPath;
			a.target = '_blank';
			a.download = this.CharInfo.DLFile;
			a.click();
		},1500);
	},

	genBgSprite: function (x,y) {
		var bgSprite = this.add.sprite(x,y,'Dialog');
		bgSprite.anchor.setTo(.5);
		bgSprite.scale.setTo(1.2);
	},

	genResultTextSprite: function (x,y,text) {
		var textSprite = this.M.S.genText(x,y,text,this.M.S.BaseTextStyle(80));
		textSprite.setScale(0,0);
		textSprite.addTween('popUpB',{duration:1300});
		textSprite.startTween('popUpB');
	},

	genResultCharSprite: function (x,y,delay) {
		var sprite = this.add.sprite(x,y,this.CharInfo.panelKey);
		sprite.anchor.setTo(.5);
		sprite.scale.setTo(0);
		this.M.T.popUpB(sprite,{duration:1300,delay:delay}).start();
	},

	genMainCharSprite: function () {
		var sprite = this.add.sprite(0,this.world.height,'Chihiro_1');
		sprite.anchor.setTo(0,1);
		this.M.S.genText(150,this.world.centerY+300,'ビキニ…',this.M.S.BaseTextStyle(60));
	},

	genResultLabel: function (x,y,text,func,delay) {
		var label = this.M.S.BasicGrayLabel(x,y,func,text,this.M.S.BaseTextStyle(50),{tint:BasicGame.MAIN_TINT});
		label.setScale(0,0);
		label.addTween('popUpB',{duration:800,delay:delay});
		label.startTween('popUpB');
	},

	tweet: function () {
		var quotes = [
			'がっくんおにいちゃんは1人でたくさんパシるんだよ！',
			'この世にえん罪なんてごまんとあるんだよぉ！！',
			'謝罪！謝罪！壺謝罪！',
			'草だよー！バカタレー！',
			'((＾ω＾≡＾ω＜ｷﾞｬｱｱｱｱｱｱｱ',
			'ばーん！それだけ？それだけなの？',
			'マニュアルを読んでいるような謝罪は誰も求めていないんだよぉ！わかるか？！',
			'にじさんじどうなってるんだよぉー！',
			'見えないんだったら感じて',
			'きたねぇなぁ！',
			'正直、（魔法少女を）やめたい',
			'スタンガントーク',
			'ちひろ、無茶ぶりするの好き！',
			'みんなビキニだよ',
			'床に頭くっつけて歩いてるよ',
			'ビキニでなんら問題ないはずだ',
			'なんでもかんでもまほうでかいけつしようとするな！',
			'まあそういうことだわな',
			'いい人じゃないかただの！',
			'だれ得な配信なんだよぉ！',
			'魔法少女っていう形を取っている',
			'ゴメンネソーリー',
			'なにそれ寒い',
			'ピース✌ピース✌',
		];
		var emoji = '🎀💙🎀💙🎀💙🎀';
		var text = 
					'『'+BasicGame.GAME_TITLE+'』で遊んだよ！\n'
					+emoji+'\n'
					+'今日の名言： 「'+this.rnd.pick(quotes)+'」\n'
					+emoji+'\n';
		var hashtags = 'ちひろゲーム';
		this.M.H.tweet(text,hashtags,location.href);
	},

};
