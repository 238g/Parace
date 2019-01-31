BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	create:function(){
		this.sounds=null; 
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		this.M.S.genText(this.world.centerX,this.world.centerY*.5,this.rnd.pick(__ADVICE_WORDS),{fontSize:25});
		this.load.onLoadComplete.add(this.loadComplete,this);
		this.loadAssets();
		this.load.start();
	},
	loadAssets:function(){
		this.load.spritesheet('CircleBtn','images/AoiGame/CircleBtn.png',200,200);
		this.load.spritesheet('Aoi_Title','images/AoiGame/Aoi_Title.png',360,640);
		this.load.atlasXML('greySheet','./images/public/sheets/greySheet.png','./images/public/sheets/greySheet.xml');
		this.load.atlasXML('GameIconsWhite','images/public/sheets/GameIconsWhite.png','images/public/sheets/GameIconsWhite.xml');
		this.load.atlasJSONHash('VolumeIcon','images/public/VolumeIcon/VolumeIcon.png','images/public/VolumeIcon/VolumeIcon.json');
		this.load.atlasJSONHash('PushAnim','images/AoiGame/PushAnim/PushAnim.png','images/AoiGame/PushAnim/PushAnim.json');
		var imageAssets = {
			'PubLogo':'images/public/logo/logo.png',
			'Title': 'images/AoiGame/Title.png',
			'Logo': 'images/AoiGame/Logo.png',
			'WhitePaper': 'images/PeanutNinja/WhitePaper.jpg',
			'Target': 'images/AoiGame/Kikunojo.png',
			'GaugeBg': 'images/AoiGame/GaugeBg.png',
			'Wheel': 'images/AoiGame/Wheel.png',
			'Pin': 'images/AoiGame/Pin.png',
			'Flower': 'images/AoiGame/Flower.png',
			'Tutorial_Bg': 'images/AoiGame/Tutorial_Bg.png',
			'Aoi_1': 'images/AoiGame/Aoi_1.png',
			'Aoi_2': 'images/AoiGame/Aoi_2.png',
			'Underground': 'images/AoiGame/Underground.jpg',
			'OnTheGround': 'images/AoiGame/OnTheGround.jpg',
			'Sky': 'images/AoiGame/Sky.jpg',
			'Hiyoko': 'images/AoiGame/Hiyoko.png',
		};
		for(var k in imageAssets)this.load.image(k,imageAssets[k]);
		for(var i=0;i<=this.M.getConst('BG_COUNT');i++)this.load.image('Bg_'+i,'images/AoiGame/Bg/Bg_'+i+'.jpg');
		this.loadAudio();
	},
	loadAudio:function(){
		this.sounds = {
			'TitleBGM': [
				'sounds/BGM/H/Hanagoyomi.mp3',
				'sounds/BGM/H/Hanagoyomi.wav',
			],
			'PlayBGM': [
				'sounds/BGM/M/Michikusa2.mp3',
				'sounds/BGM/M/Michikusa2.wav',
			],
			'OnBtn': [
				'sounds/SE/LabJP/Performance/Japan/hyoushigi1.mp3',
				'sounds/SE/LabJP/Performance/Japan/hyoushigi1.wav',
			],
			'OnBtn2': [
				'sounds/SE/LabJP/Performance/Japan/hyoushigi2.mp3',
				'sounds/SE/LabJP/Performance/Japan/hyoushigi2.wav',
			],
			'GetItem': [
				'sounds/SE/LabJP/Performance/Japan/kotsudumi1.mp3',
				'sounds/SE/LabJP/Performance/Japan/kotsudumi1.wav',
			],
			'RouletteSE': [
				'sounds/VOICE/USL/Mouth_00.mp3',
				'sounds/VOICE/USL/Mouth_00.wav',
			],
			'PushAnim': [
				'sounds/SE/AoiGame/PushAnim.mp3',
				'sounds/SE/AoiGame/PushAnim.wav',
			],
			'WhistleStart': [
				'sounds/SE/LabJP/Life/Other/police-whistle2.mp3',
				'sounds/SE/LabJP/Life/Other/police-whistle2.wav',
			],
			'WhistleEnd': [
				'sounds/SE/LabJP/Life/Other/police-whistle1.mp3',
				'sounds/SE/LabJP/Life/Other/police-whistle1.wav',
			],
			'Fall': [
				'sounds/SE/LabJP/Performance/Anime/hyun1.mp3',
				'sounds/SE/LabJP/Performance/Anime/hyun1.wav',
			],
			'Fly': [
				'sounds/SE/LabJP/Performance/Anime/flee1.mp3',
				'sounds/SE/LabJP/Performance/Anime/flee1.wav',
			],
			'FlyAway': [
				'sounds/SE/LabJP/Performance/Anime/eye-shine1.mp3',
				'sounds/SE/LabJP/Performance/Anime/eye-shine1.wav',
			],
			'DonPafu': [
				'sounds/SE/LabJP/Performance/Other/dondonpafupafu1.mp3',
				'sounds/SE/LabJP/Performance/Other/dondonpafupafu1.wav',
			],
			'Catch': [
				'sounds/SE/LabJP/System/cancel1.mp3',
				'sounds/SE/LabJP/System/cancel1.wav',
			],
			'StopPointer': [
				'sounds/SE/LabJP/System/menu2.mp3',
				'sounds/SE/LabJP/System/menu2.wav',
			],
			'Mash': [
				'sounds/SE/LabJP/Btn/decision1.mp3',
				'sounds/SE/LabJP/Btn/decision1.wav',
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
		this.sound.volume=.5;
		this.stage.disableVisibilityChange=!1;
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