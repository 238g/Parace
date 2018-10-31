BasicGame.Boot.prototype.genCharInfo=function(){
	//https://vrlive.party/member/
	// touch range / jump power / item velocity / next time
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
			WaveTime:'リスポーンまで: ',
			Result:'結果',
			Back:'もどる',
			ResScore:'スコア\n',
			Again:'もう一度',
			TwBtn:'結果をツイート',
			OtherGames:'他のゲーム',
			/*
			GameOver:'ゲームオーバー！',
			HowTo:'33333333',
			TwTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TwHT:'aaaaaaaaa',
			SelectChar:'メンバーを選択',
			TwSelectChar:'選んだメンバー: ',
			*/
		},
		en:{
		},
	};
};