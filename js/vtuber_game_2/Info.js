BasicGame.Boot.prototype.genCharInfo=function(){
	// TODO star 1~5// movie SS // watch this movie btn // so,,, need each mv url
	// TODO rare?? -> N,R,SR,SSR,UR
	return {
		1:{cName:'ベルモンド・バンデラス'},
		2:{cName:'肉赤子ちゃんPB'},
		3:{cName:'日向ヒマリ'},
		4:{cName:'にまいジータ'},
		5:{cName:'ひゅうがなつ'},
		6:{cName:'アルハ永'},
		7:{cName:'仄暗チカゲ'},
		8:{cName:'nini宮'},
		9:{cName:'ださお'},
		10:{cName:'白鳥天羽'},
		11:{cName:'魔王の息子わんわん'},
		12:{cName:'星咲ちあ'},
		13:{cName:'闇落ちVtuberめあ'},
		14:{cName:'勇者ことね'},
		15:{cName:'狐塚ひより'},
		16:{cName:'桜こまり'},
		17:{cName:'高峰伊織'},
		18:{cName:'マリー・アンドロイド'},
		19:{cName:'大谷さん'},
		20:{cName:'イドちゃん'},
		21:{cName:'丸三角シカク'},
		22:{cName:'天羽よつは'},
		23:{cName:'魔王マグロナ'},
		24:{cName:'白真クマ'},
		25:{cName:'乾伸一郎'},
		26:{cName:'ジョー・力一(りきいち)'},
		27:{cName:'海月ねう'},
		28:{cName:'勇者カキ'},
		29:{cName:'フィリア'},
		30:{cName:'さらり'},
		31:{cName:'フラム'},
		32:{cName:'夕陽リリ'},
		33:{cName:'薬袋カルテ'},
		34:{cName:'兎鞠まり'},
		/*
		35:{cName:'35'},
		36:{cName:'36'},
		37:{cName:'37'},
		38:{cName:'38'},
		39:{cName:'39'},
		*/
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
