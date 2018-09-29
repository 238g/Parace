BasicGame.Boot.prototype.genCharInfo=function(){
	return {
		1:{charName:'因幡はねる',hp:10,worldGravity:900,jumpX:200,jumpY:-500,chRecLvl:0,levelUpAdd:0,reduceOb:!1,restitution:1,
			effTint:0xe1ae5e,yt:'https://www.youtube.com/channel/UC0Owc36U9lOyi9Gx9Ic-4qg',
			color:'#e1ae5e',tw:'https://twitter.com/Haneru_Inaba',
			emoji:'💛🐰💛🐰💛🐰💛',},
		2:{charName:'宇森ひなこ',hp:12,worldGravity:1500,jumpX:250,jumpY:-650,chRecLvl:0,levelUpAdd:0,reduceOb:!1,restitution:1,
			effTint:0xf06dc0,yt:'https://www.youtube.com/channel/UChqYnJlFxlBi6DfRz6jRenQ',
			color:'#f06dc0',tw:'https://twitter.com/Hinako_Umori',
			emoji:'🎀🦇🎀🦇🎀🦇🎀',},
		3:{charName:'宗谷いちか',hp:10,worldGravity:1500,jumpX:250,jumpY:-650,chRecLvl:14,levelUpAdd:5,reduceOb:!0,restitution:1,
			effTint:0x6ab1ff,yt:'https://www.youtube.com/channel/UC2kyQhzGOB-JPgcQX9OMgEw',
			color:'#6ab1ff',tw:'https://twitter.com/Ichika_Souya',
			emoji:'🎈🐶🎈🐶🎈🐶🎈',},
		4:{charName:'日ノ隈らん',hp:20,worldGravity:1500,jumpX:250,jumpY:-550,chRecLvl:14,levelUpAdd:2,reduceOb:!1,restitution:.8,
			effTint:0x66cd50,yt:'https://www.youtube.com/channel/UCRvpMpzAXBRKJQuk-8-Sdvg',
			color:'#66cd50',tw:'https://twitter.com/Ran_Hinokuma',
			emoji:'💚🐻💚🍄💚🐻💚',},
		5:{charName:'稲荷くろむ',hp:10,worldGravity:2000,jumpX:300,jumpY:-800,chRecLvl:14,levelUpAdd:0,reduceOb:!0,restitution:.8,
			effTint:0xff1516,yt:'https://www.youtube.com/channel/UCGiFzwdasSAHILrx-DB1pVQ',
			color:'#ff1516',tw:'https://twitter.com/Kuromu_Inari',
			emoji:'❤⛩️❤🎰️❤️⛩❤️',},
	};
};
BasicGame.Boot.prototype.genLevelInfo=function(){
	return {
		1:{color:0xE0F8E0,nextLevel:10,thornCount:2,obCount:0,obAnglV:0,},
		2:{color:0xCEF6CE,nextLevel:20,thornCount:3,obCount:0,obAnglV:0,},
		3:{color:0xA9F5A9,nextLevel:30,thornCount:4,obCount:0,obAnglV:0,},
		4:{color:0x81F781,nextLevel:35,thornCount:4,obCount:1,obAnglV:0,},
		5:{color:0x58FA58,nextLevel:40,thornCount:5,obCount:0,obAnglV:0,},
		6:{color:0xCEECF5,nextLevel:45,thornCount:5,obCount:1,obAnglV:0,},
		7:{color:0x81DAF5,nextLevel:50,thornCount:6,obCount:0,obAnglV:0,},
		8:{color:0x58D3F7,nextLevel:55,thornCount:6,obCount:1,obAnglV:0,},
		9:{color:0x2ECCFA,nextLevel:60,thornCount:6,obCount:2,obAnglV:0,},
		10:{color:0xF6E3CE,nextLevel:68,thornCount:7,obCount:0,obAnglV:0,},
		11:{color:0xF7BE81,nextLevel:75,thornCount:7,obCount:1,obAnglV:0,},
		12:{color:0xF7D358,nextLevel:85,thornCount:7,obCount:2,obAnglV:0,},
		13:{color:0xFFBF00,nextLevel:98,thornCount:5,obCount:2,obAnglV:5,},
		14:{color:0xF5A9F2,nextLevel:105,thornCount:5,obCount:3,obAnglV:5,},
		15:{color:0xF781F3,nextLevel:113,thornCount:6,obCount:2,obAnglV:5,},
		16:{color:0xFE2EF7,nextLevel:120,thornCount:6,obCount:3,obAnglV:5,},
		17:{color:0xFF00FF,nextLevel:130,thornCount:6,obCount:2,obAnglV:10,},
		18:{color:0xF8E0E6,nextLevel:140,thornCount:7,obCount:1,obAnglV:10,},
		19:{color:0xF6CED8,nextLevel:150,thornCount:7,obCount:2,obAnglV:10,},
		20:{color:0xF5A9BC,nextLevel:160,thornCount:7,obCount:3,obAnglV:10,},
		21:{color:0xF7819F,nextLevel:170,thornCount:8,obCount:0,obAnglV:0,},
		22:{color:0xFA5882,nextLevel:180,thornCount:8,obCount:1,obAnglV:5,},
		23:{color:0xFE2E64,nextLevel:190,thornCount:8,obCount:2,obAnglV:10,},
		24:{color:0xFF0040,nextLevel:200,thornCount:8,obCount:3,obAnglV:15,},
		25:{color:0xDF013A,nextLevel:0,thornCount:8,obCount:4,obAnglV:15,},
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