BasicGame.Boot.prototype.defineConf = function () {
	this.game.conf = {
		animalsList: [ // 30
			'bear','buffalo','chick','chicken','cow','crocodile','dog','duck','elephant',
			'frog','giraffe','goat','gorilla','hippo','horse','monkey','moose','narwhal',
			'owl','panda','parrot','penguin','pig','rabbit','rhino','sloth','snake',
			'walrus','whale','zebra',
		],
		soundAssets: {
			// key: srcs
			'Male_1': [
				'./sounds/VOICE/Male/1.mp3',
				'./sounds/VOICE/Male/1.wav',
			], 
			'Male_2': [
				'./sounds/VOICE/Male/2.mp3',
				'./sounds/VOICE/Male/2.wav',
			], 
			'Male_3': [
				'./sounds/VOICE/Male/3.mp3',
				'./sounds/VOICE/Male/3.wav',
			], 
			'GameOver': [
				'./sounds/VOICE/Male/game_over.mp3',
				'./sounds/VOICE/Male/game_over.wav',
			], 
			'Go': [
				'./sounds/VOICE/Male/go.mp3',
				'./sounds/VOICE/Male/go.wav',
			], 
			'MenuClick': [
				'./sounds/SE/Menu_Select_00.mp3',
				'./sounds/SE/Menu_Select_00.wav',
			], 
			'Jump': [
				'./sounds/SE/phaseJump3.mp3',
				'./sounds/SE/phaseJump3.wav',
			], 
			'HappyArcadeTune': [
				'./sounds/BGM/HappyArcadeTune.mp3',
				'./sounds/BGM/HappyArcadeTune.wav',
			],
			'TowerDefenseTheme': [
				'./sounds/BGM/TowerDefenseTheme.mp3',
				'./sounds/BGM/TowerDefenseTheme.wav',
			],
		},
	};
};