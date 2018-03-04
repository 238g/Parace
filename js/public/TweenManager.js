// .to(properties [, duration] [, ease] [, autoStart] [, delay] [, repeat] [, yoyo])
TweenManager = function (self) { this.constructor(self); };
TweenManager.prototype = {
	self: null,
	constructor: function (self) {
		this.self = self;
	},
	beatA: function (target, interval) {
		return this.self.add.tween(target.scale).to({x: '+.1', y: '+.1'}, (interval || 220), Phaser.Easing.Sinusoidal.Out, true, 0, -1, true);
	},
};