BasicGame.Boot.prototype.genCharInfo=function(){
	return {
		1:{
			charName:'おめがレイ',tint:0x7ea2d6,
			ytUrl:'https://www.youtube.com/channel/UCNjTjd2-PMC8Oo_-dCEss7A',
		},
		2:{
			charName:'おめがリオ',tint:0xeda1ad,
			ytUrl:'https://www.youtube.com/channel/UCNjTjd2-PMC8Oo_-dCEss7A',
		},
		3:{
			charName:'おめがレリオ',tint:0x9c27b0,
			ytUrl:'https://www.youtube.com/channel/UCNjTjd2-PMC8Oo_-dCEss7A',
		},
		4:{
			charName:'Icotsu',tint:0xfff1da,
			ytUrl:'https://www.youtube.com/channel/UCGFD_8TRHhlpjfqGhLUSk4g',
		},
		5:{
			charName:'法要通夜',tint:0x4a4a4a,
			ytUrl:'https://www.youtube.com/channel/UCGFD_8TRHhlpjfqGhLUSk4g',
		},
		6:{
			charName:'届木ウカ',tint:0x4386b0,
			ytUrl:'https://www.youtube.com/channel/UCk0dNVAdlgn4ynURwAq_z2A',
		},
		7:{
			charName:'女神エルミナ',tint:0xf3ace9,
			ytUrl:'https://www.youtube.com/channel/UCGu_Yfe0HiMV4ffHvkVd9Jg',
		},
		8:{
			charName:'動く城のフィオ',tint:0x1bd00e,
			ytUrl:'https://www.youtube.com/channel/UCiJr4MX-DrlKgLYC0luCjpQ',
		},
		9:{
			charName:'世界クルミ',tint:0xaee803,
			ytUrl:'https://www.youtube.com/channel/UCHooCsg7FEVBGVKUE_RR0DA',
		},
		10:{
			charName:'雪猫カゥル',tint:0xa37bff,
			ytUrl:'https://www.youtube.com/channel/UCqlbdk8XtMSxogRDNMzRrxA',
		},
		11:{
			charName:'パンディ',tint:0xf5b659,
			ytUrl:'https://www.youtube.com/channel/UCu5DbFfYe3KiwhcmanCvSVg',
		},
		12:{
			charName:'クーテトラ',tint:0xac671a,
			ytUrl:'https://www.youtube.com/channel/UCTqV6u2RJE4DqfLALsGuyAw',
		},
		13:{
			charName:'小山内めい',tint:0xc6dafe,
			ytUrl:'https://www.youtube.com/channel/UCZx7wgGNs2UFyRRtLoNur9Q',
		},
		14:{
			charName:'虹乃まほろ',tint:0xffa6df,
			ytUrl:'https://www.youtube.com/channel/UCtCXaX0zEvYSgdkp-Po24TQ',
		},
		15:{
			charName:'勇者ことね',tint:0xf1a86d,
			ytUrl:'https://www.youtube.com/channel/UCHR0kaG6d7eU1wm17fx9Mvw',
		},
		16:{
			charName:'公野ゆめか',tint:0xff448c,
			ytUrl:'https://www.youtube.com/channel/UCMXKL1LgqMILqdavdc0DtVQ',
		},
	};
};
BasicGame.Boot.prototype.genStageInfo=function(){
	return {
		1:{
			selectorName:'広場',
			selectorSubName:'Lv.1',
			goalCount:5,
			isEndless:!1,
			dmge:10,
			firstChallengeCount:1,
		},
		2:{
			selectorName:'荒野',
			selectorSubName:'Lv.2',
			goalCount:6,
			isEndless:!1,
			dmge:20,
			firstChallengeCount:2,
		},
		3:{
			selectorName:'ビーチ',
			selectorSubName:'Lv.3',
			goalCount:7,
			isEndless:!1,
			dmge:30,
			firstChallengeCount:3,
		},
		4:{
			selectorName:'雪原',
			selectorSubName:'Lv.4',
			goalCount:10,
			isEndless:!1,
			dmge:40,
			firstChallengeCount:4,
		},
		5:{
			selectorName:'森',
			selectorSubName:'Lv.5',
			goalCount:15,
			isEndless:!1,
			dmge:80,
			firstChallengeCount:5,
		},
		6:{
			selectorName:'平野',
			selectorSubName:'コマンダー',
			goalCount:999,
			isEndless:!0,
			dmge:100,
			firstChallengeCount:1,
		},
	};
};