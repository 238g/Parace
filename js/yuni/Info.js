BasicGame.Boot.prototype.genLevelInfo=function(){
	//grv0-800 vel200-400 playerTurnSpeed100-250
	return {
		1:{nextLevel:10,objVel:-200,objGrv:0,playerTurnSpeed:250,objMode:1,tint:0xff00ff,},
		2:{nextLevel:10,objVel:-250,objGrv:0,playerTurnSpeed:250,objMode:1,tint:0xffffff,},
		3:{nextLevel:10,objVel:-300,objGrv:0,playerTurnSpeed:250,objMode:1,tint:0xffffff,},
		4:{nextLevel:10,objVel:-200,objGrv:-500,playerTurnSpeed:250,objMode:1,tint:0xffffff,},
		5:{nextLevel:10,objVel:-250,objGrv:-500,playerTurnSpeed:250,objMode:1,tint:0xffffff,},
		6:{nextLevel:10,objVel:-200,objGrv:-800,playerTurnSpeed:250,objMode:1,tint:0xffffff,},
		//TODO
		1:{nextLevel:10,objVel:-400,objGrv:-800,playerTurnSpeed:100,objMode:1,tint:0xffffff,},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	////// var touchJP=this.M.gGlb('TOUCH_OR_CLICK');
	////// var touchEN=this.M.gGlb('EN_TOUCH_OR_CLICK');
	return {
		jp:{
			Start:'スタート',
			TargetScore:'目標: ',
			Score:'スコア: ',
			HP:'HP: ',
			Select:'レベルを選択',
			ResScore:'スコア\n',
			Back:'もどる',
			GameOver:'ゲームオーバー！',
			OtherGames:'他のゲーム',
			HowTo:'bbbbbbbbbbbbbbbbbb',
			TwBtn:'結果をツイート',
			TwTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TwHT:'aaaaaaaaaaa',
			Result:'結果',
			Again:'もう一度',
			NextLevel:'次のレベルへ',
		},
		// TODO
		en:{
		},
	};
};