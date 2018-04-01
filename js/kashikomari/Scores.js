BasicGame.Boot.prototype.genMusicalScores = function () {
	return {
		MusicalScore_1:{
			body: [ 
				0,0,0,4, 1,2,3,4, 1,2,3,4, 1,2,3,4, // ～後奏～
				4,3,2,1, 4,3,2,1, 4,3,2,1, 4,3,2,1, // 目に映る
				1,2,3,4, 1,2,3,4, 1,2,3,4, 1,2,3,4, // 優しさに
				4,3,2,1, 4,3,2,1, 4,3,2,1, 4,3,2,1, // カーテンを
				4,4,4,4, // ～間奏～
				1,2,3,3, 4,3,2,1, 1,2,3,4, 4,1,2,3, // 目に映る
				1,2,3,4, 1,2,3,4, 1,2,3,4, 1,2,3,4, // 優しさに
				4,3,2,1, 4,3,2,1, 4,3,2,1, 4,3,2,1, // 雨上がりの
				4,4,4,4, 3,1,1,1, 2,1,1,1, 1,1,1,1, // 大切な箱
				4,1,1,1, 3,1,1,1, 2,1,1,1, 1,1,1,1, // 心の奥に
				1,2,3,4, 1,2,3,4, 1,2,3,4, 1,2,3,4, // 毎日
				4,3,2,1, 4,3,2,1, 4,3,2,1, 4,3,2,1,　// 小さい頃は
				2,2,2,2, 1,1,1,1, 4,4,4,4, 3,3,3,3, // ～間奏～
				2,2,3,3, 2,2,3,3, 2,2,3,3, 2,2,3,3, // 目に映る
				3,3,2,2, 3,3,2,2, 3,3,2,2, 3,3,2,2, // 優しさに
				4,1,1,1, 4,1,1,1, 4,3,2,1, 4,3,2,1, // カーテンを
				4,4,4,4, 3,1,1,1, 2,1,1,1, 1,1,1,1, // 大人になっても
				4,1,1,1, 3,1,1,1, 2,1,1,1, 1,1,1,1, // 優しい
				1,2,3,4, 1,2,3,4, 1,2,3,4, 1,2,3,4, // 不思議に
				4,3,2,1, 4,3,2,1, 4,3,2,1, 4,3,2,1, // 小さい頃は
				1,0,0,0, 0,0,0,0, 0,0,0,0, // ～前奏～
			],
			frequency: 571, // 60/bpm*1000 // bpm:105
			type: 'Number',
			speed: 2000,
			delay: 2000,
		},
		MusicalScore_2:{
		},
		/* --UNIMPLEMENTED
		MusicalScore_X:{
			body: [
				//1234
				'   o',
				'  o ',
				' o  ',
				'o   ',
			], 
			frequency: ????, // 60/bpm*1000 // bpm: ???
			type: 'String',
			speed: ????,
			delay: ????,
		},
		*/
	};
};