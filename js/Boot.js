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

        this.setGlobalVal();
        this.setConstVal();

    },

    create: function() {
        nextSceen.bind(this)('Title');
    },

    setGlobalVal: function () {
        this.game.global = {
            nextSceen: null,
        };
    },

    setConstVal: function () {
        this.game.const = {};
    }

};

function nextSceen (sceenName) {
    this.game.global.nextSceen = sceenName;
    this.state.start('Preloader');
}