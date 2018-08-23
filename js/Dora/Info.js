BasicGame.Boot.prototype.genWords=function(){
	var a=this.M.gGlb('TOUCH_OR_CLICK');
	// var b=this.M.gGlb('EN_TOUCH_OR_CLICK');
	return {
		jp:{
			Enter:'入り口',
			Bonus:'火炎瓶',
			FortuneTelling:'今日の運勢',
			TitleDescription:
				'かなり恐ろしいことが起こるぞ。\n'
				+'一度はじめてしまったら腹をくくって\n'
				+'最後まで進むことをおすすめする。\n'
				+'命まで取らないのでご安心を。\n'
				+'覚悟が出来たら中に入るんだぞ。',
			AreUHost:'よう人間！\nお主は配信者か？',
			HostHowTo:'※ 配信される際の注意点\nフルスクリーンモードでお楽しみください。\n（右上のアイコンから設定できます）\n３分程度で完結いたします。\n度胸試しです。\n初見プレイ以外は面白みに欠けます。\n',
			NotHostHowTo:'後戻りはできないぞ！\n（※ 実際はできます）\n覚悟ができたら進むのじゃ',
			SoonPlay:'早速遊ぶ',
			WhichUse:'お主が使っておるのはどれじゃ？',
			OtherDevice:'その他',
			DontKnowDevice:'わからない',
			NotSayDevice:'教えたくない',
			Back:'もどる',
			RightRoughlyAnswerRes:'大体合っておるの…\n次に用意したものがお主に合えばいいのじゃが…',
			RightAllAnswerRes:'全て正解じゃ！\nお主にピッタリのものを用意したぞ！',
			IgnoranceAnswerRes:'あまり詳しくはないのじゃな\n次のはどうじゃ？どうなんじゃっ？',
			SilenceAnswerRes:'秘密は大切だの\nたぶん次のものは好きになれるかのう？',
			WrongAnswerRes:'嘘をついたな！人間ども！！！\n次は正直にやるんじゃ！頼んだぞーー！',
			Next:'次へ',
			G_Text:'勇気がある者は次へボタンを押すのじゃ\n心臓が弱い者、怒りっぽい者は\n絶対に押すなよ！',
			Push:'押す',
			H_Text_0:'とんでもないことが起こります。\n本当にいいんですね。',
			H_Text_1:(this.game.device.desktop?'ハードディスク':'メモリ')+'の全てのデータを削除します。\nこの作業は中断できません。',
			H_Text_2:(this.game.device.desktop?'ドライブ':'メモリ')+'のスキャンを行っております。',
			H_Text_3:'アプリケーションのアンインストール\n全てのアプリケーションと\nコンポーネンツを削除しています。',
			H_Text_4:'システムの初期化\n全ての設定を初期化しています',
			H_Text_5:'Start Setup And Uninstalling?\nLoad Optimized Initial?',
			H_Text_6:'※ 最終同意画面です\n\n当ゲームでの故障等には一切責任を負いません\n同意しますか？',
			Cancel:'キャンセル',
			GaugeDownload:'Uninstalling... ',
			GaugeDownloaded:'Uninstall are completed. ',
			J_Text:'全部、冗談じゃ！\nよく耐えたのぉ。お主は度胸があるようじゃの。\n第２弾も用意しておる。チャレンジするかの？',
			MoveOn:'進む',
			Unfortunately_HRes:'けっ、度胸がないのお',
			Unfortunately_JRes:'それが賢明じゃ',
			K_Text:'勇気がある者は次へボタンを押すのじゃ\n今度は冗談では済まないぞ！',
			L_Text_0:'今度はマジでやばいですよ\n本当によろしいのですか？\nby作者',
			L_Text_1:'コンピューターウィルス\nArOd.exeをダウンロードします。\nこの作業は中断できません。',
			L_Text_2:'？？？',
			M_Text:'※使用条款\ntrække på милый Obrigado\nマさﾗ－OD？ｶｽて゛Iナｸｲワｶ',
			Agree:'Estoy de acuerdo',
			O_Text:'全部冗談じゃ！よく耐えたのお！\nコーヒーでも飲んで\nバクバクしておる心臓を落ち着けるのじゃ',
			Campaign:'ギャンペーン',
			Tweet:'ツイートする',
			TweetTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			TweetHT:'ドーラゲーム',
			TweetMsgAFront:'今日の運勢: ',
			TweetMsgBFront:'オカマに火炎瓶を投げた回数: ',
			TweetMsgBBack:'回',
			Q_Text_1:'オカマに火炎瓶を投げるのはやめてください',
			Q_Text_2:'タイトルの縄跳びドーラ様を10回'+a+'すると\nいつでも火炎瓶を投げれるようになるよ！',
			WatchDora:'眺めるだけ\nドーラ様',
			SelectChest:'宝箱を選んでください。',
			GetGift:'プレゼント受取',
			ResTweet:'結果をツイート',
		},
		en:{
			//TODO
		},
	};
};
BasicGame.Boot.prototype.genTreasureInfo=function(){
	return {
		1:{name:'大吉',msg:'おめでとう！\nドーラ様の自撮りをプレゼント！',
			url:'https://twitter.com/___Dola/status/1010111543327928321'},
		2:{name:'末吉',msg:'ドーラ様のチャンネルに登録する\n権利をプレゼント！',
			url:'https://www.youtube.com/channel/UC53UDnhAAYwvNO7j_2Ju1cQ?sub_confirmation=1'},
		3:{name:'吉',msg:'竜宝箱',
			url:'https://www.youtube.com/watch?v=QBA0Dbbl-4g'},
		4:{name:'凶',msg:'元気が出るよう『YUME日和』を\nプレゼント！',
			url:'https://twitter.com/___Dola/status/1008742634880421888'},
		5:{name:'中吉',msg:'やったね！\nドーラ様のスマホ壁紙をプレゼント！',
			url:this.game.device.android?'https://twitter.com/___Dola/status/1015126691126042624':'https://twitter.com/___Dola/status/1015117421235982336'},
		6:{name:'小吉',msg:'他にじさんじメンバーの\nゲームをプレイ！',
			url:__VTUBER_GAMES},
		7:{name:'大凶',msg:'きっと良いことがあるさ！\n『Agape』をプレゼント！',
			url:'https://twitter.com/___Dola/status/1007686656466358272'},
		8:{name:'大吉',msg:'あれは？誰だ？誰だ？誰だ？\nあれは…ドーラマーーーン！',
			url:'https://www.youtube.com/watch?v=94Utsy2OzuM'},
		9:{name:'中吉',msg:'レンチさん作詞・作曲\n『ともだち。』のお歌をプレゼント！',
			url:'https://www.youtube.com/watch?v=lakZiSXRtyw'},
	};
};