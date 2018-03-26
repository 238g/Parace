BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
	},

	create: function () {
		var label = this.M.S.BasicGrayLabel(500,500,function () {
			console.log(this.M);
		},'test',{ 
			fontSize: '50px', 
			fill: '#000000', 
			align: 'center', 
			stroke: '#ffffff', 
			strokeThickness: 10, 
			multipleStroke: '#000000',
			multipleStrokeThickness: 10,
		});
		// label.addTween('beatA',{duration:220});
		// label.startTween('beatA');
		label.addTween('moveA',{xy:{y:800}});
		label.startTween('moveA');
		// this.M.T.stressA(label.btnSprite).start();
		// this.M.T.stressA(label.textSprite).start();
	},
};
