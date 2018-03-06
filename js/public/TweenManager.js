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
		var tween = this.self.add.tween(target.scale).to(
			{x: '+.1', y: '+.1'}, (duration || 220), Phaser.Easing.Sinusoidal.Out, false, 0, -1, true);
		this.tweens[target.key] = tween;
		return tween;
	},
	popUpA: function (target, duration, scale) {
		scale = scale || {};
		var tween = this.self.add.tween(target.scale).to(
			{x: (scale.x || 1), y: (scale.y || 1)}, (duration || 1000), Phaser.Easing.Sinusoidal.Out);
		this.tweens[target.key] = tween;
		return tween;
	},
	moveA: function (target, xy, duration) {
		var tween = this.self.add.tween(target).to(
			xy, (duration || 1000), Phaser.Easing.Back.Out);
		this.tweens[target.key] = tween;
		return tween;
	},
	moveB: function (target, xy, duration) {
		var tween = this.self.add.tween(target).to(
			xy, (duration || 1000), Phaser.Easing.Linear.None);
		this.tweens[target.key] = tween;
		return tween;
	},
	onComplete: function (target, func, self) {
		target.onComplete.add(func, (self || this.self));
	},
};