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
            // equal name of loaded image
            EMOTION_NORMAL: 'normal',
            EMOTION_SMILE: 'smile',
            EMOTION_FROWN: 'frown',
            EMOTION_ANGRY: 'angry',
            EMOTION_HAPPY: 'happy',
        };
    },

    defineConf: function () {
        var c = this.game.const;
        this.game.conf = {
            charInfo: {
                1: {
                    id:c.CHAR_KIZUNA_AI, name:'キズナアイ', color: '0xffb6c1',
                    resultWords: {
                        1:{id:c.GAME_RESULT_CONGRATULATIONS,words:'おめでとうー！',textStyle:{fontSize:'60px'},tween:'none',emotion:c.EMOTION_HAPPY},
                        2:{id:c.GAME_RESULT_CLOSE,words:'おしい！',textStyle:{fontSize:'60px'},emotion:c.EMOTION_SMILE},
                        3:{id:c.GAME_RESULT_NORMAL,words:'それは普通ですよね！',textStyle:null,emotion:c.EMOTION_NORMAL},
                        4:{id:c.GAME_RESULT_AWKWARD,words:'おそいよ！',textStyle:{fontSize:'70px'},emotion:c.EMOTION_ANGRY},
                        5:{id:c.GAME_RESULT_FUCKYOU,words:'ふぁっ◯きゅー！',textStyle:{fontSize:'50px'},emotion:c.EMOTION_FROWN,},
                        commonTextStyle: { font: '40px Arial', fontWeight: 'bold', fill: '#d16986', align: 'center', stroke: '#eaebeb', strokeThickness: 15 },
                        commonTween: 'none',
                        commonX: this.world.centerX, commonY: this.world.centerY+200,
                    },
                },
                2: {
                    id:c.CHAR_MIRAI_AKARI, name:'ミライアカリ', color: '0x87cefa',
                    resultWords: {
                        1:{id:c.GAME_RESULT_CONGRATULATIONS,words:'おめでとうー！',textStyle:{fontSize:'60px',strokeThickness:15},tween:'none',emotion:c.EMOTION_HAPPY},
                        2:{id:c.GAME_RESULT_CLOSE,words:'あとちょっと…',textStyle:{fontSize:'55px',strokeThickness:20},emotion:c.EMOTION_SMILE},
                        // TODO 3~5
                        3:{id:c.GAME_RESULT_NORMAL,words:'それは普通ですよね！',textStyle:null,emotion:c.EMOTION_NORMAL},
                        4:{id:c.GAME_RESULT_AWKWARD,words:'おそいよ！',textStyle:{fontSize:'70px',strokeThickness:20},emotion:c.EMOTION_ANGRY},
                        5:{id:c.GAME_RESULT_FUCKYOU,words:'ふぁっ◯きゅー！',textStyle:{fontSize:'50px',strokeThickness:20},emotion:c.EMOTION_FROWN,},
                        commonTextStyle: { font: '40px Arial', fontWeight: 'bold', fill: '#36acd1', align: 'center', stroke: '#fff3b9', strokeThickness: 15 },
                        commonTween: 'none',
                        commonX: this.world.centerX, commonY: this.world.centerY+200,
                    },
                },
                3: {
                    id:c.CHAR_KAGUYA_LUNA, name:'輝夜月', color: '0xFFFF00',
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