BasicGame.Boot.prototype.genGiftInfo=function(){
	return {
		1:{
			key:1,rate:1,jackpot:!0,
			effect:'ジャックポット',
			effectMax:0,
			tint:0xff0000,
		},
		2:{
			key:2,rate:300,jackpot:!1,
			effect:'ジャックポット確率UP',
			effectMax:0,
			tint:0x00ff00,
		},
		3:{
			key:3,rate:300,jackpot:!1,
			effect:'腹筋増幅',
			effectMax:8,
			tint:0x7401DF,
		},
		4:{
			key:4,rate:300,jackpot:!1,
			effect:'お賽銭効率UP',
			effectMax:8,
			tint:0xF7FE2E,
		},
		5:{
			key:5,rate:500,jackpot:!1,
			effect:'当たり確率UP',
			effectMax:0,
			tint:0x00FFFF,
		},
		6:{
			key:6,rate:8599,jackpot:!1,
			effect:'ハズレ',
			effectMax:0,
			tint:0xffffff,
		},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	var a=this.M.gGlb('TOUCH_OR_CLICK');
	// var b=this.M.gGlb('EN_TOUCH_OR_CLICK');
	return {
		jp:{
			Start:'スタート',
			HowTo:'遊び方',
			ShizukaYt:'静凛',
			GilzYt:'ギルザレンⅢ世',
			OtherGames:'他のゲーム',
			SikiMaru:'絵師:四季丸',
			HowToText:'aaaaaaaaaaaaaaaaaaaaaaaaaa',// TODO
			Swing:'左右に振れ！',
			Back:'もどる',
			ToPlay2:'お賽銭',
		},
		en:{// TODO
		},
	};
};