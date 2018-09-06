BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	create:function(){
		this.sounds={};
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		this.M.S.genText(this.world.centerX,this.world.centerY*.5,this.rnd.pick(__ADVICE_WORDS),{fontSize:25});
		this.load.onLoadComplete.add(this.loadComplete,this);
		this.loadAssets();
		this.load.start();
	},
	loadAssets:function(){
		this.load.atlasXML('greySheet','images/public/sheets/greySheet.png','images/public/sheets/greySheet.xml');
		this.load.atlasXML('GameIconsWhite','images/public/sheets/GameIconsWhite.png','images/public/sheets/GameIconsWhite.xml');
		this.load.atlasJSONHash('VolumeIcon','images/public/VolumeIcon/VolumeIcon.png','images/public/VolumeIcon/VolumeIcon.json');
		this.load.spritesheet('BrokenGlasses','images/FOckingGlasses/BrokenGlasses.png',400,225);
			
		var imageAssets={
			'PubLogo':'images/public/logo/logo.png',
			'TWP':'images/FOckingGlasses/TranslucentWhitePaper.png',
			'Asahi_1':'images/FOckingGlasses/Asahi_1.png',
			'Asahi_2':'images/FOckingGlasses/Asahi_2.png',
			'Asahi_3':'images/FOckingGlasses/Asahi_3.png',
			'Asahi_4':'images/FOckingGlasses/Asahi_4.png',
			'Glasses':'images/FOckingGlasses/Glasses.png',
			'Channel':'images/FOckingGlasses/Channel.png',
			'Bg_1':'images/FOckingGlasses/Bg_1.jpg',
			'Bg_2':'images/FOckingGlasses/Bg_2.jpg',
			'Bg_3':'images/FOckingGlasses/Bg_3.jpg',
		};
		for(var k in imageAssets)this.load.image(k,imageAssets[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var s={
			TitleBGM:'sounds/BGM/FOckingGlasses/cyber41',
			PlayBGM:'sounds/BGM/FOckingGlasses/Lets_Party2',
			RepairGlasses:'sounds/SE/LabJP/Performance/Anime/shakin2',
			BreakGlasses_1:'sounds/SE/LabJP/Life/Collision/glass-break4',
			OnBtn:'sounds/SE/LabJP/Btn/decision17',
			Applause:'sounds/SE/Success/WellDoneApplause',
			Cheer_s1:'sounds/SE/LabJP/People/people_people-stadium-cheer1',
			Cheer_s2:'sounds/SE/LabJP/People/people_people-stadium-cheer2',
			Cheer_p1:'sounds/SE/LabJP/People/people_people-performance-cheer1',
			Cheer_p2:'sounds/SE/LabJP/People/people_people-performance-cheer2',
			Uwaa_p1:'sounds/SE/LabJP/People/people_people-performance-uwaa1',
			EE_p1:'sounds/SE/LabJP/People/people_people-performance-ee1',
			EE_s1:'sounds/SE/LabJP/TV/people_people-studio-ee1',
			Death:'sounds/VOICE/LabJP/GameSwordMan/game_swordman-death1',
		};
		for(var k in s){
			var p=s[k];
			this.sounds[k]=1;
			this.load.audio(k,[p+'.mp3',p+'wav']);
		}
	},
	loadComplete:function(){
		this.game.device.desktop&&(document.body.style.cursor='pointer');
		this.M.SE.setSounds(this.sounds);
		this.M.H.setSPBrowserColor(BasicGame.MAIN_COLOR);
		this.M.S.genText(this.world.centerX,this.world.centerY*1.7,
			this.M.getConst('TOUCH_OR_CLICK')+'してスタート\n'+this.M.getConst('EN_TOUCH_OR_CLICK')+' TO PLAY',{fontSize:25});
		// this.stage.disableVisibilityChange=!1;
		this.game.input.onDown.addOnce(this.showLogo,this);
		this.M.H.getQuery('mute')&&(this.sound.mute=!0);
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