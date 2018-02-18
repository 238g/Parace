function getQuery (key) {
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
}

function getYmd () {
	var Y = new Date().getFullYear();
	var m = ('0'+(new Date().getMonth()+1)).slice(-2);
	var d = ('0'+(new Date().getDate())).slice(-2);
	return Y+'-'+m+'-'+d;
}

userDatasController = function (storageName) { this.constructor(storageName); };
userDatasController.prototype = {
	storageName: null,
	userDatas: null,
	constructor: function (storageName) {
		this.storageName = storageName;
		this.userDatas = JSON.parse(localStorage.getItem(this.storageName)) || {};
	},
	init: function (newPath, val, oldPath) {
		this.userDatas[newPath] = val;
		if (oldPath) {
			this.copyUserDatas(oldPath, newPath);
		}
		localStorage.setItem(this.storageName, JSON.stringify(this.userDatas));
		return this.userDatas;
	},
	gen: function (path, key) {
		var paths = path.split('/');
		var digData = this.userDatas;
		for (var i=0;i<paths.length;i++) {
			if (!digData[paths[i]]) {
				digData[paths[i]] = {};
			}
			if (i == paths.length-1) {
				digData[paths[i]][key] = null;
				break;
			}
			digData = digData[paths[i]];
		}
		localStorage.setItem(this.storageName, JSON.stringify(this.userDatas));
	},
	set: function (path, val) {
		var paths = path.split('/');
		var digData = this.userDatas;
		for (var i=0;i<paths.length;i++) {
			if (i == paths.length-1) {
				digData[paths[i]] = val;
				break;
			}
			digData = digData[paths[i]];
		}
		localStorage.setItem(this.storageName, JSON.stringify(this.userDatas));
	},
	get: function (path) {
		if (path) {
			var paths = path.split('/');
			var digData = this.userDatas;
			for (var i=0;i<paths.length;i++) {
				if (!digData || !digData[paths[i]]) {
					return false;
				}
				if (i == paths.length-1) {
					return digData[paths[i]];
				}
				digData = digData[paths[i]];
			}
		}
		return this.userDatas || false;
	},
	copyUserDatas: function (oldPath, newPath) {
		// TODO
	}
};

SpriteManager = function (self) { this.constructor(self); };
SpriteManager.prototype = {
	self: null,
	constructor: function (self) {
		this.self = self;
	},
	genText: function (x, y, text, textStyle) {
		var commonTextStyle = { 
			fontSize: '50px', 
			fill: '#FFFFFF', 
			align: 'center', 
			stroke: '#000000', 
			strokeThickness: 10, 
			multipleStroke: null,
			multipleStrokeThickness: 10,
		};
		for (var key in textStyle) {
			commonTextStyle[key] = textStyle[key];
		}
		var multipleTextSprite = {};
		if (commonTextStyle.multipleStroke) {
			var multipleTextStyle = {
				fontSize: commonTextStyle.fontSize,
				fill: commonTextStyle.multipleStroke,
				align: 'center',
				stroke: commonTextStyle.multipleStroke,
				strokeThickness: commonTextStyle.strokeThickness+commonTextStyle.multipleStrokeThickness,
			};
			multipleTextSprite = this.self.add.text(x, y, text, multipleTextStyle);
			multipleTextSprite.anchor.setTo(.5);
		}
		var textSprite = this.self.add.text(x, y, text, commonTextStyle);
		textSprite.anchor.setTo(.5);
		textSprite.show = function () {
			textSprite.visible = true;
			multipleTextSprite.visible = true;
		};
		textSprite.hide = function () {
			textSprite.visible = false;
			multipleTextSprite.visible = false;
		};
		textSprite.changeText = function (text) {
			textSprite.setText(text);
			if (multipleTextSprite) {
				multipleTextSprite.setText(text);
			}
		};
		textSprite.move = function (x, y) {
			textSprite.x = x;
			textSprite.y = y;
			multipleTextSprite.x = x;
			multipleTextSprite.y = y;
		};
		textSprite.setTextStyle = function (newTextStyle) {
			for (var key in newTextStyle) {
				if (textSprite[key]) {
					textSprite[key] = newTextStyle[key];
				}
				if (multipleTextSprite && multipleTextSprite[key]) {
					multipleTextSprite[key] = newTextStyle[key]
				}
			}
		};
		return textSprite;
	}
};

SoundManager = function (self) { this.constructor(self); };
SoundManager.prototype = {
	self: null,
	sounds: null,
	constructor: function (self) {
		this.self = self;
		var sounds = {
			currentBGM: null,
		};
		var arr = self.cache._cache.sound;
		for (var key in arr) {
			sounds[key] = self.add.audio(key);
			sounds[key].onComplete = false;
		}
		this.sounds = sounds;
	},
	play: function (keyOrKeys) {
		if (typeof keyOrKeys == "object") {
			var key = keyOrKeys.key;
			if (keyOrKeys.isBGM) { this.sounds.currentBGM = this.sounds[key]; }
			if (keyOrKeys.loop) { this.sounds[key].loop = true; }
		} else {
			var key = keyOrKeys;
		}
		var sound = this.sounds[key];
		sound.play();
	},
	stop: function (key) {
		var sound = this.sounds[key];
		if (sound && sound.isPlaying) {
			sound.stop();
		}
	},
	onComplete: function (key, func, self) {
		var sound = this.sounds[key];
		if (sound.onComplete == false) {
			sound.onComplete = true;
			sound.onStop.add(func, self);
		}
	},
	setVolume: function (key, val) {
		var sound = this.sounds[key];
		sound.volume = val;
	},
	//this.sound.onMute
	//this.sound.onUnMute
	//this.sound.volume / onVolumeChange
};
