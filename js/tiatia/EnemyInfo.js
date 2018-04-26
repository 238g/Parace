BasicGame.Boot.prototype.genEnemyInfo = function () {
	return {
		'Enemy_1': this.makeEnemyInfo({
			imgPath: './images/tiatia/Enemy_1.png',
			health: 3,
			score: 100,
			speed: 500,
			Waver: true,
		}),
		'Enemy_2': this.makeEnemyInfo({
			imgPath: './images/tiatia/Enemy_2/Enemy_2',
			imgType: 'atlasJSONHash',
			imgAnim: 12,
			health: 3,
			score: 200,
			speed: 1000,
			Tracker: true,
		}),
		'Enemy_3': this.makeEnemyInfo({
			imgPath: './images/tiatia/Enemy_3/Enemy_3',
			imgType: 'atlasJSONHash',
			imgAnim: 12,
			health: 6,
			score: 500,
			speed: 200,
			Shoter: true,
		}),
		'Enemy_4': this.makeEnemyInfo({
			imgPath: './images/tiatia/Enemy_4/Enemy_4',
			imgType: 'atlasJSONHash',
			imgAnim: 12,
			health: 10,
			score: 800,
			speed: 100,
			Tracker: true,
		}),
		'Enemy_5': this.makeEnemyInfo({
			imgPath: './images/tiatia/Enemy_5/Enemy_5',
			imgType: 'atlasJSONHash',
			imgAnim: 10,
			health: 5,
			score: 1000,
			speed: 300,
			Shoter: true,
			circleShot: true,
		}),
		'Enemy_6': this.makeEnemyInfo({
			imgPath: './images/tiatia/Enemy_6/Enemy_6',
			imgType: 'atlasJSONHash',
			imgAnim: 16,
			health: 4,
			score: 1500,
			speed: 1500,
			Tracker: true,
		}),
		'Enemy_7': this.makeEnemyInfo({
			imgPath: './images/tiatia/Enemy_7/Enemy_7',
			imgType: 'atlasJSONHash',
			imgAnim: 12,
			health: 6,
			score: 1300,
			speed: 300,
			Waver: true,
			Tracker: true,
			Shoter: true,
			specialShot: true,
		}),
		'Boss': this.makeEnemyInfo({
			imgPath: './images/ankimo_drrrr/player.png',
			health: 50,
			score: 10000,
			speed: 3,
			isBoss: true,
		}),
	};
};

BasicGame.Boot.prototype.makeEnemyInfo = function (option) {
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
		circleShot: false,
		specialShot: false,
		isBoss: false,
	};
	for (var key in option) EnemyInfo[key] = option[key];
	return EnemyInfo;
};

// bg change
// level_1,2,5,8,10 Life++ item MAX5
// per 20s_Item
// item -> tripleShot,power up
