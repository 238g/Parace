BasicGame.Boot.prototype.genStageInfo=function(){
	return {
		1:{
			jp_name:'イギリス',en_name:'England',lane:'LEFT',
			leftTime:30,carSpeed:6,tileSpeed:.1,scoreRate:1,respawnRateTimeBase:1500,
			isSecret:!1,},
		2:{
			jp_name:'フランス',en_name:'France',lane:'RIGHT',
			leftTime:45,carSpeed:8,tileSpeed:.12,scoreRate:1.5,respawnRateTimeBase:1E3,
			isSecret:!1,},
		3:{
			jp_name:'ドイツ',en_name:'Germany',lane:'RIGHT',
			leftTime:60,carSpeed:10,tileSpeed:.15,scoreRate:2,respawnRateTimeBase:800,
			isSecret:!1,},
		4:{
			jp_name:'チェコ',en_name:'Czech',lane:'RIGHT',
			leftTime:90,carSpeed:12,tileSpeed:.2,scoreRate:3,respawnRateTimeBase:600,
			isSecret:!1,},
		5:{
			jp_name:'日本',en_name:'Japan',lane:'LEFT',
			leftTime:90,carSpeed:3,tileSpeed:.05,scoreRate:10,respawnRateTimeBase:400,
			isSecret:!0,openSecret:!1,},
		6:{
			jp_name:'天界',en_name:'Heaven',lane:'ALL',
			leftTime:90,carSpeed:18,tileSpeed:.3,scoreRate:10,respawnRateTimeBase:400,
			isSecret:!0,openSecret:!1,},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	return {
		jp:{
			SS_Ttl:'目的地を選択！',
			HowTo:'usage handle\naaaaaaaa', // TODO usage handle
			Start:'スタート！',
			ScoreBaseFront:'罰金: ',
			ScoreBaseBack:'万円',
			TimeBaseFront:'残り: ',
			TimeBaseBack:'km',
			DestinationBase:'目的地: ',
			End:'目的地に\n到着！',
			ResTtl:'結果',
			Again:'もう一度',
			GoToSS:'目的地選択へ',
			Tweet:'結果をツイート',
			OtherGame:'他のゲーム',
			TweetTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			Break:'破壊\n-',
			You:'YOU',
		},
		en:{
			//TODO
		},
	};
};
BasicGame.Boot.prototype.genVehicleInfo=function(){
	return {
		Ambulance:{
			jp_name:'救急車',en_name:'Ambulance',addScore:80,},
		Audi:{
			jp_name:'アウディ',en_name:'Audi',addScore:60,},
		Black_viper:{
			jp_name:'バイパー',en_name:'Viper',addScore:130,},
		Car:{
			jp_name:'乗用車',en_name:'Car',addScore:30,},
		Mini_truck:{
			jp_name:'軽トラ',en_name:'MiniTruck',addScore:20,},
		Mini_van:{
			jp_name:'ミニバン',en_name:'MiniVan',addScore:40,},
		Police:{
			jp_name:'パトカー',en_name:'PoliceCar',addScore:100,},
		Taxi:{
			jp_name:'タクシー',en_name:'Taxi',addScore:50,},
		Truck_2:{
			jp_name:'トラック',en_name:'Truck',addScore:70,},
	};
};
BasicGame.Boot.prototype.genVehicle=function(){
	return ['Ambulance','Audi','Black_viper','Car','Mini_truck','Mini_van','Police','Taxi','Truck_2'];
};
BasicGame.Boot.prototype.genObstacleInfo=function(){
	return {
		// TODO en_name
		Obstacles:[
			{jp_name:'ゴミ箱',en_name:'',addScore:3,},
			{jp_name:'ゴミ袋',en_name:'',addScore:1,},
			{jp_name:'鉢植え',en_name:'',addScore:4,},
			{jp_name:'パイロン',en_name:'',addScore:5,},
			{jp_name:'ポスト',en_name:'',addScore:8,},
			{jp_name:'水栓',en_name:'',addScore:10,},
			{jp_name:'ポール',en_name:'',addScore:6,},
			{jp_name:'タイヤ',en_name:'',addScore:2,},
		],
		Signboards:[
			{jp_name:'信号機',en_name:'',addScore:15,},
			{jp_name:'停止標識',en_name:'',addScore:11,},
			{jp_name:'禁止標識',en_name:'',addScore:12,},
			{jp_name:'街灯',en_name:'',addScore:14,},
			{jp_name:'メーター',en_name:'',addScore:13,},
		],
	};
};
