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
		this.genSoundManager();
		this.genTweenManager();

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
        this.game.global.genUserDatas = function (path, key) {
        	var paths = path.split('.');
        	var digData = userDatas[__currentVersion];
        	for (var i=0;i<paths.length;i++) {
        		if (i == paths.length-1) {
        			digData[paths[i]][key] = null;
        			break;
        		}
        		digData = digData[paths[i]];
        	}
        	localStorage.setItem(storageName, JSON.stringify(userDatas));
        };
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
            g.language = userDatas.language;
            g.playCount = userDatas.playCount;
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
            language: g.language,
            playCount: g.playCount,
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

		// siro
		this.load.image('smile_4_4', imgPath+'/character_imgs/portraits/smile_4_4.png');
		this.load.image('sad_1_4', imgPath+'/character_imgs/portraits/sad_1_4.png');
		this.load.image('smile_3_4', imgPath+'/character_imgs/portraits/smile_3_4.png');
		this.load.image('horror_1_4', imgPath+'/character_imgs/portraits/horror_1_4.png');
		this.load.image('smile_2_4', imgPath+'/character_imgs/portraits/smile_2_4.png');

		// nekomasu
		this.load.image('happy_1_5', imgPath+'/character_imgs/portraits/happy_1_5.png');
		this.load.image('smile_2_5', imgPath+'/character_imgs/portraits/smile_2_5.png');
		this.load.image('sad_1_5', imgPath+'/character_imgs/portraits/sad_1_5.png');
		this.load.image('sad_2_5', imgPath+'/character_imgs/portraits/sad_2_5.png');
		this.load.image('drunk_1_5', imgPath+'/character_imgs/portraits/drunk_1_5.png');

		// tokinosora
		this.load.image('happy_1_6', imgPath+'/character_imgs/portraits/happy_1_6.png');
		this.load.image('cool_2_6', imgPath+'/character_imgs/portraits/cool_2_6.png');
		this.load.image('smile_2_6', imgPath+'/character_imgs/portraits/smile_2_6.png');
		this.load.image('cool_1_6', imgPath+'/character_imgs/portraits/cool_1_6.png');
		this.load.image('blushing_1_6', imgPath+'/character_imgs/portraits/blushing_1_6.png');

		// fujiaoi
		this.load.image('smile_2_7', imgPath+'/character_imgs/portraits/smile_2_7.png');
		this.load.image('smile_3_7', imgPath+'/character_imgs/portraits/smile_3_7.png');
		this.load.image('smile_4_7', imgPath+'/character_imgs/portraits/smile_4_7.png');
		this.load.image('laugh_1_7', imgPath+'/character_imgs/portraits/laugh_1_7.png');
		this.load.image('surprise_1_7', imgPath+'/character_imgs/portraits/surprise_1_7.png');
	},

	genSoundManager: function () {
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
	},

	genTweenManager: function () {
		var g = this.game.global;
		if (g.tweenManager) { return; }

		g.tweenManager = {
			world: {},
			tweens: {},
			addTween: null,
			startTween: null,
		};
		g.tweenManager.init = function (self) {
			this.world.centerX = self.world.centerX;
			this.world.centerY = self.world.centerY;
			this.world.width = self.world.width;
			this.world.height = self.world.height;
		};
		g.tweenManager.genTween = function (self, targetName, targetSprite) {
			var tween = self.add.tween(targetSprite);
			switch (targetName) {
				// .to(properties [, duration] [, ease] [, autoStart] [, delay] [, repeat] [, yoyo])
				case 'ShowMenu': tween.to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out); break;
				case 'HideMenu': tween.to( { x: 0, y: 0 }, 300, Phaser.Easing.Elastic.In); break;
				case 'TransparentYOYO': tween.to({alpha: .2}, 300, "Linear", false, 0, -1, true); break;
				case 'PockyGame': tween.to({x: -this.world.width-50}, 2300, "Linear", true, 200, 0, false); break;
			}
			return tween;
		};
		g.tweenManager.init(this);
	}
};
