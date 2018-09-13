BasicGame.Boot.prototype.genStageInfo=function(){
	return {
		1:{targetCount:10,windGravityRate:1,fireVelocity:300},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	var a=this.M.gGlb('TOUCH_OR_CLICK');
	// var b=this.M.gGlb('EN_TOUCH_OR_CLICK');
	return {
		jp:{
			Start:'スタート',
			Lang:'English',
			Back:'もどる',
			SelectStg:'ステージを選択',
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
			Start:'Start',
			Lang:'日本語',
			Back:'Back',
			SelectStg:'Select Stage',
		},
	};
};