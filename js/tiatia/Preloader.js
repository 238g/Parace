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
		this.load.atlasJSONHash('FireBall', 
			'./images/tiatia/FireBall/FireBall.png', './images/tiatia/FireBall/FireBall.json');
		var imageAssets = {
			'Dialog': './images/public/dialogs/Dialog_4.png',
			'Logo': './images/AliceMononobe/Logo.jpg',
			'Player': './images/eff/Tree.png',
			'PlayerBullet': './images/tiatia/PlayerBullet.png',
			'EnemyBullet': './images/tiatia/EnemyBullet.png',
			'SkyBg_1': './images/sirorun/sky.png',
			'SkyBg_2': './images/tiatia/SkyBg_2.png',
			'SkyBg_3': './images/sirorun/sky.png',
			'MtBg_1': './images/sirorun/mountain.png',
			'MtBg_2': './images/tiatia/MtBg_2.png',
			'MtBg_3': './images/sirorun/mountain.png',
			'DamageEffect': './images/cafenozombiko/Shine.png',
			'KillEffect': './images/tiatia/KillEffect.png',
			'Ohepan': './images/tiatia/Ohepan.png',
			'Oheneko': './images/tiatia/Oheneko.png',
			'HealthHeart': './images/tiatia/HealthHeart.png',
			'HealItem': './images/tiatia/HealthHeart.png',
		};
		for (var key in imageAssets) this.load.image(key, imageAssets[key]);
		this.loadEnemyImgs();
		this.loadAudio();
	},

	loadEnemyImgs: function () {
		var EnemyInfo = this.M.getConf('EnemyInfo');
		var EnemyInfoLength = 0;
		for (var key in EnemyInfo) {
			var info = EnemyInfo[key];
			if (info.imgType == 'atlasJSONHash') {
				this.load.atlasJSONHash(key, info.imgPath+'.png', info.imgPath+'.json');
			} else {
				this.load.image(key, info.imgPath);
			}
			EnemyInfoLength++;
		}
		this.M.setGlobal('EnemyInfoLength', EnemyInfoLength);
	},

	loadAudio: function () {
		this.sounds = {
			'TitleBGM': [
				'./sounds/BGM/P/PerituneMaterial_Folk_Chinese.mp3',
				'./sounds/BGM/P/PerituneMaterial_Folk_Chinese.wav',
			],
		};
		for (var key in this.sounds) this.load.audio(key, this.sounds[key]);
	},

	loadOnlyFirst: function () {
		if (!this.M.getGlobal('loadedOnlyFirst')) {
			this.M.setGlobal('loadedOnlyFirst',true);
			if (this.game.device.desktop) document.body.style.cursor = 'pointer';
			this.M.SE.setSounds(this.sounds);
			this.M.H.setSPBrowserColor(this.M.getConst('MAIN_COLOR'));
		}
	},

	loadComplete: function () {
		this.loadOnlyFirst();
		this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');
	},
};