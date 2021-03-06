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
		var textSprite = this.add.text(
			this.world.centerX, this.world.centerY+120, '0%', 
			{ font: '30px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 10 }
		);
		textSprite.anchor.setTo(.5);
		this.load.onFileComplete.add(function (progress/*, cacheKey, success, totalLoaded, totalFiles*/) {
			textSprite.setText(progress+'%');
		}, this);
	},
	loadAssets:function(){
		this.load.atlasJSONHash('player','images/sirorun/siro_running.png','images/sirorun/siro_running.json');
		this.load.atlasXML('greySheet','images/public/sheets/greySheet.png','images/public/sheets/greySheet.xml');
		var imageAssets = {
			'PubLogo':'images/public/logo/logo.png',
			'obstacle_1':   './images/sirorun/virtual_1.png',
			'obstacle_2':   './images/sirorun/virtual_2.png',
			'obstacle_3':   './images/sirorun/virtual_3.png',
			'obstacle_4':   './images/sirorun/virtual_4.png',
			'nuisance':     './images/sirorun/virtual_5.png',
			'sky':          './images/sirorun/sky.png',
			'mountain':     './images/sirorun/mountain.png',
			'ground':       './images/sirorun/ground.png',
			'siro_res':     './images/sirorun/siro_res.png',
			'siro_title_1': './images/sirorun/siro_title_1.png',
			'siro_title_2': './images/sirorun/siro_title_2.png',
			'siro_title_3': './images/sirorun/siro_title_3.png',
		};
		for (var key in imageAssets) { this.load.image(key, imageAssets[key]); }
		var soundAssets = {
			'MenuClick':       [
				'./sounds/SE/Menu_Select_00.mp3',
				'./sounds/SE/Menu_Select_00.wav',
			], 
			'Jump':            [
				'./sounds/SE/phaseJump5.mp3',
				'./sounds/SE/phaseJump5.wav',
			], 
			'GameOver':        [
				'./sounds/VOICE/Female/game_over.mp3',
				'./sounds/VOICE/Female/game_over.wav',
			], 
			'LevelUp':         [
				'./sounds/VOICE/Female/level_up.mp3',
				'./sounds/VOICE/Female/level_up.wav',
			], 
			'HappyArcadeTune': [
				'./sounds/BGM/HappyArcadeTune.mp3',
				'./sounds/BGM/HappyArcadeTune.wav',
			], 
			'DaytimeBGM':      [
				'./sounds/BGM/ChiptuneAdventuresStage2.mp3',
				'./sounds/BGM/ChiptuneAdventuresStage2.wav',
			], 
			'EveningBGM':      [
				'./sounds/BGM/Awake.mp3',
				'./sounds/BGM/Awake.wav',
			], 
			'NightBGM':        [
				'./sounds/BGM/RailJet.mp3',
				'./sounds/BGM/RailJet.wav',
			], 

		};
		for (var key in soundAssets) { this.load.audio(key, soundAssets[key]); }
	},
	loadOnlyFirst:function(){
		if (!this.game.global.loadedOnlyFirst) {
			if (this.game.device.desktop) { document.body.style.cursor = 'pointer'; }
			this.game.global.SoundManager = new SoundManager(this);
			this.game.global.loadedOnlyFirst = true;
		}
	},
	loadComplete:function(){
		this.loadOnlyFirst();
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