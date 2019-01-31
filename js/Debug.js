BasicGame.Debug = function (game) {};

if (__ENV!='prod') { /////////////////////////
BasicGame.Debug.prototype = {

	create: function () {
		// this.compatible();
	},

	compatible: function () {
		var d = this.game.device;
		// console.log(d);
		if ((d.chrome || d.iOS) && d.touch) {
			var scaleX = 1.2;
			var scaleY = 1.2;
			if (d.iPad) {
				scaleX = .8;
				scaleY = .8;
			}
			setTimeout(function (self) {
				self.game.input.scale.set(scaleX, scaleY);
			}, 1000, this);
		}
	},

	render: function () {
			this.game.debug.pointer(this.game.input.activePointer);
			this.game.debug.inputInfo(32, 32, 'white');
		}
};

} //////////////////////////////////////////