BasicGame.Boot.prototype.genCharInfo=function(){
	return {
		1:{
			charName:'キズナアイ',tint:0xffb6c1,txtColor:'#d16986',
			resultWords:{
				1:{words:'おめでとうー！',ts:{fontSize:60}},
				2:{words:'おしい！',ts:{fontSize:60}},
				3:{words:'それは普通ですよね！',ts:{fontSize:40}},
				4:{words:'ちがうよ！',ts:{fontSize:50}},
				5:{words:'ふぁっ◯きゅー！',ts:{fontSize:50}},
			},
		},
		2:{
			charName:'ミライアカリ',tint:0x87cefa,txtColor:'#36acd1',
			resultWords:{
				1:{words:'おめでとうー！',ts:{fontSize:60}},
				2:{words:'あともうちょっとだよ',ts:{fontSize:40}},
				3:{words:'がんばれ！',ts:{fontSize:40}},
				4:{words:'人間凄いな',ts:{fontSize:70}},
				5:{words:'はぁ？',ts:{fontSize:50}},
			},
		},
		3:{
			charName:'輝夜月',tint:0xFFFF00,txtColor:'#000000',
			resultWords:{
				1:{words:'おめでとうございマ！',ts:{fontSize:40,fill:'#e30002',stroke:'#020001'},charY:this.world.centerY+75},
				2:{words:'神ゲー 神ゲー\n神ゲー',ts:{fontSize:60,y:this.world.centerY+180}},
				3:{words:'',ts:{fontSize:40}},
				4:{words:'うえ～～\nかわいそ～～～',ts:{fontSize:50}},
				5:{words:'クソゲーーーーー！！！',ts:{fontSize:'45px',fill:'#e30002',stroke:'#020001',angle:-30,y:this.world.centerY+100},charY:this.world.centerY+100},
			},
		},
		4:{
			charName:'シロ',tint:0xffffff,txtColor:'#999999',
			resultWords:{
				1:{words:'こいつはすげえや！',ts:{fontSize:45}},
				2:{words:'んーくやしぃー!!',ts:{fontSize:50}},
				3:{words:'次!!',ts:{fontSize:80}},
				4:{words:'ﾋｨｲｲ',ts:{fontSize:20}},
				5:{words:'聖地と呼びたい',ts:{fontSize:50}},
			},
		},
		5:{
			charName:'ねこます',tint:0xF5D0A9,txtColor:'#ff6a05',
			resultWords:{
				1:{words:'でぇ～～～～～ん',ts:{fontSize:55},charX:this.world.centerX+130,scale:.6},
				2:{words:'にぎにぎ・・・\n  にぎにぎ・・・\n    にぎにぎ・・・',ts:{fontSize:40,y:this.world.centerY+150},charY:this.world.centerY+100},
				3:{words:'世の中、世知辛い\nのじゃーーーー！',ts:{fontSize:50,fill:'#621d01',y:this.world.centerY+120}},
				4:{words:'',ts:{fontSize:40},charY:this.world.centerY+25},
				5:{words:'ポッキーーーッゲェェェエエエエエーーム（音割れ',ts:{fontSize:40,x:this.world.width*2+50,y:this.world.centerY+100},tween:'PockyGame'},
			},
		},
		6:{
			charName:'ときのそら',tint:0xA9F5F2,txtColor:'#A9F5F2',
			resultWords:{
				1:{words:'やったー！！',ts:{fontSize:65},charY:this.world.centerY+100},
				2:{words:'ん～･･･ みなさん･･･\n結構･･･\nほしがりですなぁ！',ts:{fontSize:45,y:this.world.centerY+170},charY:this.world.centerY+50},
				3:{words:'がんばれー！！',ts:{fontSize:60,fill:'#fc6dad',stroke:'#ffffff'}},
				4:{words:'ダメな子が                  \n        多いんだから♡',ts:{fontSize:40,fill:'#8400ea',stroke:'#0a030c',y:this.world.centerY+210},scale:.85},
				5:{words:'えへっ♡',ts:{fontSize:100,fill:'#2b1300',stroke:'#fdb1af'}},
			},
		},
		7:{
			charName:'富士葵',tint:0xBBFCBD,txtColor:'#0d6cb6',
			resultWords:{
				1:{words:'Yaaaay！',ts:{fontSize:80},scale:1.1},
				2:{words:'D☆N\nP☆F',ts:{fontSize:100,fill:'#ff0005',stroke:'#f2dd73',y:this.world.centerY+150,x:this.world.centerX+80},charY:this.world.centerY+30,charX:this.world.centerX-60},
				3:{words:'ぴろっぽー！',ts:{fontSize:50,fill:'#fff',stroke:'#ffe900',x:this.world.centerX+50},charY:this.world.centerY+100},
				4:{words:'うううぅぅぅぅ↑↑↑',ts:{fontSize:50}},
				5:{words:'はぁあぁあぁあぁあっ！',ts:{fontSize:38,y:this.world.centerY+230},charY:this.world.centerY+30},
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
			TweetTtl:'I\'d play『'+BasicGame.GAME_TITLE+'』',
			Stop:'STOP',
		},
	};
};
