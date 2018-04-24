BasicGame.Boot.prototype.genEnemyInfo = function () {
	return {
		'Enemy_1': this.setEnemyInfo({
			imgPath: './images/tiatia/Enemy_1.png',
			health: 3,
			score: 100,
			speed: 500,
			Waver: true,
		}),
		'Enemy_2': this.setEnemyInfo({
			imgPath: './images/tiatia/Enemy_2/Enemy_2',
			imgType: 'atlasJSONHash',
			imgAnim: 12,
			health: 3,
			score: 200,
			speed: 1000,
			Tracker: true,
		}),
		'Enemy_3': this.setEnemyInfo({
			imgPath: './images/tiatia/Enemy_3/Enemy_3',
			imgType: 'atlasJSONHash',
			imgAnim: 12,
			health: 6,
			score: 500,
			speed: 200,
			Shoter: true,
		}),
		'Enemy_4': this.setEnemyInfo({
			imgPath: './images/tiatia/Enemy_4/Enemy_4',
			imgType: 'atlasJSONHash',
			imgAnim: 12,
			health: 10,
			score: 800,
			speed: 100,
			Tracker: true,
		}),
		'Enemy_5': this.setEnemyInfo({
			imgPath: './images/tiatia/Enemy_5/Enemy_5',
			imgType: 'atlasJSONHash',
			imgAnim: 10,
			health: 5,
			score: 1000,
			speed: 300,
			Shoter: true,
			circleShot: 5,
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
		imgPath: './images/tiatia/Enemy_1.png',
		imgType: 'image',
		imgAnim: 0,
		health: 3,
		score: 100,
		speed: 500,
		Waver: false,
		Tracker: false,
		Shoter: false,
		circleShot: 0,
		isBoss: false,
	};
	for (var key in option) EnemyInfo[key] = option[key];
	return EnemyInfo;
};

// game system
// Level 1~10
// enemy++ per 10s
// Boss first 30 . After per 30 from killed
// level_1,2,5,8,10 Life++ MAX5
// per 20s_Item
// item -> tripleShot[,spread]

// bg change
// particles
// circle shot
// boss logic
