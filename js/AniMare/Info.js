BasicGame.Boot.prototype.genCharInfo=function(){
	return {
		1:{charName:'因幡はねる',hp:10,worldGravity:900,jumpX:200,jumpY:-500,chRecLvl:0,levelUpAdd:0,reduceOb:!1,
			yt:'',},
		2:{charName:'宇森ひなこ',hp:12,worldGravity:1500,jumpX:250,jumpY:-650,chRecLvl:0,levelUpAdd:0,reduceOb:!1,
			yt:'',},
		3:{charName:'宗谷いちか',hp:10,worldGravity:1500,jumpX:250,jumpY:-650,chRecLvl:14,levelUpAdd:5,reduceOb:!0,
			yt:'',},
		4:{charName:'日ノ隈らん',hp:20,worldGravity:1500,jumpX:250,jumpY:-550,chRecLvl:14,levelUpAdd:2,reduceOb:!1,
			yt:'',},
		5:{charName:'稲荷くろむ',hp:10,worldGravity:2000,jumpX:300,jumpY:-800,chRecLvl:14,levelUpAdd:0,reduceOb:!0,
			yt:'',},
	};
};
BasicGame.Boot.prototype.genLevelInfo=function(){
	return {
		1:{color:0x00ff00,nextLevel:10,thornCount:2,obCount:0,obAnglV:0,},
		2:{color:0x00ffff,nextLevel:20,thornCount:3,obCount:0,obAnglV:0,},
		3:{color:0x00ffff,nextLevel:30,thornCount:4,obCount:0,obAnglV:0,},
		4:{color:0x00ffff,nextLevel:35,thornCount:4,obCount:1,obAnglV:0,},
		5:{color:0x00ffff,nextLevel:40,thornCount:5,obCount:0,obAnglV:0,},
		6:{color:0x00ffff,nextLevel:45,thornCount:5,obCount:1,obAnglV:0,},
		7:{color:0x00ffff,nextLevel:50,thornCount:6,obCount:0,obAnglV:0,},
		8:{color:0x00ffff,nextLevel:55,thornCount:6,obCount:1,obAnglV:0,},
		9:{color:0x00ffff,nextLevel:60,thornCount:6,obCount:2,obAnglV:0,},
		10:{color:0x00ffff,nextLevel:68,thornCount:7,obCount:0,obAnglV:0,},
		11:{color:0x00ffff,nextLevel:75,thornCount:7,obCount:1,obAnglV:0,},
		12:{color:0x00ffff,nextLevel:85,thornCount:7,obCount:2,obAnglV:0,},
		13:{color:0x00ffff,nextLevel:98,thornCount:5,obCount:2,obAnglV:5,},
		14:{color:0x00ffff,nextLevel:105,thornCount:5,obCount:3,obAnglV:5,},
		15:{color:0x00ffff,nextLevel:113,thornCount:6,obCount:2,obAnglV:5,},
		16:{color:0x00ffff,nextLevel:120,thornCount:6,obCount:3,obAnglV:5,},
		17:{color:0x00ffff,nextLevel:130,thornCount:6,obCount:2,obAnglV:10,},
		18:{color:0x00ffff,nextLevel:140,thornCount:7,obCount:1,obAnglV:10,},
		19:{color:0x00ffff,nextLevel:150,thornCount:7,obCount:2,obAnglV:10,},
		20:{color:0x00ffff,nextLevel:160,thornCount:7,obCount:3,obAnglV:10,},
		21:{color:0x00ffff,nextLevel:170,thornCount:8,obCount:0,obAnglV:0,},
		22:{color:0x00ffff,nextLevel:180,thornCount:8,obCount:1,obAnglV:5,},
		23:{color:0x00ffff,nextLevel:190,thornCount:8,obCount:2,obAnglV:8,},
		24:{color:0x00ffff,nextLevel:200,thornCount:8,obCount:3,obAnglV:10,},
		25:{color:0x00ffff,nextLevel:0,thornCount:8,obCount:4,obAnglV:10,},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	// var touchJP=this.M.gGlb('TOUCH_OR_CLICK');
	// var touchEN=this.M.gGlb('EN_TOUCH_OR_CLICK');
	return {
		jp:{
			Start:'スタート',
			Score:'スコア: ',
			Back:'もどる',
			GameOver:'ゲームオーバー！',
			OtherGames:'他のゲーム',
			HowTo:'',
			TwBtn:'結果をツイート',
			TwTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TwHT:'',
			Result:'結果',
		},
		// TODO
		en:{
		},
	};
};