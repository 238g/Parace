BasicGame.Boot.prototype.genCharInfo=function(){
	return {
		1:{
			charName:'キズナアイ',tint:0xffb6c1,txtColor:'#d16986',
			resultWords:{
				1:{words:'おめでとうー！',txtstyl:{fontSize:60},txtOp:null},
				2:{words:'おしい！',txtstyl:{fontSize:60},txtOp:null},
				3:{words:'それは普通ですよね！',txtstyl:{fontSize:40},txtOp:null},
				4:{words:'ちがうよ！',txtstyl:{fontSize:50},txtOp:null},
				5:{words:'ふぁっ◯きゅー！',txtstyl:{fontSize:50},txtOp:null},
			},
		},
		2:{
			charName:'ミライアカリ',tint:0x87cefa,txtColor:'#36acd1',
			resultWords:{
				1:{words:'おめでとうー！',txtstyl:{fontSize:60},txtOp:null},
				2:{words:'あともうちょっとだよ',txtstyl:{fontSize:40},txtOp:null},
				3:{words:'がんばれ！',txtstyl:{fontSize:40},txtOp:null},
				4:{words:'人間凄いな',txtstyl:{fontSize:70},txtOp:null},
				5:{words:'はぁ？',txtstyl:{fontSize:50},txtOp:null},
			},
		},
		3:{
			charName:'輝夜月',tint:0xFFFF00,txtColor:'#000000',
			resultWords:{
				1:{words:'おめでとうございマ！',txtstyl:{fontSize:40,fill:'#e30002',mStroke:'#e30002'},txtOp:null,charY:this.world.centerY+75},
				2:{words:'神ゲー 神ゲー\n神ゲー',txtstyl:{fontSize:60},txtOp:{y:this.world.centerY+180}},
				3:{words:'',txtstyl:{fontSize:40},txtOp:null},
				4:{words:'うえ～～\nかわいそ～～～',txtstyl:{fontSize:50},txtOp:null},
				5:{words:'クソゲーーーーー！！！',txtstyl:{fontSize:'45px',fill:'#e30002',mStroke:'#e30002'},txtOp:{angle:-30,y:this.world.centerY+100},charY:this.world.centerY+100},
			},
		},
		4:{
			charName:'シロ',tint:0xffffff,txtColor:'#999999',
			resultWords:{
				1:{words:'こいつはすげえや！',txtstyl:{fontSize:45},txtOp:null},
				2:{words:'んーくやしぃー!!',txtstyl:{fontSize:50},txtOp:null},
				3:{words:'次!!',txtstyl:{fontSize:80},txtOp:null},
				4:{words:'ﾋｨｲｲ',txtstyl:{fontSize:20},txtOp:null},
				5:{words:'聖地と呼びたい',txtstyl:{fontSize:50},txtOp:null},
			},
		},
		5:{
			charName:'ねこます',tint:0xF5D0A9,txtColor:'#ff6a05',
			resultWords:{
				1:{words:'でぇ～～～～～ん',txtstyl:{fontSize:55},txtOp:null,charX:this.world.centerX+130,scale:.6},
				2:{words:'にぎにぎ・・・\n  にぎにぎ・・・\n    にぎにぎ・・・',txtstyl:{fontSize:40},txtOp:{y:this.world.centerY+150},charY:this.world.centerY+100},
				3:{words:'世の中、世知辛い\nのじゃーーーー！',txtstyl:{fontSize:50,fill:'#621d01'},txtOp:{y:this.world.centerY+120}},
				4:{words:'',txtstyl:{fontSize:40},txtOp:null,charY:this.world.centerY+25},
				5:{words:'ポッキーーーッゲェェェエエエエエーーム（音割れ',txtstyl:{fontSize:40},txtOp:{x:this.world.width*2+50,y:this.world.centerY+100},tween:'PockyGame'},
			},
		},
		6:{
			charName:'ときのそら',tint:0xA9F5F2,txtColor:'#A9F5F2',
			resultWords:{
				1:{words:'やったー！！',txtstyl:{fontSize:65},txtOp:null,charY:this.world.centerY+100},
				2:{words:'ん～･･･ みなさん･･･\n結構･･･\nほしがりですなぁ！',txtstyl:{fontSize:45},txtOp:{y:this.world.centerY+170},charY:this.world.centerY+50},
				3:{words:'がんばれー！！',txtstyl:{fontSize:60,fill:'#fc6dad',mStroke:'#ffffff'},txtOp:null},
				4:{words:'ダメな子が                  \n        多いんだから♡',txtstyl:{fontSize:40,fill:'#8400ea',mStroke:'#0a030c'},txtOp:{y:this.world.centerY+210},scale:.85},
				5:{words:'えへっ♡',txtstyl:{fontSize:100,fill:'#2b1300',mStroke:'#fdb1af'},txtOp:null},
			},
		},
		7:{
			charName:'富士葵',tint:0xBBFCBD,txtColor:'#0d6cb6',
			resultWords:{
				1:{words:'Yaaaay！',txtstyl:{fontSize:80},txtOp:null,scale:1.1},
				2:{words:'D☆N\nP☆F',txtstyl:{fontSize:100,fill:'#ff0005',mStroke:'#f2dd73'},txtOp:{y:this.world.centerY+150,x:this.world.centerX+80},charY:this.world.centerY+30,charX:this.world.centerX-60},
				3:{words:'ぴろっぽー！',txtstyl:{fontSize:50,fill:'#fff',mStroke:'#ffe900'},txtOp:{x:this.world.centerX+50},charY:this.world.centerY+100},
				4:{words:'うううぅぅぅぅ↑↑↑',txtstyl:{fontSize:50},txtOp:null},
				5:{words:'はぁあぁあぁあぁあっ！',txtstyl:{fontSize:38},txtOp:{y:this.world.centerY+230},charY:this.world.centerY+30},
			},
		},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	return {
		jp:{
			Start:'スタート',
			OtherGames:'他ゲーム',
			Lang:'English',
			Back:'戻る',
			Select:'選択',
			InstructB:' でピッタリ止めろ',
			InstructF:'',
			PlayCount:'回',
			Tweet:'ツイート',
			Again:'もう一度',
			SelectedChar:'選択キャラクター: ',
			TweetClearF:'',
			TweetClearB:'秒クリア！',
			TweetTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			Stop:'STOP',
		},
		en:{
			Start:'START',
			OtherGames:'OTHER GAMES',
			Lang:'日本語',
			Back:'BACK',
			Select:'SELECT',
			InstructB:'',
			InstructF:'STOP ',
			PlayCount:'times',
			Tweet:'TWEET',
			Again:'AGAIN',
			SelectedChar:'Selected: ',
			TweetClearF:'Clear ',
			TweetClearB:'sec',
			TweetTtl:'I\'d play『'+BasicGame.GAME_EN_TITLE+'』',
			Stop:'STOP',
		},
	};
};
