BasicGame.Boot.prototype.genCharInfo=function(){
	return {
		//TODO Hane-jumpUP //Kuro-GravityUp
		1:{charName:'因幡はねる',},
		2:{charName:'宇森ひなこ',},
		3:{charName:'宗谷いちか',},
		4:{charName:'日ノ隈らん',},
		5:{charName:'稲荷くろむ',},
	};
};
BasicGame.Boot.prototype.genLevelInfo=function(){
	// TODO bg or color ???
	return {
		1:{color:'#00ff00',nextLevel:10,thornCount:1,},
		2:{color:'#00ffff',nextLevel:20,thornCount:2,},
		99:{color:'#00ffff',nextLevel:null,},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	// var touchJP=this.M.gGlb('TOUCH_OR_CLICK');
	// var touchEN=this.M.gGlb('EN_TOUCH_OR_CLICK');
	return {
		jp:{
			Start:'スタート',
			Score:'スコア: ',
			/*
			CharTw:'',
			Back:'もどる',
			GameOver:'終了！',
			OtherGames:'他のゲーム',
			HowTo:'',
			TwBtn:'結果をツイート',
			TwTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TwHT:'',
			Result:'結果',
			*/
		},
		// TODO
		en:{
		},
	};
};