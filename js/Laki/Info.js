BasicGame.Boot.prototype.genStageInfo=function(){
	return {
		1:{
			name:'Level 1',
			speed:.1,target:15,
			interval:1E3,
			obstacleRate:5,
		},
		2:{
			name:'Level 2',
			speed:.15,target:20,
			interval:900,
			obstacleRate:10,
		},
		3:{
			name:'Level 3',
			speed:.2,target:30,
			interval:800,
			obstacleRate:15,
		},
		4:{
			name:'Level 4',
			speed:.25,target:40,
			interval:700,
			obstacleRate:20,
		},
		5:{
			name:'Level 5',
			speed:.3,target:50,
			interval:600,
			obstacleRate:30,
		},
		6:{
			name:'Level 6',
			speed:.4,target:100,
			interval:580,
			obstacleRate:50,
		},
		7:{
			name:'チャレンジャー',//TODO EN
			speed:.4,target:100,
			interval:600,
			obstacleRate:70,
		},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	return {
		jp:{
			Start:'スタート',
			OtherGames:'他のゲーム',
			SelectStage:'レベルを選択',
			Back:'もどる',
			HowTo:'雲に飛び乗って\n下に落ちないようにしよう！\n\n雲は４つのレーンに\nわかれてるよ！\n\n同じレーンにはジャンプが\nできないので注意！\n\nカウントが０になるとクリア！\n虹河ラキちゃんを\nゴールまで届けよう！',
			HowToE:'雲に飛び乗って\n下に落ちないようにしよう！\n\n雲は４つのレーンに\nわかれてるよ！\n\n同じレーンにはジャンプが\nできないので注意！\n\n虹河ラキちゃんを\nどこまで行かせることが\nできるのか…\nチャレンジだ！',
			Tweet:'結果をツイート',
			TweetTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			Again:'もう一度',
		},
		// TODO
		en:{
			Start:'START',
			OtherGames:'OtherGames',
			SelectStage:'Select Level',
			Back:'Back',
			HowTo:'Let\'s Play!',
			HowToE:'Let\'s Play!',
			Tweet:'Tweet',
			TweetTtl:'"'+BasicGame.GAME_TITLE_EN+'"',
			Again:'Again',
		},
	};
};