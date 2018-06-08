BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	create:function(){
		this.sounds=null; 
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		if(this.M.getGlobal('curLang')=='en'){
			// THIS IS TEST FOR TWITTER
			var title='Odadadadadadadadadada';
			document.title=title;
			BasicGame.GAME_TITLE=title;
			document.getElementsByName('apple-mobile-web-app-title')[0].setAttribute('content',title);
			document.getElementsByName('og:url')[0].setAttribute('content','https://238g.github.io/Parace/Odadadadadadadadadada.html?lang=en');
			document.getElementsByName('og:title')[0].setAttribute('content',title);
			document.getElementsByName('og:description')[0].setAttribute('content',
				'' // TODO description
			);
		}else{//jp
			this.M.S.genText(this.world.centerX,this.world.centerY*.5,this.rnd.pick(__ADVICE_WORDS),{fontSize:25});
		}
		this.load.onLoadComplete.add(this.loadComplete,this);
		this.loadAssets();
		this.load.start();
	},

	loadAssets:function(){
		this.load.atlasXML('greySheet','./images/public/sheets/greySheet.png','./images/public/sheets/greySheet.xml');
		this.load.atlasXML('GameIconsWhite','images/public/sheets/GameIconsWhite.png','images/public/sheets/GameIconsWhite.xml');
		this.load.atlasJSONHash('VolumeIcon','images/public/VolumeIcon/VolumeIcon.png','images/public/VolumeIcon/VolumeIcon.json');
		var imageAssets = {
			'TWP': 'images/Oda/TranslucentWhitePaper.png',
			'Blade': 'images/Oda/Blade.png',
			'NobuhimeCircle_1': 'images/Oda/NobuhimeCircle_1.png',
			'NobuhimeCircle_2': 'images/Oda/NobuhimeCircle_2.png',
			'NobuhimeCircle_3': 'images/Oda/NobuhimeCircle_2.png',//TODO
			'OdanobuCircle_1': 'images/Oda/OdanobuCircle_1.png',
			'OdanobuCircle_2': 'images/Oda/OdanobuCircle_2.png',
			'OdanobuCircle_3': 'images/Oda/OdanobuCircle_2.png',//TODO
			'NobuhimeLogo': 'images/Oda/NobuhimeCircle_2.png',
			'OdanobuLogo': 'images/Oda/OdanobuCircle_2.png',
		};
		for(var k in imageAssets)this.load.image(k,imageAssets[k]);
		this.load.script('Fire','https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/Fire.js');
		this.loadAudio();
	},

	loadAudio:function(){
		this.sounds = {
			'TitleBGM': [
				'sounds/BGM/H/Hanagoyomi.mp3',
				'sounds/BGM/H/Hanagoyomi.wav',
			],
		};
		for(var k in this.sounds)this.load.audio(k,this.sounds[k]);
	},

	loadComplete:function(){
		this.game.device.desktop&&(document.body.style.cursor='pointer');
		this.M.SE.setSounds(this.sounds);
		this.M.H.setSPBrowserColor(BasicGame.MAIN_COLOR);
		this.M.S.genText(this.world.centerX, this.world.centerY*1.7,
			this.M.getConst('TOUCH_OR_CLICK')+'してスタート\n'+this.M.getConst('EN_TOUCH_OR_CLICK')+' TO PLAY',{fontSize:25});
		this.stage.disableVisibilityChange=!1;
		this.game.input.onDown.add(this.start,this);
	},
	start:function(){this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');},
};