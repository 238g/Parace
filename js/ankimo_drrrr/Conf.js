BasicGame.Boot.prototype.defineConf = function () {
	this.game.conf = {
		animalsList: [ // 30
			'bear','buffalo','chick','chicken','cow','crocodile','dog','duck','elephant',
			'frog','giraffe','goat','gorilla','hippo','horse','monkey','moose','narwhal',
			'owl','panda','parrot','penguin','pig','rabbit','rhino','sloth','snake',
			'walrus','whale','zebra',
		],
		soundAssets: {
			// key: src
			'Male_1': './sounds/VOICE/Male/1.ogg', 
			'Male_2': './sounds/VOICE/Male/2.ogg', 
			'Male_3': './sounds/VOICE/Male/3.ogg', 
			'GameOver': './sounds/VOICE/Male/game_over.ogg', 
			'Go': './sounds/VOICE/Male/go.ogg', 
			'MenuClick': './sounds/SE/Menu_Select_00.mp3', 
			'Jump': './sounds/SE/phaseJump3.mp3', 
			'HappyArcadeTune': './sounds/BGM/HappyArcadeTune.mp3',
			'TowerDefenseTheme': './sounds/BGM/TowerDefenseTheme.mp3',
		},
	};
};