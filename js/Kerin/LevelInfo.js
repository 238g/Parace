BasicGame.Boot.prototype.genLevelInfo = function () {
	return {
		1: {
			name: 'ララガーデ◯春日部',
			clearCount: 3, // TODO del
			// clearCount: 30,
			holeCount: 4,
			guardImgName: 'GuardTukushi',
			guardImgPath: 'images/Kerin/GuardTukushi.png',
			multipleImg: false,
			happyEnd: false,
			infinite: false,
			goalImg: 'Level_1',
			goalImgPath: 'images/Kerin/Level_1.jpg',
		},
		2: {
			name: 'ニコ◯コ本社',
			clearCount: 30,
			holeCount: 3,
			guardImgName: 'GuardMito',
			guardImgPath: 'images/Kerin/GuardMito.png',
			multipleImg: false,
			happyEnd: false,
			infinite: false,
			goalImg: 'Level_2',
			goalImgPath: 'images/Kerin/Level_1.jpg', // TODO
		},
		3: {
			name: 'エルフの森',
			clearCount: 30,
			holeCount: 2,
			guardImgName: 'GuardKaede',
			guardImgPath: 'images/Kerin/GuardKaede.png',
			multipleImg: false,
			happyEnd: true,
			infinite: false,
			goalImg: 'Level_3',
			goalImgPath: 'images/Kerin/Level_1.jpg', // TODO
		},
		4: {
			name: '無限コンギョ',
			clearCount: 999,
			holeCount: 2,
			guardImgName: ['GuardTukushi','GuardKaede','GuardMito'],
			guardImgPath: null,
			multipleImg: true,
			happyEnd: false,
			infinite: true,
			goalImg: null,
			goalImgPath: null,
		},
	};
};
