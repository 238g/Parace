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
			'Dialog_1': './images/public/dialogs/Dialog_1.png',
			'Logo': './images/kashikomari/Logo.png',
		};
		for (var key in imageAssets) this.load.image(key, imageAssets[key]);
		this.loadPandey();
		this.loadKashikomari();
		this.loadAudio();
	},

	loadPandey: function () {
		var PandeyImgArr = [];
		for (var i=1;i<=9;i++) {
			var key = 'Pandey_'+i;
			this.load.image(key, './images/kashikomari/'+key+'.png');
			PandeyImgArr.push(key);
		}
		this.M.setGlobal('PandeyImgArr', PandeyImgArr);
	},

	loadKashikomari: function () {
		for (var i=1;i<=8;i++) {
			var key = 'Kashikomari_'+i;
			this.load.image(key, './images/kashikomari/'+key+'.png');
		}
	},

	loadAudio: function () {
		this.sounds = {
			'TitleBGM': [
				'./sounds/BGM/H/HappymelancholicWhole.ogg',
				'./sounds/BGM/H/HappymelancholicWhole.mp3',
				'./sounds/BGM/H/HappymelancholicWhole.wav',
			],
			'Result': [
				'./sounds/SE/LabJP/Performance/Other/dondonpafupafu1.mp3',
				'./sounds/SE/LabJP/Performance/Other/dondonpafupafu1.wav',
			],
		};
		this.addSoundHitTheTambourine();
		for (var key in this.sounds) this.load.audio(key, this.sounds[key]);
	},

	addSoundHitTheTambourine: function () {
		for (var i=1;i<=4;i++) {
			var name = 'HitTheTambourine_'+i;
			this.sounds[name] = [
				'./sounds/SE/Instrument/'+name+'.mp3',
				'./sounds/SE/Instrument/'+name+'.wav',
			];
		}
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
		this.M.S.genText(this.world.centerX, this.world.centerY*1.7,
			this.M.getConst('TOUCH_OR_CLICK')+'してスタート\n'+this.M.getConst('EN_TOUCH_OR_CLICK')+' TO PLAY',{fontSize:80});
		this.game.input.onDown.add(this.start,this);
	},

	start:function(){this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');},

};