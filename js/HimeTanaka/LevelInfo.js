// 0: space
// 1: horizontal tween
// 2: double horizontal tween
// 3: rotation
// 4: double rotation
// 5: horizontal change duration tween
// 6: double horizontal change duration tween
// 7: rnd horizontal tween
// 100: Goal
BasicGame.Boot.prototype.genLevelInfo = function () {
	return {
		1: {
			obstacles: [1,3,1,4,100],
			// obstacles: [1,2,3,4,5,100],
		},
		2: {
			obstacles: [3,3,100],
		},
	};
};
