BasicGame.Boot.prototype.genStageInfo=function(){
	return {
		1:{
			jp_name:'イギリス',en_name:'England',lane:'LEFT',
			leftTime:30,carSpeed:6,tileSpeed:.1,scoreRate:1,respawnRate:1,
			isSecret:!1,},
		2:{
			jp_name:'フランス',en_name:'France',lane:'RIGHT',
			leftTime:30,carSpeed:6,tileSpeed:.1,scoreRate:1,respawnRate:1,
			isSecret:!1,},
		3:{
			jp_name:'ドイツ',en_name:'Germany',lane:'RIGHT',
			leftTime:30,carSpeed:6,tileSpeed:.1,scoreRate:1,respawnRate:1,
			isSecret:!1,},
		4:{
			jp_name:'チェコ',en_name:'Czech',lane:'RIGHT',
			leftTime:30,carSpeed:6,tileSpeed:.1,scoreRate:1,respawnRate:1,
			isSecret:!1,},
		5:{
			jp_name:'日本',en_name:'Japan',lane:'LEFT',
			leftTime:30,carSpeed:6,tileSpeed:.1,scoreRate:1,respawnRate:1,
			isSecret:!0,openSecret:!1,},
		6:{
			jp_name:'天界',en_name:'Heaven',lane:'ALL',
			leftTime:30,carSpeed:6,tileSpeed:.1,scoreRate:1,respawnRate:1,
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
			ScoreBaseBack:'円',
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
		},
		en:{
			//TODO
		},
	};
};