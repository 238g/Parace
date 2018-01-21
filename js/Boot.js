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

        this.initGlobalVal();
        this.setConstVal();

        this.userDataController();
    },

    create: function() {
        if (this.game.global.loadAll) {
            // this.game.global.nextSceen = 'Play'; // TODO del
            this.game.global.nextSceen = 'Title';
            this.goToNextSceen('Preloader');
        } else {
            this.game.global.goToNextSceen('Title');
        }
    },

    initGlobalVal: function () {
        this.game.global = {
            loadAll: true,
            nextSceen: null,
            goToNextSceen: this.goToNextSceen.bind(this),
            currentCharacter: 1,
            characterCount: 2,
            targetTime: 1,
        };
    },

    setConstVal: function () {
        this.game.const = {
            STORAGE_NAME: 'hitten',
            GAME_RESULT_CONGRATULATIONS: 1,
            GAME_RESULT_CLOSE: 2,
            GAME_RESULT_NORMAL: 3,
            GAME_RESULT_AWKWARD: 4,
            GAME_RESULT_FUCKYOU: 5,
        };
    },

    userDataController: function () {
        // TODO update userData... date180101->180202 _ each if?
        if (!this.getUserData()) { this.initUserData(); }
    },

    getUserData: function () {
        var storageName = this.game.const.STORAGE_NAME;
        if (localStorage.getItem(storageName)) {
            var userDatas = JSON.parse(localStorage.getItem(storageName));
            // TODO Set each data to global after under TODO separate
            // TODO each if be?not be? _ data json for(check->function)
            console.log(userDatas);
            return true;
        } else {
            return false;
        }
    },

    initUserData: function () {
        var g = this.game.global;
        var c = this.game.const;
        var storageName = c.STORAGE_NAME;
        var userDatas = {
            // TODO more separate...
            // think,think,think... design...
            characterCount: g.characterCount,
        };
        localStorage.setItem(storageName, JSON.stringify(userDatas));
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