BasicGame.Boot.prototype.genCharInfo=function(){
	return {
		1:{},
		2:{},
		3:{},
		4:{},
		5:{},
	};
};
BasicGame.Boot.prototype.genLevelInfo=function(){
	return {
	};
};
BasicGame.Boot.prototype.genWords=function(){
	var touchJP=this.M.gGlb('TOUCH_OR_CLICK');
	// var touchEN=this.M.gGlb('EN_TOUCH_OR_CLICK');
	return {
		jp:{
			Start:'スタート',
			Score:'スコア: ',
			ResScore:'スコア\n',
			Back:'もどる',
			GameOver:'ゲームオーバー！',
			OtherGames:'他のゲーム',
			HowTo:'操作方法\n\n'+'選んだメンバーを\nジャンプさせて\nななしさんから逃げろ！\n'+touchJP+'すると\nジャンプできるよ\n\nスコアを\nどこまで\n伸ばせるかな？',
			TwBtn:'結果をツイート',
			TwTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TwHT:'あにまーれゲーム',
			Result:'結果',
			SelectTw:'選んだメンバー: ',
		},
		// TODO
		en:{
		},
	};
};