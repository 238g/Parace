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

        	this.userDatasController();

			this.game.global.loadedOnlyFirst = true;
		}
	},

    userDatasController: function () {
        // TODO update userData... date180101->180202 _ each if?
        var userDatas  = this.getUserDatas() || this.initUserDatas();
        var storageName = this.game.const.STORAGE_NAME;
        this.game.global.setUserDatas = function (path, val) {
        	var paths = path.split('.');
        	var digData = userDatas;
        	for (var i=0;i<paths.length;i++) {
        		if (i == paths.length-1) {
        			digData[paths[i]] = val;
        			break;
        		}
        		digData = digData[paths[i]];
        	}
        	localStorage.setItem(storageName, JSON.stringify(userDatas));
        };
    },

    getUserDatas: function () {
    	var g = this.game.global;
        var storageName = this.game.const.STORAGE_NAME;
        if (localStorage.getItem(storageName)) {
            var userDatas = JSON.parse(localStorage.getItem(storageName));
            // TODO Set each data to global after under TODO separate
            // TODO each if be?not be? _ data json for(check->function)
            g.charCount = userDatas.charCount;
            g.soundVolumes = userDatas.soundVolumes;
            return userDatas;
        } else {
            return false;
        }
    },

    initUserDatas: function () {
        var g = this.game.global;
        var storageName = this.game.const.STORAGE_NAME;
        var userDatas = {
            // TODO more separate...
            // think,think,think... design...
            charCount: g.charCount,
            soundVolumes: g.soundVolumes,
        };
        localStorage.setItem(storageName, JSON.stringify(userDatas));
        return userDatas;
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
		this.load.atlasXML('greySheet', imgPath+'/btns/greySheet.png', imgPath+'/btns/greySheet.xml');
		this.load.atlasXML('redSheet', imgPath+'/btns/redSheet.png', imgPath+'/btns/redSheet.xml');
		this.load.atlasXML('blueSheet', imgPath+'/btns/blueSheet.png', imgPath+'/btns/blueSheet.xml');
		this.load.audio('selectSE', soundPath+'selectSE.mp3');
		this.load.audio('cancelSE', soundPath+'cancelSE.mp3');
		this.load.audio('stopwatchSE', soundPath+'stopwatchSE.mp3');
		this.load.audio('stageSelectBGM', soundPath+'stageSelectBGM.wav');
	},

	loadAssets_CharacterSelect: function () {
		var imgPath = this.imgPath;
		for (var i=1;i<=this.charCount;i++) {
			this.load.image('icon_'+i, imgPath+'/character_imgs/icons/icon_'+i+'.jpg');
			this.load.image('smile_1_'+i, imgPath+'/character_imgs/portraits/smile_1_'+i+'.png');
		}
	},

	loadAssets_Play: function () {
		var imgPath = this.imgPath;
	},

	setSounds: function () {
		var g = this.game.global;
		var sounds = {
			currentBGM: null,
			selectSE: this.add.audio('selectSE'),
			cancelSE: this.add.audio('cancelSE'),
			stopwatchSE: this.add.audio('stopwatchSE'),
			stageSelectBGM: this.add.audio('stageSelectBGM'),
		};

		sounds.selectSE.soundType = 'se';
		sounds.cancelSE.soundType = 'se';
		sounds.stopwatchSE.soundType = 'se';
		sounds.stageSelectBGM.soundType = 'bgm';

		/* dont need???!?!?!?
		var soundTypes = {
			se: ['selectSE', 'cancelSE', 'stopwatchSE'],
			bgm: ['stageSelectBGM'],
			voice: [],
			master: null,
		};
		*/

		g.soundManager = {
			soundPlay: null,
			soundStop: null,
			getSound: null,
			volumeUp: null,
			volumeDown: null,
			soundMute: null,
		};
		g.soundManager.soundPlay = function (key) {
			var sound = sounds[key];
			
			// TODO master volume // *master??
			switch (sound.soundType) {
				case 'se':
					sound.volume = g.soundVolumes.se;
					break; 
				case 'bgm':
					sound.volume = g.soundVolumes.bgm;
					sound.loop = true;
					sounds.currentBGM = sound;
					break;
				case 'voice':
					sound.volume = g.soundVolumes.voice;
					break;
			}
			sound.play();
		};
		g.soundManager.soundStop = function (key) {
			var sound = sounds[key];
			sound.stop();
		};
		g.soundManager.getSound = function (key) {
			var sound = sounds[key];
			return sound;
		};
		g.soundManager.volumeUp = function (type) {
			// TODO max 1 !!!
			var currentVolume = g.soundVolumes[type];
			currentVolume += .1;
			g.soundVolumes[type] = currentVolume;
			g.setUserDatas('soundVolumes.'+type, currentVolume);

			// TODO type
			/* dont need???!?!?!?
			var sound = sounds[key];
			var volume = sound.volume;
			volume += .1;
			sound.volume = volume;
			g.soundVolumes[key] = sound.volume;
			g.setUserDatas('soundVolumes.'+sound.soundType, sound.volume);
			*/
		};
		g.soundManager.volumeDown = function (type) {
			// TODO min 0 !!!
			var currentVolume = g.soundVolumes[type];
			currentVolume -= .1;
			g.soundVolumes[type] = currentVolume;
			g.setUserDatas('soundVolumes.'+type, currentVolume);

			// TODO type
			/* dont need???!?!?!?
			var sound = sounds[key];
			var volume = sound.volume;
			volume -= .1;
			sound.volume = volume;
			g.soundVolumes[key] = sound.volume;
			g.setUserDatas('soundVolumes.'+sound.soundType, sound.volume);
			*/
		};
		g.soundManager.volumeMute = function (type) {
			var currentVolume = g.soundVolumes[type];
			currentVolume = 0;
			g.soundVolumes[type] = currentVolume;
			g.setUserDatas('soundVolumes.'+type, currentVolume);
			// TODO type
			/* dont need???!?!?!?
			var sound = sounds[key];
			sound.volume = 0;
			g.soundVolumes[key] = sound.volume;
			g.setUserDatas('soundVolumes.'+sound.soundType, sound.volume);
			*/
		};
	}
};
