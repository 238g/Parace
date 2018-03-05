// .to(properties [, duration] [, ease] [, autoStart] [, delay] [, repeat] [, yoyo])
TweenManager = function (self) { this.constructor(self); };
TweenManager.prototype = {
	self: null,
	tweens: {},
	constructor: function (self) {
		this.self = self;
	},
	beatA: function (target, duration) {
		var tween = this.self.add.tween(target.scale).to({x: '+.1', y: '+.1'}, (duration || 220), Phaser.Easing.Sinusoidal.Out, false, 0, -1, true);
		this.tweens[target.key] = tween;
		return tween;
	},
};