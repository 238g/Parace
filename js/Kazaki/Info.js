BasicGame.Boot.prototype.genStageInfo=function(){
	return {
		1:{name:'Level 1',targetScore:0,closed:!1,
		},
		2:{name:'Level 2',targetScore:0,closed:!1,
		},
		3:{name:'Level 3',targetScore:0,closed:!1,
		},
		4:{name:'Level 4',targetScore:0,closed:!1,
		},
		5:{name:'タイムアタック60',targetScore:0,closed:!1,
		},
		6:{name:'タイムアタック120',targetScore:0,closed:!1,
		},
		7:{name:'サドンデススコア',targetScore:0,closed:!1,
		},
		8:{name:'サドンデススコア改',targetScore:0,closed:!0,
		},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	return {
		jp:{
			Start:'スタート',
			OtherGames:'他のゲーム',
			Back:'もどる',
			Again:'もういちど',
			HowTo:'',
			Tweet:'結果をツイート',
			TweetTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			Clear:'',
		},
		en:{},//TODO
	};
};