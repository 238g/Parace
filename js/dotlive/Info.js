BasicGame.Boot.prototype.genCharInfo=function(){
	//https://vrlive.party/member/
	// touch range / jump power / item velocity / next time
	return {
		1:{cName:'もこ田めめめ',
			yt:'',tw:'',},
		2:{cName:'花京院ちえり',
			yt:'',tw:'',},
		3:{cName:'神楽すず',
			yt:'',tw:'',},
		4:{cName:'金剛いろは',
			yt:'',tw:'',},
		5:{cName:'カルロピノ',
			yt:'',tw:'',},
		6:{cName:'牛巻りこ',
			yt:'',tw:'',},
		7:{cName:'夜桜たま',
			yt:'',tw:'',},
		8:{cName:'木曽あずき',
			yt:'',tw:'',},
		9:{cName:'北上双葉',
			yt:'',tw:'',},
		10:{cName:'猫乃木もち',
			yt:'',tw:'',},
		11:{cName:'ヤマトイオリ',
			yt:'',tw:'',},
		12:{cName:'八重沢なとり',
			yt:'',tw:'',},
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
			SelectChar:'メンバーを選択',
			/*
			GameOver:'ゲームオーバー！',
			HowTo:'33333333',
			TwTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TwHT:'aaaaaaaaa',
			TwSelectChar:'選んだメンバー: ',
			*/
		},
		en:{
		},
	};
};