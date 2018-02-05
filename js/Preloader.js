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
		this.setSounds();

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
        var userDatas  = this.getUserDatas() || this.initUserDatas();
        var storageName = this.game.const.STORAGE_NAME;
        this.game.global.setUserDatas = function (path, val) {
        	var paths = path.split('.');
        	var digData = userDatas[__currentVersion];
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
        	var allUserDatas = JSON.parse(localStorage.getItem(storageName));
        	if (allUserDatas[__oldVersion] && !allUserDatas[__currentVersion]) {
        		var oldUserDatas = allUserDatas[__oldVersion];
        		var initUserDatas = this.initUserDatas()[__currentVersion];
        		for (var key in initUserDatas) {
        			if (oldUserDatas[key]) {
        				if (typeof oldUserDatas[key] == 'object' && typeof initUserDatas[key] == 'object') {
        					for (var inKey in initUserDatas[key]) {
        						if (oldUserDatas[key][inKey]) {
        							initUserDatas[key][inKey] = oldUserDatas[key][inKey];
        						}
        					}
        				} else if (typeof initUserDatas[key] == 'object') {
        					for (var inKey in initUserDatas[key]) {
        						if (oldUserDatas[inKey]) {
        							initUserDatas[key][inKey] = oldUserDatas[inKey];
        						}
        					}
        				} else if (typeof oldUserDatas[key] == 'object') {
        					continue;
        				} else {
        					initUserDatas[key] = oldUserDatas[key];
        				}
        			}
        		}
        		allUserDatas[__currentVersion] = initUserDatas;
        	}
            var userDatas = allUserDatas[__currentVersion];
            g.charCount = userDatas.charCount;
            g.currentCharNum = userDatas.currentCharNum;
            g.soundVolumes = userDatas.soundVolumes;
            return allUserDatas;
        } else {
            return false;
        }
    },

    initUserDatas: function () {
        var g = this.game.global;
        var storageName = this.game.const.STORAGE_NAME;
        var userDatas = {};
        userDatas[__currentVersion] = {
            charCount: g.charCount,
            currentCharNum: g.currentCharNum,
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

		var info = this.game.conf.loadSoundInfo;
		for (var key in info) {
			this.load.audio(info[key][0], soundPath+info[key][0]+'.'+info[key][1]);
		}
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
		for (var i=1;i<=this.charCount;i++) {
			this.load.image('normal_1_'+i, imgPath+'/character_imgs/portraits/normal_1_'+i+'.png');
			// this.load.image('normal_2_'+i, imgPath+'/character_imgs/portraits/normal_2_'+i+'.png');
			// this.load.image('frown_1_'+i, imgPath+'/character_imgs/portraits/frown_1_'+i+'.png');
			// this.load.image('angry_1_'+i, imgPath+'/character_imgs/portraits/angry_1_'+i+'.png');
			// this.load.image('smile_2_'+i, imgPath+'/character_imgs/portraits/smile_2_'+i+'.png');
			// this.load.image('happy_1_'+i, imgPath+'/character_imgs/portraits/happy_1_'+i+'.png');
			// this.load.image('surprise_1_'+i, imgPath+'/character_imgs/portraits/surprise_1_'+i+'.png');
			// this.load.image('cool_1_'+i, imgPath+'/character_imgs/portraits/cool_1_'+i+'.png');
			// this.load.image('drunk_1_'+i, imgPath+'/character_imgs/portraits/drunk_1_'+i+'.png');
		}

		// kizuna ai
		this.load.image('normal_2_1', imgPath+'/character_imgs/portraits/normal_2_1.png');
		this.load.image('frown_1_1', imgPath+'/character_imgs/portraits/frown_1_1.png');
		this.load.image('angry_1_1', imgPath+'/character_imgs/portraits/angry_1_1.png');
		this.load.image('smile_2_1', imgPath+'/character_imgs/portraits/smile_2_1.png');
		this.load.image('happy_1_1', imgPath+'/character_imgs/portraits/happy_1_1.png');

		// mirai akari
		this.load.image('happy_1_2', imgPath+'/character_imgs/portraits/happy_1_2.png');
		this.load.image('smile_2_2', imgPath+'/character_imgs/portraits/smile_2_2.png');
		this.load.image('normal_2_2', imgPath+'/character_imgs/portraits/normal_2_2.png');
		this.load.image('surprise_1_2', imgPath+'/character_imgs/portraits/surprise_1_2.png');
		this.load.image('angry_1_2', imgPath+'/character_imgs/portraits/angry_1_2.png');

		// kaguya runa
		this.load.image('cool_1_3', imgPath+'/character_imgs/portraits/cool_1_3.png');
		this.load.image('smile_2_3', imgPath+'/character_imgs/portraits/smile_2_3.png');
		this.load.image('laugh_1_3', imgPath+'/character_imgs/portraits/laugh_1_3.png');
		this.load.image('laugh_2_3', imgPath+'/character_imgs/portraits/laugh_2_3.jpg'); // jpg
		this.load.image('drunk_1_3', imgPath+'/character_imgs/portraits/drunk_1_3.png');
	},

	setSounds: function () {
		var g = this.game.global;

		if (g.soundManager) { return; }

		g.soundManager = {
			sounds: null,
			soundPlay: null,
			soundStop: null,
			getSound: null,
			volumeUp: null,
			volumeDown: null,
			volumeMute: null,
		};

		var sounds = {
			currentBGM: null,
		};

		var info = this.game.conf.loadSoundInfo;
		for (var key in info) {
			sounds[info[key][0]] = this.add.audio(info[key][0]);
			sounds[info[key][0]].soundType = info[key][2];
		}

		g.soundManager.soundPlay = function (key) {
			var sound = sounds[key];
			switch (sound.soundType) {
				case 'se':
					sound.volume = g.soundVolumes.se * g.soundVolumes.master * g.soundVolumes.mute;
					break; 
				case 'bgm':
					sound.volume = g.soundVolumes.bgm * g.soundVolumes.master * g.soundVolumes.mute;
					sound.loop = true;
					sounds.currentBGM = sound;
					break;
				case 'voice':
					sound.volume = g.soundVolumes.voice * g.soundVolumes.master * g.soundVolumes.mute;
					break;
			}
			sound.play();
		};
		g.soundManager.soundStop = function (key) {
			var sound = sounds[key];
			if (sound) {
				sound.stop();
			}
		};
		g.soundManager.getSound = function (key) {
			var sound = sounds[key];
			return sound;
		};
		g.soundManager.volumeUp = function (type) {
			var currentVolume = g.soundVolumes[type];
			if (currentVolume >= 1) { return false; }
			currentVolume *= 100;
			currentVolume += 10;
			currentVolume /= 100;
			g.soundVolumes[type] = currentVolume;
			g.setUserDatas('soundVolumes.'+type, currentVolume);
			if (type == 'bgm' || type == 'master') {
				sounds.currentBGM.volume = g.soundVolumes.bgm * g.soundVolumes.master * g.soundVolumes.mute;
			}
		};
		g.soundManager.volumeDown = function (type) {
			var currentVolume = g.soundVolumes[type];
			if (currentVolume <= 0) { return false; }
			currentVolume *= 100;
			currentVolume -= 10;
			currentVolume /= 100;
			g.soundVolumes[type] = currentVolume;
			g.setUserDatas('soundVolumes.'+type, currentVolume);
			if (type == 'bgm' || type == 'master') {
				sounds.currentBGM.volume = g.soundVolumes.bgm * g.soundVolumes.master * g.soundVolumes.mute;
			}
		};
		g.soundManager.volumeMute = function () {
			if (g.soundVolumes.mute == 0) {
				g.soundVolumes.mute = 1;
			} else {
				g.soundVolumes.mute = 0;
			}
			g.setUserDatas('soundVolumes.mute', g.soundVolumes.mute);
			sounds.currentBGM.volume = g.soundVolumes.bgm * g.soundVolumes.master * g.soundVolumes.mute;
		};
	}
};
