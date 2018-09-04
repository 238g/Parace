BasicGame.Boot.prototype.genCharInfo=function(){
	return {
		1:{name:'ノーマル花咲',playerMoveSpeed:1,
			delayLoopObstaclesTime:0,
			scoreRate:10,minusScoreRate:1,
			closed:!1,playerImg:'Kazaki_1',largeImg:'Kazaki_1_L',
		},
		2:{name:'オトナ花咲\n【 速 】',playerMoveSpeed:1.2,
			delayLoopObstaclesTime:0,
			scoreRate:12,minusScoreRate:1.2,
			closed:!0,playerImg:'Kazaki_2',largeImg:'Kazaki_2_L',
		},
		3:{name:'デコニウム花咲\n【 遅 】',playerMoveSpeed:.6,
			delayLoopObstaclesTime:100,
			scoreRate:10,minusScoreRate:.6,
			closed:!0,playerImg:'Kazaki_3',largeImg:'Kazaki_3_L',
		},
		4:{name:'山田はんぺん\n【 超速 】',playerMoveSpeed:2,
			delayLoopObstaclesTime:-100,
			scoreRate:20,minusScoreRate:2,
			closed:!0,playerImg:'Yamada_1',largeImg:'Yamada_1_L',
		},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	// var a=this.M.gGlb('TOUCH_OR_CLICK');
	// var b=this.M.gGlb('EN_TOUCH_OR_CLICK');
	return {
		jp:{
			Start:'スタート',
			Back:'もどる',
			HowTo_A:this.game.device.touch?'画面の左右をタッチすると移動！\n':'画面の左右をクリックするか\nキーボードの右左キーで移動！\n',
			HowTo_1:'目標のスコアを目指して\n良アイテムを取ろう！\n右のハートがなくなったら\nゲームオーバー！\n高レベルクリアで\n隠しキャラがオープン！？\n',
			HowTo_2:'制限時間まで\n良アイテムを取って\nハイスコアを目指せ！\n不良アイテムは\nスコアが減るよ！\nどこまでスコアを伸ばせるか…\nTwitterのみんなと競争だ！\n',
			HowTo_3:'命の限り\n良アイテムを取り続けよう！\nどこまでスコアを伸ばせるか…\nTwitterのみんなと競争だ！\n高スコアで さらなる\n隠しステージが…！\n',
			GoodItem:'良アイテム',
			BadItem:'不良アイテム',
			CurScore:'スコア: ',
			TargetScore:'目標: ',
			TimeAttack:'制限時間: ',
			GameOver:'ゲームオーバー',
			Clear:'クリア！',
			Timeout:'終了！',
			Result:'結果',
			Again:'もういちど',
			OtherGames:'他のゲーム',
			Tweet:'結果をツイート',
			TweetTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TweetHT:'かざゲー',
			TweetResChar:'キャラ: ',
			TweetResStg:'ステージ: ',
			TweetResScore:'スコア: ',
			NextStg:'次のレベルへ',
			OpenNewStg:'新ステージ\nオープン！',
			OpenNewChar:'新キャラ\nオープン！',
			SelectStg:'ステージを選んでね',
			SelectChar:'キャラを選んでね',
		},
		en:{},//TODO
	};
};