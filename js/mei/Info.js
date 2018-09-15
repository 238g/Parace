BasicGame.Boot.prototype.genStageInfo=function(){
	return {
		1:{trgtC:10,grvtyR:1,grvtyRTMX:16,trgtVlcty:60,earthHP:15,obRA:5,obRB:10,rndTmrMx:9E3,cntDwn:200,plsTfR:30,},
		2:{trgtC:20,grvtyR:2,grvtyRTMX:16,trgtVlcty:60,earthHP:15,obRA:5,obRB:10,rndTmrMx:8E3,cntDwn:195,plsTfR:30,},
		3:{trgtC:30,grvtyR:3,grvtyRTMX:14,trgtVlcty:70,earthHP:15,obRA:10,obRB:20,rndTmrMx:6E3,cntDwn:190,plsTfR:40,},
		4:{trgtC:40,grvtyR:4,grvtyRTMX:14,trgtVlcty:70,earthHP:12,obRA:10,obRB:20,rndTmrMx:5E3,cntDwn:185,plsTfR:40,},
		5:{trgtC:50,grvtyR:6,grvtyRTMX:12,trgtVlcty:80,earthHP:12,obRA:15,obRB:25,rndTmrMx:4E3,cntDwn:180,plsTfR:50,},
		6:{trgtC:60,grvtyR:6,grvtyRTMX:12,trgtVlcty:80,earthHP:9,obRA:15,obRB:30,rndTmrMx:4E3,cntDwn:175,plsTfR:50,},
		7:{trgtC:80,grvtyR:8,grvtyRTMX:10,trgtVlcty:90,earthHP:9,obRA:20,obRB:30,rndTmrMx:3E3,cntDwn:170,plsTfR:60,},
		8:{trgtC:100,grvtyR:8,grvtyRTMX:10,trgtVlcty:90,earthHP:6,obRA:25,obRB:40,rndTmrMx:3E3,cntDwn:165,plsTfR:60,},
		9:{trgtC:150,grvtyR:9,grvtyRTMX:8,trgtVlcty:100,earthHP:6,obRA:25,obRB:40,rndTmrMx:2E3,cntDwn:160,plsTfR:80,},
		10:{trgtC:200,grvtyR:9,grvtyRTMX:8,trgtVlcty:100,earthHP:4,obRA:30,obRB:50,rndTmrMx:2E3,cntDwn:150,plsTfR:80,},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	// var touchJP=this.M.gGlb('TOUCH_OR_CLICK');
	// var touchEN=this.M.gGlb('EN_TOUCH_OR_CLICK');
	return {
		jp:{
			Start:'スタート',
			Lang:'English',
			Back:'もどる',
			SelectStg:'レベルを選択',
			Again:'もういちど',
			NextStg:'次のレベルへ',
			OtherGames:'他のゲーム',
			Tweet:'結果をツイート',
			TweetTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TwClearLevel:'クリアレベル: ',
			TwChallengeLevel:'チャレンジレベル: ',
			TwToFCount:'クリアまでに集めた📛の数: ',
			HowTo:'豆腐をめがけて\n火を投げつけよう！\n📛を目的数獲得してね！\n\n火を外したり\nミソシタに当てたら\n地球が危ない！\n\n右上の重力値や\n時間制限もあるので注意！',
			Result:'結果',
			TweetHT:'めいゲーム',
			AllClear:'全て達成！',
		},
		en:{
			Start:'Start',
			Lang:'日本語',
			Back:'Back',
			SelectStg:'Select Level',
			Again:'Again',
			NextStg:'Next Level',
			OtherGames:'OtherGames',
			Tweet:'Tweet',
			TweetTtl:'I\'ve played the game "'+BasicGame.GAME_TITLE_EN+'"!!!',
			TwClearLevel:'ClearLevel: ',
			TwChallengeLevel:'ChallengeLevel: ',
			TwToFCount:'Total📛Count: ',
			HowTo:'Let\'s throw fire against Tofu!\nPlease earn 📛 \nthe purpose number!\n\nThe earth is dangerous \nif you remove the fire or \nhit the Mr.Missoshita\'s head!\n\nBe careful as there is \ngravity value \non the upper right \nand time limit!',
			Result:'Result',
			TweetHT:'MeiGame',
			AllClear:'ALL CLEAR',
		},
	};
};