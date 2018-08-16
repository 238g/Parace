BasicGame.Boot.prototype.genGiftInfo=function(){
	return {
		1:{key:1,rate:1,count:0,
			effect:'ジャックポット',
			tint:0xff0000,
		},
		2:{key:2,rate:300,count:0,
			effect:'JP確率UP',
			tint:0x00ff00,
		},
		3:{key:3,rate:300,count:0,
			effect:'腹筋マシマシ',
			tint:0x7401DF,
		},
		4:{key:4,rate:300,count:0,
			effect:'お賽銭効率UP',
			tint:0xF7FE2E,
		},
		5:{key:5,rate:500,count:0,
			effect:'当たり確率UP',
			tint:0x00FFFF,
		},
		6:{key:6,rate:8599,count:0,
			effect:'ハズレ',
			tint:0xffffff,
		},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	// var a=this.M.gGlb('TOUCH_OR_CLICK');
	// var b=this.M.gGlb('EN_TOUCH_OR_CLICK');
	return {
		jp:{
			Start:'スタート',
			HowTo:'遊び方',
			ShizukaYt:'静凛',
			GilzYt:'ギルザレンⅢ世',
			OtherGames:'他のゲーム',
			SikiMaru:'絵師:四季丸',
			HowToText:
				'ギルザレン様の腹筋を\nしずりん先輩に捧げるゲームです\n'
				+'（※実際はジャックポットを\n引き当てるゲームです）\n\n'
				+'まずは工場で\n腹筋をゲットしましょう！\n'
				+'ゲットした腹筋は\n鈴緒(すずお)を揺らして\nお賽銭へ投げ入れましょう？\n\n'
				+'ジャックポットが出たらクリア！\nあなたは何回目で出せるかな？',
			Swing:'左右に振れ！',
			Back:'もどる',
			ToPlay2:'お賽銭',
			Count:'回',
			SumCount:'計',
			Congratulations:'ジャックポット\nおめでとう！',
			Continue:'続けて遊ぶ',
			Tweet:'結果をツイート',
			TweetTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TweetHT:'シズザレンゲーム',
		},
		en:{// TODO
		},
	};
};