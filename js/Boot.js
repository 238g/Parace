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

        this.defineConst(); // Const.js
        this.defineGlobal();
        this.defineConf(); // Conf.js
    },

    create: function() {
        var nextSceenName = (__ENV!='prod') ? this.getQuery('s') || 'Title' : 'Title';
        if (this.game.global.loadAll) {
            this.game.global.nextSceen = nextSceenName;
            this.goToNextSceen('Preloader');
        } else {
            this.game.global.goToNextSceen(nextSceenName);
        }
    },

    defineGlobal: function () {
        this.game.global = {
            loadAll: true, // Load whether all or each sceen
            loadedOnlyFirst: false, // true:loaded, false:not yet load
            nextSceen: null, // Used Phaser.state.start
            goToNextSceen: this.goToNextSceen.bind(this), // bind otherwise "this" is "this.game.global"
            currentCharNum: this.game.const.CHAR_KIZUNA_AI, // This is default.
            charCount: 7, // ENHANCE think... level up??-default 2?
            targetTime: 1, // Now, 1 seconds
            soundManager: null, // default:null, set Preloader.js
            soundVolumes: { se: .5, bgm: .5, voice: .5, master: .5, mute: 1 }, // default volumes
            setUserDatas: null, // set Preloader.js
            language: this.game.const.LANGUAGE_JP,
            tweenManager: null, // default:null, gen Preloader.js
            playCount: {},
            getQuery: this.getQuery,
            getYmd: this.getYmd,
        };
    },

    goToNextSceen: function (sceenName) {
        if (this.game.global.loadAll) {
            this.state.start(sceenName);    
        } else {
            this.game.global.nextSceen = sceenName;
            this.state.start('Preloader');
        }
    },

    getQuery: function (key) {
        var querys = window.location.search.slice(1).split('&');
        for (var i in querys) {
            var arr = querys[i].split('=');
            var queryKey = arr[0];
            var queryVal = arr[1];

            if (key == queryKey) {
                return queryVal;
            }
        }
        return false;
    },

    getYmd: function () {
        var Y = new Date().getFullYear();
        var m = ('0'+(new Date().getMonth()+1)).slice(-2);
        var d = ('0'+new Date().getDate()).slice(-2);
        return Y+'-'+m+'-'+d;
    }

};