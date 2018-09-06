BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	create:function(){
		this.TOUCH_OR_CLICK=(this.game.device.touch)?'タッチ':'クリック';
		this.EN_TOUCH_OR_CLICK=(this.game.device.touch)?'TOUCH':'CLICK';
		this.loadingAnim();
		this.loadingText();
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},
	loadingAnim:function(){
		var loadingSprite=this.add.sprite(this.world.centerX,this.world.centerY,'loading');
		loadingSprite.anchor.setTo(.5);
		loadingSprite.scale.setTo(1.5);
		loadingSprite.animations.add('loading').play(18,true);
	},
	loadingText:function(){
		var textSprite = this.add.text(
			this.world.centerX, this.world.centerY+120, '0%', 
			{ font: '30px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 10 }
		);
		textSprite.anchor.setTo(.5);
		this.load.onFileComplete.add(function (progress/*, cacheKey, success, totalLoaded, totalFiles*/) {
			textSprite.setText(progress+'%');
		}, this);
	},

	loadAssets: function () {
		this.load.atlasXML('greySheet','images/public/sheets/greySheet.png','images/public/sheets/greySheet.xml');
		var imageAssets = {
			'PubLogo':'images/public/logo/logo.png',
			'Bg_1':         './images/cafenozombiko/Bg_1.jpg',
			'Zombiko_1':    './images/cafenozombiko/Zombiko_1.png',
			'Zombiko_2':    './images/cafenozombiko/Zombiko_2.png',
			'MiniZombie_1': './images/cafenozombiko/MiniZombie_1.png',
			'MiniZombie_2': './images/cafenozombiko/MiniZombie_2.png',
			'Human':        './images/cafenozombiko/Human.png',
			'Takashi':      './images/cafenozombiko/Takashi.png',
			'Particle':     './images/cafenozombiko/Shine.png',
		};
		for (var key in imageAssets) { this.load.image(key, imageAssets[key]); }
		this.loadAudio();
	},

	loadAudio: function () {
		for (var i=0;i<=20;i++) {
			var num = ('0'+i).slice(-2);
			this.load.audio('MiniZombieVoice_'+num, [
				'./sounds/VOICE/VSEL/Alien/Alien_Funny_'+num+'.mp3',
				'./sounds/VOICE/VSEL/Alien/Alien_Funny_'+num+'.wav',
			]);
		}
		this.load.audio('Click', [
			'./sounds/SE/GUI_Sound_Effects/misc_menu_4.mp3',
			'./sounds/SE/GUI_Sound_Effects/misc_menu_4.wav',
		]);
		this.load.audio('Gunfire', [
			'./sounds/SE/Digital_SFX/laser7.mp3',
			'./sounds/SE/Digital_SFX/laser7.wav',
		]);
		this.load.audio('ZombieVoice_1', [
			'./sounds/SE/Zombies/zombie-12.mp3',
			'./sounds/SE/Zombies/zombie-12.wav',
		]);
		this.load.audio('ZombieVoice_2', [
			'./sounds/SE/Fantasy/Goblin_01.mp3',
			'./sounds/SE/Fantasy/Goblin_01.wav',
		]);
		this.load.audio('HumanVoice', [
			'./sounds/VOICE/VSEL/Human/Human_Good_06.mp3',
			'./sounds/VOICE/VSEL/Human/Human_Good_06.wav',
		]);
		this.load.audio('HappyBGM_1', [
			'./sounds/BGM/HappyBGM_1.mp3',
			'./sounds/BGM/HappyBGM_1.wav',
			'./sounds/BGM/HappyBGM_1.ogg',
		]);
		this.load.audio('HappyBGM_2', [
			'./sounds/BGM/HappyBGM_2.mp3',
			'./sounds/BGM/HappyBGM_2.wav',
		]);
	},

	loadOnlyFirst: function () {
		if (!this.game.global.loadedOnlyFirst) {
			if (this.game.device.desktop) { document.body.style.cursor = 'pointer'; }
			this.game.global.SoundManager = new SoundManager(this);
			this.game.global.loadedOnlyFirst = true;
		}
	},
	loadComplete: function () {
		this.loadOnlyFirst();
		var textStyle = { font: '80px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 10 };
		var textSprite = this.add.text(this.world.centerX, this.world.centerY*1.7,
			this.TOUCH_OR_CLICK+'してスタート\n'+this.EN_TOUCH_OR_CLICK+' TO PLAY', textStyle);
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