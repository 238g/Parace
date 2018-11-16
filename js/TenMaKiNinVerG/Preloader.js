BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	init:function(){this.sounds=null},
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

	loadingText: function () {
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
		this.load.atlasXML('greySheet', 
			'./images/public/sheets/greySheet.png', './images/public/sheets/greySheet.xml');
		var imageAssets = {
			'PubLogo':'images/public/logo/logo.png',
			'Logo':             './images/TenMaKiNinVerG/Logo.png',
			'Char_T':           './images/TenMaKiNinVerG/Char_T.png',
			'Char_M':           './images/TenMaKiNinVerG/Char_M.png',
			'Char_K':           './images/TenMaKiNinVerG/Char_K.png',
			'Char_N':           './images/TenMaKiNinVerG/Char_N.png',
			'Char_G':           './images/TenMaKiNinVerG/Char_G.png',
			'TitleBg_T':        './images/TenMaKiNinVerG/TitleBg_T.jpg',
			'TitleBg_M':        './images/TenMaKiNinVerG/TitleBg_M.jpg',
			'TitleBg_K':        './images/TenMaKiNinVerG/TitleBg_K.jpg',
			'TitleBg_N':        './images/TenMaKiNinVerG/TitleBg_N.jpg',
			'TitleBg_G':        './images/TenMaKiNinVerG/TitleBg_G.jpg',
			'PlayBg_T':         './images/TenMaKiNinVerG/PlayBg_T.jpg',
			'PlayBg_M':         './images/TenMaKiNinVerG/PlayBg_M.jpg',
			'PlayBg_K':         './images/TenMaKiNinVerG/PlayBg_K.jpg',
			'PlayBg_N':         './images/TenMaKiNinVerG/PlayBg_N.jpg',
			'PlayBg_G':         './images/TenMaKiNinVerG/PlayBg_G.jpg',
			'Particle':         './images/cafenozombiko/Shine.png',
		};
		for (var key in imageAssets) { this.load.image(key, imageAssets[key]); }
		this.load.spritesheet('CharStones', './images/TenMaKiNinVerG/CharStones.png', 100, 100);
		this.loadAudio();
	},

	loadAudio: function () {
		this.sounds = {
			'TitleBGM': [
				'./sounds/BGM/ChoroBavarioLoop.mp3',
				'./sounds/BGM/ChoroBavarioLoop.wav',
			],
			'ThemeBGM_T': [
				'./sounds/BGM/BusyDayAtTheMarketLoop.mp3',
				'./sounds/BGM/BusyDayAtTheMarketLoop.wav',
			],
			'ThemeBGM_M': [
				'./sounds/BGM/GreatBoss.mp3',
				'./sounds/BGM/GreatBoss.wav',
			],
			'ThemeBGM_K': [
				'./sounds/BGM/SpeedWay.mp3',
				'./sounds/BGM/SpeedWay.wav',
			],
			'ThemeBGM_N': [
				'./sounds/BGM/ThemeNinja.mp3',
				'./sounds/BGM/ThemeNinja.wav',
			],
			'ThemeBGM_G': [
				'./sounds/BGM/ANewDay.mp3',
				'./sounds/BGM/ANewDay.wav',
			],
			'PageOpen': [
				'./sounds/SE/Cartoon/CartoonThrow.mp3',
				'./sounds/SE/Cartoon/CartoonThrow.wav',
			],
			'Cheer': [
				'./sounds/SE/SpellSet1/cheer.mp3',
				'./sounds/SE/SpellSet1/cheer.wav',
			],
			'SelectChar': [
				'./sounds/SE/GUI_Sound_Effects/positive.mp3',
				'./sounds/SE/GUI_Sound_Effects/positive.wav',
			],
			'KillStone': [
				'./sounds/SE/SpellSet2/spell1.mp3',
				'./sounds/SE/SpellSet2/spell1.wav',
			],
			'UseSpell': [
				'./sounds/SE/SpellSet2/teleport.mp3',
				'./sounds/SE/SpellSet2/teleport.wav',
			],
			'GameOver': [
				'./sounds/SE/JingleSet1/leave.mp3',
				'./sounds/SE/JingleSet1/leave.wav',
			],
			'NoneKillStone': [
				'./sounds/SE/GUI_Sound_Effects/negative.mp3',
				'./sounds/SE/GUI_Sound_Effects/negative.wav',
			],
			'SwapStone': [
				'./sounds/SE/GUI_Sound_Effects/sharp_echo.mp3',
				'./sounds/SE/GUI_Sound_Effects/sharp_echo.wav',
			],
			'Result': [
				'./sounds/SE/GUI_Sound_Effects/save.mp3',
				'./sounds/SE/GUI_Sound_Effects/save.wav',
			],
		};
		for(var k in this.sounds)this.load.audio(k,this.sounds[k]);
	},

	loadOnlyFirst: function () {
		if (!this.game.global.loadedOnlyFirst) {
			if (this.game.device.desktop) { document.body.style.cursor = 'pointer'; }
			this.game.global.SoundManager = new SoundManager(this, this.sounds);
			this.game.global.loadedOnlyFirst = true;
		}
	},

	loadComplete: function () {
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