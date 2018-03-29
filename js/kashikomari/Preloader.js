BasicGame.Preloader = function () {};
BasicGame.Preloader.prototype = {
	init: function () { this.sounds = null; },
	create: function () {
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},

	loadAssets: function () {
		this.load.atlasXML('greySheet', 
			'./images/public/sheets/greySheet.png', './images/public/sheets/greySheet.xml');
		var imageAssets = {
			// 'Pandey_1': './images/kashikomari/Pandey_1.png',
		};
		for (var key in imageAssets) this.load.image(key, imageAssets[key]);
		var PandeyImgArr = [];
		for (var i=1;i<=9;i++) {
			var key = 'Pandey_'+i;
			this.load.image(key, './images/kashikomari/'+key+'.png');
			PandeyImgArr.push(key);
		}
		this.M.setGlobal('PandeyImgArr', PandeyImgArr);
		this.loadAudio();
	},

	loadAudio: function () {
		this.sounds = {
			'PlayBGM': [
				'./sounds/BGM/RainbowRush_loop.ogg',
				'./sounds/BGM/RainbowRush_loop.mp3',
				'./sounds/BGM/RainbowRush_loop.wav',
			],
		};
		for (var key in this.sounds) this.load.audio(key, this.sounds[key]);
	},

	loadOnlyFirst: function () {
		if (!this.M.getGlobal('loadedOnlyFirst')) {
			this.M.setGlobal('loadedOnlyFirst',true);
			if (this.game.device.desktop) document.body.style.cursor = 'pointer';
			this.M.SE.setSounds(this.sounds);
		}
	},

	loadComplete: function () {
		this.loadOnlyFirst();
		this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');
	},
};