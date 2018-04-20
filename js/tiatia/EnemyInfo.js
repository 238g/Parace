BasicGame.Boot.prototype.genEnemyInfo = function () {
	return {
		'Enemy_1': {
			imgPath: './images/HimeTanaka/Turtle_1.png',
		},
		'Enemy_2': {
			imgPath: './images/HimeTanaka/Pig_1.png',
		},
		'Enemy_3': {
			imgPath: './images/HimeTanaka/Chair_1.png',
		},
	};
};

// game system
// Level 1~10
// enemy++ per 10s
// EnemyTint 1-3,normal 4-6,blue 7-9,yellow 10-,red
// Boss first 30 . After per 30 from killed
// level_1,2,5,8,10 Life++ MAX5
// per 20s_Item
// item -> tripleShot[,spread]
// bullet speed -> per level ?
// enemy speed -> this info ?
// enemy score *level?
