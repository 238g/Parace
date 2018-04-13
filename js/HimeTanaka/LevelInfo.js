// 0: space
// 1: horizontal tween
// 2: double horizontal tween
// 3: rotation
// 4: double rotation
// 5: horizontal change duration tween
// 6: double horizontal change duration tween
// 7: rnd horizontal tween
// 100: Goal

// imgKeyHT: horizontal tween
// imgKeyR: rotation
// imgKeyRHT: rnd horizontal tween
BasicGame.Boot.prototype.genLevelInfo = function () {
	return {
		1: {
			imgKeyHT: 'Turtle_1',
			imgKeyR: 'Turtle_1',
			imgKeyRHT: 'Turtle_1',
			obstacles: [1,0,1,0,2,100],
		},
		2: {
			imgKeyHT: 'Turtle_1',
			imgKeyR: 'Turtle_1',
			imgKeyRHT: 'Turtle_1',
			obstacles: [3,0,3,0,4,100],
		},
		3: {
			imgKeyHT: 'Pig_1',
			imgKeyR: 'Turtle_1',
			imgKeyRHT: 'Turtle_1',
			obstacles: [1,0,1,1,0,4,1,0,100],
		},
		4: {
			imgKeyHT: 'Turtle_1',
			imgKeyR: 'Pig_1',
			imgKeyRHT: 'Turtle_1',
			obstacles: [2,1,0,3,0,4,0,2,100],
		},
		5: {
			imgKeyHT: 'Pig_1',
			imgKeyR: 'Pig_1',
			imgKeyRHT: 'Turtle_1',
			obstacles: [4,3,2,2,0,5,2,5,4,2,1,100],
		},
		6: {
			imgKeyHT: 'Chair_1',
			imgKeyR: 'Pig_1',
			imgKeyRHT: 'Turtle_1',
			obstacles: [1,2,5,2,6,3,6,4,5,1,2,6,100],
		},
		7: {
			imgKeyHT: 'Chair_1',
			imgKeyR: 'Pig_1',
			imgKeyRHT: 'Turtle_1',
			obstacles: [7,5,1,4,3,3,6,2,6,1,5,2,4,100],
		},
		8: {
			imgKeyHT: 'Chair_1',
			imgKeyR: 'Chair_1',
			imgKeyRHT: 'Turtle_1',
			obstacles: [7,4,6,3,7,4,6,3,5,7,7,3,6,7,4,1,5,100],
		},
	};
};
