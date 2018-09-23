BasicGame.Boot.prototype.genStageInfo=function(){
	return {
		1:{
			name:'Easy',enemyName:'大黒天',img:'Daikokuten',playerHP:100,shot:'shotBulletsA',
			bullets:['Uchide','Koban','Tawara'],playBGM:'PlayBGM_A',
			bulletTime:1E3,leftTime:30,bgSpeed:3,open:!0,},
		2:{
			name:'Normal',enemyName:'アザトース',img:'Azathoth',playerHP:80,shot:'shotBulletsB',
			bullets:['ToyaA','ToyaB'],playBGM:'PlayBGM_A',
			bulletTime:1E3,leftTime:40,bgSpeed:5,open:!0,},
		3:{
			name:'Hard',enemyName:'風神・雷神',img:'FuujinRaijin',playerHP:50,shot:'shotBulletsC',
			bullets:['TenkiA','TenkiB','TenkiC','TenkiD','TenkiE'],playBGM:'PlayBGM_B',
			bulletTime:800,leftTime:50,bgSpeed:-3,open:!0,},
		4:{
			name:'Lunatic',enemyName:'ポセイドン',img:'Poseidon',playerHP:30,shot:'shotBulletsD',
			bullets:['UmiushiA','UmiushiB','UmiushiC','UmiushiD','Trident'],playBGM:'PlayBGM_B',
			bulletTime:500,leftTime:60,bgSpeed:8,open:!0,},
		5:{
			name:'Extra',enemyName:'おまいら(参拝者)',img:'You',playerHP:10,shot:'shotBulletsE',
			bullets:['OtakuA','OtakuB','OtakuC','OtakuD','FujoshiA','FujoshiB'],playBGM:'PlayBGM_C',
			bulletTime:300,leftTime:80,bgSpeed:5,open:!1,},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	var touchJP=this.M.gGlb('TOUCH_OR_CLICK');
	// var touchEN=this.M.gGlb('EN_TOUCH_OR_CLICK');
	return {
		jp:{
			Start:'スタート',
			CharTw:'海夜叉神',
			GenStart:'\nVS\n海夜叉神',
			Back:'もどる',
			SelectStg:'難易度を選択',
			GameOver:'終了！',
			OtherGames:'他のゲーム',
			HowTo:'遊び方\n\nあなたは敵です\n敵を'+touchJP+'しながら\n動かすことができます\n\n海夜叉神を\n生かすも殺すも\nアナタ次第\n\n以上。',
			TwBtn:'結果をツイート',
			TwTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TwHT:'海夜叉神ゲーム',
			Result:'結果',
			Win:'海夜叉神は\n神々に勝利した！',
			Lose:'海夜叉神は\n神々に敗北した',
			TwWin:'海夜叉神は神々に勝利した！',
			TwLose:'海夜叉神は神々に敗北した',
			TwHPFront:'海夜叉神のHP: ',
			OpenNewStg:'難易度追加！',
			//////Lang:'English',
		},
		// TODO
		en:{
			Start:'Start',
			CharTw:'GodOfCDemon',
			Lang:'日本語',
		},
	};
};