BasicGame.Boot.prototype.genCharInfo=function(){
	return {
		/////////// 0
		1:{cName:'',
			scoreRate:1,addRespawnCount:0,playerSpeed:-500,reviveInterval:800,appearItemInterval:500,
			// scoreRate:1,addRespawnCount:0,playerSpeed:-500,reviveInterval:800,appearItemInterval:1E4,
			tw:'',
			yt:'',},
		2:{},
		3:{},
		4:{},
		/////////// 1
		5:{},
		6:{},
		7:{},
		8:{},
		9:{},
		/////////// 2
		10:{},
		11:{},
		12:{},
		13:{},
		14:{},
	};
};
BasicGame.Boot.prototype.genLevelInfo=function(){
	return {
		// TODO level 1~6?time attack60/120
		1:{leftTime:99,timeAttack:!1,},
		2:{leftTime:99,timeAttack:!1,},
		3:{leftTime:99,timeAttack:!1,},
		4:{leftTime:99,timeAttack:!1,},
		5:{leftTime:99,timeAttack:!1,},
		6:{leftTime:99,timeAttack:!1,},
		7:{leftTime:60,timeAttack:!0,},
		8:{leftTime:120,timeAttack:!0,},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	////// var touchJP=this.M.gGlb('TOUCH_OR_CLICK');
	////// var touchEN=this.M.gGlb('EN_TOUCH_OR_CLICK');
	return {
		jp:{
			Start:'スタート',
			Back:'もどる',
			Score:'スコア: ',
			LeftTime:'タイム: ',
			Clear:'クリア！',
			NotClear:'残念！',
			GameOver:'ゲームオーバー！',
			HowTo:'bbbbbbbbbbbbbbbbbb',
			Result:'結果',
			ResScore:'スコア\n',
			Again:'もう一度',
			NextLevel:'次のレベルへ',
			TwBtn:'結果をツイート',
			OtherGames:'他のゲーム',
			TwTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TwHT:'aaaaaaaaaaa',
			TimeUp:'タイムアップ！',
			TimeAttack:'タイムアタック',
		},
		// TODO
		en:{
		},
	};
};