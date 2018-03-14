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
	popUpB: function (target, duration, scale, delay) {
		scale = scale || {};
		delay = delay || 0;
		var tween = this.self.add.tween(target.scale).to(
			{x: (scale.x || 1), y: (scale.y || 1)}, (duration || 1000), Phaser.Easing.Back.Out, false, delay);
		this.tweens[target.key] = tween;
		return tween;
	},
	// Easing.Back.Out
	moveA: function (target, xy, duration, delay) {
		duration = duration || 1000;
		delay = delay || 0;
		var tween = this.self.add.tween(target).to(
			xy, duration, Phaser.Easing.Back.Out, false, delay);
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
	fadeInA: function (target, duration, delay) {
		duration = duration || 1000;
		delay = delay || 0;
		var tween = this.self.add.tween(target).to(
			{alpha:1}, duration, Phaser.Easing.Linear.None, false, delay);
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
	stressA: function (target, durations, delay) {
		durations = durations || [200,100];
		delay = (delay >= 0) ? delay : 500;
		var startTween = this.self.add.tween(target.scale).to({x:'+.1'},durations[0],Phaser.Easing.Linear.None,false,delay);
		var endTween = this.self.add.tween(target.scale).to({x:'-.1'},durations[0],Phaser.Easing.Linear.None);
		var yoyoTween = this.self.add.tween(target).to({angle:5},durations[1],Phaser.Easing.Linear.None,false,0,2,true);
		startTween.chain(yoyoTween);
		startTween.onComplete.add(function () {
			target.angle = -5;
		}, this);
		yoyoTween.onComplete.add(function () {
			target.angle = 0;
			endTween.start();
		}, this);
		endTween.onComplete.add(function () {
			startTween.start();
		}, this);
		this.tweens[target.key] = startTween;
		return startTween;
	},
	onComplete: function (target, func, self) {
		target.onComplete.add(func, (self || this.self));
	},
};