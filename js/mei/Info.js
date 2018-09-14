BasicGame.Boot.prototype.genStageInfo=function(){
	return {
		1:{targetCount:10,windGravityRate:1,targetVelocity:100,earthHealth:10,},
		2:{targetCount:10,windGravityRate:1,targetVelocity:100,earthHealth:10,},
		3:{targetCount:10,windGravityRate:1,targetVelocity:100,earthHealth:10,},
		4:{targetCount:10,windGravityRate:1,targetVelocity:100,earthHealth:10,},
		5:{targetCount:10,windGravityRate:1,targetVelocity:100,earthHealth:10,},
		6:{targetCount:10,windGravityRate:1,targetVelocity:100,earthHealth:10,},
		7:{targetCount:10,windGravityRate:1,targetVelocity:100,earthHealth:10,},
		8:{targetCount:10,windGravityRate:1,targetVelocity:100,earthHealth:10,},
		9:{targetCount:10,windGravityRate:1,targetVelocity:100,earthHealth:10,},
		10:{targetCount:10,windGravityRate:1,targetVelocity:100,earthHealth:10,},
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
			SelectStg:'レベルを選択',
			Again:'もういちど',
			NextStg:'次のレベルへ',
			OtherGames:'他のゲーム',
			Tweet:'結果をツイート',
			TweetTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			HowTo:'333333333333333333333333333333333333',//TODO
			Result:'結果',
			TweetHT:'めいゲーム',
			AllClear:'全て達成！',
		},
		en:{
			Start:'Start',
			Lang:'日本語',
			Back:'Back',
			SelectStg:'Select Level',
			Again:'Again',
			NextStg:'Next Level',
			OtherGames:'OtherGames',
			Tweet:'Tweet',
			TweetTtl:'I\'ve played the game "'+BasicGame.GAME_TITLE+'"!!!',
			HowTo:'333333333333333333333333333333333333',//TODO
			Result:'Result',
			TweetHT:'めいゲーム',
			AllClear:'ALL CLEAR',
		},
	};
};