BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
	},

	create: function () {
		var label = this.M.S.BasicGrayLabel(500,500,function () {
			console.log(this.M);
		},'test');
		label.addTween('beatA',{duration:220});
		label.startTween('beatA');
		// this.M.T.stressA(label.btnSprite).start();
		// this.M.T.stressA(label.textSprite).start();
	},
};
