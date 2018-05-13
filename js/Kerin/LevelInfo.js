BasicGame.Boot.prototype.genLevelInfo = function () {
	return {
		1: {
			name: 'ララガーデ◯春日部',
			clearCount: 3,
			// clearCount: 30,
			holeCount: 4,
			imgName: 'GuardTukushi',
			imgPath: 'images/Kerin/GuardTukushi.png',
			multipleImg: false,
		},
		2: {
			name: 'ニコ◯コ本社',
			clearCount: 30,
			holeCount: 3,
			imgName: 'GuardMito',
			imgPath: 'images/Kerin/GuardMito.png',
			multipleImg: false,
		},
		3: {
			name: 'エルフの森',
			clearCount: 30,
			holeCount: 2,
			imgName: 'GuardKaede',
			imgPath: 'images/Kerin/GuardKaede.png',
			multipleImg: false,
		},
		4: {
			name: '無限コンギョ',
			clearCount: 999,
			holeCount: 2,
			imgName: ['GuardTukushi','GuardKaede','GuardMito'],
			imgPath: null,
			multipleImg: true,
		},
	};
};
