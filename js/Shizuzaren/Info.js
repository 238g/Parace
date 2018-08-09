
BasicGame.Boot.prototype.genWords=function(){
	var a=this.M.gGlb('TOUCH_OR_CLICK');
	// var b=this.M.gGlb('EN_TOUCH_OR_CLICK');
	return {
		jp:{
			Start:'スタート',
			Again:'もう一度',
			HowTo:'',
			Blow:'連打！',
			Tweet:'結果をツイート',
			TweetTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TweetHT:BasicGame.GAME_TITLE,
			TweetResDefault:'',
			TweetResTop:'',
			TweetResBack:'',
			Back:'もどる',
			OtherGames:'他のゲーム',
		},
		en:{// TODO
			Start:'START',
			Again:'Again',
			HowTo:'Let\'s Start!',
			Cast:'Let\'s Cast',
			Blow:'Blow!!',
			TweetTtl:'"'+BasicGame.GAME_TITLE_EN+'"',
			TweetHT:BasicGame.GAME_TITLE,
			TweetResDefault:'************************',
			TweetResTop:'************************',
			TweetResBack:'************************',
			Tweet:'Tweet',
			Back:'Back',
			OtherGames:'OtherGames',
		},
	};
};