BasicGame.Boot.prototype.genCharInfo=function(){
	return {};
};
BasicGame.Boot.prototype.genWords=function(){
	var a=this.M.gGlb('TOUCH_OR_CLICK');
	// var b=this.M.gGlb('EN_TOUCH_OR_CLICK');
	return {
		jp:{
			Start:'スタート',
			Lang:'English',
			/*
			HowTo:'',
			Result:'結果',
			Again:'もういちど',
			Back:'もどる',
			Tweet:'結果をツイート',
			OtherGames:'他のゲーム',
			TweetTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TweetFirstGotCard:'最初にゲットしたVtuber: \n',
			TweetFalseCount:'お手つき: ',
			TweetClearTimeFront:'クリアタイム: ',
			TweetClearTimeBack:'秒',
			TweetHT:'upd8ゲーム',
			*/
		},
		en:{
			Start:'START',
			Lang:'日本語',
		},
	};
};