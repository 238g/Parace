BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	create:function(){
		this.sounds={};
		this.M.S.genLoading();
		this.M.gGlb('curLang')=='en'?this.M.H.changeTtl(BasicGame.GAME_TITLE_EN):this.M.S.genTxt(this.world.centerX,this.world.height*.25,this.rnd.pick(__ADVICE_WORDS),this.M.S.txtstyl(25));
		this.load.onLoadComplete.add(this.loadComplete,this);
		this.loadAssets();
		this.load.start();
	},
	loadAssets:function(){
		this.M.S.loadLoadingAssetsW();
		var i={
			'PubLogo':'images/public/logo/logo.png',
			'WP':'images/TruckGoddess/WhitePaper.jpg',
			'TWP':'images/FOckingGlasses/TranslucentWhitePaper.png',
			'Umiyasha':'images/UMI/Umiyasha.png',
			
			'TitleA':'images/UMI/TitleA.png',
			'TitleB':'images/UMI/TitleB.png',

			'Bg_A':'images/UMI/Bg_A.jpg',
			'Bg_B':'images/UMI/Bg_B.jpg',
			'Bg_C':'images/UMI/Bg_C.jpg',
			'Bg_D':'images/UMI/Bg_D.jpg',
			'Bg_1':'images/UMI/Bg_1.jpg',
			'Bg_2':'images/mei/Bg_4.jpg',
			'Bg_3':'images/UMI/Bg_3.jpg',
			'Bg_5':'images/UMI/Bg_5.jpg',

			'Azathoth':'images/UMI/Enemies/Azathoth.png',
			'Daikokuten':'images/UMI/Enemies/Daikokuten.png',
			'FuujinRaijin':'images/UMI/Enemies/FuujinRaijin.png',
			'Poseidon':'images/UMI/Enemies/Poseidon.png',
			'You':'images/UMI/Enemies/You.png',

			'ToyaA':'images/UMI/Bullets/ToyaA.png',
			'ToyaB':'images/UMI/Bullets/ToyaB.png',
			'Koban':'images/UMI/Bullets/Koban.png',
			'Tawara':'images/UMI/Bullets/Tawara.png',
			'Uchide':'images/UMI/Bullets/Uchide.png',
			'TenkiA':'images/UMI/Bullets/TenkiA.png',
			'TenkiB':'images/UMI/Bullets/TenkiB.png',
			'TenkiC':'images/UMI/Bullets/TenkiC.png',
			'TenkiD':'images/UMI/Bullets/TenkiD.png',
			'TenkiE':'images/UMI/Bullets/TenkiE.png',
			'Trident':'images/UMI/Bullets/Trident.png',
			'UmiushiA':'images/UMI/Bullets/UmiushiA.png',
			'UmiushiB':'images/UMI/Bullets/UmiushiB.png',
			'UmiushiC':'images/UMI/Bullets/UmiushiC.png',
			'UmiushiD':'images/UMI/Bullets/UmiushiD.png',
			'OtakuA':'images/UMI/Bullets/OtakuA.png',
			'OtakuB':'images/UMI/Bullets/OtakuB.png',
			'OtakuC':'images/UMI/Bullets/OtakuC.png',
			'OtakuD':'images/UMI/Bullets/OtakuD.png',
			'FujoshiA':'images/UMI/Bullets/FujoshiA.png',
			'FujoshiB':'images/UMI/Bullets/FujoshiB.png',
		};
		for(var k in i)this.load.image(k,i[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var s={
			TitleBGM:'sounds/BGM/UMI/TitleBGM',
			PlayBGM_A:'sounds/BGM/UMI/Raid2_Short',
			PlayBGM_B:'sounds/BGM/UMI/Breakthrough_Short',
			PlayBGM_C:'sounds/BGM/UMI/Neorock10',
			OnBtn:'sounds/SE/LabJP/Performance/Japan/kotsudumi1',
			OnStart:'sounds/SE/LabJP/Performance/Japan/drum-japanese2',
			GenStart:'sounds/SE/LabJP/Performance/Other/sceneswitch1',
			End:'sounds/SE/UMI/onepoint30',
			Res:'sounds/SE/UMI/onepoint16',
			ResT:'sounds/SE/LabJP/Performance/Anime/tin1',
			Damage1:'sounds/SE/LabJP/Battle/Fight/kick-low1',
			Damage2:'sounds/SE/LabJP/Battle/Fight/kick-middle1',
			Damage3:'sounds/SE/LabJP/Battle/Fight/punch-high1',
			Damage4:'sounds/SE/LabJP/Battle/Fight/punch-middle2',
			Damage5:'sounds/SE/LabJP/Battle/Fight/kick-high1',
			Combo:'sounds/SE/LabJP/Performance/Anime/shakin1',
		};
		for(var k in s){
			var p=s[k];
			this.sounds[k]=1;
			this.load.audio(k,[p+'.mp3',p+'wav']);
		}
	},
	loadComplete:function(){
		this.M.S.loadCmpl();
		this.M.SE.setSounds(this.sounds);
		this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		this.sound.volume=.5;
		this.game.input.onDown.addOnce(this.showLogo,this);
	},
	showLogo:function(){
		this.M.S.genBmpSqrSp(0,0,this.world.width,this.world.height,'#000000');
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