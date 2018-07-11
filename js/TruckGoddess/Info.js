BasicGame.Boot.prototype.genStageInfo=function(){
	return {
		1:{
			jp_name:'イギリス',en_name:'England',lane:'LEFT',
			leftTime:30,carSpeed:6,tileSpeed:.1,scoreRate:1,respawnRateTimeBase:1500,
			isSecret:!1,},
		2:{
			jp_name:'フランス',en_name:'France',lane:'RIGHT',
			leftTime:60,carSpeed:8,tileSpeed:.12,scoreRate:1.2,respawnRateTimeBase:1E3,
			isSecret:!1,},
		3:{
			jp_name:'ドイツ',en_name:'Germany',lane:'RIGHT',
			leftTime:90,carSpeed:10,tileSpeed:.15,scoreRate:1.5,respawnRateTimeBase:800,
			isSecret:!1,},
		4:{
			jp_name:'チェコ',en_name:'Czech',lane:'RIGHT',
			leftTime:120,carSpeed:12,tileSpeed:.2,scoreRate:2,respawnRateTimeBase:600,
			isSecret:!1,},
		5:{
			jp_name:'日本',en_name:'Japan',lane:'LEFT',
			leftTime:120,carSpeed:3,tileSpeed:.05,scoreRate:3,respawnRateTimeBase:400,
			isSecret:!0,openSecret:!1,},
		6:{
			jp_name:'天界',en_name:'Heaven',lane:'ALL',
			leftTime:120,carSpeed:18,tileSpeed:.3,scoreRate:3,respawnRateTimeBase:400,
			isSecret:!0,openSecret:!1,},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	return {
		jp:{
			SS_Ttl:'目的地を選択！',
			HowTo:'usage handle\naaaaaaaa', // TODO usage handle
			Start:'スタート！',
			ScoreBaseFront:'罰金: ',
			ScoreBaseBack:'万円',
			TimeBaseFront:'残り: ',
			TimeBaseBack:'km',
			DestinationBase:'目的地: ',
			End:'目的地に\n到着！',
			ResTtl:'結果',
			Again:'もう一度',
			GoToSS:'目的地選択へ',
			Tweet:'結果をツイート',
			OtherGame:'他のゲーム',
			TweetTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			Break:'破壊\n-',
		},
		en:{
			//TODO
		},
	};
};