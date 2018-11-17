BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	init:function(){
		this.sounds=null;
	},
	create:function(){
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		this.load.onLoadComplete.add(this.loadComplete,this);
		this.loadAssets();
		this.load.start();
	},
	loadAssets:function(){
		this.load.atlasXML('greySheet','images/public/sheets/greySheet.png','images/public/sheets/greySheet.xml');
		this.load.atlasJSONHash('Trump','images/AliceMononobe/Trump.png','images/AliceMononobe/Trump.json');
		this.load.atlasJSONHash('Darts','images/AliceMononobe/Darts.png','images/AliceMononobe/Darts.json');
		this.load.atlasXML('GameIcons','images/public/sheets/GameIconsWhite.png','images/public/sheets/GameIconsWhite.xml');
		var i={
			'PubLogo':'images/public/logo/logo.png',
			'Dialog':'images/public/dialogs/Dialog_3.png',
			'Logo':'images/AliceMononobe/Logo.jpg',
			'Board':'images/AliceMononobe/Board.png',
			'TopBg':'images/AliceMononobe/TopBg.jpg',
			'PlayBg':'images/AliceMononobe/PlayBg.jpg',
			'Alice_1':'images/AliceMononobe/Alice_1.png',
			'Alice_2':'images/AliceMononobe/Alice_2.png',
			'Alice_3':'images/AliceMononobe/Alice_3.png',
			'Alice_4':'images/AliceMononobe/Alice_4.png',
			'Giruzaren':'images/AliceMononobe/Giruzaren.png',
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		this.sounds = {
			'TitleBGM': [
				'sounds/BGM/P/PerituneMaterial_Snowy_Day2.mp3',
				'sounds/BGM/P/PerituneMaterial_Snowy_Day2.wav',
			],
			'PlayBGM': [
				'sounds/BGM/J/JazzBrunch.mp3',
				'sounds/BGM/J/JazzBrunch.wav',
			],
			'CardSlide': [
				'sounds/SE/Casino/Pack_1/cardSlide7.mp3',
				'sounds/SE/Casino/Pack_1/cardSlide7.wav',
			],
			'HitDart': [
				'sounds/SE/Bang/nutfall.mp3',
				'sounds/SE/Bang/nutfall.wav',
			],
			'OpenDialog': [
				'sounds/SE/Casino/Pack_1/dieGrab1.mp3',
				'sounds/SE/Casino/Pack_1/dieGrab1.wav',
			],
			'Applause': [
				'sounds/SE/Success/WellDoneApplause.mp3',
				'sounds/SE/Success/WellDoneApplause.wav',
			],
			'GameOver': [
				'sounds/SE/Fantasy_2/PickedCoinEcho2.mp3',
				'sounds/SE/Fantasy_2/PickedCoinEcho2.wav',
			],
		};
		for (var key in this.sounds) this.load.audio(key, this.sounds[key]);
	},
	loadOnlyFirst:function(){
		if(!this.M.getGlobal('loadedOnlyFirst')){
			this.M.setGlobal('loadedOnlyFirst',!0);
			if(this.game.device.desktop)document.body.style.cursor='pointer';
			this.M.SE.setSounds(this.sounds);
			this.M.H.setSPBrowserColor(this.M.getConst('MAIN_COLOR'));
		}
	},
	loadComplete:function(){
		this.loadOnlyFirst();
		this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		this.M.S.genText(this.world.centerX, this.world.centerY*1.7,
			this.M.getConst('TOUCH_OR_CLICK')+'してスタート\n'+this.M.getConst('EN_TOUCH_OR_CLICK')+' TO PLAY',{fontSize:40});
		this.game.input.onDown.addOnce((__ENV!='prod')?this.start:this.showLogo,this);
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