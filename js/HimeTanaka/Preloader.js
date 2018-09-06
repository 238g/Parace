BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	init:function(){this.sounds=null;},
	create:function(){
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},
	loadAssets:function(){
		this.load.atlasXML('greySheet','images/public/sheets/greySheet.png','images/public/sheets/greySheet.xml');
		var imageAssets = {
			'PubLogo':'images/public/logo/logo.png',
			'Dialog': './images/public/dialogs/Dialog_2.png',
			'Hime_1': './images/HimeTanaka/Hime_1.png',
			'Nikuman_1': './images/HimeTanaka/Nikuman_1.png',
			'Turtle_1': './images/HimeTanaka/Turtle_1.png',
			'Pig_1': './images/HimeTanaka/Pig_1.png',
			'Chair_1': './images/HimeTanaka/Chair_1.png',
			'Logo': './images/HimeTanaka/Logo.png',
		};
		for (var key in imageAssets) this.load.image(key, imageAssets[key]);
		for (var i=1;i<=this.M.getConst('ALBUM_COUNT');i++) this.load.image('Album_'+i, './images/HimeTanaka/Album_'+i+'.jpg');
		this.loadAudio();
	},
	loadAudio: function () {
		this.sounds = {
			'TitleBGM': [
				'./sounds/BGM/P/PerituneMaterial_Folk_Chinese.mp3',
				'./sounds/BGM/P/PerituneMaterial_Folk_Chinese.wav',
			],
			'PlayBGM': [
				'./sounds/BGM/C/Chikurin.mp3',
				'./sounds/BGM/C/Chikurin.wav',
			],
			'Gong': [
				'./sounds/SE/LabJP/Performance/Anime/ban1.mp3',
				'./sounds/SE/LabJP/Performance/Anime/ban1.wav',
			],
			'Jump': [
				'./sounds/SE/phaseJump3.mp3',
				'./sounds/SE/phaseJump3.wav',
			],
			'Hit': [
				'./sounds/SE/LabJP/Performance/Anime/feed1.mp3',
				'./sounds/SE/LabJP/Performance/Anime/feed1.wav',
			],
			'Clear': [
				'./sounds/SE/LabJP/Performance/Other/trumpet1.mp3',
				'./sounds/SE/LabJP/Performance/Other/trumpet1.wav',
			],
		};
		for (var key in this.sounds) this.load.audio(key, this.sounds[key]);
	},
	loadOnlyFirst: function () {
		if (!this.M.getGlobal('loadedOnlyFirst')) {
			this.M.setGlobal('loadedOnlyFirst',true);
			if (this.game.device.desktop)document.body.style.cursor='pointer';
			this.M.SE.setSounds(this.sounds);
			this.M.H.setSPBrowserColor(this.M.getConst('MAIN_COLOR'));
		}
	},
	loadComplete:function(){
		this.loadOnlyFirst();
		this.M.S.genText(this.world.centerX, this.world.centerY*1.7,
			this.M.getConst('TOUCH_OR_CLICK')+'してスタート\n'+this.M.getConst('EN_TOUCH_OR_CLICK')+' TO PLAY',{fontSize:80});
		this.game.input.onDown.addOnce(this.showLogo,this);
	},
	showLogo:function(){
		this.M.S.genBmpSprite(0,0,this.world.width,this.world.height,'#000000');
		var logo=this.add.sprite(this.world.centerX,this.world.centerY,'PubLogo');
		logo.alpha=0;
		logo.anchor.setTo(.5);
		var twA=this.M.T.fadeInA(logo,{duration:1000,alpha:1});
		twA.start();
		var twB=this.M.T.fadeOutA(logo,{duration:500,delay:300});
		twA.chain(twB);
		twB.onComplete.add(this.start,this);
	},
	start:function(){this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title')},
};