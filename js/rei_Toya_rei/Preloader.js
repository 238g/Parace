BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	init:function(){this.sounds=null},
	create:function(){
		var s=this.game.global.SpriteManager;
		s.MidLoadingAnim();
		s.MidLoadingText(this);
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},
	loadAssets:function(){
		this.load.atlasXML('greySheet','images/public/sheets/greySheet.png','images/public/sheets/greySheet.xml');
		this.load.atlasXML('GameIcons','images/public/sheets/GameIconsWhite.png','images/public/sheets/GameIconsWhite.xml');
		var imageAssets = {
			'PubLogo':'images/public/logo/logo.png',
			'Toya_1': './images/rei_Toya_rei/Toya_1.png',
			'Toya_2': './images/rei_Toya_rei/Toya_2.png',
			'Toya_3': './images/rei_Toya_rei/Toya_3.png',
			'ToyaFace_1': './images/rei_Toya_rei/ToyaFace_1.png',
			'ToyaFace_R': './images/rei_Toya_rei/ToyaFace_R.png',
			'Chihiro_1': './images/rei_Toya_rei/Chihiro_1.png',
		};
		for (var key in imageAssets) this.load.image(key, imageAssets[key]);
		this.loadAudio();
	},
	loadAudio: function () {
		this.sounds = {
			'TitleBGM': [
				'./sounds/BGM/CopyCat.mp3',
				'./sounds/BGM/CopyCat.wav',
			],
			'PlayBGM': [
				'./sounds/BGM/WaveMenuLoop.mp3',
				'./sounds/BGM/WaveMenuLoop.wav',
			],
			'Hit': [
				'./sounds/SE/LabJP/Performance/Anime/feed1.mp3',
				'./sounds/SE/LabJP/Performance/Anime/feed1.wav',
			],
			'Show': [
				'./sounds/SE/Digital_SFX/laser4.mp3',
				'./sounds/SE/Digital_SFX/laser4.wav',
			],
			'HitEnemy': [
				'./sounds/SE/SpellSet1/explode.mp3',
				'./sounds/SE/SpellSet1/explode.wav',
			],
			'Move': [
				'./sounds/SE/phaseJump5.mp3',
				'./sounds/SE/phaseJump5.wav',
			],
			'Result': [
				'./sounds/SE/JingleSet1/receive.mp3',
				'./sounds/SE/JingleSet1/receive.wav',
			],
			'Feint': [
				'./sounds/SE/LabJP/Performance/Anime/eye-shine1.mp3',
				'./sounds/SE/LabJP/Performance/Anime/eye-shine1.wav',
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