BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	create:function(){
		this.loadingAnim();

		var textStyle = { font: '30px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 10 };
		var textSprite = this.add.text(this.world.centerX, this.world.centerY+120, '0%', textStyle);
		textSprite.anchor.setTo(.5);
		this.load.onFileComplete.add(function (progress/*, cacheKey, success, totalLoaded, totalFiles*/) {
			textSprite.setText(progress+'%');
		}, this);
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},
	loadingAnim: function () {
		var loadingSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'loading');
		loadingSprite.anchor.setTo(.5);
		loadingSprite.scale.setTo(1.5);

		var loadingAnim = loadingSprite.animations.add('loading');
		loadingAnim.play(18, true);
	},
	loadComplete: function () {
		this.loadOnlyFirst();
		var textStyle = { font: '80px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 10 };
		var textSprite = this.add.text(this.world.centerX,this.world.centerY*1.7,
			this.game.const.TOUCH_OR_CLICK+'してスタート\n'+this.game.const.EN_TOUCH_OR_CLICK+' TO PLAY', textStyle);
		textSprite.anchor.setTo(.5);
		this.game.input.onDown.addOnce(this.showLogo,this);
	},
	loadAssets:function(){
		this.load.image('PubLogo','images/public/logo/logo.png');
		this.load.image('player','images/ankimo_drrrr/player.png');
		this.load.atlasXML('roundAnimals','images/ankimo_drrrr/roundAnimals.png','images/ankimo_drrrr/roundAnimals.xml');
		this.load.atlasXML('squareAnimals','images/ankimo_drrrr/squareAnimals.png','images/ankimo_drrrr/squareAnimals.xml');
		this.load.atlasXML('greySheet','images/public/sheets/greySheet.png','images/public/sheets/greySheet.xml');
		for(var k in this.game.conf.soundAssets)this.load.audio(k,this.game.conf.soundAssets[k]);
	},
	loadOnlyFirst:function(){
		if (!this.game.global.loadedOnlyFirst) {
			if(this.game.device.desktop)document.body.style.cursor='pointer';
			this.game.global.SoundManager=new SoundManager(this);
			// this.userDatasController();
			this.game.global.loadedOnlyFirst=!0;
		}
	},
	userDatasController:function(){
		var udc=new UserDatasController(this.game.const.STORAGE_NAME);
		var datas=udc.get('0.0.0')||udc.init('0.0.0',{
			total_score:0,
			best_score:0,
		}/*, '0.0.0'*/);
		this.game.global.UserDatasController = udc;
		// ENHANCE set totalscore,bestscore to global
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