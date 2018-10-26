BasicGame.Boot.prototype.genCharInfo=function(){
	// TODO star 1~5// movie SS // watch this movie btn // so,,, need each mv url
	// TODO rare?? -> N,R,SR,SSR,UR
	return {
		1:{cName:'1'},
		2:{cName:'2'},
		3:{cName:'3'},
		4:{cName:'4'},
		5:{cName:'5'},
		6:{cName:'6'},
		7:{cName:'7'},
		8:{cName:'8'},
		9:{cName:'9'},
		10:{cName:'10'},
		11:{cName:'11'},
		12:{cName:'12'},
		13:{cName:'13'},
		14:{cName:'14'},
		15:{cName:'15'},
		16:{cName:'16'},
		17:{cName:'17'},
		18:{cName:'18'},
		19:{cName:'19'},
	};
};
BasicGame.Boot.prototype.genGachaInfo=function(){
	return {
		1:{},
		2:{},
		3:{},
		4:{},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	////// var touchJP=this.M.gGlb('TOUCH_OR_CLICK');
	////// var touchEN=this.M.gGlb('EN_TOUCH_OR_CLICK');
	return {
		jp:{
			Start:'スタート',
			Back:'もどる',
			Collection:'図鑑',
			Close:'とじる',
			Again:'もう一度！',
			TwBtn:'結果をツイート',
			OtherGames:'他のゲーム',
			/*
			Select:'４人選んでね！',
			Set:'セット',
			Speed:'スピード',
			Difficulty:'難易度',
			GameOver:'終了！',
			Result:'結果',
			Score:'スコア: ',
			ResScore:'スコア\n',
			HowTo:'aaaaaaaaaaaaaaa',
			TwTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TwHT:'Vtuberゲーム',
			SelectTw:'最初に選んだVtuber: ',
			*/
		},
		// TODO
		en:{
		},
	};
};
