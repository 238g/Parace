BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	init:function(){this.sounds=null;},
	create: function () {
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},

	loadAssets: function () {
		this.load.atlasXML('greySheet','./images/public/sheets/greySheet.png','./images/public/sheets/greySheet.xml');
		var imgs = {
			'transp': './images/238Games/transp.png',
			'PubLogo':'images/public/logo/logo.png',
		};
		for(var k in imgs)this.load.image(k,imgs[k]);
		var GI = this.M.getConf('GamesInfo');
		for(var k in GI) this.load.image(GI[k].slideImg,GI[k].slideImgUrl);
	},

	loadComplete: function () {
		if(this.game.device.desktop)document.body.style.cursor='pointer';
		this.M.SE.setSounds(this.sounds);
		this.showLogo();
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