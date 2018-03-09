// .to(properties [, duration] [, ease] [, autoStart] [, delay] [, repeat] [, yoyo])
// repeat default 0
TweenManager = function (self) { this.constructor(self); };
TweenManager.prototype = {
	self: null,
	tweens: {},
	constructor: function (self) {
		this.self = self;
	},
	beatA: function (target, duration) {
		duration = duration || 220;
		var tween = this.self.add.tween(target.scale).to(
			{x: '+.1', y: '+.1'}, duration, Phaser.Easing.Sinusoidal.Out, false, 0, -1, true);
		this.tweens[target.key] = tween;
		return tween;
	},
	popUpA: function (target, duration, scale, delay) {
		scale = scale || {};
		delay = delay || 0;
		var tween = this.self.add.tween(target.scale).to(
			{x: (scale.x || 1), y: (scale.y || 1)}, (duration || 1000), Phaser.Easing.Sinusoidal.Out, false, delay);
		this.tweens[target.key] = tween;
		return tween;
	},
	// Easing.Back.Out
	moveA: function (target, xy, duration) {
		duration = duration || 1000;
		var tween = this.self.add.tween(target).to(
			xy, duration, Phaser.Easing.Back.Out);
		this.tweens[target.key] = tween;
		return tween;
	},
	// Easing.Linear.None
	moveB: function (target, xy, duration) {
		duration = duration || 1000;
		var tween = this.self.add.tween(target).to(
			xy, duration, Phaser.Easing.Linear.None);
		this.tweens[target.key] = tween;
		return tween;
	},
	fadeOutA: function (target, duration, delay) {
		duration = duration || 1000;
		delay = delay || 0;
		var tween = this.self.add.tween(target).to(
			{alpha:0}, duration, Phaser.Easing.Linear.None, false, delay);
		this.tweens[target.key] = tween;
		return tween;
	},
	onComplete: function (target, func, self) {
		target.onComplete.add(func, (self || this.self));
	},
};