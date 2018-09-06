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
		var i={
			'PubLogo':'images/public/logo/logo.png',
			'Ttl':'images/OmesisCommanders/Ttl.png',
			'TtlBlink':'images/OmesisCommanders/TtlBlink.png',
			'StartBtn':'images/OmesisCommanders/StartBtn.png',
			'OkBtn':'images/OmesisCommanders/OkBtn.png',
			'BackBtn':'images/OmesisCommanders/BackBtn.png',
			'ReadyText':'images/OmesisCommanders/ReadyText.png',
			'FightText':'images/OmesisCommanders/FightText.png',
			'TWP':'images/Nekomiya/TranslucentWhitePaper.png',
			'WP':'images/OmesisCommanders/WhitePaper.jpg',
			'Bg_1':'images/OmesisCommanders/Bg_1.jpg',
			'Bg_2':'images/OmesisCommanders/Bg_2.jpg',
			'KO':'images/OmesisCommanders/KO.png',
			'GameOver':'images/OmesisCommanders/GameOver.png',
			'ChannelPanel':'images/OmesisCommanders/ChannelPanel.png',
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadAudio();
		this.loadInfo();
	},
	loadInfo:function(){
		var charCount=0;
		var charAnimCount=this.M.getConst('CHAR_ANIM_COUNT');
		var CI=this.M.getConf('CharInfo');
		for(var k in CI){
			var info=CI[k];
			////// animBase:'album_',animBasePath:'images/AzlimBushi/album_',
			////// for(var i=1;i<=charAnimCount;i++)this.load.image(info.animBase+i,info.animBasePath+i+'.jpg');
			////// for(var i=1;i<=charAnimCount;i++)this.load.image(info.animBase+i,info.animBasePath+i+'.png');
			charCount++;
			var charSquare='CS'+charCount;
			this.load.image(charSquare,'images/OmesisCommanders/Chars/CharSquare/'+charCount+'.jpg');
			info.charSquare=charSquare;
			var idle='Idle_'+charCount;
			this.load.image(idle,'images/OmesisCommanders/Chars/Char_'+charCount+'/Idle.png');
			info.idle=idle;
			this.load.image('Anim_'+charCount+'_1','images/OmesisCommanders/Chars/Char_'+charCount+'/Anim_1.png');
		}
		this.M.setGlobal('charCount',charCount);
		var SI=this.M.getConf('StageInfo');
		for(var k in SI){
			var info=SI[k];
			var selector='SBs'+k;
			this.load.image(selector,'images/OmesisCommanders/StgBg/s'+k+'.jpg');
			info.selector=selector;
			var stgBg='SB'+k;
			this.load.image(stgBg,'images/OmesisCommanders/StgBg/'+k+'.jpg');
			info.stgBg=stgBg;
		}
	},

	loadAudio:function(){
		var s={
			TitleBGM:'sounds/BGM/OmesisCommanders/MaouCyber16',
			////// VS:'sounds/SE/V/VS',
			OnBtn:'sounds/SE/Menu_Select_00',
			HoverMouse:'sounds/SE/JingleSet1/click',
			SelectChar:'sounds/SE/LabJP/Performance/Anime/jump-anime1',
			SelectStage:'sounds/SE/LabJP/Btn/decision17',
			Attack_1:'sounds/SE/LabJP/Battle/Fight/kick-low1',
			Attack_2:'sounds/SE/LabJP/Battle/Fight/punch-middle2',
			Damage_1:'sounds/SE/LabJP/Battle/Fight/kick-middle1',
			Damage_2:'sounds/SE/LabJP/Battle/Fight/punch-high1',
			OnClickGamePad:'sounds/SE/UISoundLibrary/Click_Electronic/Click_Electronic_14',
			Ready:'sounds/VOICE/K_VoiceFighter/ready',
			Fight:'sounds/VOICE/K_VoiceFighter/fight',
			GameOver:'sounds/VOICE/K_VoiceFighter/game_over',
			Win:'sounds/VOICE/K_VoiceFighter/you_win',
			Lose:'sounds/VOICE/K_VoiceFighter/you_lose',
			ChooseChar:'sounds/VOICE/K_VoiceFighter/choose_your_character',
			WinSE:'sounds/SE/LabJP/People/people_people-stadium-cheer1',
			LoseSE:'sounds/SE/LabJP/People/people_people-performance-cheer2',
		};
		var playBgmList=['Greece_Alpha','Greece_Beta','Greece_Delta','Greece_Epsilon','Greece_Gamma','Greece_Omega'];
		var rndBgm=this.rnd.pick(playBgmList);
		s[rndBgm]='sounds/BGM/OmesisCommanders/'+rndBgm;
		this.M.setGlobal('rndBgm',rndBgm);
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