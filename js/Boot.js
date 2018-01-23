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
            // this.game.global.nextSceen = 'Play'; // TODO del
            // this.game.global.nextSceen = 'CharacterSelect'; // TODO del
            this.game.global.nextSceen = 'Title';
            this.goToNextSceen('Preloader');
        } else {
            this.game.global.goToNextSceen('Title');
        }
    },

    defineConst: function () {
        this.game.const = {
            STORAGE_NAME: 'hitten',
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
        };
    },

    defineConf: function () {
        var c = this.game.const;
        this.game.conf = {
            charInfo: {
                1: {id:c.CHAR_KIZUNA_AI,   name:'キズナアイ', color: '0xffb6c1'},
                2: {id:c.CHAR_MIRAI_AKARI, name:'ミライアカリ', color: '0x87cefa'},
                3: {id:c.CHAR_KAGUYA_LUNA, name:'輝夜月', color: '0xFFFF00'},
                4: {id:c.CHAR_SIRO,        name:'シロ', color: '0xffffff'},
                5: {id:c.CHAR_NEK0MASU,    name:'ねこます', color: ''},
                6: {id:c.CHAR_TOKINO_SORA, name:'ときのそら', color: ''},
                7: {id:c.CHAR_FUJI_AOI,    name:'富士葵', color: ''},
            }
        };
    },

    defineGlobal: function () {
        this.game.global = {
            loadAll: true, // Load whether all or each sceen
            loadedOnlyFirst: false, // true:loaded, false:not yet load
            nextSceen: null,
            goToNextSceen: this.goToNextSceen.bind(this),
            currentCharNum: this.game.const.CHAR_KIZUNA_AI, // This is default.
            charCount: 7, // default 2? // TODO think... level up??
            targetTime: 1,
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