BasicGame.Boot.prototype.genCharInfo=function(){
	return {
		1:{},
	};
};
BasicGame.Boot.prototype.genLevelInfo=function(){
	return {
		1:{},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	////// var touchJP=this.M.gGlb('TOUCH_OR_CLICK');
	////// var touchEN=this.M.gGlb('EN_TOUCH_OR_CLICK');
	return {
		jp:{
			Start:'スタート',
			Score:'スコア: ',
			ResScore:'スコア\n',
			Back:'もどる',
			GameOver:'ゲームオーバー！',
			OtherGames:'他のゲーム',
			HowTo:'bbbbbbbbbbbbbbbbbb',
			TwBtn:'結果をツイート',
			TwTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TwHT:'aaaaaaaaaaa',
			Result:'結果',
			SelectTw:'選んだメンバー: ',
			Again:'もう一度',
		},
		// TODO
		en:{
		},
	};
};