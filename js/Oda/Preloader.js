BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	create:function(){
		this.sounds=null; 
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		if(this.M.getGlobal('curLang')=='en'){
			// THIS IS TEST FOR TWITTER => OGP CAN'T
			var title='Odadadadadadadadadada';
			document.title=title;
			BasicGame.GAME_TITLE=title;
			document.getElementsByName('apple-mobile-web-app-title')[0].setAttribute('content',title);
			// document.getElementsByName('og:url')[0].setAttribute('content','https://238g.github.io/Parace/Odadadadadadadadadada.html?lang=en');
			// document.getElementsByName('og:title')[0].setAttribute('content',title);
			// document.getElementsByName('og:description')[0].setAttribute('content',
				// 'Oda\'s doujin game! Overcome the prepared 50 levels of trials! Well, just stick the Oda Army!');
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
			'Title_jp': 'images/Oda/Title_jp.png',
			'Title_en': 'images/Oda/Title_en.png',
			'NobuhimeCircle_1': 'images/Oda/NobuhimeCircle_1.png',
			'NobuhimeCircle_2': 'images/Oda/NobuhimeCircle_2.png',
			'NobuhimeCircle_3': 'images/Oda/NobuhimeCircle_3.png',
			'NobuhimeLogo': 'images/Oda/NobuhimeLogo.png',
			'OdanobuCircle_1': 'images/Oda/OdanobuCircle_1.png',
			'OdanobuCircle_2': 'images/Oda/OdanobuCircle_2.png',
			'OdanobuCircle_3': 'images/Oda/OdanobuCircle_3.png',
			'OdanobuLogo': 'images/Oda/OdanobuLogo.png',
			'Temple': 'images/Oda/Temple.png',
			'GiantNobuhime': 'images/Oda/GiantNobuhime.jpg',
			'PlayBg': 'images/Oda/PlayBg.jpg',
		};
		for(var k in imageAssets)this.load.image(k,imageAssets[k]);
		this.load.script('Fire','https://cdn.rawgit.com/photonstorm/phaser-ce/master/filters/Fire.js');
		this.loadAudio();
	},

	loadAudio:function(){
		this.sounds = {
			'TitleBGM': [
				'sounds/BGM/S/shizukanarunatsunopulse2.mp3',
				'sounds/BGM/S/shizukanarunatsunopulse2.wav',
			],
			'PlayBGM': [
				'sounds/BGM/M/Michikusa.mp3',
				'sounds/BGM/M/Michikusa.wav',
			],
			'FireBGM': [
				'sounds/SE/Fire/Fire2.mp3',
				'sounds/SE/Fire/Fire2.wav',
			],
			'OdanobuVoice_1':[
				'sounds/VOICE/Odanobu/OdanobuVoice_1.mp3',
				'sounds/VOICE/Odanobu/OdanobuVoice_1.wav',
			],
			'OdanobuVoice_2':[
				'sounds/VOICE/Odanobu/OdanobuVoice_2.mp3',
				'sounds/VOICE/Odanobu/OdanobuVoice_2.wav',
			],
			'OdanobuVoice_3':[
				'sounds/VOICE/Odanobu/OdanobuVoice_3.mp3',
				'sounds/VOICE/Odanobu/OdanobuVoice_3.wav',
			],
			'OdanobuVoice_4':[
				'sounds/VOICE/Odanobu/OdanobuVoice_4.mp3',
				'sounds/VOICE/Odanobu/OdanobuVoice_4.wav',
			],
			'NobuhimeVoice_1':[
				'sounds/VOICE/Nobuhime/NobuhimeVoice_1.mp3',
				'sounds/VOICE/Nobuhime/NobuhimeVoice_1.wav',
			],
			'NobuhimeVoice_2':[
				'sounds/VOICE/Nobuhime/NobuhimeVoice_2.mp3',
				'sounds/VOICE/Nobuhime/NobuhimeVoice_2.wav',
			],
			'NobuhimeVoice_3':[
				'sounds/VOICE/Nobuhime/NobuhimeVoice_3.mp3',
				'sounds/VOICE/Nobuhime/NobuhimeVoice_3.wav',
			],
			'NobuhimeVoice_4':[
				'sounds/VOICE/Nobuhime/NobuhimeVoice_4.mp3',
				'sounds/VOICE/Nobuhime/NobuhimeVoice_4.wav',
			],
			'NobuhimeLaugh':[
				'sounds/VOICE/Nobuhime/NobuhimeLaugh.mp3',
				'sounds/VOICE/Nobuhime/NobuhimeLaugh.wav',
			],
			// 'Pew':[
				// 'sounds/SE/P/Pew.mp3',
				// 'sounds/SE/P/Pew.wav',
			// ],
			'RipPaper':[
				'sounds/SE/Paper_rip/paper-rip-3.mp3',
				'sounds/SE/Paper_rip/paper-rip-3.wav',
			],
			'Slash':[
				'sounds/SE/LabJP/Battle/Weapon/sword-slash3.mp3',
				'sounds/SE/LabJP/Battle/Weapon/sword-slash3.wav',
			],
			'OnBtn':[
				'sounds/SE/LabJP/Performance/Japan/hyoushigi1.mp3',
				'sounds/SE/LabJP/Performance/Japan/hyoushigi1.wav',
			],
			'OnBtn2':[
				'sounds/SE/LabJP/Performance/Japan/kotsudumi1.mp3',
				'sounds/SE/LabJP/Performance/Japan/kotsudumi1.wav',
			],
			'DonPafu':[
				'sounds/SE/LabJP/Performance/Other/dondonpafupafu1.mp3',
				'sounds/SE/LabJP/Performance/Other/dondonpafupafu1.wav',
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