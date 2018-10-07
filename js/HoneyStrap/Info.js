BasicGame.Boot.prototype.genCharInfo=function(){
	return {
		1:{charName:'周防パトラ',jumpForce:[10,7,5],worldG:.5,speed:1.3,farFromSpike:35,HP:10,color:'#ef6f7c',tint:0xef6f7c,
			levelUpAdd:0,yt:'https://www.youtube.com/channel/UCeLzT-7b2PBcunJplmWtoDg',
			tw:'https://twitter.com/Patra_HNST',emoji:'❤🦀❤️🦀❤️🦀❤️',obRate:1.5,},
		2:{charName:'蒼月エリ',jumpForce:[10,7,5],worldG:.5,speed:1,farFromSpike:50,HP:11,color:'#aec3ef',tint:0xaec3ef,
			levelUpAdd:0,yt:'https://www.youtube.com/channel/UC3UKMRQmBcjXWu66cvxcngA',
			tw:'https://twitter.com/Eli_HNST',emoji:'💎🥀💎🥀💎🥀💎',obRate:.5,},
		3:{charName:'島村シャルロット',jumpForce:[11,8,6],worldG:.6,speed:1.1,farFromSpike:40,HP:20,color:'#3a67c5',tint:0x3a67c5,
			levelUpAdd:0,yt:'https://www.youtube.com/channel/UCYTz3uIgwVY3ZU-IQJS8r3A',
			tw:'https://twitter.com/Charlotte_HNST',emoji:'❄️♣️❄️♣️❄️♣️❄️',obRate:.5,},
		4:{charName:'西園寺メアリ',jumpForce:[9,9,8],worldG:.7,speed:1,farFromSpike:35,HP:13,color:'#7f3572',tint:0x7f3572,
			levelUpAdd:0,yt:'https://www.youtube.com/channel/UCwePpiw1ocZRSNSkpKvVISw',
			tw:'https://twitter.com/Mary_HNST',emoji:'🔮🍼🔮🍼🔮🍼🔮',obRate:.5,},
		5:{charName:'堰代ミコ',jumpForce:[9,4,9],worldG:.4,speed:.9,farFromSpike:35,HP:10,color:'#a8d45c',tint:0xa8d45c,
			levelUpAdd:0,yt:'https://www.youtube.com/channel/UCDh2bWI5EDu7PavqwICkVpA',
			tw:'https://twitter.com/Mico_HNST',emoji:'🍏🔱🍏🔱🍏🔱🍏',obRate:1,},
	};
};
BasicGame.Boot.prototype.genLevelInfo=function(){
	return {
		1:{addSpeed:0,nextLevel:20,tint:0xD8F781,mask:null,obRate:1,},
		2:{addSpeed:.1,nextLevel:30,tint:0xD0FA58,mask:null,obRate:1,},
		3:{addSpeed:0,nextLevel:45,tint:0xC8FE2E,mask:1,obRate:1,},
		4:{addSpeed:.1,nextLevel:60,tint:0x3ADF00,mask:1,obRate:1,},
		5:{addSpeed:.1,nextLevel:75,tint:0x04B404,mask:2,obRate:1,},
		6:{addSpeed:.2,nextLevel:90,tint:0xBCA9F5,mask:2,obRate:1,},
		7:{addSpeed:.2,nextLevel:105,tint:0x9F81F7,mask:1,obRate:1,},
		8:{addSpeed:.3,nextLevel:120,tint:0x9A2EFE,mask:1,obRate:1,},
		9:{addSpeed:.3,nextLevel:140,tint:0x8904B1,mask:2,obRate:1,},
		10:{addSpeed:0,nextLevel:160,tint:0xA9D0F5,mask:3,obRate:3,},
		11:{addSpeed:.1,nextLevel:175,tint:0x58ACFA,mask:3,obRate:3,},
		12:{addSpeed:.2,nextLevel:190,tint:0x58FAF4,mask:3,obRate:3,},
		13:{addSpeed:0,nextLevel:210,tint:0x00FFFF,mask:3,obRate:5,},
		14:{addSpeed:.1,nextLevel:220,tint:0x2E9AFE,mask:null,obRate:5,},
		15:{addSpeed:.2,nextLevel:230,tint:0x5882FA,mask:null,obRate:5,},
		16:{addSpeed:.3,nextLevel:245,tint:0x2E2EFE,mask:null,obRate:8,},
		17:{addSpeed:.4,nextLevel:265,tint:0x0101DF,mask:null,obRate:8,},
		18:{addSpeed:.5,nextLevel:285,tint:0xF7819F,mask:null,obRate:8,},
		19:{addSpeed:.5,nextLevel:305,tint:0xFA5882,mask:1,obRate:10,},
		20:{addSpeed:.5,nextLevel:350,tint:0xFE2E64,mask:2,obRate:10,},
		21:{addSpeed:.5,nextLevel:0,tint:0xFF0040,mask:3,obRate:10,},
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
			HowTo:'操作方法\n\n'+'選んだメンバーを\n３段までジャンプさせて\nななしさんから逃げろ！\n'+touchJP+'すると\nジャンプできるよ\n\nスコアを\nどこまで\n伸ばせるかな？',
			TwBtn:'結果をツイート',
			TwTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TwHT:'ハニストゲーム',
			Result:'結果',
			SelectTw:'選んだメンバー: ',
			Again:'もう一度',
		},
		// TODO
		en:{
		},
	};
};