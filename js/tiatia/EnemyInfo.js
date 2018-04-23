BasicGame.Boot.prototype.genEnemyInfo = function () {
	return {
		'Enemy_1': this.setEnemyInfo({
			imgPath: './images/HimeTanaka/Turtle_1.png',
			health: 3,
			score: 100,
			speed: 500,
			Waver: true,
		}),
		'Enemy_2': this.setEnemyInfo({
			imgPath: './images/HimeTanaka/Pig_1.png',
			health: 5,
			score: 200,
			speed: 1000,
			Tracker: true,
		}),
		'Enemy_3': this.setEnemyInfo({ // TODO shot char -> 6~
			imgPath: './images/HimeTanaka/Chair_1.png',
			health: 10,
			shot: true,
			score: 500,
			speed: 200,
			Shoter: true,
		}),
		'Boss': this.setEnemyInfo({
			imgPath: './images/ankimo_drrrr/player.png',
			health: 50,
			score: 10000,
			speed: 0,
			isBoss: true,
		}),
	};
};

BasicGame.Boot.prototype.setEnemyInfo = function (option) {
	var EnemyInfo = {
		imgPath: './images/HimeTanaka/Turtle_1.png',
		health: 3,
		shot: false,
		multipleShot: false,
		score: 100,
		speed: 500,
		Waver: false,
		Tracker: false,
		Shoter: false,
		isBoss: false,
	};
	for (var key in option) EnemyInfo[key] = option[key];
	return EnemyInfo;
};

// game system
// Level 1~10
// enemy++ per 10s
// EnemyTint 1-3,normal 4-6,blue 7-9,yellow 10-,red
// Boss first 30 . After per 30 from killed
// level_1,2,5,8,10 Life++ MAX5
// per 20s_Item
// item -> tripleShot[,spread]
// bullet speed -> per level
