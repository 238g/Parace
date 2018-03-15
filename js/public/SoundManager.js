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
			if (keyOrKeys.volume) { this.sounds[key].volume = keyOrKeys.volume; }
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
	// fadeIn volume 0->1
	fadeIn: function (keyOrKeys, duration) {
		var loop = false;
		if (typeof keyOrKeys == "object") {
			var key = keyOrKeys.key;
			if (keyOrKeys.isBGM) { this.sounds.currentBGM = this.sounds[key]; }
			if (keyOrKeys.loop) { loop = true; }
		} else {
			var key = keyOrKeys;
		}
		var sound = this.sounds[key];
		sound.fadeIn(duration, loop);
	},
	fadeOut: function (key, duration) {
		var sound = this.sounds[key];
		if (sound && sound.isPlaying) {
			sound.fadeOut(duration);
		}
	},
	isPlaying: function (key) {
		var sound = this.getSound(key);
		return sound ? sound.isPlaying : false;
	},
	getSound: function (key) {
		return this.sounds[key] || false;
	},
	//this.sound.onMute
	//this.sound.onUnMute
	//this.sound.volume / onVolumeChange
};
