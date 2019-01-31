BasicGame.Boot.prototype.defineConf = function () {
    var c = this.game.const;
    this.game.conf = {
        charInfo: {
            1: {
                id:c.CHAR_KIZUNA_AI, name:'キズナアイ', color: '0xffb6c1',
                resultWords: {
                    // none
                    1:{id:c.GAME_RESULT_CONGRATULATIONS,
                    	words:'おめでとうー！',textStyle:{fontSize:'60px'},emotion:c.EMOTION_HAPPY,version:1,
                    },
                    // none
                    2:{id:c.GAME_RESULT_CLOSE,
                    	words:'おしい！',textStyle:{fontSize:'60px'},emotion:c.EMOTION_SMILE,version:2,
                    },
                    // none
                    3:{id:c.GAME_RESULT_NORMAL,
                    	words:'それは普通ですよね！',textStyle:null,emotion:c.EMOTION_NORMAL,version:2,
                    },
                    // none
                    4:{id:c.GAME_RESULT_AWKWARD,
                    	words:'ちがうよ！',textStyle:{fontSize:'50px'},emotion:c.EMOTION_ANGRY,version:1,
                    },
                    // https://www.youtube.com/watch?v=FyFYH-7Ody0&t=14m59s 【BIOHAZARD 7 resident evil】#19 楽しいビデオ鑑賞会！ パーティ前夜！
                    5:{id:c.GAME_RESULT_FUCKYOU,
                    	words:'ふぁっ◯きゅー！',textStyle:{fontSize:'50px'},emotion:c.EMOTION_FROWN,version:1,
                    },
                    commonTextStyle: { font: '40px Arial', fontWeight: 'bold', fill: '#d16986', align: 'center', stroke: '#eaebeb', strokeThickness: 15 },
                    commonX: this.world.centerX, commonY: this.world.centerY+200,
                },
                tweetTexts: ['秒当てゲームで遊んだよ♪',],
                tweetImg: 'https://twitter.com/238games/status/962321391809802241/photo/1',
                tweetHashtags: ['KizunaAI','YouTube','キズナアイ'],
            },
            2: {
                id:c.CHAR_MIRAI_AKARI, name:'ミライアカリ', color: '0x87cefa',
                resultWords: {
                    // https://www.youtube.com/watch?v=qWY_G_VRBAo&t=59m21s 【大晦日生放送】ミライアカリの2.5次元から配信中！
                    1:{id:c.GAME_RESULT_CONGRATULATIONS,
                    	words:'おめでとうー！',textStyle:{fontSize:'60px'},emotion:c.EMOTION_HAPPY,version:1,
                    },
                    // https://www.youtube.com/watch?v=qWY_G_VRBAo&t=58m38s 【大晦日生放送】ミライアカリの2.5次元から配信中！
                    2:{id:c.GAME_RESULT_CLOSE,
                    	words:'あともうちょっとだよ',textStyle:null,emotion:c.EMOTION_SMILE,version:2,
                    },
                    // none
                    3:{id:c.GAME_RESULT_NORMAL,
                    	words:'がんばれ！',textStyle:{fontSize:'60px'},emotion:c.EMOTION_NORMAL,version:2,
                    },
                    // https://www.youtube.com/watch?v=b_SEEnVq_GM&t=4m59s 【欲望全開!!!】ポチポチしてみた結果【MiraiAkariProject#003】
                    4:{id:c.GAME_RESULT_AWKWARD,
                    	words:'人間凄いな',textStyle:{fontSize:'70px'},emotion:c.EMOTION_SURPRISE,version:1,
                    },
                    // https://www.youtube.com/watch?v=92tp_PU_VSg&t=0m53s　【ブラック校則】物申す！ちょっと怒ってます！【MiraiAkariProject#008】
                    5:{id:c.GAME_RESULT_FUCKYOU,
                    	words:'はぁ？',textStyle:{fontSize:'110px'},emotion:c.EMOTION_ANGRY,version:1,
                    },
                    commonTextStyle: { font: '40px Arial', fontWeight: 'bold', fill: '#36acd1', align: 'center', stroke: '#fff3b9', strokeThickness: 15 },
                    commonX: this.world.centerX, commonY: this.world.centerY+200,
                },
                tweetTexts: ['秒当てゲームで遊んだよ♪',],
                tweetImg: 'https://twitter.com/238games/status/962321446381867008/photo/1',
                tweetHashtags: ['ミライアカリ','バーチャルYouTuber'],
            },
            3: {
                id:c.CHAR_KAGUYA_LUNA, name:'輝夜月', color: '0xFFFF00',
                resultWords: {
                    // https://www.youtube.com/watch?v=ZJinxt-wui0&t=1s あけおめワッショイ∠ 'ω'／
                    1:{id:c.GAME_RESULT_CONGRATULATIONS,
                    	words:'おめでとうございマ！',textStyle:{fontSize:'40px',fill:'#e30002',stroke:'#020001'},emotion:c.EMOTION_COOL,version:1,charY:this.world.centerY+75,
                    },
                    // https://www.youtube.com/watch?v=GG7nBgIHmKw&t=3m57s 【Getting Over It】月ちゃんおこだよ！！！！！おこ
                    2:{id:c.GAME_RESULT_CLOSE,
                    	words:'神ゲー 神ゲー\n神ゲー',textStyle:{fontSize:'60px',y:this.world.centerY+180},emotion:c.EMOTION_SMILE,version:2,
                    },
                    // https://www.youtube.com/watch?v=4i1p0cMebMY&t=1m Twitterが面白くなる方法をみつけたんだがｗｗｗｗｗｗ
                    3:{id:c.GAME_RESULT_NORMAL,
                    	words:'',textStyle:null,emotion:c.EMOTION_LAUGH,version:2,
                    },
                    // https://www.youtube.com/watch?v=e-csTusLwZA&t=9s え・・・・まさかおまえらって・・・・・・
                    4:{id:c.GAME_RESULT_AWKWARD,
                    	words:'うえ～～\nかわいそ～～～',textStyle:{fontSize:'50px'},emotion:c.EMOTION_LAUGH,version:1,
                    },
                    // https://www.youtube.com/watch?v=GG7nBgIHmKw&t=4m 【Getting Over It】月ちゃんおこだよ！！！！！おこ
                    5:{id:c.GAME_RESULT_FUCKYOU,
                    	words:'クソゲーーーーー！！！',textStyle:{fontSize:'45px',fill:'#e30002',stroke:'#020001',angle:-30, y: this.world.centerY+100},emotion:c.EMOTION_DRUNK,version:1,charY:this.world.centerY+100,
                    },
                    commonTextStyle: { font: '40px Arial', fontWeight: 'bold', fill: '#e8c528', align: 'center', stroke: '#030001', strokeThickness: 15 },
                    commonX: this.world.centerX, commonY: this.world.centerY+200,
                },
                tweetTexts: ['秒当てゲームで遊んだよ♪',],
                tweetImg: 'https://twitter.com/238games/status/962321473514844162/photo/1',
                tweetHashtags: ['輝夜月','バーチャルYouTuber'],
            },
            4: {
                id:c.CHAR_SIRO, name:'シロ', color: '0xffffff',
                resultWords: {
                    // MEMO https://www.youtube.com/watch?v=h0TnhNcWpWE 【Twitterで話題！】簡単に3Dモデルが作れちゃうUnityアセットを発見!!【047】
                    // MEMO https://www.youtube.com/watch?v=Dyqporq1mzc&t=3m50s 【一緒に遊ぼ】キャッチコピーで連想ゲーム【130】
                    // MEMO https://www.youtube.com/watch?v=JiPlQvP94Uo&t=6m57s ◯◯縛りで話題のアプリゲーム【どうぶつタワー】に挑戦！連勝の奇跡でシロ壊れる‥!?【099】
                    // https://www.youtube.com/watch?v=y366RsRdIDc&t=4m12s 【大晦日】セルフ〇〇大会開催するので参加してね【110】
                    1:{id:c.GAME_RESULT_CONGRATULATIONS,
                    	words:'こいつはすげえや！',textStyle:{fontSize:'45px'},emotion:c.EMOTION_SMILE,version:4,
                    },
                    // https://www.youtube.com/watch?v=Ur51MzH4dBc&t=19m08s 【驚愕】PUBGでなぜかコンパス駆逐した...【PLAYERUNKNOWN'S BATTLEGROUNDS】
                    2:{id:c.GAME_RESULT_CLOSE,
                    	words:'んーくやしぃー!!',textStyle:{fontSize:'50px'},emotion:c.EMOTION_SAD,version:1,
                    },
                    // https://www.youtube.com/watch?v=Dyqporq1mzc&t=3m15s 【一緒に遊ぼ】キャッチコピーで連想ゲーム【130】
                    3:{id:c.GAME_RESULT_NORMAL,
                    	words:'次!!',textStyle:{fontSize:'80px'},emotion:c.EMOTION_SMILE,version:3,
                    },
                    // https://www.youtube.com/watch?v=h0TnhNcWpWE&t=2m52s 【Twitterで話題！】簡単に3Dモデルが作れちゃうUnityアセットを発見!!【047】
                    4:{id:c.GAME_RESULT_AWKWARD,
                    	words:'ﾋｨｲｲ',textStyle:{fontSize:'20px'},emotion:c.EMOTION_HORROR,version:1,
                    },
                    // https://www.youtube.com/watch?v=d5yVgYC-ao4&t=6m03s　【PUBG初実況】シロの初出撃です!!予想外の美味しい結果に‥！【PLAYERUNKNOWN'S BATTLEGROUNDS】
                    5:{id:c.GAME_RESULT_FUCKYOU,
                    	words:'聖地と呼びたい',textStyle:{fontSize:'50px'},emotion:c.EMOTION_SMILE,version:2,
                    },
                    commonTextStyle: { font: '40px Arial', fontWeight: 'bold', fill: '#ffffff', align: 'center', stroke: '#0977ff', strokeThickness: 15 },
                    commonX: this.world.centerX, commonY: this.world.centerY+200,
                },
                tweetTexts: ['秒当てゲームで遊んだよ♪',],
                tweetImg: 'https://twitter.com/238games/status/962321516644872192/photo/1',
                tweetHashtags: ['シロ','バーチャルYouTuber'],
            },
            5: {
                id:c.CHAR_NEK0MASU, name:'ねこます', color: '0xF5D0A9',
                resultWords: {
                    // https://www.youtube.com/watch?v=QDWKOzum6F8&t=2m02s 狐娘のワキ握り【005】
                    1:{id:c.GAME_RESULT_CONGRATULATIONS,
                    	words:'でぇ～～～～～ん',textStyle:{fontSize:'55px'},emotion:c.EMOTION_HAPPY,version:1,charX:this.world.centerX+130,scale:.6,
                    },
                    // https://www.youtube.com/watch?v=QDWKOzum6F8&t=1m13s 狐娘のワキ握り【005】
                    2:{id:c.GAME_RESULT_CLOSE,
                    	words:'にぎにぎ・・・\n  にぎにぎ・・・\n    にぎにぎ・・・',textStyle:{y:this.world.centerY+150},emotion:c.EMOTION_SMILE,version:2,charY:this.world.centerY+100,
                    },
                    // https://www.youtube.com/watch?v=DoVh4Fc43Bo&t=1m13s それはとっても世知辛いなって【002】
                    3:{id:c.GAME_RESULT_NORMAL,
                    	words:'世の中、世知辛い\nのじゃーーーー！',textStyle:{fontSize:'50px',fill:'#621d01',y:this.world.centerY+120},emotion:c.EMOTION_SAD,version:1,
                    },
                    // SERCH MOVIE
                    4:{id:c.GAME_RESULT_AWKWARD,
                    	words:'',textStyle:null,emotion:c.EMOTION_SAD,version:2,charY:this.world.centerY+25,
                    },
                    // https://www.youtube.com/watch?v=0q4CQEw60IM&t=33s 狐娘とポッキーゲームしたい？【003】
                    5:{id:c.GAME_RESULT_FUCKYOU,
                    	words:'ポッキーーーッゲェェェエエエエエーーム（音割れ',textStyle:{x:this.world.width*2+50,y:this.world.centerY+100},tween:'PockyGame',emotion:c.EMOTION_DRUNK,version:1,
                    },
                    commonTextStyle: { font: '40px Arial', fontWeight: 'bold', fill: '#ff6a05', align: 'center', stroke: '#fbffff', strokeThickness: 15 },
                    commonX: this.world.centerX, commonY: this.world.centerY+200,
                },
                tweetTexts: ['秒当てゲームで遊んだよ♪',],
                tweetImg: 'https://twitter.com/238games/status/962321550882914304/photo/1',
                tweetHashtags: ['バーチャルのじゃろり狐娘Youtuberおじさん','のじゃろり'],
            },
            6: {
                id:c.CHAR_TOKINO_SORA, name:'ときのそら', color: '0xA9F5F2',
                resultWords: {
                    // MEMO https://www.youtube.com/watch?v=gcmMsbkb9QA 【よるのクマ】あん肝、ゲーム選定ダイジェストです！
                    // https://www.youtube.com/watch?v=5qM0yOkZA-o&t=21s 【新年】振り袖で書き初めしてみたのそら
                    1:{id:c.GAME_RESULT_CONGRATULATIONS,
                    	words:'やったー！！',textStyle:{fontSize:'65px'},emotion:c.EMOTION_HAPPY,version:1,charY:this.world.centerY+100,
                    },
                    // TODO https://www.youtube.com/watch?v=CPlx3uCF3yU&t=55s 【検証？】ときのそらの、珍プレー謎プレー
                    2:{id:c.GAME_RESULT_CLOSE,
                    	words:'ん～･･･ みなさん･･･\n結構･･･\nほしがりですなぁ！',textStyle:{fontSize:'45px',y:this.world.centerY+170},emotion:c.EMOTION_SMILE,version:2,charY:this.world.centerY+50,
                    },
                    // https://www.youtube.com/watch?v=Xi2wxXsi3EU&t=32s 【Twitter】センター試験の受験生先輩を応援するのそら【Short】
                    3:{id:c.GAME_RESULT_NORMAL,
                    	words:'がんばれー！！',textStyle:{fontSize:'60px',fill:'#fc6dad',stroke:'#ffffff'},emotion:c.EMOTION_COOL,version:2,
                    },
                    // https://www.youtube.com/watch?v=cee8QH0H_1I&t=23s 【検証】ときのそらはママなのか？お姉ちゃんなのか？
                    4:{id:c.GAME_RESULT_AWKWARD,
                    	words:'ダメな子が                  \n        多いんだから♡',textStyle:{fill:'#8400ea',stroke:'#0a030c',y:this.world.centerY+210},emotion:c.EMOTION_COOL,version:1,scale:.85,
                    },
                    // https://www.youtube.com/watch?v=CPlx3uCF3yU&t=1m37s 【検証？】ときのそらの、珍プレー謎プレー
                    5:{id:c.GAME_RESULT_FUCKYOU,
                    	words:'えへっ♡',textStyle:{fontSize:'100px',fill:'#2b1300',stroke:'#fdb1af'},emotion:c.EMOTION_BLUSHING,version:1,
                    },
                    commonTextStyle: { font: '40px Arial', fontWeight: 'bold', fill: '#ffffff', align: 'center', stroke: '#3366ff', strokeThickness: 15 },
                    commonX: this.world.centerX, commonY: this.world.centerY+200,
                },
                tweetTexts: ['秒当てゲームで遊んだよ♪',],
                tweetImg: 'https://twitter.com/238games/status/962321587943882753/photo/1',
                tweetHashtags: ['ときのそら','そらとも'],
            },
            7: {
                id:c.CHAR_FUJI_AOI, name:'富士葵', color: '0xBBFCBD',
                resultWords: {
                    // https://www.youtube.com/watch?v=gS5zJURTCTI&t=1m15s 【NGもあるよ】1月はこーんなことやあーんなことをしていました！
                    1:{id:c.GAME_RESULT_CONGRATULATIONS,
                    	words:'Yaaaay！',textStyle:{fontSize:'80px'},emotion:c.EMOTION_SMILE,version:2,scale:1.1,
                    },
                    // https://www.youtube.com/watch?v=UP6LzYeA0DQ&t=1m8s 富士葵、いざ！！ここに表明する！！聞いてー！！
                    2:{id:c.GAME_RESULT_CLOSE,
                    	words:'D☆N\nP☆F',textStyle:{fontSize:'100px',fill:'#ff0005',stroke:'#f2dd73',y:this.world.centerY+150,x:this.world.centerX+80},emotion:c.EMOTION_SMILE,version:3,charY:this.world.centerY+30,charX:this.world.centerX-60,
                    },
                    // https://www.youtube.com/watch?v=tLZqjICvkAo&t=5s 新年のご挨拶と2018年の抱負を伝えさせてください！
                    3:{id:c.GAME_RESULT_NORMAL,
                    	words:'ぴろっぽー！',textStyle:{fontSize:'50px',fill:'#fff',stroke:'#ffe900',x:this.world.centerX+50},emotion:c.EMOTION_SMILE,version:4,charY:this.world.centerY+100,
                    },
                    // https://www.youtube.com/watch?v=gS5zJURTCTI&t=5m11s 【NGもあるよ】1月はこーんなことやあーんなことをしていました！
                    4:{id:c.GAME_RESULT_AWKWARD,
                    	words:'うううぅぅぅぅ↑↑↑',textStyle:{fontSize:'50px'},emotion:c.EMOTION_LAUGH,version:1,
                    },
                    // https://www.youtube.com/watch?v=o0_6SnmW1gQ　【利きシリーズ】第一回は利き”緑茶”　Japanese Green Tea Tasting╭( ･ㅂ･)و
                    5:{id:c.GAME_RESULT_FUCKYOU,
                    	words:'はぁあぁあぁあぁあっ！',textStyle:{fontSize:'38px',y:this.world.centerY+230},emotion:c.EMOTION_SURPRISE,version:1,charY:this.world.centerY+30
                    },
                    commonTextStyle: { font: '40px Arial', fontWeight: 'bold', fill: '#0d6cb6', align: 'center', stroke: '#fffeff', strokeThickness: 15 },
                    commonX: this.world.centerX, commonY: this.world.centerY+200,
                },
                tweetTexts: ['秒当てゲームで遊んだよ♪',],
                tweetImg: 'https://twitter.com/238games/status/962321608282062848/photo/1',
                tweetHashtags: ['富士葵','バーチャルYouTuber'],
            },
        },
        loadSoundInfo: [
            ['selectSE', ['sounds/selectSE.mp3','sounds/selectSE.wav'], 'se'],
            ['cancelSE', ['sounds/cancelSE.mp3','sounds/cancelSE.wav'], 'se'],
            ['stopwatchSE', ['sounds/stopwatchSE.mp3','sounds/stopwatchSE.wav'], 'se'],
            ['stageSelectBGM', ['sounds/stageSelectBGM.mp3','sounds/stageSelectBGM.wav'], 'bgm'],
            ['closeWindowSE', ['sounds/closeWindowSE.mp3','sounds/closeWindowSE.wav'], 'se'],
            ['openWindowSE', ['sounds/openWindowSE.mp3','sounds/openWindowSE.wav'], 'se'],
            ['volumeControlBtnSE', ['sounds/volumeControlBtnSE.mp3','sounds/volumeControlBtnSE.wav'], 'se'],
            ['panelOverSE', ['sounds/panelOverSE.mp3','sounds/panelOverSE.wav'], 'se'],
        ],
        langTextInfo: {
            'Title': {
                'TitleText': {'jp':'秒当てゲーム','en':'Hitten',},
                'OptionBtn': {'jp':'  OPTION  ','en':'  OPTION  ',},
                'VolumeText': {'jp':'VOLUME MAX=10','en':'VOLUME MAX=10',},
                'MasterText': {'jp':'MASTER : ','en':'MASTER : ',},
                'SEText': {'jp':'SE : ','en':'SE : ',},
                'BGMText': {'jp':'BGM : ','en':'BGM : ',},
                'VoiceText': {'jp':'VOICE : ','en':'VOICE : ',},
                'MuteText': {'jp':'MUTE : ','en':'MUTE : ',},
            },
            'CharacterSelect': {
                'SelectedBtn': {'jp':'  SELECT  ','en':'  SELECT  ',},
            },
            'Play': {
                'TargetTimeText': {'jp':'.00 でピッタリ止めろ','en':'.00 Stop at the perfect',},
                'StopBtn': {'jp':'  STOP  ','en':'  STOP  ',},
                'RestartBtn': {'jp':'  RESTART  ','en':'  RESTART  ',},
                'AgainBtn': {'jp':'  AGAIN  ','en':'  AGAIN  ',},
            },
            'Common': {
                'StartBtn': {'jp':'  START  ','en':'  START  ',},
                'BackBtn': {'jp':'  BACK  ','en':'  BACK  ',},
            },
        },
    };
};