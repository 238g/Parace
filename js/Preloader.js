BasicGame.Preloader = function (game) {};

BasicGame.Preloader.prototype = {

	init: function () {
		this.imgPath = 'images/';
		this.soundPath = 'sounds/';

		var g = this.game.global;
		this.charCount = g.charCount;
		this.nextSceen = g.nextSceen;
	},

	preload: function () {
		this.genBackGround();
		this.loadingAnim();

		this.loadOnlyFirst();
		this.loadAssets();
	},

	create: function () {
		this.setSounds(); // TODO load only first ??? or All set at Title

		this.state.start(this.nextSceen);
	},

	genBackGround: function () {
		this.stage.backgroundColor = '#424242';
	},

	loadingAnim: function () {
		var loadingSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'loading');
		loadingSprite.anchor.setTo(.5);
		loadingSprite.scale.setTo(1.5);

		var loadingAnim = loadingSprite.animations.add('loading');
		loadingAnim.play(18, true);
	},

	loadOnlyFirst: function () {
		if (!this.game.global.loadedOnlyFirst) {

        	this.userDataController();

			this.game.global.loadedOnlyFirst = true;
		}
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
            charCount: g.charCount,
        };
        localStorage.setItem(storageName, JSON.stringify(userDatas));
    },

	loadAssets: function () {
		if (this.game.global.loadAll) {
			this.loadAssets_All();
		} else {
			var nextSceenName = this.nextSceen;
			var className = 'loadAssets_'+nextSceenName;
			this[className]();
		}
	},

	loadAssets_All: function () {
		this.loadAssets_Title();
		this.loadAssets_CharacterSelect();
		this.loadAssets_Play();
	},

	loadAssets_Title: function () {
		var imgPath = this.imgPath;
		var soundPath = this.soundPath;
		this.load.atlasXML('yellowSheet', imgPath+'/btns/yellowSheet.png', imgPath+'/btns/yellowSheet.xml');
		this.load.audio('click', soundPath+'click_1.mp3');
	},

	loadAssets_CharacterSelect: function () {
		var imgPath = this.imgPath;
		this.load.atlasXML('greySheet', imgPath+'/btns/greySheet.png', imgPath+'/btns/greySheet.xml');
		for (var i=1;i<=this.charCount;i++) {
			this.load.image('icon_'+i, imgPath+'/character_imgs/icons/icon_'+i+'.jpg');
			this.load.image('smile_1_'+i, imgPath+'/character_imgs/portraits/smile_1_'+i+'.png');
		}
	},

	loadAssets_Play: function () {
		var imgPath = this.imgPath;
		this.load.atlasXML('redSheet', imgPath+'/btns/redSheet.png', imgPath+'/btns/redSheet.xml');
	},

	setSounds: function () {
		var gs = this.game.global.sounds;
		gs.click = gs.click || this.add.audio('click'); // TODO correct???
	}
};
