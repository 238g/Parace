BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	create:function(){
		this.loadingAnim();
		this.loadingText();
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},
	loadingAnim:function(){
		var loadingSprite=this.add.sprite(this.world.centerX, this.world.centerY, 'loading');
		loadingSprite.anchor.setTo(.5);
		loadingSprite.scale.setTo(1.5);
		loadingSprite.animations.add('loading').play(18, true);
	},
	loadingText:function(){
		var textSprite=this.add.text(
			this.world.centerX, this.world.centerY+120, '0%', 
			{ font: '30px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 10 }
		);
		textSprite.anchor.setTo(.5);
		this.load.onFileComplete.add(function (progress/*, cacheKey, success, totalLoaded, totalFiles*/) {
			textSprite.setText(progress+'%');
		}, this);
	},
	loadAssets:function(){
		this.load.atlasXML('greySheet','images/public/sheets/greySheet.png','images/public/sheets/greySheet.xml');
		var imageAssets = {
			'PubLogo':'images/public/logo/logo.png',
			'Elu_1':       './images/eff/elu_1.png',
			'Tree':        './images/eff/Tree.png',
			'DeadTree':    './images/eff/DeadTree.png',
			'Fire_1':      './images/eff/Fire_1.png',
			'Fire_2':      './images/eff/Fire_2.png',
			'Mito_1':      './images/eff/mito_1.png',
			'Kaede_1':     './images/eff/kaede_1.png',
			'WarotaPmang': './images/eff/Pmang_1.png',
			'IkaPonPmang': './images/eff/Pmang_2.png',
			'Flame':       './images/eff/Flame.png',
		};
		for (var key in imageAssets) { this.load.image(key, imageAssets[key]); }

		this.loadAudio();
	},

	loadAudio: function () {
		this.load.audio('MenuStart', [
			'./sounds/SE/GUI_Sound_Effects/load.mp3',
			'./sounds/SE/GUI_Sound_Effects/load.wav',
		]); 
		this.load.audio('GetPmang', [
			'./sounds/SE/GUI_Sound_Effects/positive.mp3',
			'./sounds/SE/GUI_Sound_Effects/positive.wav',
		]); 
		this.load.audio('GameOver', [
			'./sounds/SE/GUI_Sound_Effects/save.mp3',
			'./sounds/SE/GUI_Sound_Effects/save.wav',
		]); 
		this.load.audio('Miss', [
			'./sounds/SE/GUI_Sound_Effects/negative.mp3',
			'./sounds/SE/GUI_Sound_Effects/negative.wav',
		]); 
		this.load.audio('Fire', [
			'./sounds/SE/Fire/FireImpact_1.mp3',
			'./sounds/SE/Fire/FireImpact_1.wav',
		]); 
		this.load.audio('Flame', [
			'./sounds/SE/Fantasy/Spell_02.mp3',
			'./sounds/SE/Fantasy/Spell_02.wav',
		]); 
		this.load.audio('MushroomDance', [
			'./sounds/BGM/MushroomDance.mp3',
			'./sounds/BGM/MushroomDance.wav',
		]); 
		this.load.audio('MushroomsForest', [
			'./sounds/BGM/MushroomsForest.mp3',
			'./sounds/BGM/MushroomsForest.wav',
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
			((this.game.device.touch)?'タッチ':'クリック')+'してスタート\n'+((this.game.device.touch)?'TOUCH':'CLICK')+' TO PLAY', textStyle);
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