BasicGame.Boot.prototype.genLevelInfo=function(){
	return {
		1:{objVel:-200,objGrv:0,playerTurnSpeed:250,objMode:1,tint:0xffffff,respawnInterval:2E3,goalCount:10,mode:'score',},
		2:{objVel:-300,objGrv:0,playerTurnSpeed:250,objMode:1,tint:0xf0e68c,respawnInterval:1900,goalCount:10,mode:'score',},
		3:{objVel:-400,objGrv:0,playerTurnSpeed:200,objMode:1,tint:0xf4a460,respawnInterval:1800,goalCount:15,mode:'score',},
		4:{objVel:-200,objGrv:-300,playerTurnSpeed:200,objMode:2,tint:0x98fb98,respawnInterval:1700,goalCount:15,mode:'score',},
		5:{objVel:-300,objGrv:-300,playerTurnSpeed:150,objMode:2,tint:0x00ff7f,respawnInterval:1600,goalCount:20,mode:'score',},
		6:{objVel:-400,objGrv:-300,playerTurnSpeed:150,objMode:2,tint:0x4169e1,respawnInterval:1200,goalCount:20,mode:'score',},
		7:{objVel:-500,objGrv:0,playerTurnSpeed:120,objMode:3,tint:0x0000cd,respawnInterval:1E3,goalCount:30,mode:'score',},
		8:{objVel:-500,objGrv:-300,playerTurnSpeed:120,objMode:3,tint:0xff7f50,respawnInterval:900,goalCount:30,mode:'score',},
		9:{objVel:-500,objGrv:-500,playerTurnSpeed:100,objMode:3,tint:0xff4500,respawnInterval:800,goalCount:50,mode:'score',},
		10:{objVel:-500,objGrv:-700,playerTurnSpeed:100,objMode:3,tint:0xdc143c,respawnInterval:700,goalCount:100,mode:'score',},
		11:{objVel:-500,objGrv:-200,playerTurnSpeed:100,objMode:3,tint:0xffffff,respawnInterval:800,goalCount:0,mode:'endless',},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	var touchJP=this.M.gGlb('TOUCH_OR_CLICK');
	////// var touchEN=this.M.gGlb('EN_TOUCH_OR_CLICK');
	return {
		jp:{
			Start:'スタート',
			Select:'レベルを選択',
			TargetScore:'目標: ',
			Score:'スコア: ',
			HP:'HP: ',
			Select:'レベルを選択',
			Back:'もどる',
			GameOver:'ゲームオーバー！',
			OtherGames:'他のゲーム',
			HowTo:'操作方法\n\n画面の左右を'+touchJP+'して\nYuNiと乙女丸を動かそう！\n丸を取るとスコアアップ\n四角を取るとHPが減るよ\n'+(this.game.device.desktop?'キーボードの\nFとJでも動かせるよ！':'')+'\n\n目標までスコアを稼ごう！',
			TwBtn:'結果をツイート',
			TwTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TwHT:'YuNiゲーム',
			TwLevel:'チャレンジしたレベル: ',
			TwMode:'スコアモード',
			TwRes:'結果: ',
			Result:'結果',
			Again:'もう一度',
			NextLevel:'次のレベルへ',
			Clear:'クリア！',
			ResScore:'スコア',
		},
		// TODO
		en:{
		},
	};
};