BasicGame = {};

BasicGame.Boot = function(game) {};

BasicGame.Boot.prototype = {
    
    init: function() {

        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        this.stage.backgroundColor = '#424242';

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.scale.parentIsWindow = true ;

        this.scale.refresh();

    },

    preload: function() {

        this.load.crossOrigin = 'Anonymous';
        this.load.atlasJSONHash('loading', 'images/loading/loading.png', 'images/loading/loading.json');

        this.defineConst();
        this.defineGlobal();
        this.defineConf();
    },

    create: function() {
        if (this.game.global.loadAll) {
            this.game.global.nextSceen = 'Title';
            // this.game.global.nextSceen = 'Play'; // TODO del
            // this.game.global.nextSceen = 'CharacterSelect'; // TODO del
            this.goToNextSceen('Preloader');
        } else {
            this.game.global.goToNextSceen('Title');
        }
    },

    defineConst: function () {
        this.game.const = {
            // local storage name
            STORAGE_NAME: 'hitten',
            // result status
            GAME_RESULT_CONGRATULATIONS: 1,
            GAME_RESULT_CLOSE: 2,
            GAME_RESULT_NORMAL: 3,
            GAME_RESULT_AWKWARD: 4,
            GAME_RESULT_FUCKYOU: 5,
            // equal panel number
            CHAR_KIZUNA_AI: 1,
            CHAR_MIRAI_AKARI: 2,
            CHAR_KAGUYA_LUNA: 3,
            CHAR_SIRO: 4,
            CHAR_NEK0MASU: 5,
            CHAR_TOKINO_SORA: 6,
            CHAR_FUJI_AOI: 7,
            // language
            LANGUAGE_JP: 'jp',
            LANGUAGE_EN: 'en',
            // equal name of loaded image
            EMOTION_NORMAL: 'normal',
            EMOTION_SMILE: 'smile',
            EMOTION_FROWN: 'frown',
            EMOTION_ANGRY: 'angry',
            EMOTION_HAPPY: 'happy',
            EMOTION_SURPRISE: 'surprise',
            EMOTION_COOL: 'cool',
            EMOTION_DRUNK: 'drunk',
            EMOTION_LAUGH: 'laugh',
        };
    },

    defineConf: function () {
        var c = this.game.const;
        this.game.conf = {
            charInfo: {
                1: {
                    id:c.CHAR_KIZUNA_AI, name:'キズナアイ', color: '0xffb6c1',
                    resultWords: {
                        // none
                        1:{id:c.GAME_RESULT_CONGRATULATIONS,words:'おめでとうー！',textStyle:{fontSize:'60px'},tween:'none',emotion:c.EMOTION_HAPPY,version:1},
                        // none
                        2:{id:c.GAME_RESULT_CLOSE,words:'おしい！',textStyle:{fontSize:'60px'},emotion:c.EMOTION_SMILE,version:2},
                        // none
                        3:{id:c.GAME_RESULT_NORMAL,words:'それは普通ですよね！',textStyle:null,emotion:c.EMOTION_NORMAL,version:2},
                        // none
                        4:{id:c.GAME_RESULT_AWKWARD,words:'ちがうよ！',textStyle:{fontSize:'50px'},emotion:c.EMOTION_ANGRY,version:1},
                        // https://www.youtube.com/watch?v=FyFYH-7Ody0&t=14m59s 【BIOHAZARD 7 resident evil】#19 楽しいビデオ鑑賞会！ パーティ前夜！
                        5:{id:c.GAME_RESULT_FUCKYOU,words:'ふぁっ◯きゅー！',textStyle:{fontSize:'50px'},emotion:c.EMOTION_FROWN,version:1,},
                        commonTextStyle: { font: '40px Arial', fontWeight: 'bold', fill: '#d16986', align: 'center', stroke: '#eaebeb', strokeThickness: 15 },
                        commonTween: 'none',
                        commonX: this.world.centerX, commonY: this.world.centerY+200,
                    },
                },
                2: {
                    id:c.CHAR_MIRAI_AKARI, name:'ミライアカリ', color: '0x87cefa',
                    resultWords: {
                        // https://www.youtube.com/watch?v=qWY_G_VRBAo&t=59m21s 【大晦日生放送】ミライアカリの2.5次元から配信中！
                        1:{id:c.GAME_RESULT_CONGRATULATIONS,words:'おめでとうー！',textStyle:{fontSize:'60px'},tween:'none',emotion:c.EMOTION_HAPPY,version:1},
                        // https://www.youtube.com/watch?v=qWY_G_VRBAo&t=58m38s 【大晦日生放送】ミライアカリの2.5次元から配信中！
                        2:{id:c.GAME_RESULT_CLOSE,words:'あともうちょっとだよ',textStyle:null,emotion:c.EMOTION_SMILE,version:2},
                        // none
                        3:{id:c.GAME_RESULT_NORMAL,words:'がんばれ！',textStyle:{fontSize:'60px'},emotion:c.EMOTION_NORMAL,version:2},
                        // https://www.youtube.com/watch?v=b_SEEnVq_GM&t=4m59s 【欲望全開!!!】ポチポチしてみた結果【MiraiAkariProject#003】
                        4:{id:c.GAME_RESULT_AWKWARD,words:'人間凄いな',textStyle:{fontSize:'70px'},emotion:c.EMOTION_SURPRISE,version:1},
                        // https://www.youtube.com/watch?v=92tp_PU_VSg&t=0m53s　【ブラック校則】物申す！ちょっと怒ってます！【MiraiAkariProject#008】
                        5:{id:c.GAME_RESULT_FUCKYOU,words:'はぁ？',textStyle:{fontSize:'110px'},emotion:c.EMOTION_ANGRY,version:1,},
                        commonTextStyle: { font: '40px Arial', fontWeight: 'bold', fill: '#36acd1', align: 'center', stroke: '#fff3b9', strokeThickness: 15 },
                        commonTween: 'none',
                        commonX: this.world.centerX, commonY: this.world.centerY+200,
                    },
                },
                3: {
                    id:c.CHAR_KAGUYA_LUNA, name:'輝夜月', color: '0xFFFF00',
                    resultWords: {
                        // https://www.youtube.com/watch?v=ZJinxt-wui0&t=1s あけおめワッショイ∠ 'ω'／
                        1:{id:c.GAME_RESULT_CONGRATULATIONS,words:'おめでとうございマ！',textStyle:{fontSize:'40px',fill:'#e30002',stroke:'#020001'},tween:'none',emotion:c.EMOTION_COOL,version:1,charY:this.world.centerY+75},
                        // https://www.youtube.com/watch?v=GG7nBgIHmKw&t=3m57s 【Getting Over It】月ちゃんおこだよ！！！！！おこ
                        2:{id:c.GAME_RESULT_CLOSE,words:'神ゲー 神ゲー\n神ゲー',textStyle:{fontSize:'60px',y:this.world.centerY+180},emotion:c.EMOTION_SMILE,version:2},
                        // https://www.youtube.com/watch?v=4i1p0cMebMY&t=1m Twitterが面白くなる方法をみつけたんだがｗｗｗｗｗｗ
                        3:{id:c.GAME_RESULT_NORMAL,words:'',textStyle:null,emotion:c.EMOTION_LAUGH,version:2},
                        // https://www.youtube.com/watch?v=e-csTusLwZA&t=9s え・・・・まさかおまえらって・・・・・・
                        4:{id:c.GAME_RESULT_AWKWARD,words:'うえ～～\nかわいそ～～～',textStyle:{fontSize:'50px'},emotion:c.EMOTION_LAUGH,version:1},
                        // https://www.youtube.com/watch?v=GG7nBgIHmKw&t=4m 【Getting Over It】月ちゃんおこだよ！！！！！おこ
                        5:{id:c.GAME_RESULT_FUCKYOU,words:'クソゲーーーーー！！！',textStyle:{fontSize:'45px',fill:'#e30002',stroke:'#020001',angle:-30, y: this.world.centerY+100},emotion:c.EMOTION_DRUNK,version:1,charY:this.world.centerY+100},
                        commonTextStyle: { font: '40px Arial', fontWeight: 'bold', fill: '#e8c528', align: 'center', stroke: '#030001', strokeThickness: 15 },
                        commonTween: 'none',
                        commonX: this.world.centerX, commonY: this.world.centerY+200,
                    },
                },
                4: {
                    id:c.CHAR_SIRO, name:'シロ', color: '0xffffff',
                },
                5: {
                    id:c.CHAR_NEK0MASU, name:'ねこます', color: '0xF5D0A9',
                },
                6: {
                    id:c.CHAR_TOKINO_SORA, name:'ときのそら', color: '0xA9F5F2',
                },
                7: {
                    id:c.CHAR_FUJI_AOI, name:'富士葵', color: '0xBBFCBD',
                },
            },
            loadSoundInfo: [
                ['selectSE', 'mp3', 'se'],
                ['cancelSE', 'mp3', 'se'],
                ['stopwatchSE', 'mp3', 'se'],
                ['stageSelectBGM', 'wav', 'bgm'],
                ['closeWindowSE', 'mp3', 'se'],
                ['openWindowSE', 'mp3', 'se'],
                ['volumeControlBtnSE', 'mp3', 'se'],
                ['panelOverSE', 'mp3', 'se'],
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
    },

    defineGlobal: function () {
        this.game.global = {
            loadAll: true, // Load whether all or each sceen
            loadedOnlyFirst: false, // true:loaded, false:not yet load
            nextSceen: null,
            goToNextSceen: this.goToNextSceen.bind(this),
            currentCharNum: this.game.const.CHAR_KIZUNA_AI, // This is default.
            charCount: 7, // ENHANCE think... level up??-default 2?
            targetTime: 1,
            soundManager: null, // default:null, set Preloader.js
            soundVolumes: { se: .5, bgm: .5, voice: .5, master: .5, mute: 1 }, // default volumes
            setUserDatas: null, // set Preloader.js
            language: this.game.const.LANGUAGE_JP,
        };
    },

    goToNextSceen: function (sceenName) {
        if (this.game.global.loadAll) {
            this.state.start(sceenName);    
        } else {
            this.game.global.nextSceen = sceenName;
            this.state.start('Preloader');
        }
    }

};