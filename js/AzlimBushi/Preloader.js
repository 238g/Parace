BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	init:function(){
		this.sounds=null;
	},
	create:function(){
		var s=this.game.global.SpriteManager;
		s.MidLoadingAnim();
		s.MidLoadingText(this);
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},
	loadAssets:function(){
		this.load.atlasXML('greySheet', 
			'./images/public/sheets/greySheet.png', './images/public/sheets/greySheet.xml');
		this.load.atlasXML('fishSpritesheet', 
			'./images/AzlimBushi/fishSpritesheet.png', './images/AzlimBushi/fishSpritesheet.xml');
		var imageAssets = {
			'PubLogo':'images/public/logo/logo.png',
			'Net': './images/AzlimBushi/Net.png',
			'BeefBowl': './images/AzlimBushi/BeefBowl.png',
			'Azlim_1': './images/AzlimBushi/Azlim_1.png',
			'Azlim_2': './images/AzlimBushi/Azlim_2.png',
			'Azlim_3': './images/AzlimBushi/Azlim_3.png',
			'Azlim_4': './images/AzlimBushi/Azlim_4.png',
		};
		for (var key in imageAssets) this.load.image(key, imageAssets[key]);
		for (var i=1;i<=12;i++) {
			this.load.image('album_'+i, './images/AzlimBushi/album_'+i+'.jpg');
			this.game.global.albumCount+=1;
		}
		this.loadAudio();
	},
	loadAudio: function () {
		this.sounds = {
			'PlayBGM': [
				'./sounds/BGM/RainbowRush_loop.ogg',
				'./sounds/BGM/RainbowRush_loop.mp3',
				'./sounds/BGM/RainbowRush_loop.wav',
			],
			'TitleBGM': [
				'./sounds/BGM/SoranBushi.mp3',
				'./sounds/BGM/SoranBushi.wav',
			],
			'SoundBtn_1': [
				'./sounds/SE/LabJP/Performance/Japan/drum-japanese1.mp3',
				'./sounds/SE/LabJP/Performance/Japan/drum-japanese1.wav',
			],
			'SoundBtn_2': [
				'./sounds/SE/LabJP/Performance/Japan/hyoushigi1.mp3',
				'./sounds/SE/LabJP/Performance/Japan/hyoushigi1.wav',
			],
			'SoundBtn_3': [
				'./sounds/SE/LabJP/Performance/Japan/kotsudumi1.mp3',
				'./sounds/SE/LabJP/Performance/Japan/kotsudumi1.wav',
			],
			'Ou': [
				'./sounds/VOICE/LabJP/Performance/mens-ou1.mp3',
				'./sounds/VOICE/LabJP/Performance/mens-ou1.wav',
			],
			'CastNet': [
				'./sounds/SE/LabJP/Battle/Other/whip-gesture2.mp3',
				'./sounds/SE/LabJP/Battle/Other/whip-gesture2.wav',
			],
			'Result': [
				'./sounds/SE/LabJP/Performance/Other/dondonpafupafu1.mp3',
				'./sounds/SE/LabJP/Performance/Other/dondonpafupafu1.wav',
			],
			'BonusMode': [
				'./sounds/SE/LabJP/Performance/Anime/shakin1.mp3',
				'./sounds/SE/LabJP/Performance/Anime/shakin1.wav',
			],
			'Show': [
				'./sounds/SE/LabJP/Btn/decision8.mp3',
				'./sounds/SE/LabJP/Btn/decision8.wav',
			],
			'ScoreUp': [
				'./sounds/SE/LabJP/Btn/decision4.mp3',
				'./sounds/SE/LabJP/Btn/decision4.wav',
			],
		};
		for (var key in this.sounds) this.load.audio(key, this.sounds[key]);
	},
	loadOnlyFirst: function () {
		var g = this.game.global;
		if (!g.loadedOnlyFirst) {
			g.loadedOnlyFirst = true;
			if (this.game.device.desktop) document.body.style.cursor = 'pointer';
			g.SoundManager = new SoundManager(this, this.sounds);
			g.SpriteManager.useTween(g.TweenManager);
		}
	},
	loadComplete: function () {
		this.loadOnlyFirst();
		__setSPBrowserColor(this.game.const.GAME_MAIN_COLOR);
		var textStyle = { font: '80px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 10 };
		var textSprite = this.add.text(this.world.centerX, this.world.centerY*1.7,
			this.game.const.TOUCH_OR_CLICK+'してスタート\n'+this.game.const.EN_TOUCH_OR_CLICK+' TO PLAY', textStyle);
		textSprite.anchor.setTo(.5);
		this.game.input.onDown.addOnce(this.showLogo,this);
	},
	showLogo:function(){
		this.genBmpSqrSp(0,0,this.world.width,this.world.height,'#000000');
		var logo=this.add.sprite(this.world.centerX,this.world.centerY,'PubLogo');
		logo.alpha=0;
		logo.anchor.setTo(.5);
		var twA=this.fadeInA(logo,{duration:1000,alpha:1});
		twA.start();
		var twB=this.fadeOutA(logo,{duration:500,delay:300});
		twA.chain(twB);
		twB.onComplete.add(this.start,this);
	},
	start:function(){this.state.start(this.game.global.nextSceen)},
	genBmpSqrSp:function(x,y,w,h,f){
		var b=this.add.bitmapData(w,h);
		b.ctx.fillStyle=f;
		b.ctx.beginPath();
		b.ctx.rect(0,0,w,h);
		b.ctx.fill();
		b.update();
		return this.add.sprite(x,y,b);
	},
	fadeInA:function(t,op={}){return this.add.tween(t).to({alpha:op.alpha||1}, op.duration,Phaser.Easing.Linear.None,!1,op.delay)},
	fadeOutA:function(t,op={}){return this.add.tween(t).to({alpha:0},op.duration,Phaser.Easing.Linear.None,!1,op.delay)},
};