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
		this.load.atlasJSONHash('Power', 
			'./images/tiatia/PowerUps/PowerUps.png', './images/tiatia/PowerUps/PowerUps.json');
		var imageAssets = {
			'Dialog': './images/public/dialogs/Dialog_4.png',
			'Logo': './images/tiatia/Logo.jpg',
			'Player': './images/tiatia/Tia.png',
			'PlayerBullet': './images/tiatia/PlayerBullet.png',
			'EnemyBullet': './images/tiatia/EnemyBullet.png',
			'DamageEffect': './images/cafenozombiko/Shine.png',
			'KillEffect': './images/tiatia/KillEffect.png',
			'OhepanOrigin': './images/tiatia/OhepanOrigin.png',
			'Ohepan': './images/tiatia/Ohepan.png',
			// 'ChocolateOhepan': './images/tiatia/ChocolateOhepan.png',
			'Oheneko': './images/tiatia/Oheneko.png',
			'HealthHeart': './images/tiatia/HealthHeart.png',
			'HealItem': './images/tiatia/HealItem.png',
		};
		for (var key in imageAssets) this.load.image(key, imageAssets[key]);
		for (var i=1;i<=this.M.getConst('ALBUM_COUNT');i++) this.load.image('Album_'+i, './images/tiatia/Albums/Album_'+i+'.jpg');
		this.loadEnemyImgs();
		this.loadBgImgs();
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

	loadBgImgs: function () {
		for (var i=1;i<=5;i++) {
			this.load.image('SkyBg_'+i, './images/tiatia/Bg/SkyBg_'+i+'.jpg');
			this.load.image('MtBg_'+i, './images/tiatia/Bg/MtBg_'+i+'.png');
		}
	},

	loadAudio: function () {
		this.sounds = {
			'TitleBGM': [
				'./sounds/BGM/R/retrogamecenter3.mp3',
				'./sounds/BGM/R/retrogamecenter3.wav',
			],
			'Stage_1': [
				'./sounds/BGM/F/famipop4.mp3',
				'./sounds/BGM/F/famipop4.wav',
			],
			'Stage_2': [
				'./sounds/BGM/S/sunadokeiseiun.mp3',
				'./sounds/BGM/S/sunadokeiseiun.wav',
			],
			'Stage_3': [
				'./sounds/BGM/P/picopiconostalgie.mp3',
				'./sounds/BGM/P/picopiconostalgie.wav',
			],
			'Stage_4': [
				'./sounds/BGM/M/mist.mp3',
				'./sounds/BGM/M/mist.wav',
			],
			'TakeDamage': [
				'./sounds/SE/RetroEffect/Explosions/Clusters/sfx_exp_cluster4.mp3',
				'./sounds/SE/RetroEffect/Explosions/Clusters/sfx_exp_cluster4.wav',
			],
			'GetItem': [
				'./sounds/SE/Digital_SFX/powerUp7.mp3',
				'./sounds/SE/Digital_SFX/powerUp7.wav',
			],
			'FireBall': [
				'./sounds/SE/Fire/Flame_1.mp3',
				'./sounds/SE/Fire/Flame_1.wav',
			],
			'PlayerFire': [
				'./sounds/SE/Digital_SFX/laser8.mp3',
				'./sounds/SE/Digital_SFX/laser8.wav',
			],
			'KillEnemy': [
				'./sounds/SE/SpellSet1/zap5a.mp3',
				'./sounds/SE/SpellSet1/zap5a.wav',
			],
			'SpawnBoss': [
				'./sounds/SE/Alert/Alert_1_3.mp3',
				'./sounds/SE/Alert/Alert_1_3.wav',
			],
			'CloseSE': [
				'./sounds/SE/Cartoon/SlideWhistleDown.mp3',
				'./sounds/SE/Cartoon/SlideWhistleDown.wav',
			],
			'OpenSE': [
				'./sounds/SE/Cartoon/ApricotJumpBounce.mp3',
				'./sounds/SE/Cartoon/ApricotJumpBounce.wav',
			],
			'Start': [
				'./sounds/SE/GUI_Sound_Effects/positive.mp3',
				'./sounds/SE/GUI_Sound_Effects/positive.wav',
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
			this.stage.disableVisibilityChange = false;
		}
	},

	loadComplete: function () {
		this.loadOnlyFirst();
		this.M.S.genText(this.world.centerX, this.world.centerY*1.7,
			this.M.getConst('TOUCH_OR_CLICK')+'してスタート\n'+this.M.getConst('EN_TOUCH_OR_CLICK')+' TO PLAY',{fontSize:80});
		this.game.input.onDown.add(this.start,this);
	},
	start:function(){this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');},
};